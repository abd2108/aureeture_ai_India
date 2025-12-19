"use client";

import React, { useState, FC, ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Briefcase, Target, Building, Edit, Mail, Phone, MapPin, Linkedin, 
  BarChart3, CheckCircle, Clock, GraduationCap, Palette, Code, Plus, Trash2, 
  Save, Calendar as CalendarIcon, X, Loader2, Sparkles
} from 'lucide-react';

// --- UI Components (from shadcn/ui or similar) ---
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useProfile } from "@/contexts/ProfileContext";
import { format } from "date-fns";
import { useUser, useAuth } from "@clerk/nextjs";

// --- TYPESCRIPT TYPES ---
type PersonalInfoKey = 'name' | 'email' | 'phone' | 'location' | 'linkedin';
type ProfileData = {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
};
type TimelineItem = {
  id: number;
  type: 'education' | 'work' | 'project';
  title: string;
  subtitle: string;
  description: string;
  startDate?: Date;
  endDate?: Date;
  isCurrent?: boolean;
};
type Skill = {
  id: number;
  name: string;
};
type Task = {
  id: number;
  title: string;
  priority: 'high' | 'medium' | 'low';
  deadline?: Date;
};
type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  match: number;
};
type ModalType = 'ADD_TIMELINE' | 'EDIT_TIMELINE' | 'APPLY_JOB';

// --- HELPER & REUSABLE COMPONENTS ---

const MotionCard = ({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: delay * 0.1 }}
  >
    <Card
      className={cn(
        "relative overflow-hidden rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80",
        "bg-white/95 dark:bg-zinc-950/95 shadow-sm transition-all duration-300",
        className
      )}
    >
      {children}
    </Card>
  </motion.div>
);

const EditableField: FC<{
  icon: ReactNode;
  label: string;
  value: string;
  onSave: (newValue: string) => void;
}> = ({ icon, label, value, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  const handleSave = () => {
    onSave(currentValue);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center justify-between p-3 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="text-zinc-500">{icon}</div>
        <div>
          <p className="text-xs text-zinc-500">{label}</p>
          {!isEditing ? (
            <p className="font-medium">{value}</p>
          ) : (
            <Input
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              className="h-8 mt-1"
            />
          )}
        </div>
      </div>
      <div>
        {!isEditing ? (
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4" />
          </Button>
        ) : (
          <div className="flex gap-1">
             <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleSave}>
               <CheckCircle className="h-4 w-4 text-green-500" />
             </Button>
             <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsEditing(false)}>
               <X className="h-4 w-4 text-red-500" />
             </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const Toast: FC<{ message: string; onDismiss: () => void }> = ({ message, onDismiss }) => {
    useEffect(() => {
        const timer = setTimeout(onDismiss, 3000);
        return () => clearTimeout(timer);
    }, [onDismiss]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.5 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 py-2 px-4 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-lg z-50"
        >
            <CheckCircle className="h-5 w-5 text-green-500" />
            <p className="font-medium">{message}</p>
        </motion.div>
    );
};

// Simple Bar Chart for Analytics
const EngagementChart: FC<{ data: { name: string, value: number }[] }> = ({ data }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    return (
        <div className="h-40 flex justify-around items-end gap-2 p-4 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
            {data.map((item, index) => (
                <motion.div 
                    key={index} 
                    className="w-full flex flex-col items-center gap-1"
                    initial={{ height: 0 }}
                    animate={{ height: `${(item.value / maxValue) * 100}%` }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                >
                    <div className="w-full bg-zinc-900/20 dark:bg-zinc-100/20 rounded-t-sm flex-grow" />
                    <p className="text-xs text-zinc-500">{item.name}</p>
                </motion.div>
            ))}
        </div>
    );
};

// Simulate an API call
const simulateApiCall = (duration = 1000) => new Promise(resolve => setTimeout(resolve, duration));

// --- MAIN PROFILE PAGE COMPONENT ---
interface ProfilePageDashboardProps {
  onOpenSettings?: () => void;
}

const ProfilePageDashboard: FC<ProfilePageDashboardProps> = ({
  onOpenSettings,
}) => {

  // --- STATE MANAGEMENT ---
  const { profile, updateProfile } = useProfile();
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  const [profileData, setProfileData] = useState<ProfileData>({
    name: profile.name || "Your name",
    email: profile.email || "",
    phone: (profile as any).phone || "",
    location: profile.location || "Your city",
    linkedin: (profile as any).linkedIn || "",
  });

  // Fetch profile data from backend
  useEffect(() => {
    const fetchProfile = async () => {
      if (!isLoaded || !user?.id || !apiBase) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Get auth token from Clerk
        const token = await getToken();
        
        const res = await fetch(`${apiBase}/api/profile/student`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch profile");
        }

        const result = await res.json();
        if (result.success && result.data) {
          const data = result.data;
          
          // Update profile data - prioritize backend data, fallback to Clerk user data
          setProfileData({
            name: data.personalInfo?.name || user?.fullName || user?.firstName || profile.name || "Your name",
            email: data.personalInfo?.email || user?.primaryEmailAddress?.emailAddress || profile.email || "",
            phone: data.personalInfo?.phone || "",
            location: data.personalInfo?.location || profile.location || "Your city",
            linkedin: data.personalInfo?.linkedin || "",
          });

          // Update timeline items
          if (data.timelineItems) {
            setTimelineItems(data.timelineItems.map((item: any) => ({
              ...item,
              startDate: item.startDate ? new Date(item.startDate) : undefined,
              endDate: item.endDate ? new Date(item.endDate) : undefined,
            })));
          }

          // Update skills
          if (data.skills) {
            setSkills(data.skills.map((skill: string, index: number) => ({
              id: index + 1,
              name: skill,
            })));
          }

          // Update tasks
          if (data.tasks) {
            setTasks({
              todo: data.tasks.todo || [],
              later: data.tasks.later || [],
              done: data.tasks.done || [],
            });
          }

          // Update snapshot data
          if (data.careerSnapshot) {
            setSnapshotData({
              careerStage: data.careerSnapshot.careerStage,
              longTermGoal: data.careerSnapshot.longTermGoal,
              currentRole: data.careerSnapshot.currentRole,
              company: data.careerSnapshot.currentCompany,
              joinDate: data.careerSnapshot.joinDate,
            });
          }

          // Update analytics
          if (data.analytics) {
            setAnalytics({
              profileCompletion: data.analytics.profileCompletion,
              skillScore: data.analytics.skillScore,
              connections: data.analytics.connects,
              applications: data.analytics.applications,
              jobMatches: data.analytics.matches,
              chartData: [
                { name: 'Views', value: data.analytics.views },
                { name: 'Connects', value: data.analytics.connects },
                { name: 'Applies', value: data.analytics.applications },
                { name: 'Matches', value: data.analytics.matches },
              ],
            });
          }

          // Update career goals
          if (data.careerGoals) {
            setCareerGoals(data.careerGoals);
          }
        }
      } catch (err: any) {
        console.error("Error fetching profile:", err);
        setError(err.message || "Failed to load profile");
        // Even on error, use Clerk user data as fallback
        if (user) {
          setProfileData({
            name: user.fullName || user.firstName || "Your name",
            email: user.primaryEmailAddress?.emailAddress || "",
            phone: "",
            location: profile.location || "Your city",
            linkedin: "",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded && user?.id && apiBase && getToken) {
      fetchProfile();
    } else if (isLoaded && user) {
      // If no API base URL, use Clerk user data
      setProfileData({
        name: user.fullName || user.firstName || "Your name",
        email: user.primaryEmailAddress?.emailAddress || "",
        phone: "",
        location: profile.location || "Your city",
        linkedin: "",
      });
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [isLoaded, user?.id, apiBase, getToken, user]);

  // keep local profileData in sync when global profile changes
  useEffect(() => {
    setProfileData({
      name: profile.name || "Your name",
      email: profile.email || "",
      phone: (profile as any).phone || "",
      location: profile.location || "Your city",
      linkedin: (profile as any).linkedIn || "",
    });
    // we only care about these primitive fields
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.name, profile.email, profile.location]);
  
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([
    {
      id: 1,
      type: 'education',
      title: 'IIT Data Science',
      subtitle: '2021 - 2025',
      description: 'GPA: 8.7/10',
      startDate: new Date(2021, 0, 1),
      endDate: new Date(2025, 5, 30),
      isCurrent: false,
    },
    {
      id: 2,
      type: 'work',
      title: 'Animator',
      subtitle: 'Disney',
      description: 'Jul 2025 - Present',
      startDate: new Date(2025, 6, 1),
      endDate: undefined,
      isCurrent: true,
    },
    {
      id: 3,
      type: 'project',
      title: '3D Animation Portfolio',
      subtitle: 'Personal Project',
      description: 'Character animation & VFX',
      startDate: new Date(2024, 0, 1),
      endDate: new Date(2024, 5, 30),
      isCurrent: false,
    },
  ]);
  
  const [skills, setSkills] = useState<Skill[]>([
    { id: 1, name: '3D Animation' }, { id: 2, name: 'Maya' }, { id: 3, name: 'Blender' },
    { id: 4, name: 'After Effects' }, { id: 5, name: 'Storytelling' }
  ]);
  const [newSkill, setNewSkill] = useState('');

  const [tasks, setTasks] = useState<{ todo: Task[], later: Task[], done: Task[] }>({
    todo: [{ id: 1, title: 'Complete animation reel', priority: 'high', deadline: new Date() }],
    later: [{ id: 2, title: 'Learn Houdini basics', priority: 'low' }],
    done: [{ id: 3, title: 'Finish modeling course', priority: 'high' }]
  });
  
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [newTaskData, setNewTaskData] = useState<{ title: string; priority: 'high' | 'medium' | 'low', list: 'todo' | 'later', deadline?: Date }>({
    title: '', priority: 'medium', list: 'todo'
  });
  const [modal, setModal] = useState<{ type: ModalType | null; data?: any }>({ type: null });
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [newTimeline, setNewTimeline] = useState<{
    type: TimelineItem["type"];
    title: string;
    subtitle: string;
    description: string;
    startDate?: Date;
    endDate?: Date;
    isCurrent?: boolean;
  }>({
    type: "work",
    title: "",
    subtitle: "",
    description: "",
    startDate: undefined,
    endDate: undefined,
    isCurrent: false,
  });
  const [editingTimeline, setEditingTimeline] = useState<TimelineItem | null>(null);

  // --- STATE DATA ---
  const [snapshotData, setSnapshotData] = useState({
    careerStage: 'Professional',
    longTermGoal: 'Become a lead animator',
    currentRole: 'Animator',
    company: 'Disney',
    joinDate: 'Jul 2025'
  });

  const [analytics, setAnalytics] = useState({
    profileCompletion: 85,
    skillScore: 847,
    connections: 89,
    applications: 12,
    jobMatches: 24,
    chartData: [
        { name: 'Views', value: 127 },
        { name: 'Connects', value: 89 },
        { name: 'Applies', value: 12 },
        { name: 'Matches', value: 24 },
    ]
  });

  const [careerGoals, setCareerGoals] = useState([
    { name: 'Portfolio', progress: 75 },
    { name: 'Networking', progress: 60 },
    { name: 'Skills', progress: 90 },
    { name: 'Experience', progress: 45 },
  ]);

  const jobRecommendations = [
    { id: 1, title: 'Senior 3D Animator', company: 'Pixar', location: 'Emeryville, CA', match: 92 },
    { id: 2, title: 'Character Animator', company: 'DreamWorks', location: 'Glendale, CA', match: 88 },
    { id: 3, title: 'VFX Animator', company: 'Industrial Light & Magic', location: 'San Francisco, CA', match: 85 },
    { id: 4, title: 'Game Animator', company: 'Riot Games', location: 'Los Angeles, CA', match: 82 },
  ];

  // --- HANDLERS ---
  const showToast = (message: string) => setToast({ id: Date.now(), message });

  const handleSaveAll = async () => {
    if (!user?.id || !apiBase) {
      showToast("Unable to save: User not authenticated");
      return;
    }

    setSaving(true);
    setIsSaving(true);
    setError(null);

    try {
      const token = await getToken();
      
      const updatePayload = {
        personalInfo: {
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone,
          location: profileData.location,
          linkedin: profileData.linkedin,
        },
        careerSnapshot: snapshotData,
        timelineItems: timelineItems.map(item => ({
          type: item.type,
          title: item.title,
          subtitle: item.subtitle,
          description: item.description,
          startDate: item.startDate,
          endDate: item.endDate,
          isCurrent: item.isCurrent,
        })),
        skills: skills.map(s => s.name),
        tasks: tasks,
        careerGoals: careerGoals,
        analytics: analytics,
      };

      const res = await fetch(`${apiBase}/api/profile/student`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(updatePayload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to save profile");
      }

      updateProfile({
        name: profileData.name,
        email: profileData.email,
        location: profileData.location,
      } as any);

      showToast("Profile updated successfully!");
    } catch (err: any) {
      console.error("Error saving profile:", err);
      setError(err.message || "Failed to save profile");
      showToast(err.message || "Failed to save profile");
    } finally {
      setSaving(false);
      setIsSaving(false);
    }
  };

  const handleProfileDataSave = async (key: PersonalInfoKey, value: string) => {
    setProfileData((prev) => ({ ...prev, [key]: value }));

    // also update global profile context immediately
    switch (key) {
      case "name":
        updateProfile({ name: value });
        break;
      case "email":
        updateProfile({ email: value });
        break;
      case "location":
        updateProfile({ location: value });
        break;
      case "phone":
        // @ts-expect-error custom field
        updateProfile({ phone: value });
        break;
      case "linkedin":
        // @ts-expect-error custom field
        updateProfile({ linkedIn: value });
        break;
    }

    // Auto-save to backend
    if (user?.id && apiBase && getToken) {
      try {
        const token = await getToken();
        await fetch(`${apiBase}/api/profile/student`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({
            personalInfo: {
              ...profileData,
              [key]: value,
            },
          }),
        });
      } catch (err) {
        console.error("Error auto-saving:", err);
      }
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setSkills(prev => [...prev, { id: Date.now(), name: newSkill.trim() }]);
      setNewSkill('');
    }
  };
  const handleDeleteSkill = (id: number) => setSkills(prev => prev.filter(s => s.id !== id));

  const handleOpenTaskModal = (list: 'todo' | 'later') => {
      setNewTaskData(prev => ({ ...prev, list, title: '', priority: 'medium', deadline: undefined }));
      setTaskModalOpen(true);
  }

  const handleAddTask = () => {
    if(!newTaskData.title.trim()) return;
    const newTask: Task = {
        id: Date.now(),
        title: newTaskData.title,
        priority: newTaskData.priority,
        deadline: newTaskData.deadline,
    };
    setTasks(prev => ({ ...prev, [newTaskData.list]: [newTask, ...prev[newTaskData.list]] }));
    setTaskModalOpen(false);
  };

  const getPriorityClasses = (p: Task['priority']) => ({
      high: 'border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-400',
      medium: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
      low: 'border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400'
  }[p]);

  const getTimelineIcon = (type: TimelineItem['type']) => {
      if(type === 'education') return <GraduationCap className="h-5 w-5"/>
      if(type === 'work') return <Briefcase className="h-5 w-5"/>
      return <Palette className="h-5 w-5"/>
  }

  const handleAddTimelineItem = () => {
    if (!newTimeline.title.trim()) return;
    const item: TimelineItem = {
      id: Date.now(),
      ...newTimeline,
    };
    setTimelineItems((prev) => [...prev, item]);
    setNewTimeline({
      type: "work",
      title: "",
      subtitle: "",
      description: "",
      startDate: undefined,
      endDate: undefined,
      isCurrent: false,
    });
    setModal({ type: null });
    showToast("Timeline updated");
  };

  const handleUpdateTimelineItem = () => {
    if (!editingTimeline || !editingTimeline.title.trim()) return;

    setTimelineItems((prev) =>
      prev.map((item) => (item.id === editingTimeline.id ? editingTimeline : item))
    );
    setEditingTimeline(null);
    setModal({ type: null });
    showToast("Timeline updated");
  };

  const sortedTimelineItems = [...timelineItems].sort((a, b) => {
    const now = Date.now();
    const aEnd = a.isCurrent ? now : a.endDate?.getTime() ?? a.startDate?.getTime() ?? 0;
    const bEnd = b.isCurrent ? now : b.endDate?.getTime() ?? b.startDate?.getTime() ?? 0;
    return bEnd - aEnd;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
          <span className="text-sm text-zinc-500">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AnimatePresence>
        {toast && <Toast key={toast.id} message={toast.message} onDismiss={() => setToast(null)} />}
      </AnimatePresence>
      
      {error && (
        <div className="mx-auto max-w-6xl p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-lg text-red-700 dark:text-red-200">
          {error}
        </div>
      )}
      
      {/* --- ADD TASK MODAL --- */}
      <Dialog open={isTaskModalOpen} onOpenChange={setTaskModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add New Task</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <Input 
                placeholder="Task title..."
                value={newTaskData.title}
                onChange={(e) => setNewTaskData(p => ({...p, title: e.target.value}))}
            />
            <Select value={newTaskData.priority} onValueChange={(v: Task['priority']) => setNewTaskData(p => ({...p, priority: v}))}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
            </Select>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant={"outline"} className={cn(!newTaskData.deadline && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newTaskData.deadline ? format(newTaskData.deadline, "PPP") : <span>Pick a deadline</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={newTaskData.deadline} onSelect={(d) => setNewTaskData(p => ({...p, deadline: d}))} initialFocus /></PopoverContent>
            </Popover>
          </div>
          <Button onClick={handleAddTask}>Add Task</Button>
        </DialogContent>
      </Dialog>
      {/* --- ADD TIMELINE MODAL --- */}
      <Dialog
        open={modal.type === "ADD_TIMELINE"}
        onOpenChange={(open) =>
          setModal(open ? { type: "ADD_TIMELINE" } : { type: null })
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add career timeline entry</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 py-2 text-sm">
            <div className="space-y-1">
              <p className="text-xs font-medium text-zinc-500">
                Type
              </p>
              <Select
                value={newTimeline.type}
                onValueChange={(v: TimelineItem["type"]) =>
                  setNewTimeline((prev) => ({ ...prev, type: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input
              placeholder="Title (e.g. Senior Engineer)"
              value={newTimeline.title}
              onChange={(e) =>
                setNewTimeline((p) => ({ ...p, title: e.target.value }))
              }
            />
            <Input
              placeholder="Subtitle (e.g. 2021 - Present, Company)"
              value={newTimeline.subtitle}
              onChange={(e) =>
                setNewTimeline((p) => ({ ...p, subtitle: e.target.value }))
              }
            />
            <Input
              placeholder="Short description"
              value={newTimeline.description}
              onChange={(e) =>
                setNewTimeline((p) => ({ ...p, description: e.target.value }))
              }
            />
            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 p-3 space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span className="font-medium flex items-center gap-1.5">
                  <CalendarIcon className="h-3.5 w-3.5" />
                  Timeline dates
                </span>
                {(newTimeline.startDate || newTimeline.endDate || newTimeline.isCurrent) && (
                  <span className="font-mono text-[11px]">
                    {newTimeline.startDate
                      ? format(newTimeline.startDate, "MMM yyyy")
                      : "Start"}{" "}
                    –{" "}
                    {newTimeline.isCurrent
                      ? "Present"
                      : newTimeline.endDate
                      ? format(newTimeline.endDate, "MMM yyyy")
                      : "End"}
                  </span>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wide">
                    Start date
                  </p>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !newTimeline.startDate && "text-zinc-500"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newTimeline.startDate ? (
                          format(newTimeline.startDate, "PPP")
                        ) : (
                          <span>Select start</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        captionLayout="dropdown"
                        fromYear={2000}
                        toYear={2035}
                        selected={newTimeline.startDate}
                        onSelect={(d) =>
                          setNewTimeline((p) => ({
                            ...p,
                            startDate: d ?? undefined,
                          }))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wide">
                    End date
                  </p>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          (!newTimeline.endDate && !newTimeline.isCurrent) &&
                            "text-zinc-500"
                        )}
                        disabled={!!newTimeline.isCurrent}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newTimeline.isCurrent
                          ? "Present"
                          : newTimeline.endDate
                          ? format(newTimeline.endDate, "PPP")
                          : "Select end"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        captionLayout="dropdown"
                        fromYear={2000}
                        toYear={2035}
                        selected={newTimeline.endDate}
                        onSelect={(d) =>
                          setNewTimeline((p) => ({
                            ...p,
                            endDate: d ?? undefined,
                          }))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <label className="flex items-center gap-2 text-xs text-zinc-500">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded border-zinc-500/40"
                  checked={!!newTimeline.isCurrent}
                  onChange={(e) =>
                    setNewTimeline((p) => ({
                      ...p,
                      isCurrent: e.target.checked,
                      endDate: e.target.checked ? undefined : p.endDate,
                    }))
                  }
                />
                <span>Currently working here / ongoing</span>
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setModal({ type: null })}
            >
              Cancel
            </Button>
            <Button onClick={handleAddTimelineItem}>Save entry</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- EDIT TIMELINE MODAL --- */}
      <Dialog
        open={modal.type === "EDIT_TIMELINE"}
        onOpenChange={(open) => {
          if (!open) {
            setModal({ type: null });
            setEditingTimeline(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit career timeline entry</DialogTitle>
          </DialogHeader>
          {editingTimeline && (
            <div className="grid gap-3 py-2 text-sm">
              <div className="space-y-1">
                <p className="text-xs font-medium text-zinc-500">
                  Type
                </p>
                <Select
                  value={editingTimeline.type}
                  onValueChange={(v: TimelineItem["type"]) =>
                    setEditingTimeline((prev) =>
                      prev ? { ...prev, type: v } : prev
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="work">Work</SelectItem>
                    <SelectItem value="project">Project</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Input
                placeholder="Title (e.g. Senior Engineer)"
                value={editingTimeline.title}
                onChange={(e) =>
                  setEditingTimeline((p) =>
                    p ? { ...p, title: e.target.value } : p
                  )
                }
              />
              <Input
                placeholder="Subtitle (e.g. 2021 - Present, Company)"
                value={editingTimeline.subtitle}
                onChange={(e) =>
                  setEditingTimeline((p) =>
                    p ? { ...p, subtitle: e.target.value } : p
                  )
                }
              />
              <Input
                placeholder="Short description"
                value={editingTimeline.description}
                onChange={(e) =>
                  setEditingTimeline((p) =>
                    p ? { ...p, description: e.target.value } : p
                  )
                }
              />
              <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 p-3 space-y-3">
                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <span className="font-medium flex items-center gap-1.5">
                    <CalendarIcon className="h-3.5 w-3.5" />
                    Timeline dates
                  </span>
                  {(editingTimeline.startDate ||
                    editingTimeline.endDate ||
                    editingTimeline.isCurrent) && (
                    <span className="font-mono text-[11px]">
                      {editingTimeline.startDate
                        ? format(editingTimeline.startDate, "MMM yyyy")
                        : "Start"}{" "}
                      –{" "}
                      {editingTimeline.isCurrent
                        ? "Present"
                        : editingTimeline.endDate
                        ? format(editingTimeline.endDate, "MMM yyyy")
                        : "End"}
                    </span>
                  )}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wide">
                      Start date
                    </p>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !editingTimeline.startDate &&
                              "text-zinc-500"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {editingTimeline.startDate ? (
                            format(editingTimeline.startDate, "PPP")
                          ) : (
                            <span>Select start</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          captionLayout="dropdown"
                          fromYear={2000}
                          toYear={2035}
                          selected={editingTimeline.startDate}
                          onSelect={(d) =>
                            setEditingTimeline((p) =>
                              p
                                ? { ...p, startDate: d ?? undefined }
                                : p
                            )
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wide">
                      End date
                    </p>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            (!editingTimeline.endDate &&
                              !editingTimeline.isCurrent) &&
                              "text-zinc-500"
                          )}
                          disabled={!!editingTimeline.isCurrent}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {editingTimeline.isCurrent
                            ? "Present"
                            : editingTimeline.endDate
                            ? format(editingTimeline.endDate, "PPP")
                            : "Select end"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          captionLayout="dropdown"
                          fromYear={2000}
                          toYear={2035}
                          selected={editingTimeline.endDate}
                          onSelect={(d) =>
                            setEditingTimeline((p) =>
                              p
                                ? { ...p, endDate: d ?? undefined }
                                : p
                            )
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <label className="flex items-center gap-2 text-xs text-zinc-500">
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 rounded border-zinc-500/40"
                    checked={!!editingTimeline.isCurrent}
                    onChange={(e) =>
                      setEditingTimeline((p) =>
                        p
                          ? {
                              ...p,
                              isCurrent: e.target.checked,
                              endDate: e.target.checked ? undefined : p.endDate,
                            }
                          : p
                      )
                    }
                  />
                  <span>Currently working here / ongoing</span>
                </label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setModal({ type: null });
                setEditingTimeline(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateTimelineItem}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* --- HERO SECTION --- */}
        <section>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <h1 className="mb-4 text-3xl font-semibold tracking-tight">
              Hey {profileData.name || user?.firstName || user?.fullName || "there"} 👋 Welcome back!
            </h1>
          </motion.div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <MotionCard delay={1}>
              <CardHeader className="flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Career Stage</CardTitle><Briefcase className="h-4 w-4 text-zinc-500"/></CardHeader>
              <CardContent><div className="text-2xl font-bold">{snapshotData.careerStage}</div></CardContent>
            </MotionCard>
            <MotionCard delay={2}>
              <CardHeader className="flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Long-term Goal</CardTitle><Target className="h-4 w-4 text-zinc-500"/></CardHeader>
              <CardContent><div className="text-2xl font-bold">{snapshotData.longTermGoal}</div></CardContent>
            </MotionCard>
            <MotionCard delay={3}>
              <CardHeader className="flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Current Role</CardTitle><Building className="h-4 w-4 text-zinc-500"/></CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">{snapshotData.currentRole} at {snapshotData.company}</div>
                  <p className="text-xs text-zinc-500">Since {snapshotData.joinDate}</p>
              </CardContent>
            </MotionCard>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* --- PERSONAL INFO --- */}
            <MotionCard delay={4}>
              <CardHeader><CardTitle>Personal Information</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EditableField icon={<User size={16}/>} label="Full Name" value={profileData.name} onSave={(v) => handleProfileDataSave('name', v)} />
                <EditableField icon={<Mail size={16}/>} label="Email" value={profileData.email} onSave={(v) => handleProfileDataSave('email', v)} />
                <EditableField icon={<Phone size={16}/>} label="Phone" value={profileData.phone} onSave={(v) => handleProfileDataSave('phone', v)} />
                <EditableField icon={<MapPin size={16}/>} label="Location" value={profileData.location} onSave={(v) => handleProfileDataSave('location', v)} />
                <div className="md:col-span-2">
                    <EditableField icon={<Linkedin size={16}/>} label="LinkedIn" value={profileData.linkedin} onSave={(v) => handleProfileDataSave('linkedin', v)} />
                </div>
              </CardContent>
            </MotionCard>

            {/* --- CAREER TIMELINE --- */}
            <MotionCard delay={5}>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Career Timeline</CardTitle>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setModal({ type: "ADD_TIMELINE" })}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add entry
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="relative pl-6">
                        <div className="absolute left-[34px] top-4 h-[calc(100%-2rem)] w-0.5 bg-zinc-200 dark:bg-zinc-800 -translate-x-1/2"></div>
                        {sortedTimelineItems.map((item) => (
                          <div key={item.id} className="flex items-start gap-4 mb-6 last:mb-0">
                            <div className="w-8 h-8 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full flex items-center justify-center flex-shrink-0 z-10">
                              {getTimelineIcon(item.type)}
                            </div>
                            <div className="flex-1 flex justify-between gap-4">
                             <div>
                                <h3 className="font-semibold">
                                  {item.title}{" "}
                                  <span className="text-zinc-500 font-normal">
                                    - {item.subtitle}
                                  </span>
                                </h3>
                                <p className="text-sm text-zinc-500">
                                  {item.description}
                                </p>
                                {(item.startDate || item.endDate || item.isCurrent) && (
                                  <p className="text-xs text-zinc-500 mt-1">
                                    {item.startDate
                                      ? format(item.startDate, "MMM yyyy")
                                      : "N/A"}{" "}
                                    -{" "}
                                    {item.isCurrent
                                      ? "Present"
                                      : item.endDate
                                      ? format(item.endDate, "MMM yyyy")
                                      : "N/A"}
                                  </p>
                                )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 mt-1"
                              onClick={() => {
                                setEditingTimeline(item);
                                setModal({ type: "EDIT_TIMELINE", data: { id: item.id } });
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                           </div>
                          </div>
                       ))}
                    </div>
                </CardContent>
            </MotionCard>
            
            {/* --- TASK MANAGER --- */}
            <MotionCard delay={6}>
                <CardHeader><CardTitle>Task Manager</CardTitle></CardHeader>
                <CardContent>
                    <Tabs defaultValue="todo">
                        <div className="flex justify-between items-center mb-4">
                           <TabsList>
                               <TabsTrigger value="todo">To-Do ({tasks.todo.length})</TabsTrigger>
                               <TabsTrigger value="later">Later ({tasks.later.length})</TabsTrigger>
                               <TabsTrigger value="done">Done ({tasks.done.length})</TabsTrigger>
                           </TabsList>
                           <div className="flex gap-2">
                             <Button variant="outline" size="sm" onClick={() => handleOpenTaskModal('todo')}><Plus className="h-4 w-4 mr-2"/>To-Do</Button>
                             <Button variant="outline" size="sm" onClick={() => handleOpenTaskModal('later')}><Plus className="h-4 w-4 mr-2"/>Later</Button>
                           </div>
                        </div>
                        <TabsContent value="todo" className="space-y-2">
                          {tasks.todo.map(t => <div key={t.id} className="p-3 bg-zinc-100 dark:bg-zinc-900 rounded-lg flex justify-between items-center"><p>{t.title}</p><Badge variant="outline" className={getPriorityClasses(t.priority)}>{t.priority}</Badge></div>)}
                        </TabsContent>
                        <TabsContent value="later" className="space-y-2">
                          {tasks.later.map(t => <div key={t.id} className="p-3 bg-zinc-100 dark:bg-zinc-900 rounded-lg flex justify-between items-center"><p>{t.title}</p><Badge variant="outline" className={getPriorityClasses(t.priority)}>{t.priority}</Badge></div>)}
                        </TabsContent>
                        <TabsContent value="done" className="space-y-2">
                          {tasks.done.map(t => <div key={t.id} className="p-3 bg-zinc-100 dark:bg-zinc-900 rounded-lg flex items-center gap-2 text-zinc-500 line-through"><CheckCircle className="h-4 w-4 text-green-500"/>{t.title}</div>)}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </MotionCard>

          </div>
          <div className="space-y-8">
              {/* --- CAREER SNAPSHOT --- */}
              <MotionCard delay={7}>
                  <CardHeader><CardTitle>Career Snapshot</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                      <div>
                          <div className="flex justify-between mb-1"><p className="text-sm font-medium">Profile Completion</p><p className="text-sm font-medium">{analytics.profileCompletion}%</p></div>
                          <Progress value={analytics.profileCompletion}/>
                      </div>
                      <div className="p-4 text-center bg-zinc-100 dark:bg-zinc-900 rounded-lg">
                          <p className="text-sm text-zinc-500">Skill Score</p>
                          <p className="text-4xl font-bold">{analytics.skillScore}</p>
                          <Badge>Above Average</Badge>
                      </div>
                      <EngagementChart data={analytics.chartData}/>
                  </CardContent>
              </MotionCard>
              
              {/* --- SKILLS --- */}
              <MotionCard delay={8}>
                  <CardHeader><CardTitle>Skills</CardTitle></CardHeader>
                  <CardContent>
                      <div className="flex flex-wrap gap-2 mb-4">
                          {skills.map(skill => (
                              <Badge key={skill.id} variant="secondary" className="group pr-1">
                                  {skill.name}
                                  <button onClick={() => handleDeleteSkill(skill.id)} className="ml-1 opacity-0 group-hover:opacity-100"><X className="h-3 w-3"/></button>
                              </Badge>
                          ))}
                      </div>
                      <div className="flex gap-2">
                         <Input placeholder="Add a new skill..." value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddSkill()}/>
                         <Button onClick={handleAddSkill} size="sm">Add</Button>
                      </div>
                  </CardContent>
              </MotionCard>

              {/* --- CAREER GOALS --- */}
              <MotionCard delay={9}>
                  <CardHeader><CardTitle>Career Goals Tracker</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                      {careerGoals.map(goal => (
                          <div key={goal.name}>
                             <div className="flex justify-between mb-1"><p className="text-sm font-medium">{goal.name}</p><p className="text-sm font-medium">{goal.progress}%</p></div>
                             <Progress value={goal.progress}/>
                          </div>
                      ))}
                  </CardContent>
              </MotionCard>
          </div>
        </div>

        {/* --- JOB RECOMMENDATIONS --- */}
        <section className="mt-8">
            <MotionCard delay={10}>
                <CardHeader><CardTitle>Job Recommendations For You</CardTitle></CardHeader>
                <CardContent>
                    <div className="flex space-x-4 overflow-x-auto pb-4 -mb-4 -mx-2 px-2 snap-x snap-mandatory">
                        {jobRecommendations.map(job => (
                            <Card key={job.id} className="min-w-[280px] snap-start flex-shrink-0">
                                <CardHeader>
                                    <CardTitle className="text-lg">{job.title}</CardTitle>
                                    <CardDescription>{job.company} - {job.location}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex justify-between items-end">
                                    <div>
                                        <p className="text-xs text-zinc-500">Match Score</p>
                                        <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{job.match}%</p>
                                    </div>
                                    <Button size="sm">Apply Now</Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </MotionCard>
        </section>
        
        {/* --- REVIEW & SAVE --- */}
        <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.1 }}
            className="mt-8 p-6 bg-white dark:bg-zinc-950 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4 border border-zinc-200 dark:border-zinc-800"
        >
            <div>
                <h3 className="text-xl font-bold">Review Your Profile</h3>
                <p className="text-zinc-500">Ensure all your information is up-to-date to get the best opportunities.</p>
            </div>
            <Button
              onClick={async () => {
                await handleSaveAll();
                onOpenSettings?.();
              }}
              disabled={isSaving}
            >
                {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin"/> : <Save className="h-4 w-4 mr-2"/>}
                {isSaving ? "Saving..." : "Save & Continue"}
            </Button>
        </motion.section>
      </div>
    </div>
  );
};

export default function StudentProfilePage() {
  return <ProfilePageDashboard />;
}