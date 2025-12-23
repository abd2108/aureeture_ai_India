"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getToken, isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser();
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const apiBase = useMemo(
    () => process.env.NEXT_PUBLIC_API_BASE_URL || "",
    []
  );

  useEffect(() => {
    const ensureOnboarding = async () => {
      if (!isAuthLoaded || !isUserLoaded) return;
      if (!isSignedIn) {
        setReady(true);
        return;
      }

      try {
        const token = await getToken();
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          "x-active-role": "student",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
        const statusUrl = apiBase
          ? `${apiBase}/api/role-onboarding/student/status`
          : "/api/role-onboarding/student/status";

        const res = await fetch(statusUrl, {
          method: "GET",
          headers,
          credentials: "include",
        });

        const data = res.ok ? await res.json().catch(() => null) : null;
        const isOnboarded = !!data?.data?.isOnboarded;
        const onboardingPath = "/dashboard/student/onboarding";

        if (!isOnboarded) {
          if (pathname !== onboardingPath) {
            router.replace(onboardingPath);
            return;
          }
        } else if (pathname === onboardingPath) {
          router.replace("/dashboard/student/overview");
          return;
        }
      } catch (err) {
        console.error("Error checking student onboarding status", err);
      } finally {
        setReady(true);
      }
    };

    ensureOnboarding();
  }, [apiBase, getToken, isAuthLoaded, isSignedIn, isUserLoaded, pathname, router, user]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 text-sm text-zinc-500 dark:bg-zinc-950 dark:text-zinc-300">
        <div className="flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600" />
          Preparing your dashboard…
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

