"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Video,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SessionStatus = "scheduled" | "ongoing" | "completed" | "cancelled" | "reschedule_requested";

type MentorSession = {
  _id: string;
  mentorId: string;
  studentId?: string;
  studentName: string;
  studentEmail?: string;
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
  rescheduleCount?: number;
};

const statusLabel: Record<SessionStatus, string> = {
  scheduled: "Scheduled",
  ongoing: "Ongoing",
  completed: "Completed",
  cancelled: "Cancelled",
  reschedule_requested: "Reschedule Requested",
};

const statusColorClasses: Record<SessionStatus, string> = {
  scheduled: "bg-blue-50/50 text-blue-700 border-blue-200/50 dark:bg-blue-900/10 dark:text-blue-300 dark:border-blue-800/30",
  ongoing: "bg-blue-50/50 text-blue-700 border-blue-200/50 dark:bg-blue-900/10 dark:text-blue-300 dark:border-blue-800/30",
  completed: "bg-emerald-50/50 text-emerald-700 border-emerald-200/50 dark:bg-emerald-900/10 dark:text-emerald-300 dark:border-emerald-800/30",
  cancelled: "bg-zinc-50/50 text-zinc-600 border-zinc-200/50 dark:bg-zinc-900/40 dark:text-zinc-300 dark:border-zinc-800/50",
  reschedule_requested: "bg-amber-50/50 text-amber-700 border-amber-200/50 dark:bg-amber-900/10 dark:text-amber-300 dark:border-amber-800/30",
};

const SessionDetailsPage: React.FC = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const params = useParams();
  const sessionId = params?.id as string;

  const [session, setSession] = useState<MentorSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<string>("");

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const useMockData = !apiBase || process.env.NEXT_PUBLIC_USE_MOCK_SESSIONS === "true";
  // Allow joining at any time so UI/UX can be previewed without waiting
  const allowJoinAnytime =
    useMockData ||
    process.env.NEXT_PUBLIC_ALLOW_JOIN_ANYTIME === "true" ||
    true; // default to true for easy preview

  const mockSession: MentorSession = {
    _id: sessionId || "mock-1",
    mentorId: "mock-mentor",
    studentName: "Rishabh Jain",
    studentEmail: "rishabh@example.com",
    title: "Frontend Portfolio Review",
    description: "Review GitHub portfolio and improve storytelling.",
    startTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 75 * 60 * 1000).toISOString(),
    durationMinutes: 45,
    status: "scheduled",
    paymentStatus: "paid",
    meetingLink: "https://meet.aureeture.ai/session/rishabh-1",
    recordingUrl: "https://recordings.aureeture.ai/mock-1",
    notes: "Mock notes: arrive 5 minutes early and share your repo links.",
    rescheduleCount: 0,
  };

  // Calculate countdown and join eligibility
  const joinEligibility = useMemo(() => {
    if (!session) return { canJoin: false, reason: "", timeUntilStart: 0 };

    // For previews we allow join anytime
    if (allowJoinAnytime) {
      return { canJoin: true, reason: "", timeUntilStart: 0 };
    }

    const now = new Date();
    const startTime = new Date(session.startTime);
    const endTime = new Date(session.endTime);
    const fifteenMinutesBefore = new Date(startTime.getTime() - 15 * 60 * 1000);

    // Session has ended
    if (now > endTime) {
      return { canJoin: false, reason: "This session has ended.", timeUntilStart: 0 };
    }

    // Payment not confirmed
    if (session.paymentStatus !== "paid") {
      return { canJoin: false, reason: "Payment not confirmed. Please wait for payment confirmation.", timeUntilStart: 0 };
    }

    // Session not in valid status
    if (session.status !== "scheduled" && session.status !== "ongoing") {
      return { canJoin: false, reason: `Session is ${statusLabel[session.status].toLowerCase()}.`, timeUntilStart: 0 };
    }

    // Too early to join (more than 15 minutes before start)
    if (now < fifteenMinutesBefore) {
      const msUntilStart = startTime.getTime() - now.getTime();
      return { canJoin: false, reason: "Session hasn't started yet. You can join 15 minutes before the scheduled time.", timeUntilStart: msUntilStart };
    }

    // Can join (within 15 minutes before start or after start)
    return { canJoin: true, reason: "", timeUntilStart: 0 };
  }, [session]);

  // Update countdown timer
  useEffect(() => {
    if (!session || joinEligibility.canJoin || joinEligibility.timeUntilStart === 0) {
      setCountdown("");
      return;
    }

    const updateCountdown = () => {
      const now = new Date();
      const startTime = new Date(session.startTime);
      const fifteenMinutesBefore = new Date(startTime.getTime() - 15 * 60 * 1000);
      const msUntilJoin = fifteenMinutesBefore.getTime() - now.getTime();

      if (msUntilJoin <= 0) {
        setCountdown("");
        return;
      }

      const hours = Math.floor(msUntilJoin / (1000 * 60 * 60));
      const minutes = Math.floor((msUntilJoin % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((msUntilJoin % (1000 * 60)) / 1000);

      if (hours > 0) {
        setCountdown(`${hours}h ${minutes}m ${seconds}s`);
      } else if (minutes > 0) {
        setCountdown(`${minutes}m ${seconds}s`);
      } else {
        setCountdown(`${seconds}s`);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [session, joinEligibility]);

  // Fetch session details
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user?.id || !sessionId) {
      if (useMockData) {
        setSession(mockSession);
        setLoading(false);
      }
      return;
    }

    if (useMockData) {
      setSession(mockSession);
      setLoading(false);
      return;
    }

    const fetchSession = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `${apiBase}/api/mentor-sessions/${sessionId}?mentorId=${encodeURIComponent(user.id)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Session not found. It may have been deleted or you don't have access.");
          }
          const errorData = await res.json().catch(() => ({ message: "Failed to fetch session" }));
          throw new Error(errorData.message || `HTTP ${res.status}: Failed to fetch session`);
        }

        const data = (await res.json()) as MentorSession;
        setSession(data);
      } catch (err: any) {
        console.error("Error fetching session:", err);
        // Fallback to mock data when backend is unreachable
        setSession(mockSession);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [isLoaded, isSignedIn, user?.id, sessionId, apiBase]);

  // Handle join session
  const handleJoinSession = async () => {
    if (!session || !user?.id) return;

    // Mock mode: just navigate to join page
    if (useMockData) {
      router.push(`/dashboard/mentor/sessions/${session._id}/join`);
      return;
    }

    setJoining(true);
    setJoinError(null);

    try {
      // First, verify with backend that we can join
      const verifyRes = await fetch(
        `${apiBase}/api/mentor-sessions/${session._id}/verify-join?mentorId=${encodeURIComponent(user.id)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!verifyRes.ok) {
        const errorData = await verifyRes.json().catch(() => ({ message: "Cannot join session" }));
        throw new Error(errorData.message || "Cannot join this session at this time.");
      }

      const verifyData = await verifyRes.json();
      
      // If backend provides a meeting link, use it
      if (verifyData.meetingLink) {
        // Navigate to video session page
        router.push(`/dashboard/mentor/sessions/${session._id}/join`);
      } else if (session.meetingLink) {
        // Fallback to stored meeting link
        router.push(`/dashboard/mentor/sessions/${session._id}/join`);
      } else {
        throw new Error("No meeting link available. Please contact support.");
      }
    } catch (err: any) {
      console.error("Error joining session:", err);
      setJoinError(err.message || "Failed to join session. Please try again.");
    } finally {
      setJoining(false);
    }
  };

  const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isLoaded) {
    return (
      <div className="flex h-full items-center justify-center min-h-screen">
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <span className="h-4 w-4 rounded-full border-2 border-zinc-300 border-t-zinc-600 animate-spin" />
          Loading session details...
        </div>
      </div>
    );
  }

  if (!isSignedIn || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-2 text-center">
          <h1 className="text-xl font-semibold tracking-tight">Session Details</h1>
          <p className="text-sm text-zinc-500">Please sign in to view session details.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center min-h-screen">
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading session details...
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-zinc-50/70 p-6 dark:bg-zinc-950/60">
        <div className="mx-auto max-w-4xl">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard/mentor/sessions")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sessions
          </Button>
          <Card className="border-red-200 dark:border-red-900/40">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                    Unable to Load Session
                  </h2>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {error || "Session not found or you don't have permission to view it."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/70 p-6 space-y-6 dark:bg-zinc-950/60 lg:p-10">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard/mentor/sessions")}
          className="mb-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Sessions
        </Button>

        {/* Session Header */}
        <Card className="border-2 border-zinc-200/80 dark:border-zinc-800/80">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                    {session.title}
                  </h1>
                  <Badge
                    className={`text-xs font-medium capitalize border ${statusColorClasses[session.status]}`}
                  >
                    {statusLabel[session.status]}
                  </Badge>
                </div>
                {session.description && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
                    {session.description}
                  </p>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Session Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-zinc-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1">
                    Student
                  </p>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {session.studentName}
                  </p>
                  {session.studentEmail && (
                    <p className="text-xs text-zinc-500 mt-0.5">{session.studentEmail}</p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CalendarIcon className="h-5 w-5 text-zinc-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-1">
                    Scheduled Time
                  </p>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {formatDateTime(session.startTime)}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Duration: {session.durationMinutes} minutes
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Status */}
            {session.paymentStatus && (
              <div className="flex items-center gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
                  Payment Status:
                </span>
                <Badge
                  variant={session.paymentStatus === "paid" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {session.paymentStatus === "paid" ? "Paid" : session.paymentStatus === "pending" ? "Pending" : "Refunded"}
                </Badge>
              </div>
            )}

            {/* Join Section */}
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
              {joinEligibility.canJoin ? (
                <div className="space-y-3">
                  <Button
                    onClick={handleJoinSession}
                    disabled={joining}
                    size="lg"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
                  >
                    {joining ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Joining Session...
                      </>
                    ) : (
                      <>
                        <Video className="mr-2 h-4 w-4" />
                        Join Session
                      </>
                    )}
                  </Button>
                  {joinError && (
                    <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-200">
                      <AlertCircle className="h-4 w-4" />
                      {joinError}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <Button
                    disabled
                    size="lg"
                    variant="outline"
                    className="w-full"
                  >
                    <Video className="mr-2 h-4 w-4" />
                    Join Session
                  </Button>
                  <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-200">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium mb-0.5">{joinEligibility.reason}</p>
                      {countdown && (
                        <p className="text-xs opacity-90">
                          You can join in: <strong>{countdown}</strong>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Session Notes */}
            {session.notes && (
              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-2">
                  Session Notes
                </p>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                  {session.notes}
                </p>
              </div>
            )}

            {/* Recording */}
            {session.recordingUrl && (
              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <a
                  href={session.recordingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Session Recording
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SessionDetailsPage;



