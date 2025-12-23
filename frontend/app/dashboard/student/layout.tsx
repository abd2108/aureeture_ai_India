"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { useEffect, useMemo, useState } from "react";

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { getToken, isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser();
  const [ready, setReady] = useState(false);
  const apiBase = useMemo(
    () => process.env.NEXT_PUBLIC_API_BASE_URL || "",
    []
  );

  useEffect(() => {
    const ensureStudentProfile = async () => {
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
        const profileUrl = apiBase
          ? `${apiBase}/api/student/profile`
          : "/api/student/profile";

        const res = await fetch(profileUrl, {
          method: "GET",
          headers,
          credentials: "include",
        });

        let data: any = null;
        if (res.ok) {
          data = await res.json().catch(() => null);
        } else if (res.status === 403) {
          // If 403, it means the Student record definitely doesn't exist yet
          // because requireRole("student") failed.
          data = { data: null };
        }

        const studentExists = data?.data;

        if (!studentExists) {
          console.log("Student profile not found, creating one...");
          const createUrl = apiBase
            ? `${apiBase}/api/role-onboarding/student`
            : "/api/role-onboarding/student";

          const createRes = await fetch(createUrl, {
            method: "POST",
            headers,
            credentials: "include",
            body: JSON.stringify({
              fullName: user?.fullName || user?.username || "Student",
              email:
                user?.primaryEmailAddress?.emailAddress ||
                user?.emailAddresses?.[0]?.emailAddress ||
                "",
              phone: "",
              linkedinUrl: "",
              links: {},
              skills: [],
              preferences: {},
            }),
          });
          
          if (!createRes.ok) {
            const errBody = await createRes.json().catch(() => ({}));
            console.error("Failed to seed student profile:", errBody);
          } else {
            console.log("Student profile seeded successfully");
          }
        }
      } catch (err) {
        console.error("Error syncing student profile", err);
      } finally {
        setReady(true);
      }
    };

    ensureStudentProfile();
  }, [apiBase, getToken, isAuthLoaded, isSignedIn, isUserLoaded, user]);

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

