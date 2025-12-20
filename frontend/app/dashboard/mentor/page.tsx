"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ONBOARDING_KEY = "aureeture_mentor_onboarding_complete";

export default function MentorDashboardIndex() {
  const router = useRouter();

  useEffect(() => {
    const hasCompletedOnboarding =
      typeof window !== "undefined" &&
      window.localStorage.getItem(ONBOARDING_KEY) === "true";

    if (hasCompletedOnboarding) {
      router.replace("/dashboard/mentor/overview");
    } else {
      router.replace("/dashboard/mentor/onboarding");
    }
  }, [router]);

  return null;
}

