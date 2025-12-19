"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  Calendar,
  Video,
  TrendingUp,
  Clock,
  ArrowRight,
  Loader2,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";

type StudentSession = {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  status: "scheduled" | "ongoing" | "completed" | "cancelled";
  meetingLink?: string;
  notes?: string;
};

type SessionsResponse = {
  upcoming: StudentSession[];
  past: StudentSession[];
  total: number;
};

const StudentOverviewPage: React.FC = () => {
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();
  const [upcomingSessions, setUpcomingSessions] = useState<StudentSession[]>([]);
  const [recentSessions, setRecentSessions] = useState<StudentSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalSessions: 0,
    upcomingCount: 0,
    completedCount: 0,
  });

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  const canLoad = useMemo(
    () => isLoaded && isSignedIn && !!user?.id,
    [isLoaded, isSignedIn, user?.id]
  );

  const fetchSessions = async () => {
    if (!user?.id || !apiBase) {
      setLoading(false);
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
        throw new Error("Failed to fetch sessions");
      }

      const data = (await res.json()) as SessionsResponse;
      setUpcomingSessions(data.upcoming || []);
      setRecentSessions((data.past || []).slice(0, 3));
      setStats({
        totalSessions: data.total || 0,
        upcomingCount: data.upcoming?.length || 0,
        completedCount: data.past?.filter(s => s.status === "completed").length || 0,
      });
      setError(null);
    } catch (err: any) {
      console.error("Error fetching sessions:", err);
      setError(err.message || "Unable to load sessions");
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

  if (!isLoaded) {
    return (
      <div className="flex h-full items-center justify-center min-h-screen">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/70 p-6 space-y-8 dark:bg-zinc-950/60 lg:p-10">
      {/* Header */}
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Dashboard
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Welcome back! Here's an overview of your mentoring journey.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="rounded-2xl border border-zinc-200/80 bg-white/95 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950/90">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Total Sessions
                </p>
                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mt-2">
                  {loading ? "..." : stats.totalSessions}
                </p>
              </div>
              <Video className="h-8 w-8 text-zinc-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-zinc-200/80 bg-white/95 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950/90">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Upcoming
                </p>
                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mt-2">
                  {loading ? "..." : stats.upcomingCount}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-zinc-200/80 bg-white/95 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950/90">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Completed
                </p>
                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mt-2">
                  {loading ? "..." : stats.completedCount}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-emerald-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Sessions */}
      <Card className="mx-auto max-w-6xl rounded-2xl border border-zinc-200/80 bg-white/95 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950/90">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Upcoming Sessions</CardTitle>
              <CardDescription className="text-xs">
                Your next mentoring sessions
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/dashboard/student/sessions?tab=upcoming")}
            >
              View All
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-10">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          ) : upcomingSessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Calendar className="h-10 w-10 text-zinc-400 mb-3" />
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                No upcoming sessions
              </p>
              <p className="text-xs text-zinc-500">
                Book a session with a mentor to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingSessions.slice(0, 3).map((session) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                      {session.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDateTime(session.startTime)}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300"
                  >
                    {session.status}
                  </Badge>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Sessions */}
      <Card className="mx-auto max-w-6xl rounded-2xl border border-zinc-200/80 bg-white/95 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950/90">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Recent Sessions</CardTitle>
              <CardDescription className="text-xs">
                Your completed mentoring sessions
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/dashboard/student/sessions?tab=past")}
            >
              View All
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
            </div>
          ) : recentSessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <BookOpen className="h-10 w-10 text-zinc-400 mb-3" />
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                No past sessions
              </p>
              <p className="text-xs text-zinc-500">
                Completed sessions will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentSessions.map((session) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                      {session.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDateTime(session.startTime)}
                      </span>
                    </div>
                    {session.notes && (
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 line-clamp-1">
                        {session.notes}
                      </p>
                    )}
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300"
                  >
                    {session.status}
                  </Badge>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentOverviewPage;


