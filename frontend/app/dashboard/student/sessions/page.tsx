"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Video,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type SessionStatus = "scheduled" | "ongoing" | "completed" | "cancelled";

type StudentSession = {
  id: string;
  mentorId: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  status: SessionStatus;
  paymentStatus?: "pending" | "paid" | "refunded";
  meetingLink?: string;
  recordingUrl?: string;
  notes?: string;
  amount?: number;
  currency?: string;
};

type SessionsResponse = {
  upcoming: StudentSession[];
  past: StudentSession[];
  total: number;
};

const formatDateTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const statusLabel: Record<SessionStatus, string> = {
  scheduled: "Scheduled",
  ongoing: "Ongoing",
  completed: "Completed",
  cancelled: "Cancelled",
};

const statusBorderColors: Record<SessionStatus, string> = {
  scheduled: "border-blue-500/60 dark:border-blue-400/60",
  ongoing: "border-blue-500/60 dark:border-blue-400/60",
  completed: "border-emerald-500/60 dark:border-emerald-400/60",
  cancelled: "border-zinc-300 dark:border-zinc-700",
};

const statusColorClasses: Record<SessionStatus, string> = {
  scheduled: "bg-blue-50/50 text-blue-700 border-blue-200/50 dark:bg-blue-900/10 dark:text-blue-300 dark:border-blue-800/30",
  ongoing: "bg-blue-50/50 text-blue-700 border-blue-200/50 dark:bg-blue-900/10 dark:text-blue-300 dark:border-blue-800/30",
  completed: "bg-emerald-50/50 text-emerald-700 border-emerald-200/50 dark:bg-emerald-900/10 dark:text-emerald-300 dark:border-emerald-800/30",
  cancelled: "bg-zinc-50/50 text-zinc-600 border-zinc-200/50 dark:bg-zinc-900/40 dark:text-zinc-300 dark:border-zinc-800/50",
};

const StudentSessionsPage: React.FC = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [upcoming, setUpcoming] = useState<StudentSession[]>([]);
  const [past, setPast] = useState<StudentSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  const canLoad = useMemo(
    () => isLoaded && isSignedIn && !!user?.id,
    [isLoaded, isSignedIn, user?.id]
  );

  const fetchSessions = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    if (!apiBase) {
      setError("API base URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL in your environment variables.");
      setLoading(false);
      setUpcoming([]);
      setPast([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${apiBase}/api/student-sessions?studentId=${encodeURIComponent(user.id)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      
      if (!res.ok) {
        let errorMessage = "Failed to fetch sessions";
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = `HTTP ${res.status}: ${res.statusText}`;
        }
        throw new Error(errorMessage);
      }
      
      const data = (await res.json()) as SessionsResponse;
      
      // Format sessions properly
      const formatSessions = (sessions: any[]) => {
        return sessions.map(s => ({
          ...s,
          id: s.id || s._id?.toString() || "",
          startTime: typeof s.startTime === 'string' ? s.startTime : new Date(s.startTime).toISOString(),
          endTime: typeof s.endTime === 'string' ? s.endTime : new Date(s.endTime).toISOString(),
        }));
      };
      
      setUpcoming(formatSessions(data.upcoming || []));
      setPast(formatSessions(data.past || []));
      setError(null);
    } catch (err: any) {
      console.error("Error fetching student sessions:", err);
      setError(err.message || "Failed to load sessions. Please try again.");
      setUpcoming([]);
      setPast([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canLoad) {
      fetchSessions();
      // Auto-refresh every 30 seconds
      const interval = setInterval(fetchSessions, 30000);
      return () => clearInterval(interval);
    }
  }, [canLoad, user?.id, apiBase]);

  // Refresh on window focus
  useEffect(() => {
    const handleFocus = () => {
      if (canLoad) {
        fetchSessions();
      }
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [canLoad, user?.id, apiBase]);

  // Sync initial tab from URL
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "upcoming" || tab === "past") {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: "upcoming" | "past") => {
    setActiveTab(tab);
    const current = new URLSearchParams(searchParams.toString());
    current.set("tab", tab);
    router.replace(`?${current.toString()}`);
  };

  const openDetails = (session: StudentSession) => {
    router.push(`/dashboard/student/sessions/${session.id}`);
  };

  const renderSessionRow = (session: StudentSession) => {
    const borderColor = statusBorderColors[session.status] || "border-zinc-200 dark:border-zinc-800";
    
    return (
      <motion.button
        key={session.id}
        onClick={() => openDetails(session)}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={`group w-full text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border-2 ${borderColor} bg-white/95 dark:bg-zinc-950/90 hover:shadow-md transition-all duration-200`}
      >
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="mt-0.5 flex-shrink-0">
            <div className={`p-2 rounded-lg ${
              session.status === "completed" 
                ? "bg-emerald-50 dark:bg-emerald-900/20" 
                : "bg-blue-50 dark:bg-blue-900/20"
            }`}>
              <Video className={`h-4 w-4 ${
                session.status === "completed"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-blue-600 dark:text-blue-400"
              }`} />
            </div>
          </div>
          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {session.title}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-600 dark:text-zinc-400">
              <span className="flex items-center gap-1.5">
                <CalendarIcon className="h-3.5 w-3.5" />
                {formatDateTime(session.startTime)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {session.durationMinutes} min
              </span>
            </div>
            {session.description && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">
                {session.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 sm:flex-none flex-shrink-0">
          <Badge
            className={`text-[10px] font-medium capitalize border ${statusColorClasses[session.status]}`}
          >
            {statusLabel[session.status]}
          </Badge>
          <ArrowRight className="h-4 w-4 text-zinc-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
        </div>
      </motion.button>
    );
  };

  if (!isLoaded) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <span className="h-4 w-4 rounded-full border-2 border-zinc-300 border-t-zinc-600 animate-spin" />
          Loading sessions...
        </div>
      </div>
    );
  }

  if (!isSignedIn || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="space-y-2 text-center">
          <h1 className="text-xl font-semibold tracking-tight">
            My Sessions
          </h1>
          <p className="text-sm text-zinc-500">
            Please sign in to access your sessions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/70 p-6 space-y-8 dark:bg-zinc-950/60 lg:p-10">
      {/* Header */}
      <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            My Sessions
          </h1>
          <p className="text-sm text-zinc-500">
            Review your upcoming and past mentoring sessions.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={fetchSessions}
            variant="outline"
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <Clock className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Content */}
      <Card className="mx-auto max-w-6xl rounded-2xl border border-zinc-200/80 bg-white/95 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950/90 p-4 md:p-5">
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-200">
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <Loader2 className="h-6 w-6 animate-spin" />
              Loading your sessions...
            </div>
          </div>
        ) : upcoming.length === 0 && past.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
            <Video className="h-8 w-8 text-zinc-400" />
            <div>
              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
                No sessions yet
              </p>
              <p className="text-xs text-zinc-500">
                Book your first mentoring session to get started.
              </p>
            </div>
          </div>
        ) : (
          <Tabs
            value={activeTab}
            onValueChange={(v) => handleTabChange(v as "upcoming" | "past")}
          >
            <TabsList className="mb-6 inline-flex rounded-lg bg-zinc-100/80 p-1 text-sm dark:bg-zinc-900/80 border border-zinc-200/50 dark:border-zinc-800/50">
              <TabsTrigger 
                value="upcoming" 
                className="rounded-md px-5 py-2 font-medium data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm dark:data-[state=active]:bg-zinc-800 dark:data-[state=active]:text-indigo-400 transition-all"
              >
                Upcoming
                {upcoming.length > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                    {upcoming.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="past" 
                className="rounded-md px-5 py-2 font-medium data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm dark:data-[state=active]:bg-zinc-800 dark:data-[state=active]:text-indigo-400 transition-all"
              >
                Past
                {past.length > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                    {past.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming" className="space-y-3 mt-4">
              {upcoming.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CalendarIcon className="h-10 w-10 text-zinc-400 mb-3" />
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    No upcoming sessions
                  </p>
                  <p className="text-xs text-zinc-500">
                    Book a session with a mentor to get started.
                  </p>
                </div>
              ) : (
                upcoming.map(renderSessionRow)
              )}
            </TabsContent>
            <TabsContent value="past" className="space-y-3 mt-4">
              {past.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CalendarIcon className="h-10 w-10 text-zinc-400 mb-3" />
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                    No past sessions
                  </p>
                  <p className="text-xs text-zinc-500">
                    Completed sessions will appear here.
                  </p>
                </div>
              ) : (
                past.map(renderSessionRow)
              )}
            </TabsContent>
          </Tabs>
        )}
      </Card>
    </div>
  );
};

export default StudentSessionsPage;


