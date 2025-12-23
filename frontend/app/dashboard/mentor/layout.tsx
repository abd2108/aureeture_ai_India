"use client";

import MentorOnboardingGuard from "@/components/dashboard/mentor-onboarding-guard";

export default function MentorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MentorOnboardingGuard>{children}</MentorOnboardingGuard>;
}

