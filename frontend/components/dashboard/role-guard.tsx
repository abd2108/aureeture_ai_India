"use client";

import { useAuth, useUser, useClerk } from "@clerk/nextjs";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

type Role = "student" | "mentor" | "founder" | "unknown";

const ROLE_KEY = "aureeture_active_role";

/**
 * RoleGuard enforces that the current dashboard route matches the active role
 * selection. It also prevents cross-tab bleeding by preferring sessionStorage
 * (tab-scoped) and falling back to localStorage only when absent.
 */
export default function RoleGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const { isLoaded, isSignedIn } = useAuth();
  const { isLoaded: isUserLoaded } = useUser();
  const [ready, setReady] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/");
    } catch (err) {
      console.error("Logout failed:", err);
      window.location.href = "/";
    }
  };

  const expectedRole: Role = useMemo(() => {
    if (pathname?.startsWith("/dashboard/mentor")) return "mentor";
    if (pathname?.startsWith("/dashboard/student")) return "student";
    if (pathname?.startsWith("/dashboard/founder")) return "founder";
    return "unknown";
  }, [pathname]);

  const getActiveRole = (): Role => {
    if (typeof window === "undefined") return "unknown";
    const sessionVal = window.sessionStorage.getItem(ROLE_KEY);
    const localVal = window.localStorage.getItem(ROLE_KEY);
    const val = (sessionVal || localVal || "").toLowerCase();
    if (val === "mentor" || val === "student" || val === "founder") return val;
    return "unknown";
  };

  useEffect(() => {
    if (!isLoaded || !isUserLoaded) return;
    if (!isSignedIn) {
      router.replace("/sign-in");
      return;
    }

    const activeRole = getActiveRole();

    // If no role recorded yet but we are on a role-specific route, set it now (tab-scoped + local fallback)
    if (expectedRole !== "unknown" && activeRole === "unknown") {
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(ROLE_KEY, expectedRole);
        window.localStorage.setItem(ROLE_KEY, expectedRole);
      }
      setReady(true);
      return;
    }

    // If user navigates to a role-specific dashboard without matching active role,
    // force them to re-select the role (this also refreshes the session/tab state).
    if (
      expectedRole !== "unknown" &&
      activeRole !== "unknown" &&
      activeRole !== expectedRole
    ) {
      router.replace(`/auth/select-role?redirect=${encodeURIComponent(pathname || "/dashboard")}`);
      return;
    }

    setReady(true);
  }, [isLoaded, isUserLoaded, isSignedIn, expectedRole, pathname, router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 text-sm text-zinc-500 dark:bg-zinc-950 dark:text-zinc-300">
        <div className="flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600" />
          Checking workspace access…
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

