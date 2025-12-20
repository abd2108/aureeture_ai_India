"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function StudentDashboardIndex() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/student/overview");
  }, [router]);

  return null;
}


