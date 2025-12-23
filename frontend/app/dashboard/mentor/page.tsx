"use client";

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MentorDashboardIndex() {
  const router = useRouter();
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  useEffect(() => {
    const check = async () => {
      if (!isLoaded) return;
      if (!isSignedIn) {
        router.replace("/sign-in");
        return;
      }

      try {
        const token = await getToken();
        const endpoint = apiBase
          ? `${apiBase}/api/role-onboarding/mentor/status`
          : "/api/role-onboarding/mentor/status";

        const res = await fetch(endpoint, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Unable to check mentor onboarding status");
        }

        const json = await res.json();
        const isOnboarded = json?.data?.isOnboarded ?? false;

        router.replace(
          isOnboarded
            ? "/dashboard/mentor/overview"
            : "/dashboard/mentor/onboarding"
        );
      } catch (err) {
        // Fail closed to onboarding if status check fails
        router.replace("/dashboard/mentor/onboarding");
      }
    };

    check();
  }, [apiBase, getToken, isLoaded, isSignedIn, router]);

  return null;
}