"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  TrendingUp,
  Target,
  MessageCircle,
  User,
  Loader2,
  CheckCircle2,
  Clock,
  BookOpen,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type Mentee = {
  id: string;
  name: string;
  email?: string;
  avatarUrl: string;
  goal: string;
  progress: number;
  lastSession: string;
  nextSession?: string;
  status: "Active" | "Paused" | "New";
  studentId?: string;
  milestones?: Array<{
    id: string;
    title: string;
    description: string;
    completed: boolean;
    dueDate?: string;
  }>;
  sessions?: Array<{
    id: string;
    date: string;
    title: string;
    status: "completed" | "upcoming" | "cancelled";
  }>;
  notes?: string;
};

const MenteePlanPage: React.FC = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const params = useParams();
  const menteeId = params?.id as string;

  const [mentee, setMentee] = useState<Mentee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user?.id || !menteeId) {
      if (!isLoaded) return;
      setLoading(false);
      return;
    }

    const fetchMentee = async () => {
      setLoading(true);
      setError(null);

      try {
        if (apiBase) {
          const res = await fetch(
            `${apiBase}/api/mentor-mentees/${menteeId}?mentorId=${encodeURIComponent(user.id)}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
            }
          );

          if (!res.ok) {
            throw new Error("Failed to fetch mentee details");
          }

          const data = (await res.json()) as Mentee;
          setMentee(data);
        } else {
          // Mock data for demo
          setMentee({
            id: menteeId,
            name: "Aditi Sharma",
            email: "aditi@example.com",
            avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aditi",
            goal: "Crack FAANG SDE role in 6 months",
            progress: 65,
            lastSession: "12 Dec 2025",
            nextSession: "18 Dec, 7:30 PM",
            status: "Active",
            milestones: [
              {
                id: "m1",
                title: "Complete Data Structures & Algorithms",
                description: "Master core DSA concepts and solve 200+ problems",
                completed: true,
                dueDate: "1 Dec 2025",
              },
              {
                id: "m2",
                title: "System Design Fundamentals",
                description: "Learn distributed systems, scalability, and design patterns",
                completed: true,
                dueDate: "15 Dec 2025",
              },
              {
                id: "m3",
                title: "Mock Interviews",
                description: "Complete 10 mock interviews with feedback",
                completed: false,
                dueDate: "25 Dec 2025",
              },
              {
                id: "m4",
                title: "Resume & Portfolio Review",
                description: "Optimize resume and build portfolio projects",
                completed: false,
                dueDate: "5 Jan 2026",
              },
            ],
            sessions: [
              {
                id: "s1",
                date: "12 Dec 2025",
                title: "DSA Problem Solving Session",
                status: "completed",
              },
              {
                id: "s2",
                date: "18 Dec 2025, 7:30 PM",
                title: "System Design Deep Dive",
                status: "upcoming",
              },
              {
                id: "s3",
                date: "25 Dec 2025, 6:00 PM",
                title: "Mock Interview - Round 1",
                status: "upcoming",
              },
            ],
            notes: "Aditi is making excellent progress. Strong fundamentals in DSA. Needs more practice with system design trade-offs.",
          });
        }
      } catch (err: any) {
        console.error("Error fetching mentee:", err);
        setError(err.message || "Unable to load mentee details.");
      } finally {
        setLoading(false);
      }
    };

    fetchMentee();
  }, [isLoaded, isSignedIn, user?.id, menteeId, apiBase]);

  if (!isLoaded) {
    return (
      <div className="flex h-full items-center justify-center min-h-screen">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center min-h-screen">
        <div className="text-center space-y-2">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-400 mx-auto" />
          <p className="text-sm text-zinc-500">Loading mentee details...</p>
        </div>
      </div>
    );
  }

  if (error || !mentee) {
    return (
      <div className="min-h-screen bg-zinc-50/70 p-6 dark:bg-zinc-950/60">
        <div className="mx-auto max-w-4xl">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard/mentor/mentees")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Mentees
          </Button>
          <Card className="border-red-200 dark:border-red-900/40">
            <CardContent className="p-6">
              <p className="text-sm text-red-600 dark:text-red-400">
                {error || "Mentee not found"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const completedMilestones = mentee.milestones?.filter((m) => m.completed).length || 0;
  const totalMilestones = mentee.milestones?.length || 0;

  return (
    <div className="min-h-screen bg-zinc-50/70 p-6 space-y-6 dark:bg-zinc-950/60 lg:p-10">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard/mentor/mentees")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Mentees
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/mentor/mentees?message=${mentee.id}`)}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Message
          </Button>
        </div>

        {/* Mentee Profile Card */}
        <Card className="rounded-2xl border border-zinc-200/80 bg-white/95 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950/90">
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <Avatar className="h-20 w-20 border-2 border-zinc-200 dark:border-zinc-800">
                <AvatarImage src={mentee.avatarUrl} alt={mentee.name} />
                <AvatarFallback className="text-2xl">{mentee.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                      {mentee.name}
                    </h1>
                    {mentee.email && (
                      <p className="text-sm text-zinc-500 mt-1">{mentee.email}</p>
                    )}
                  </div>
                  <Badge
                    variant="outline"
                    className={`${
                      mentee.status === "Active"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-200"
                        : mentee.status === "New"
                        ? "bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-200"
                        : "bg-zinc-50 text-zinc-600 border-zinc-100 dark:bg-zinc-900/40 dark:text-zinc-300"
                    }`}
                  >
                    {mentee.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-zinc-500" />
                    <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      {mentee.goal}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-zinc-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Last session: {mentee.lastSession}
                    </span>
                    {mentee.nextSession && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Next: {mentee.nextSession}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Overview */}
        <Card className="rounded-2xl border border-zinc-200/80 bg-white/95 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950/90">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Progress Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  Overall Progress
                </span>
                <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {mentee.progress}%
                </span>
              </div>
              <div className="relative h-3 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800/50">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${mentee.progress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`h-full rounded-full ${
                    mentee.progress >= 70
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
                      : mentee.progress >= 40
                      ? "bg-gradient-to-r from-indigo-500 to-indigo-600"
                      : "bg-gradient-to-r from-amber-500 to-amber-600"
                  }`}
                />
              </div>
            </div>
            {totalMilestones > 0 && (
              <div className="flex items-center gap-4 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-zinc-500" />
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    Milestones: {completedMilestones}/{totalMilestones} completed
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabs for Milestones, Sessions, Notes */}
        <Card className="rounded-2xl border border-zinc-200/80 bg-white/95 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950/90">
          <CardContent className="p-0">
            <Tabs defaultValue="milestones" className="w-full">
              <div className="border-b border-zinc-200 dark:border-zinc-800 px-6 pt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="milestones" className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Milestones
                  </TabsTrigger>
                  <TabsTrigger value="sessions" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Sessions
                  </TabsTrigger>
                  <TabsTrigger value="notes" className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Notes
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="milestones" className="p-6 space-y-4">
                {mentee.milestones && mentee.milestones.length > 0 ? (
                  mentee.milestones.map((milestone) => (
                    <motion.div
                      key={milestone.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-4 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
                    >
                      <div className="mt-0.5">
                        {milestone.completed ? (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          </div>
                        ) : (
                          <div className="h-6 w-6 rounded-full border-2 border-zinc-300 dark:border-zinc-700" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                              {milestone.title}
                            </h3>
                            <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                              {milestone.description}
                            </p>
                          </div>
                        </div>
                        {milestone.dueDate && (
                          <p className="mt-2 text-xs text-zinc-500">
                            Due: {milestone.dueDate}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-sm text-zinc-500 text-center py-8">
                    No milestones set yet.
                  </p>
                )}
              </TabsContent>

              <TabsContent value="sessions" className="p-6 space-y-3">
                {mentee.sessions && mentee.sessions.length > 0 ? (
                  mentee.sessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            session.status === "completed"
                              ? "bg-emerald-500"
                              : session.status === "upcoming"
                              ? "bg-blue-500"
                              : "bg-zinc-400"
                          }`}
                        />
                        <div>
                          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                            {session.title}
                          </p>
                          <p className="text-xs text-zinc-500">{session.date}</p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          session.status === "completed"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-200"
                            : session.status === "upcoming"
                            ? "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-200"
                            : "bg-zinc-50 text-zinc-600 border-zinc-100 dark:bg-zinc-900/40 dark:text-zinc-300"
                        }
                      >
                        {session.status}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-zinc-500 text-center py-8">
                    No sessions scheduled yet.
                  </p>
                )}
              </TabsContent>

              <TabsContent value="notes" className="p-6">
                {mentee.notes ? (
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                      {mentee.notes}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-zinc-500 text-center py-8">
                    No notes added yet.
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MenteePlanPage;






