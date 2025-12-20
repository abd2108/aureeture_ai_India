"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Video,
  FileText,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

type StudentSession = {
  id: string;
  mentorId: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  status: "scheduled" | "ongoing" | "completed" | "cancelled";
  paymentStatus?: "pending" | "paid" | "refunded";
  meetingLink?: string;
  recordingUrl?: string;
  notes?: string;
  amount?: number;
  currency?: string;
  createdAt?: string;
  updatedAt?: string;
};

const StudentSessionDetailsPage: React.FC = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const params = useParams();
  const sessionId = params.id as string;
  const [session, setSession] = useState<StudentSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  useEffect(() => {
    const fetchSession = async () => {
      if (!user?.id || !sessionId || !apiBase) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `${apiBase}/api/student-sessions/${sessionId}?studentId=${encodeURIComponent(user.id)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          throw new Error(errorData?.message || "Failed to fetch session");
        }

        const data = await res.json();
        setSession({
          ...data,
          startTime: typeof data.startTime === 'string' ? data.startTime : new Date(data.startTime).toISOString(),
          endTime: typeof data.endTime === 'string' ? data.endTime : new Date(data.endTime).toISOString(),
        });
        setError(null);
      } catch (err: any) {
        console.error("Error fetching session:", err);
        setError(err.message || "Unable to load session");
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded && isSignedIn && user?.id) {
      fetchSession();
      // Auto-refresh every 30 seconds to get updates (like notes from mentor)
      const interval = setInterval(fetchSession, 30000);
      return () => clearInterval(interval);
    }
  }, [isLoaded, isSignedIn, user?.id, sessionId, apiBase]);

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
        <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50/70 p-6 dark:bg-zinc-950/60 lg:p-10">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-zinc-50/70 p-6 dark:bg-zinc-950/60 lg:p-10">
        <div className="mx-auto max-w-4xl">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Alert variant="destructive">
            <AlertDescription>
              {error || "Session not found"}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/70 p-6 dark:bg-zinc-950/60 lg:p-10">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              {session.title}
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              Session Details
            </p>
          </div>
        </div>

        {/* Session Info Card */}
        <Card className="rounded-2xl border border-zinc-200/80 bg-white/95 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950/90">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Session Information</CardTitle>
              <Badge
                variant="outline"
                className={
                  session.status === "completed"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300"
                    : session.status === "scheduled"
                    ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300"
                    : "bg-zinc-50 text-zinc-600 border-zinc-200 dark:bg-zinc-900/40 dark:text-zinc-300"
                }
              >
                {session.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {session.description && (
              <div>
                <p className="text-xs font-medium text-zinc-500 mb-1">Description</p>
                <p className="text-sm text-zinc-700 dark:text-zinc-300">
                  {session.description}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-zinc-500 mb-1">Start Time</p>
                <div className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                  <Calendar className="h-4 w-4" />
                  {formatDateTime(session.startTime)}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-500 mb-1">Duration</p>
                <div className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                  <Clock className="h-4 w-4" />
                  {session.durationMinutes} minutes
                </div>
              </div>
            </div>

            {session.meetingLink && (
              <div>
                <p className="text-xs font-medium text-zinc-500 mb-2">Meeting Link</p>
                <Button
                  variant="outline"
                  onClick={() => window.open(session.meetingLink, '_blank')}
                  className="w-full justify-start gap-2"
                >
                  <Video className="h-4 w-4" />
                  Join Meeting
                </Button>
              </div>
            )}

            {session.recordingUrl && (
              <div>
                <p className="text-xs font-medium text-zinc-500 mb-2">Recording</p>
                <Button
                  variant="outline"
                  onClick={() => window.open(session.recordingUrl, '_blank')}
                  className="w-full justify-start gap-2"
                >
                  <Video className="h-4 w-4" />
                  Watch Recording
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mentor Notes Card */}
        {session.notes && (
          <Card className="rounded-2xl border border-zinc-200/80 bg-white/95 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950/90">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Mentor Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                {session.notes}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Payment Info */}
        {session.amount && (
          <Card className="rounded-2xl border border-zinc-200/80 bg-white/95 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950/90">
            <CardHeader>
              <CardTitle className="text-base">Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-500">Amount</p>
                <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {session.currency || "₹"}{session.amount.toLocaleString('en-IN')}
                </p>
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-sm text-zinc-500">Status</p>
                <Badge
                  variant="outline"
                  className={
                    session.paymentStatus === "paid"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300"
                      : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300"
                  }
                >
                  {session.paymentStatus || "pending"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StudentSessionDetailsPage;


