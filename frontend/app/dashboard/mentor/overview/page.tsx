"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Users,
  Star,
  TrendingUp,
  Video,
  ArrowRight,
  Clock,
  MoreHorizontal,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const ONBOARDING_KEY = "aureeture_mentor_onboarding_complete";

// --- Types ---

type SessionStatus = "scheduled" | "ongoing" | "completed" | "cancelled";

type MentorSession = {
  _id: string;
  mentorId: string;
  studentName: string;
  studentEmail?: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  status: SessionStatus;
  meetingLink?: string;
};

type SessionsResponse = {
  upcoming: MentorSession[];
  past: MentorSession[];
};

// --- COMPONENTS ---

const DashboardWidget = ({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, delay, ease: "easeOut" }}
    className={`rounded-2xl border border-zinc-200/80 bg-white/95 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950/90 ${className}`}
  >
    {children}
  </motion.div>
);

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  delay,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: any;
  delay: number;
}) => (
  <DashboardWidget delay={delay} className="p-5 flex flex-col justify-between h-full">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-1">
          {title}
        </p>
        <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          {value}
        </h3>
      </div>
      <div className="p-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
        <Icon className="w-5 h-5 text-zinc-500" />
      </div>
    </div>
    <p className="text-xs text-zinc-500 mt-4">{subtitle}</p>
  </DashboardWidget>
);

const SessionRow = ({
  name,
  topic,
  time,
  status = "upcoming",
  avatar,
  onJoin,
}: {
  name: string;
  topic: string;
  time: string;
  status?: "upcoming" | "completed" | "cancelled";
  avatar: string;
  onJoin?: () => void;
}) => (
  <div className="flex items-center justify-between p-3 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 rounded-lg transition-colors group">
    <div className="flex items-center gap-3">
      <Avatar className="h-10 w-10 border border-zinc-200 dark:border-zinc-800">
        <AvatarImage src={avatar} alt={name} />
        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {name}
        </p>
        <p className="text-xs text-zinc-500">{topic}</p>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <div className="hidden text-right sm:block">
        <p className="text-xs font-medium text-zinc-900 dark:text-zinc-200">
          {time}
        </p>
        <Badge
          variant={status === "upcoming" ? "secondary" : "outline"}
          className="text-[10px] h-5 px-1.5"
        >
          {status}
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        {onJoin && (
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-[11px]"
            type="button"
            onClick={onJoin}
          >
            Join meeting
          </Button>
        )}
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
);

// --- PAGE COMPONENT ---

const MentorOverviewPage: React.FC = () => {
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();
  const [isOnline, setIsOnline] = useState(true);
  const [isVerified] = useState(true); // placeholder until backend verification is wired
  const [isCopyingLink, setIsCopyingLink] = useState(false);
  const [todaySessions, setTodaySessions] = useState<MentorSession[]>([]);
  const [loadingToday, setLoadingToday] = useState(true);
  const [todayError, setTodayError] = useState<string | null>(null);
  const [pendingRequests, setPendingRequests] = useState<Array<{
    id: string;
    name: string;
    summary: string;
    createdAt: string;
    type?: string;
    sessionId?: string;
    action?: string;
  }>>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [requestsError, setRequestsError] = useState<string | null>(null);

  // Dashboard stats
  const [stats, setStats] = useState({
    earnings: { total: 0, formatted: "₹0", change: 0, changeType: "increase" as "increase" | "decrease" },
    mentees: { active: 0, total: 0, newRequests: 0 },
    rating: { value: 0, reviewCount: 0 },
    visibility: { percentage: 0 },
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  const canLoadSessions = useMemo(
    () => isLoaded && isSignedIn && !!user?.id,
    [isLoaded, isSignedIn, user?.id]
  );

  // Gate: if onboarding not complete, push back to onboarding wizard
  useEffect(() => {
    const hasCompletedOnboarding =
      typeof window !== "undefined" &&
      window.localStorage.getItem(ONBOARDING_KEY) === "true";
    if (!hasCompletedOnboarding) {
      router.replace("/dashboard/mentor/onboarding");
    }
  }, [router]);

  // Load dashboard stats
  useEffect(() => {
    const loadStats = async () => {
      if (!canLoadSessions || !user?.id || !apiBase) return;
      setLoadingStats(true);
      setStatsError(null);
      try {
        const res = await fetch(
          `${apiBase}/api/mentor/stats?mentorId=${encodeURIComponent(user.id)}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.message || "Unable to load stats");
        }
        const data = await res.json();
        setStats(data);
      } catch (err: any) {
        console.error("Error loading stats:", err);
        setStatsError(err.message || "Unable to load dashboard stats");
      } finally {
        setLoadingStats(false);
      }
    };
    loadStats();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, [apiBase, canLoadSessions, user?.id]);

  // Refresh on window focus
  useEffect(() => {
    const handleFocus = () => {
      if (canLoadSessions && user?.id && apiBase) {
        // Reload all data when window regains focus
        window.location.reload();
      }
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [canLoadSessions, user?.id, apiBase]);

  // Load pending requests
  useEffect(() => {
    const loadRequests = async () => {
      if (!canLoadSessions || !user?.id || !apiBase) return;
      setLoadingRequests(true);
      setRequestsError(null);
      try {
        const res = await fetch(
          `${apiBase}/api/mentor/pending-requests?mentorId=${encodeURIComponent(user.id)}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.message || "Unable to load requests");
        }
        const data = await res.json();
        setPendingRequests(data.requests || []);
      } catch (err: any) {
        console.error("Error loading requests:", err);
        setRequestsError(err.message || "Unable to load pending requests");
        // Set empty array on error to show "all caught up" message
        setPendingRequests([]);
      } finally {
        setLoadingRequests(false);
      }
    };
    loadRequests();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadRequests, 30000);
    return () => clearInterval(interval);
  }, [apiBase, canLoadSessions, user?.id]);

  // Load sessions for today from backend for this mentor
  useEffect(() => {
    const loadToday = async () => {
      if (!canLoadSessions || !user?.id) return;
      setLoadingToday(true);
      setTodayError(null);
      try {
        const res = await fetch(
          `${apiBase}/api/mentor-sessions?mentorId=${encodeURIComponent(
            user.id
          )}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.message || "Unable to load sessions");
        }
        const data = (await res.json()) as SessionsResponse;
        const all = [...(data.upcoming || []), ...(data.past || [])];
        const today = new Date();
        const isSameDay = (d: Date) =>
          d.getFullYear() === today.getFullYear() &&
          d.getMonth() === today.getMonth() &&
          d.getDate() === today.getDate();

        const filtered = all.filter((s) =>
          isSameDay(new Date(s.startTime))
        );
        setTodaySessions(filtered.slice(0, 5));
      } catch (err: any) {
        console.error("Error loading today sessions:", err);
        setTodayError(err.message || "Unable to load today's sessions");
      } finally {
        setLoadingToday(false);
      }
    };
    loadToday();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadToday, 30000);
    return () => clearInterval(interval);
  }, [apiBase, canLoadSessions, user?.id]);

  const handleCopyProfileLink = async () => {
    if (typeof window === "undefined") return;
    try {
      setIsCopyingLink(true);
      const url = `${window.location.origin}/mentor/profile`;
      await navigator.clipboard.writeText(url);
      setTimeout(() => setIsCopyingLink(false), 1200);
    } catch {
      setIsCopyingLink(false);
    }
  };

  const handleViewSession = (sessionId: string) => {
    router.push(`/dashboard/mentor/sessions/${sessionId}`);
  };

  const handleWriteFeedback = (sessionId: string) => {
    router.push(`/dashboard/mentor/sessions/${sessionId}`);
  };

  const handleGoToSessions = (tab: "upcoming" | "past" = "upcoming") => {
    router.push(`/dashboard/mentor/sessions?tab=${tab}`);
  };

  const handleGoToMentees = () => {
    router.push("/dashboard/mentor/mentees");
  };

  const handleGoToAvailabilitySettings = () => {
    router.push("/dashboard/mentor/profile#availability");
  };

  const handleJoinMeeting = (session: MentorSession) => {
    // Navigate to session details page which handles join logic with server-side validation
    router.push(`/dashboard/mentor/sessions/${session._id}`);
  };

  return (
    <div className="min-h-screen bg-zinc-50/70 p-6 space-y-8 dark:bg-zinc-950/60 lg:p-10">
      {/* Verification banner */}
      {!isVerified && (
        <Alert className="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-400/40 dark:bg-amber-950/40 dark:text-amber-100">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Verification pending</AlertTitle>
          <AlertDescription>
            Your mentor profile is currently being reviewed by Aureeture AI.
            Students will be able to book with you once verification is
            complete. This usually takes less than 24 hours.
          </AlertDescription>
        </Alert>
      )}

      {/* 1. Header Section + availability toggle */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Mentor Dashboard
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Manage sessions, respond to requests, and track your impact on
            Aureeture.
          </p>
        </div>
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center justify-between gap-3 rounded-full border border-zinc-200 bg-white/95 px-4 py-2 text-xs shadow-sm dark:border-zinc-800 dark:bg-zinc-950/90">
            <div className="flex flex-col">
              <span className="font-medium text-zinc-900 dark:text-zinc-50">
                {isOnline ? "Available for instant bookings" : "Offline"}
              </span>
              <span className="text-[11px] text-zinc-500">
                Toggle to control your live visibility.
              </span>
            </div>
            <Switch checked={isOnline} onCheckedChange={setIsOnline} />
          </div>
          <Button
            variant="outline"
            className="gap-2 rounded-full"
            type="button"
            onClick={handleGoToMentees}
          >
            <Users className="h-4 w-4" />
            Manage mentees
          </Button>
          <Button
            variant="outline"
            className="gap-2 rounded-full"
            type="button"
            onClick={handleCopyProfileLink}
            disabled={isCopyingLink}
          >
            <ArrowRight className="h-4 w-4 rotate-[-45deg]" />
            {isCopyingLink ? "Copied" : "Copy profile link"}
          </Button>
        </div>
      </motion.div>

      {/* 2. Key Metrics Grid */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total earnings"
          value={loadingStats ? "Loading..." : stats.earnings.formatted}
          subtitle={loadingStats ? "" : `${stats.earnings.change >= 0 ? '+' : ''}${stats.earnings.change}% from last month`}
          icon={TrendingUp}
          delay={0.1}
        />
        <StatCard
          title="Active mentees"
          value={loadingStats ? "Loading..." : String(stats.mentees.active)}
          subtitle={loadingStats ? "" : `${stats.mentees.newRequests} new requests pending`}
          icon={Users}
          delay={0.15}
        />
        <StatCard
          title="Rating"
          value={loadingStats ? "Loading..." : String(stats.rating.value)}
          subtitle={loadingStats ? "" : `Based on ${stats.rating.reviewCount} reviews`}
          icon={Star}
          delay={0.2}
        />
        <StatCard
          title="Profile visibility"
          value={loadingStats ? "Loading..." : `${stats.visibility.percentage}%`}
          subtitle="Higher visibility gives you more booking requests"
          icon={Video}
          delay={0.25}
        />
      </div>

      {/* 3. Main Content Area */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Schedule (2 cols wide) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Sessions (Today) */}
          <DashboardWidget delay={0.3} className="p-0 overflow-hidden">
            <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Today&apos;s sessions
                </h3>
                <p className="text-xs text-zinc-500">
                  A quick snapshot of your schedule for today.
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                type="button"
                onClick={() => handleGoToSessions("upcoming")}
              >
                View Calendar
              </Button>
            </div>
            <div className="p-2 space-y-1">
              {loadingToday ? (
                <div className="flex items-center justify-center py-8 text-xs text-zinc-500">
                  <span className="mr-2 h-4 w-4 rounded-full border-2 border-zinc-300 border-t-zinc-600 animate-spin" />
                  Loading today&apos;s sessions...
                </div>
              ) : todayError ? (
                <p className="py-4 text-center text-xs text-red-500">
                  {todayError}
                </p>
              ) : todaySessions.length === 0 ? (
                <p className="py-4 text-center text-xs text-zinc-500">
                  No sessions scheduled for today yet.
                </p>
              ) : (
                todaySessions.map((s) => (
                  <SessionRow
                    key={s._id}
                    name={"abdullah"}
                    topic={s.title}
                    time={new Date(s.startTime).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    status={
                      s.status === "completed"
                        ? "completed"
                        : s.status === "cancelled"
                        ? "cancelled"
                        : "upcoming"
                    }
                    avatar={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                      s.studentName
                    )}`}
                    onJoin={
                      s.status === "scheduled" || s.status === "ongoing"
                        ? () => handleJoinMeeting(s)
                        : undefined
                    }
                  />
                ))
              )}
            </div>
            <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/30">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs text-zinc-500 hover:text-zinc-900"
                type="button"
                onClick={() => handleGoToSessions("upcoming")}
              >
                View all upcoming sessions
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </DashboardWidget>

          {/* Pending Requests */}
          <DashboardWidget delay={0.4} className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-indigo-500" />
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                Pending requests
              </h3>
            </div>
            <div className="space-y-3">
              {loadingRequests ? (
                <div className="flex items-center justify-center py-4 text-xs text-zinc-500">
                  <span className="mr-2 h-4 w-4 rounded-full border-2 border-zinc-300 border-t-zinc-600 animate-spin" />
                  Loading requests...
                </div>
              ) : requestsError ? (
                <p className="text-xs text-red-500 py-4 text-center">
                  {requestsError}
                </p>
              ) : pendingRequests.length === 0 ? (
                <p className="text-xs text-zinc-500">
                  You&apos;re all caught up. New student requests will appear
                  here.
                </p>
              ) : (
                pendingRequests.map((req) =>
                  req.type === "paid_booking" ? (
                    <div
                      key={req.id}
                      className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-zinc-400" />
                        <div>
                          <p className="text-sm text-zinc-700 dark:text-zinc-300">
                            <span className="font-medium">{req.name}</span>{" "}
                            {req.summary}
                          </p>
                          <p className="text-[11px] text-zinc-500">
                            {req.createdAt} • Auto-confirmed after payment
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        type="button"
                        onClick={() => req.sessionId && handleViewSession(req.sessionId)}
                      >
                        View Session
                      </Button>
                    </div>
                  ) : (
                    <div
                      key={req.id}
                      className="flex items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                        <p className="text-sm text-zinc-700 dark:text-zinc-300">
                          {req.summary}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        type="button"
                        onClick={() => req.sessionId && handleWriteFeedback(req.sessionId)}
                      >
                        Write feedback
                      </Button>
                    </div>
                  )
                )
              )}
            </div>
          </DashboardWidget>
        </div>

        {/* Right Column: Insights & Quick Actions (1 col wide) */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <DashboardWidget delay={0.5} className="p-5">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-zinc-500 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start h-10 text-sm font-normal"
                type="button"
                onClick={() => handleGoToSessions("upcoming")}
              >
                <Video className="w-4 h-4 mr-2 text-zinc-500" /> Start Instant
                Session
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start h-10 text-sm font-normal"
                type="button"
                onClick={handleGoToAvailabilitySettings}
              >
                <Clock className="w-4 h-4 mr-2 text-zinc-500" /> Edit
                Availability Slots
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start h-10 text-sm font-normal"
                type="button"
                onClick={handleGoToMentees}
              >
                <Users className="w-4 h-4 mr-2 text-zinc-500" /> Browse Mentee
                Pool
              </Button>
            </div>
          </DashboardWidget>

          {/* Performance Insight */}
          <DashboardWidget
            delay={0.6}
            className="p-5 bg-gradient-to-br from-zinc-900 to-zinc-800 text-white dark:from-zinc-800 dark:to-black border-none"
          >
            <div className="flex items-center gap-2 mb-2 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Top Performer
              </span>
            </div>
            <h3 className="text-lg font-bold mb-2">You&apos;re in the top 5%</h3>
            <p className="text-sm text-zinc-400 mb-4">
              {loadingStats ? (
                "Loading performance data..."
              ) : (
                <>
                  Your session rating of {stats.rating.value} is exceptional. Keep it up to earn
                  the &quot;Super Mentor&quot; badge next month.
                </>
              )}
            </p>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full transition-all duration-500" 
                style={{ width: `${loadingStats ? 0 : stats.visibility.percentage}%` }}
              />
            </div>
            <p className="text-[10px] text-right mt-1 text-zinc-500">
              {loadingStats ? "Loading..." : `${stats.visibility.percentage}% to goal`}
            </p>
          </DashboardWidget>
        </div>
      </div>
    </div>
  );
};

export default MentorOverviewPage;
