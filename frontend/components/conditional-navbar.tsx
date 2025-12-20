"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import EnterpriseNavbar from "@/components/enterprise-navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Hide navbar on internal dashboard-style pages
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  if (pathname?.startsWith('/enterprise')) {
    return <EnterpriseNavbar />;
  }
  return <Navbar />;
}

