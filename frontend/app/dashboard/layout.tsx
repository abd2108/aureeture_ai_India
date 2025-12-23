"use client";

import React from "react";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import TopNavbar from "@/components/dashboard/TopNavbar";
import { ProfileProvider } from "@/contexts/ProfileContext";
import { PathProvider } from "@/contexts/PathContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import RoleGuard from "@/components/dashboard/role-guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProfileProvider>
      <PathProvider>
        <SignedOut>
          <RedirectToSignIn redirectUrl="/dashboard" />
        </SignedOut>

        <SignedIn>
          <NotificationProvider>
            <RoleGuard>
              {/* Main Layout Container - Fixed Screen Height */}
              <div className="flex h-screen w-full overflow-hidden bg-zinc-50 dark:bg-zinc-950">
                {/* Desktop Sidebar (Hidden on mobile, layout handled by Sheet in Navbar) */}
                <div className="hidden md:block flex-shrink-0">
                  <DashboardSidebar />
                </div>

                {/* Main Content Area */}
                <div className="flex flex-1 flex-col overflow-hidden">
                  {/* Navbar - Fixed at the top of this column */}
                  <TopNavbar />

                  {/* Scrollable Content Zone */}
                  <main
                    className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 scroll-smooth"
                    id="dashboard-main-content"
                  >
                    <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                      {children}
                    </div>
                  </main>
                </div>
              </div>
            </RoleGuard>
          </NotificationProvider>
        </SignedIn>
      </PathProvider>
    </ProfileProvider>
  );
}