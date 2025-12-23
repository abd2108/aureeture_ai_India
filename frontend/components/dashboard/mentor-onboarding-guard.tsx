"use client";

import { useAuth, useUser, useClerk } from "@clerk/nextjs";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

type GuardState = "checking" | "allowed";

interface Props {
  children: React.ReactNode;
}

/**
 * Locks all mentor dashboard routes until the mentor has completed onboarding
 * in MongoDB (`isOnboarded: true`). If a mentor is not onboarded they are
 * forced into the onboarding wizard; if they are already onboarded the guard
 * keeps them out of the wizard and into the dashboard.
 */
export default function MentorOnboardingGuard({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const { getToken, isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser();
  const [state, setState] = useState<GuardState>("checking");
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (err) {
      console.error("Logout failed:", err);
      window.location.href = "/";
    }
  };

  const apiBase = useMemo(
    () => process.env.NEXT_PUBLIC_API_BASE_URL || "",
    []
  );

  const isMentorPath =
    pathname?.startsWith("/dashboard/mentor") ?? false;
  const isOnboardingPath =
    pathname?.startsWith("/dashboard/mentor/onboarding") ?? false;

  const readActiveRole = () => {
    if (typeof window === "undefined") return undefined;
    return (
      window.sessionStorage.getItem("aureeture_active_role") ||
      window.localStorage.getItem("aureeture_active_role") ||
      undefined
    );
  };

  useEffect(() => {
    const run = async () => {
      if (!isMentorPath) {
        // Not a mentor route, allow immediately
        setState("allowed");
        return;
      }

      if (!isAuthLoaded || !isUserLoaded) return;
      if (!isSignedIn || !user?.id) {
        // If the user signs out mid-flight, send to root
        router.replace("/sign-in");
        return;
      }

      const activeRole = readActiveRole();
      if (activeRole && activeRole !== "mentor") {
        router.replace("/auth/select-role");
        return;
      }

      try {
        setError(null);
        const token = await getToken();
        const endpoint = apiBase
          ? `${apiBase}/api/role-onboarding/mentor/status`
          : "/api/role-onboarding/mentor/status";

        const res = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
        });

        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.message || `Failed to check onboarding (HTTP ${res.status})`);
        }

        const json = await res.json();
        const isOnboarded = json?.data?.isOnboarded ?? false;

        if (!isOnboarded && !isOnboardingPath) {
          router.replace("/dashboard/mentor/onboarding");
          return;
        }

        if (isOnboarded && isOnboardingPath) {
          router.replace("/dashboard/mentor/overview");
          return;
        }

        setState("allowed");
      } catch (err: any) {
        console.error("Failed to enforce mentor onboarding gate:", err);
        setError(err?.message || "Unable to verify onboarding status");
        // Fail closed: send to onboarding
        if (!isOnboardingPath) {
          router.replace("/dashboard/mentor/onboarding");
        } else {
          setState("allowed");
        }
      }
    };

    run();
    // We only want to react to auth/path changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBase, getToken, isAuthLoaded, isUserLoaded, isSignedIn, pathname, router, user?.id]);

  if (!isMentorPath) {
    return <>{children}</>;
  }

  if (state === "checking") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 text-sm text-zinc-500 dark:bg-zinc-950 dark:text-zinc-300">
        <div className="flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600" />
          {error ? "Checking access…" : "Loading mentor workspace…"}
        </div>
        <div className="mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="gap-2 rounded-full border-zinc-200 dark:border-zinc-800"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

