"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  MessageCircle,
  ArrowRight,
  TrendingUp,
  Calendar,
  UserPlus,
  Loader2,
  X,
  Send,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
};

type MenteesResponse = {
  mentees: Mentee[];
  total: number;
};

const statusColor: Record<Mentee["status"], string> = {
  Active:
    "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-200 dark:border-emerald-900/40",
  Paused:
    "bg-zinc-50 text-zinc-600 border-zinc-100 dark:bg-zinc-900/40 dark:text-zinc-300 dark:border-zinc-800",
  New: "bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-200 dark:border-indigo-900/40",
};

const MenteeCard: React.FC<{
  mentee: Mentee;
  onMessage: (mentee: Mentee) => void;
  onViewPlan: (mentee: Mentee) => void;
}> = ({ mentee, onMessage, onViewPlan }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.25 }}
  >
    <Card className="h-full rounded-2xl border border-zinc-200/80 bg-white/95 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-950/90">
      <CardContent className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-zinc-200 dark:border-zinc-800">
              <AvatarImage src={mentee.avatarUrl} alt={mentee.name} />
              <AvatarFallback>{mentee.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                {mentee.name}
              </p>
              <p className="text-xs text-zinc-500 line-clamp-1">{mentee.goal}</p>
            </div>
          </div>
          <Badge
            variant="outline"
            className={`h-6 px-2 text-[10px] font-semibold ${statusColor[mentee.status]}`}
          >
            {mentee.status}
          </Badge>
        </div>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Progress
            </span>
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {mentee.progress}%
            </span>
          </div>
          <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800/50">
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
        <div className="flex items-center justify-between text-[11px] text-zinc-500">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Last session: {mentee.lastSession}
          </span>
          {mentee.nextSession && (
            <span className="flex items-center gap-1 text-zinc-600 dark:text-zinc-300">
              <TrendingUp className="h-3 w-3" />
              Next: {mentee.nextSession}
            </span>
          )}
        </div>
        <div className="flex justify-between gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            className="h-8 flex-1 text-xs gap-1"
            onClick={() => onMessage(mentee)}
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Message
          </Button>
          <Button
            size="sm"
            className="h-8 flex-1 text-xs gap-1"
            onClick={() => onViewPlan(mentee)}
          >
            View plan
            <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const MentorMenteesPage: React.FC = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | Mentee["status"]>("all");
  const [mentees, setMentees] = useState<Mentee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isAddMenteeOpen, setIsAddMenteeOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [selectedMentee, setSelectedMentee] = useState<Mentee | null>(null);
  const [messageText, setMessageText] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  // Add mentee form state
  const [newMenteeForm, setNewMenteeForm] = useState({
    name: "",
    email: "",
    goal: "",
    status: "New" as Mentee["status"],
  });
  const [addingMentee, setAddingMentee] = useState(false);

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  const canLoad = useMemo(
    () => isLoaded && isSignedIn && !!user?.id,
    [isLoaded, isSignedIn, user?.id]
  );

  const fetchMentees = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    if (!apiBase) {
      setError("API base URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL in your environment variables.");
      setLoading(false);
      setMentees([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${apiBase}/api/mentor-mentees?mentorId=${encodeURIComponent(user.id)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!res.ok) {
        let errorMessage = "Failed to fetch mentees";
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = `HTTP ${res.status}: ${res.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = (await res.json()) as MenteesResponse;
      setMentees(data.mentees || []);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching mentees:", err);
      setError(err.message || "Unable to load mentees. Please try again.");
      setMentees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canLoad) {
      fetchMentees();
      // Auto-refresh every 30 seconds
      const interval = setInterval(fetchMentees, 30000);
      return () => clearInterval(interval);
    }
  }, [canLoad, user?.id, apiBase]);

  // Refresh on window focus
  useEffect(() => {
    const handleFocus = () => {
      if (canLoad) {
        fetchMentees();
      }
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [canLoad, user?.id, apiBase]);

  const filteredMentees =
    filter === "all"
      ? mentees
      : mentees.filter((m) => m.status === filter);

  const handleAddMentee = async () => {
    if (!newMenteeForm.name.trim() || !newMenteeForm.email.trim() || !newMenteeForm.goal.trim()) {
      return;
    }

    if (!apiBase || !user?.id) {
      alert("API configuration error. Please check your environment variables.");
      return;
    }

    setAddingMentee(true);
    try {
      const res = await fetch(`${apiBase}/api/mentor-mentees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          mentorId: user.id,
          name: newMenteeForm.name,
          email: newMenteeForm.email,
          goal: newMenteeForm.goal,
          status: newMenteeForm.status,
        }),
      });

      if (!res.ok) {
        let errorMessage = "Failed to add mentee";
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = `HTTP ${res.status}: ${res.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const newMentee = await res.json();
      // Refetch mentees to ensure consistency
      await fetchMentees();
      setIsAddMenteeOpen(false);
      setNewMenteeForm({ name: "", email: "", goal: "", status: "New" });
    } catch (err: any) {
      console.error("Error adding mentee:", err);
      alert(err.message || "Failed to add mentee. Please try again.");
    } finally {
      setAddingMentee(false);
    }
  };

  const handleMessage = (mentee: Mentee) => {
    setSelectedMentee(mentee);
    setMessageText("");
    setIsMessageOpen(true);
  };

  const handleSendMessage = async () => {
    if (!selectedMentee || !messageText.trim()) return;

    setSendingMessage(true);
    try {
      if (apiBase && user?.id) {
        const res = await fetch(`${apiBase}/api/mentor-mentees/${selectedMentee.id}/message`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            mentorId: user.id,
            message: messageText,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to send message");
        }
      }

      // Show success feedback
      setMessageText("");
      setTimeout(() => {
        setIsMessageOpen(false);
        setSelectedMentee(null);
      }, 1000);
    } catch (err: any) {
      console.error("Error sending message:", err);
      alert(err.message || "Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  const handleViewPlan = (mentee: Mentee) => {
    router.push(`/dashboard/mentor/mentees/${mentee.id}`);
  };

  if (!isLoaded) {
    return (
      <div className="flex h-full items-center justify-center min-h-screen">
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/70 p-6 space-y-8 dark:bg-zinc-950/60 lg:p-10">
      <header className="mx-auto flex max-w-6xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Mentee CRM
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Track your student relationships, progress, and upcoming touchpoints.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1 rounded-full border border-zinc-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300 md:flex">
            <Users className="h-3.5 w-3.5" />
            {mentees.length} mentees
          </div>
          <Button
            className="gap-2 rounded-full bg-indigo-600 px-4 text-sm text-white shadow-sm hover:bg-indigo-700"
            onClick={() => setIsAddMenteeOpen(true)}
          >
            <UserPlus className="h-4 w-4" />
            Add mentee
          </Button>
        </div>
      </header>

      <Card className="mx-auto max-w-6xl rounded-2xl border border-zinc-200/80 bg-white/95 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950/90">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-4 w-4 text-zinc-500" />
                Active mentees
              </CardTitle>
              <CardDescription className="text-xs">
                A quick overview of everyone you&apos;re currently mentoring.
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="mr-1 text-[11px] uppercase tracking-wide text-zinc-500">
                Filter
              </span>
              {["all", "Active", "New", "Paused"].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() =>
                    setFilter(v === "all" ? "all" : (v as Mentee["status"]))
                  }
                  className={`rounded-full border px-3 py-1 transition-colors ${
                    filter === v
                      ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                      : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
            </div>
          ) : error && mentees.length === 0 ? (
            <div className="flex items-center justify-center py-10">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          ) : filteredMentees.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Users className="h-10 w-10 text-zinc-400 mb-3" />
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                No mentees found
              </p>
              <p className="text-xs text-zinc-500">
                {filter === "all"
                  ? "Add your first mentee to get started."
                  : `No mentees with status "${filter}".`}
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredMentees.map((m) => (
                <MenteeCard
                  key={m.id}
                  mentee={m}
                  onMessage={handleMessage}
                  onViewPlan={handleViewPlan}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Mentee Modal */}
      <Dialog open={isAddMenteeOpen} onOpenChange={setIsAddMenteeOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Mentee</DialogTitle>
            <DialogDescription>
              Add a new student to your mentoring program. You can set their initial goal and status.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="Enter mentee name"
                value={newMenteeForm.name}
                onChange={(e) =>
                  setNewMenteeForm({ ...newMenteeForm, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter mentee email"
                value={newMenteeForm.email}
                onChange={(e) =>
                  setNewMenteeForm({ ...newMenteeForm, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal">Goal *</Label>
              <Textarea
                id="goal"
                placeholder="What is their primary goal? (e.g., Crack FAANG SDE role in 6 months)"
                value={newMenteeForm.goal}
                onChange={(e) =>
                  setNewMenteeForm({ ...newMenteeForm, goal: e.target.value })
                }
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Initial Status</Label>
              <Select
                value={newMenteeForm.status}
                onValueChange={(value) =>
                  setNewMenteeForm({
                    ...newMenteeForm,
                    status: value as Mentee["status"],
                  })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Paused">Paused</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddMenteeOpen(false)}
              disabled={addingMentee}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddMentee}
              disabled={
                addingMentee ||
                !newMenteeForm.name.trim() ||
                !newMenteeForm.email.trim() ||
                !newMenteeForm.goal.trim()
              }
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {addingMentee ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Mentee
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Message Modal */}
      <Dialog open={isMessageOpen} onOpenChange={setIsMessageOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Send Message
            </DialogTitle>
            <DialogDescription>
              {selectedMentee
                ? `Send a message to ${selectedMentee.name}`
                : "Send a message to your mentee"}
            </DialogDescription>
          </DialogHeader>
          {selectedMentee && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={selectedMentee.avatarUrl}
                    alt={selectedMentee.name}
                  />
                  <AvatarFallback>{selectedMentee.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {selectedMentee.name}
                  </p>
                  {selectedMentee.email && (
                    <p className="text-xs text-zinc-500">{selectedMentee.email}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Type your message here..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsMessageOpen(false);
                setMessageText("");
                setSelectedMentee(null);
              }}
              disabled={sendingMessage}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={sendingMessage || !messageText.trim()}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {sendingMessage ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MentorMenteesPage;
