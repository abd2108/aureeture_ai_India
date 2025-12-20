"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function DashboardTrafficController() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role");

  useEffect(() => {
    if (role === "founder") {
      router.push("/dashboard/founder/overview");
    } else if (role === "mentor") {
      router.push("/dashboard/mentor/overview");
    } else {
      // Default to student view → go directly to Profile
      router.push("/dashboard/student/profile");
    }
  }, [role, router]);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <p className="text-zinc-500 dark:text-zinc-400 animate-pulse">
        Redirecting to your workspace...
      </p>
    </div>
  );
}


