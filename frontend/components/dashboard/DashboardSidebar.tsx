"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import {
  LayoutDashboard,
  User,
  Users,
  Route,
  Rocket,
  Briefcase,
  Gift,
  Wallet,
  Bot,
  Calendar,
  Settings,
  LogOut,
  ChevronDown,
  Bell,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProfile } from "@/contexts/ProfileContext";
import ProfileSettings from "@/components/dashboard/ProfileSettings";
import { useNotificationModal } from "@/contexts/NotificationContext";

// --- Types ---
type Role = "student" | "mentor" | "founder";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string; // Optional badge for notifications/status
  badgeColor?: string; // Optional custom color for the badge
};

// --- Configuration ---
// Centrally managing navigation items makes it easier to update later
const NAV_CONFIG: Record<Role, NavItem[]> = {
  student: [
    { label: "Profile", href: "/dashboard/student/profile", icon: User },
    { label: "Mentors", href: "/dashboard/student/mentors", icon: Users },
    { label: "Sessions", href: "/dashboard/student/sessions", icon: Calendar },
    { label: "Path Finder", href: "/dashboard/student/pathfinder", icon: Route },
    {
      label: "Real-time Projects",
      href: "/dashboard/student/real-time-projects",
      icon: Rocket,
      badge: "New",
      badgeColor: "bg-emerald-500",
    },
    { label: "Explore Opportunities", href: "/dashboard/student/job-finder", icon: Briefcase },
    { label: "Referrals", href: "/dashboard/student/referrals", icon: Gift },
    { label: "Earnings", href: "/dashboard/student/earnings", icon: Wallet },
  ],
  mentor: [
    { label: "Overview", href: "/dashboard/mentor/overview", icon: LayoutDashboard },
    { label: "Sessions", href: "/dashboard/mentor/sessions", icon: Calendar },
    { label: "Mentees", href: "/dashboard/mentor/mentees", icon: Users },
    { label: "Earnings", href: "/dashboard/mentor/earnings", icon: Wallet },
  ],
  founder: [
    { label: "Overview", href: "/dashboard/founder/overview", icon: LayoutDashboard },
    { label: "Talent Pool", href: "/dashboard/founder/talent-pool", icon: Users },
    { label: "Post Job", href: "/dashboard/founder/post-job", icon: Briefcase },
  ],
};

// --- Helper Hook ---
// In a real app, you might get this from your Auth Context or Session
function useCurrentRole(pathname: string): Role {
  if (pathname.startsWith("/dashboard/mentor")) return "mentor";
  if (pathname.startsWith("/dashboard/founder")) return "founder";
  return "student";
}

export default function Sidebar() {
  const pathname = usePathname();
  const role = useCurrentRole(pathname || "");
  const router = useRouter();
  const { signOut } = useClerk();
  const { profile, setProfile } = useProfile();
  const [isProfileSettingsOpen, setProfileSettingsOpen] = useState(false);
  const { open: openNotifications } = useNotificationModal();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/");
      // Force reload if navigation doesn't happen
      setTimeout(() => {
        if (window.location.pathname !== "/") {
          window.location.href = "/";
        }
      }, 1000);
    } catch (err) {
      console.error("Logout failed:", err);
      window.location.href = "/";
    }
  };

  // Memoize nav items to avoid re-calculating on every render
  const navItems = useMemo(() => NAV_CONFIG[role], [role]);

  return (
    <>
    <aside className="sticky top-0 hidden h-screen w-64 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 md:flex">
      
      {/* 1. Brand Header */}
      <div className="flex h-16 items-center px-6 border-b border-zinc-200 dark:border-zinc-800">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight transition-opacity hover:opacity-90">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900 shadow-sm">
            <Bot className="h-5 w-5" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-lg">Aureeture</span>
            <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
              {role} Workspace
            </span>
          </div>
        </Link>
      </div>

      {/* 2. Main Navigation (Scrollable) */}
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav className="space-y-1">
          {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50 shadow-sm"
                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900/50 dark:hover:text-zinc-50"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon 
                    className={cn(
                      "h-4 w-4 transition-colors", 
                      isActive ? "text-zinc-900 dark:text-zinc-50" : "text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
                    )} 
                  />
                  <span>{item.label}</span>
                </div>
                
                {/* Notification Badge */}
                {item.badge && (
                  <span className={cn(
                    "ml-auto rounded-full px-2 py-0.5 text-[10px] font-medium text-white shadow-sm",
                    item.badgeColor || "bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900"
                  )}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* 3. User Footer (Sticky Bottom) */}
      <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-3 rounded-lg border border-transparent p-2 text-left transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-400">
              <Avatar className="h-9 w-9 border border-zinc-200 dark:border-zinc-800">
                <AvatarImage src={profile.profilePicture || ""} alt={profile.name || profile.email} />
                <AvatarFallback>
                  {(profile.name?.charAt(0) || profile.email?.charAt(0) || "U").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
                  {profile.name || "Innovator"}
                </p>
                <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                  {profile.email}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-zinc-400" />
            </button>
          </DropdownMenuTrigger>
          
            <DropdownMenuContent align="end" className="w-56" side="right" sideOffset={10}>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={(e) => {
                e.preventDefault();
                router.push(`/dashboard/${role}/profile`);
              }}
            >
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={(e) => {
                e.preventDefault();
                // Navigate to role-based settings page
                router.push(`/dashboard/${role}/settings`);
              }}
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={(e) => {
                e.preventDefault();
                openNotifications();
              }}
            >
              <Bell className="mr-2 h-4 w-4" />
              <span>Notifications</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onSelect={(e) => {
                e.preventDefault();
                handleLogout();
              }}
              className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:text-red-400 dark:focus:bg-red-950/20 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
    <ProfileSettings
      isOpen={isProfileSettingsOpen}
      onClose={() => setProfileSettingsOpen(false)}
      currentProfile={profile}
      onSave={setProfile}
    />
    </>
  );
}