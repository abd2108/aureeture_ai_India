"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  Bell,
  BellOff,
  Bot,
  Briefcase,
  Calendar,
  LayoutDashboard,
  Users,
  ChevronDown,
  Search,
  Menu,
  Slash,
  Command,
  HelpCircle,
  User,
  Route,
  Rocket,
  Gift,
  Wallet,
  Settings,
  LogOut,
  Star,
} from "lucide-react";
import ThemeToggle from "@/components/dashboard/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfile } from "@/contexts/ProfileContext";
import { useNotificationModal } from "@/contexts/NotificationContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// --- Types & Logic Preserved ---
type RoleKey = "student" | "mentor" | "founder";

function getRoleFromPath(pathname: string): RoleKey {
  if (pathname.startsWith("/dashboard/mentor")) return "mentor";
  if (pathname.startsWith("/dashboard/founder")) return "founder";
  return "student";
}

const ROLE_LABEL: Record<RoleKey, string> = {
  student: "Student Workspace",
  mentor: "Mentor Workspace",
  founder: "Recruiter Workspace",
};

const ROLE_PILL: Record<RoleKey, string> = {
  student: "Student",
  mentor: "Mentor",
  founder: "Founder",
};

type QuickAction = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

type MobileNavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
};

function getQuickActions(role: RoleKey): QuickAction[] {
  // Mentor navbar quick actions removed as per latest design request
  if (role === "mentor") {
    return [];
  }
  if (role === "founder") {
    return [
      { label: "Post Role", href: "/dashboard/founder/post-job", icon: Briefcase },
      { label: "Talent", href: "/dashboard/founder/talent-pool", icon: Users },
    ];
  }
  // No quick actions for student navbar (Roadmap & Jobs removed as requested)
  return [];
}

const MOBILE_NAV_CONFIG: Record<RoleKey, MobileNavItem[]> = {
  student: [
    { label: "Profile", href: "/dashboard/student/profile", icon: User },
    { label: "Mentors", href: "/dashboard/student/mentors", icon: Users },
    { label: "Path Finder", href: "/dashboard/student/pathfinder", icon: Route },
    {
      label: "Real-time Projects",
      href: "/dashboard/student/real-time-projects",
      icon: Rocket,
      badge: "New",
    },
    {
      label: "Explore Opportunities",
      href: "/dashboard/student/job-finder",
      icon: Briefcase,
    },
    { label: "Referrals", href: "/dashboard/student/referrals", icon: Gift },
    { label: "Earnings", href: "/dashboard/student/earnings", icon: Wallet },
    { label: "Settings", href: "/dashboard/student/settings", icon: Settings },
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
    { label: "Settings", href: "/dashboard/founder/settings", icon: Settings },
  ],
};

// --- Helper for Breadcrumbs ---
const getBreadcrumbs = (pathname: string) => {
  const parts = pathname.split("/").filter(Boolean);
  // Skip the first part if it's 'dashboard' to keep it clean
  return parts.map((part) => 
    part.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  );
};

export default function TopNavbar() {
  const pathname = usePathname() || "/dashboard/student/profile";
  const router = useRouter();
  const { signOut } = useClerk();
  const role = getRoleFromPath(pathname);
  const quickActions = getQuickActions(role);
  const breadcrumbs = getBreadcrumbs(pathname);
  const mobileNavItems = MOBILE_NAV_CONFIG[role];

  const { profile, getInitials, getDisplayName } = useProfile();
  const {
    isOpen: isNotificationsOpen,
    open: openNotifications,
    setOpen: setNotificationsOpen,
  } = useNotificationModal();
  const [isNavOpen, setNavOpen] = useState(false);

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

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-40 flex h-16 w-full items-center gap-4 border-b border-zinc-200 bg-white/80 px-3 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80 md:px-6"
    >
      {/* 0. Mobile brand + menu */}
      <div className="flex items-center gap-2 md:hidden">
        <Sheet open={isNavOpen} onOpenChange={setNavOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full border-zinc-200 bg-white text-zinc-700 shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
              aria-label="Open navigation"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="flex h-full flex-col gap-0 bg-white p-0 text-zinc-900 shadow-xl sm:max-w-xs dark:bg-zinc-950 dark:text-zinc-50"
          >
            <SheetHeader className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-900">
              <SheetTitle className="flex items-center gap-3 text-sm">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-xs font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900">
                  A
                </span>
                <span className="flex flex-col">
                  <span className="font-medium">Aureeture</span>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    {ROLE_LABEL[role]}
                  </span>
                </span>
              </SheetTitle>
            </SheetHeader>

            <nav className="flex-1 overflow-y-auto px-3 py-4">
              <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500 dark:text-zinc-500">
                Workspace
              </p>
              <div className="space-y-1">
                {mobileNavItems.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setNavOpen(false)}
                      className={cn(
                        "flex items-center justify-between rounded-lg px-3 py-2 text-sm",
                        isActive
                          ? "bg-zinc-900 text-zinc-50 shadow-sm ring-1 ring-zinc-700 dark:bg-zinc-900"
                          : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-900/60 dark:hover:text-zinc-50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </nav>

            <div className="border-t border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-900 dark:bg-zinc-950">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 border border-zinc-200 dark:border-zinc-800">
                    <AvatarImage src={profile.profilePicture || ""} />
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium leading-tight">
                      {getDisplayName()}
                    </span>
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-500">
                      {profile.email || "user@example.com"}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleLogout}
                  className="h-8 w-8 rounded-full border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  aria-label="Log out"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            Aureeture
          </span>
          <span className="text-[11px] text-zinc-500">
            {ROLE_LABEL[role]}
          </span>
        </div>
      </div>

      {/* 1. Breadcrumbs (Desktop) */}
      <div className="hidden flex-col md:flex">
        <nav aria-label="Breadcrumb" className="flex items-center text-sm text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-100">
            <Bot className="h-4 w-4" />
            <span>Aureeture</span>
          </div>
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={item}>
              <Slash className="mx-2 h-3 w-3 text-zinc-300 dark:text-zinc-700" />
              <span 
                className={index === breadcrumbs.length - 1 ? "font-medium text-zinc-900 dark:text-zinc-100" : ""}
              >
                {item}
              </span>
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* 3. Global Search (Command Center style) */}
      <div className="flex flex-1 items-center justify-end gap-4 md:gap-6">
        <div className="relative hidden w-full max-w-sm sm:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
          <Input
            type="search"
            placeholder={`Search ${ROLE_LABEL[role].toLowerCase()}...`}
            className="h-9 w-full rounded-full border-zinc-200 bg-zinc-50 pl-9 pr-8 text-sm outline-none transition-all focus:w-[105%] focus:border-zinc-400 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:focus:bg-zinc-950"
          />
          <div className="absolute right-2.5 top-2.5 hidden items-center gap-1 opacity-50 lg:flex">
            <Command className="h-3 w-3" />
            <span className="text-[10px]">K</span>
          </div>
        </div>

        {/* 4. Quick Actions & Profile */}
        <div className="flex items-center gap-2">
          {/* Quick Actions (Desktop Only) */}
          <div className="hidden items-center gap-2 lg:flex">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.label} href={action.href}>
                  <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-zinc-600 dark:text-zinc-300">
                    <Icon className="h-3.5 w-3.5" />
                    <span className="text-[11px] font-medium">{action.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>

          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block mx-1" />

          {/* Icons */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
            onClick={openNotifications}
            aria-label="Open notifications"
          >
            <Bell className="h-5 w-5" />
          </Button>

          <ThemeToggle />

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full border border-zinc-200 dark:border-zinc-800 ml-1">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.profilePicture} alt={getDisplayName()} />
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{getDisplayName()}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {profile.email || "user@example.com"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-1">
                <div className="flex items-center gap-2 rounded-md bg-zinc-50 px-2 py-1.5 text-xs font-medium text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {ROLE_PILL[role]} Role
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/${role === 'founder' ? 'founder/settings' : (role + '/profile')}`}>
                  Profile & Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onSelect={(e) => {
                  e.preventDefault();
                  handleLogout();
                }}
                className="text-red-600 dark:text-red-400 cursor-pointer"
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Notifications Modal */}
      <Dialog open={isNotificationsOpen} onOpenChange={setNotificationsOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden">
          <DialogHeader className="border-b border-zinc-200 bg-zinc-50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
            <DialogTitle className="text-base font-semibold">
              Notifications
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center px-8 py-12 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-900">
              <BellOff className="h-7 w-7" />
            </div>
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
              No notifications yet.
            </p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              When something important happens in your workspace, it will show up here.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </motion.header>
  );
}