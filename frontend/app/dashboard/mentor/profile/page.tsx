 "use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import {
  User,
  Briefcase,
  MapPin,
  Linkedin,
  FileText,
  Calendar,
  DollarSign,
  Save,
  Plus,
  X,
  AlertCircle,
  Target,
  Clock,
  Loader2,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

// --- Types ---

interface ScheduleSlot {
  day: string;
  active: boolean;
  start: string;
  end: string;
}

interface MentorProfile {
  isOnline: boolean;
  fullName: string;
  role: string;
  company: string;
  location: string;
  linkedin: string;
  avatarUrl?: string;
  resumeName: string;
  experienceYears: string | number;
  degree: string;
  college: string;
  bio: string;
  tags: string[];
  hourlyRate: string | number;
  halfHourRate: string | number;
  timezone: string;
  instantBooking: boolean;
  schedule: ScheduleSlot[];
  mentoringFocus: string;
  idealMentee: string;
  languages: string;
  minNoticeHours: string | number;
  maxSessionsPerWeek: string | number;
  preSessionNotesRequired: boolean;
  allowRecording: boolean;
}

// --- Constants & Defaults ---

const MENTEE_LEVELS = [
  "Students & freshers",
  "Early‑career (0–3 years)",
  "Mid‑career (3–7 years)",
  "Senior / leadership",
];

const TIMEZONES = [
  { value: "Asia/Kolkata", label: "Asia / Kolkata (IST)" },
  { value: "America/New_York", label: "America / New York (ET)" },
  { value: "Europe/London", label: "Europe / London (GMT)" },
  { value: "UTC", label: "UTC" },
];

const DEFAULT_SCHEDULE: ScheduleSlot[] = [
  { day: "Sunday", active: false, start: "09:00", end: "17:00" },
  { day: "Monday", active: false, start: "09:00", end: "17:00" },
  { day: "Tuesday", active: false, start: "09:00", end: "17:00" },
  { day: "Wednesday", active: false, start: "09:00", end: "17:00" },
  { day: "Thursday", active: false, start: "09:00", end: "17:00" },
  { day: "Friday", active: false, start: "09:00", end: "17:00" },
  { day: "Saturday", active: false, start: "09:00", end: "17:00" },
];

const DEFAULT_DATA: MentorProfile = {
  isOnline: true,
  fullName: "",
  role: "",
  company: "",
  location: "",
  linkedin: "",
  avatarUrl: "",
  resumeName: "",
  experienceYears: "",
  degree: "",
  college: "",
  bio: "",
  tags: [],
  hourlyRate: "",
  halfHourRate: "",
  timezone: "Asia/Kolkata",
  instantBooking: true,
  schedule: DEFAULT_SCHEDULE,
  mentoringFocus: "",
  idealMentee: "",
  languages: "",
  minNoticeHours: "",
  maxSessionsPerWeek: "",
  preSessionNotesRequired: false,
  allowRecording: false,
};

// --- Sub-Components ---

const IdentityCard = ({
  data,
  onChange,
  onAvatarChange,
  onResumeChange,
}: {
  data: MentorProfile;
  onChange: (e: any) => void;
  onAvatarChange?: (file: File) => void;
  onResumeChange?: (file: File) => void;
}) => {
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const resumeInputRef = useRef<HTMLInputElement | null>(null);

  const handleAvatarClick = () => {
    avatarInputRef.current?.click();
  };

  const handleResumeClick = () => {
    resumeInputRef.current?.click();
  };

  const handleAvatarSelected = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file && onAvatarChange) {
      onAvatarChange(file);
    }
  };

  const handleResumeSelected = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file && onResumeChange) {
      onResumeChange(file);
    }
  };

  return (
    <Card className="rounded-2xl border border-zinc-200/80 bg-white/95 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950/90">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-indigo-500" />
          Basic information
        </CardTitle>
        <CardDescription>
          How students identify and find you on Aureeture.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-6 md:flex-row">
          {/* Avatar Area */}
          <button
            type="button"
            onClick={handleAvatarClick}
            className="group relative flex h-24 w-24 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-zinc-300 bg-zinc-50 transition-colors hover:border-indigo-500 hover:bg-indigo-50 dark:border-zinc-700 dark:bg-zinc-800"
          >
            {data.avatarUrl ? (
              <img
                src={data.avatarUrl}
                alt={data.fullName}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="text-center text-xs text-zinc-500 group-hover:text-indigo-600">
                Upload
                <br />
                Photo
              </div>
            )}
          </button>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarSelected}
          />

        {/* Inputs */}
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Full name</label>
            <Input
              name="fullName"
              value={data.fullName}
              onChange={onChange}
              placeholder="e.g. Jane Doe"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Current role</label>
            <Input
              name="role"
              value={data.role}
              onChange={onChange}
              placeholder="e.g. Product Manager"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Company</label>
            <div className="relative">
              <Briefcase className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
              <Input
                className="pl-9"
                name="company"
                value={data.company}
                onChange={onChange}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Location</label>
            <div className="relative">
              <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
              <Input
                className="pl-9"
                name="location"
                value={data.location}
                onChange={onChange}
              />
            </div>
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-sm font-medium">LinkedIn URL</label>
            <div className="relative">
              <Linkedin className="absolute left-2.5 top-2.5 h-4 w-4 text-blue-500" />
              <Input
                className="pl-9"
                name="linkedin"
                value={data.linkedin}
                onChange={onChange}
              />
            </div>
          </div>
        </div>
        </div>

        <div className="flex items-center justify-between rounded-lg border bg-zinc-50 p-3 dark:bg-zinc-800/50">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-white p-2 shadow-sm dark:bg-zinc-900">
              <FileText className="h-5 w-5 text-red-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Resume / CV</span>
              <span className="max-w-[180px] truncate text-xs text-zinc-500 md:max-w-xs">
                {data.resumeName || "No file uploaded"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={handleResumeClick}
            >
              Update
            </Button>
          </div>
          <input
            ref={resumeInputRef}
            type="file"
            accept=".pdf,.doc,.docx,application/pdf"
            className="hidden"
            onChange={handleResumeSelected}
          />
        </div>
      </CardContent>
    </Card>
  );
};

const ExperienceCard = ({
  data,
  onChange,
  onAddTag,
  onRemoveTag,
}: {
  data: MentorProfile;
  onChange: (e: any) => void;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
} ) => {
  const [tagInput, setTagInput] = useState("");

  const handleAddKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onAddTag(tagInput);
      setTagInput("");
    }
  };

  return (
    <Card className="rounded-2xl border border-zinc-200/80 bg-white/95 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950/90">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-indigo-500" />
          Experience &amp; Skills
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Total Experience (Yrs)</label>
            <Input
              type="number"
              name="experienceYears"
              value={data.experienceYears}
              onChange={onChange}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Highest Degree</label>
            <Input
              name="degree"
              value={data.degree}
              onChange={onChange}
            />
          </div>
        </div>
        
        <div className="space-y-1.5">
          <label className="text-sm font-medium">College / University</label>
          <Input
            name="college"
            value={data.college}
            onChange={onChange}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Expertise Tags</label>
          <div className="flex flex-wrap gap-2">
            {data.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-normal"
              >
                {tag}
                <X
                  className="h-3 w-3 cursor-pointer text-zinc-400 hover:text-red-500"
                  onClick={() => onRemoveTag(tag)}
                />
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Type skill & press Enter..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddKey}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                onAddTag(tagInput);
                setTagInput("");
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Bio</label>
          <Textarea
            name="bio"
            className="min-h-[100px] resize-none"
            placeholder="Tell students about your journey..."
            value={data.bio}
            onChange={onChange}
          />
        </div>
      </CardContent>
    </Card>
  );
};

const AvailabilityCard = ({
  data,
  onScheduleChange,
  onTimezoneChange,
  onToggleInstant,
}: {
  data: MentorProfile;
  onScheduleChange: (idx: number, field: string, val: any) => void;
  onTimezoneChange: (val: string) => void;
  onToggleInstant: () => void;
}) => (
  <Card
    id="availability"
    className="rounded-2xl border border-zinc-200/80 bg-white/95 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950/90"
  >
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Calendar className="h-5 w-5 text-orange-500" />
        Availability
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Timezone</label>
        <Select value={data.timezone} onValueChange={onTimezoneChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select timezone" />
          </SelectTrigger>
          <SelectContent>
            {TIMEZONES.map((tz) => (
              <SelectItem key={tz.value} value={tz.value}>
                {tz.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between rounded-lg border bg-zinc-50 p-3 dark:bg-zinc-800/50">
        <div className="space-y-0.5">
          <label className="block text-sm font-medium">Instant Booking</label>
          <span className="text-xs text-zinc-500">
            Auto‑accept eligible requests
          </span>
        </div>
        <Switch
          checked={data.instantBooking}
          onCheckedChange={onToggleInstant}
        />
      </div>

      <Separator />

      <div className="space-y-3">
        <label className="text-sm font-medium">Weekly Schedule</label>
        {data.schedule.map((slot, index) => (
          <div
            key={slot.day}
            className={cn(
              "flex flex-col space-y-2 rounded-md border p-3 transition-all",
              slot.active
                ? "border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900"
                : "border-transparent bg-zinc-50 opacity-60 dark:bg-zinc-800/30"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch
                  checked={slot.active}
                  onCheckedChange={(c) => onScheduleChange(index, "active", c)}
                  className="scale-75"
                />
                <span className="text-sm font-medium w-24">
                  {slot.day}
                </span>
              </div>
              {slot.active ? (
                 <div className="flex items-center gap-2">
                 <Input
                   type="time"
                   className="h-7 w-[90px] text-xs"
                   value={slot.start}
                   onChange={(e) =>
                     onScheduleChange(index, "start", e.target.value)
                   }
                 />
                 <span className="text-zinc-400">-</span>
                 <Input
                   type="time"
                   className="h-7 w-[90px] text-xs"
                   value={slot.end}
                   onChange={(e) =>
                     onScheduleChange(index, "end", e.target.value)
                   }
                 />
               </div>
              ) : (
                <span className="text-xs text-zinc-400 italic">Unavailable</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

// --- Main Page Component ---

export default function MentorProfilePage() {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<MentorProfile>(DEFAULT_DATA);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const { getToken } = useAuth();
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  const hydrateFromApi = (mentor: any): MentorProfile => {
    const scheduleFromApi: ScheduleSlot[] = DEFAULT_SCHEDULE.map((slot) => {
      const match =
        mentor?.weeklyAvailability?.find(
          (w: any) => (w.day || "").toLowerCase() === slot.day.toLowerCase()
        ) || null;
      if (match) {
        return {
          ...slot,
          active: true,
          start: match.startTime || slot.start,
          end: match.endTime || slot.end,
        };
      }
      return slot;
    });

    return {
      isOnline: mentor?.isOnline ?? true,
      fullName: mentor?.name || "",
      role: mentor?.currentRole || "",
      company: mentor?.company || "",
      location: mentor?.location || "",
      linkedin: mentor?.linkedinUrl || "",
      avatarUrl: mentor?.avatarUrl || "",
      resumeName: mentor?.resumeUrl || "",
      experienceYears:
        typeof mentor?.totalExperienceYears === "number"
          ? mentor.totalExperienceYears
          : mentor?.totalExperienceYears || "",
      degree: mentor?.educationDegree || "",
      college: mentor?.educationCollege || "",
      bio: mentor?.bio || "",
      tags: mentor?.specializationTags || [],
      hourlyRate: mentor?.pricing?.expectedHourlyRate ?? "",
      halfHourRate: mentor?.pricing?.expectedHalfHourRate ?? "",
      timezone: mentor?.timezone || "Asia/Kolkata",
      instantBooking: mentor?.isOnline ?? true,
      schedule: scheduleFromApi,
      mentoringFocus: mentor?.mentoringFocus || "",
      idealMentee: mentor?.idealMentee || "",
      languages: mentor?.languages || "",
      minNoticeHours: mentor?.minNoticeHours ?? "",
      maxSessionsPerWeek: mentor?.maxSessionsPerWeek ?? "",
      preSessionNotesRequired: mentor?.preSessionNotesRequired ?? false,
      allowRecording: mentor?.allowRecording ?? false,
    };
  };

  // Load Mentor profile from API
  useEffect(() => {
    const load = async () => {
      try {
        const token = await getToken();
        const endpoint = apiBase
          ? `${apiBase}/api/role-onboarding/mentor`
          : "/api/role-onboarding/mentor";

        const res = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
        });

        if (!res.ok) {
          // If mentor record does not exist yet, fall back to defaults
          setLoading(false);
          return;
        }

        const payload = await res.json();
        if (payload?.data) {
          setFormData(hydrateFromApi(payload.data));
        }
      } catch (err) {
        console.error("Failed to load mentor profile", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [apiBase, getToken]);

  // Handlers
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (key: keyof MentorProfile, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleToggle = (field: keyof MentorProfile) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !(prev[field] as boolean),
    }));
  };

  const handleScheduleChange = (index: number, field: string, value: any) => {
    const updatedSchedule = [...formData.schedule];
    // @ts-ignore - dynamic key access
    updatedSchedule[index] = { ...updatedSchedule[index], [field]: value };
    setFormData((prev) => ({ ...prev, schedule: updatedSchedule }));
  };

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleSaveChanges = async () => {
    setSaveStatus("saving");
    try {
      const token = await getToken();
      const endpoint = apiBase
        ? `${apiBase}/api/role-onboarding/mentor`
        : "/api/role-onboarding/mentor";

      const weeklyAvailability = formData.schedule
        .filter((slot) => slot.active)
        .map((slot) => ({
          id: `slot-${slot.day.toLowerCase()}`,
          day: slot.day,
          startTime: slot.start,
          endTime: slot.end,
        }));

      const payload = {
        name: formData.fullName,
        currentRole: formData.role,
        company: formData.company,
        location: formData.location,
        linkedinUrl: formData.linkedin,
        resumeUrl: formData.resumeName,
        totalExperienceYears: formData.experienceYears
          ? Number(formData.experienceYears)
          : null,
        educationDegree: formData.degree,
        educationCollege: formData.college,
        specializationTags: formData.tags,
        pricing: {
          expectedHourlyRate: formData.hourlyRate ? Number(formData.hourlyRate) : null,
          expectedHalfHourRate: formData.halfHourRate ? Number(formData.halfHourRate) : null,
          currency: "INR",
        },
        timezone: formData.timezone,
        weeklyAvailability,
        overrideAvailability: [],
        isVerified: false,
        isOnline: formData.instantBooking,
        bio: formData.bio,
        mentoringFocus: formData.mentoringFocus,
        idealMentee: formData.idealMentee,
        languages: formData.languages,
        minNoticeHours: formData.minNoticeHours
          ? Number(formData.minNoticeHours)
          : null,
        maxSessionsPerWeek: formData.maxSessionsPerWeek
          ? Number(formData.maxSessionsPerWeek)
          : null,
        preSessionNotesRequired: formData.preSessionNotesRequired,
        allowRecording: formData.allowRecording,
        avatarUrl: formData.avatarUrl,
      };

      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw new Error(errBody?.message || "Unable to save mentor profile");
      }

      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch (err: any) {
      console.error("Failed to save mentor profile", err);
      alert(err?.message || "Could not save profile. Please try again.");
      setSaveStatus("idle");
    }
  };

  const handleAvatarChange = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, avatarUrl: previewUrl }));
  };

  const handleResumeChange = (file: File) => {
    setFormData((prev) => ({ ...prev, resumeName: file.name }));
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/70 p-6 dark:bg-zinc-950/60 lg:p-10">
      {/* Page Header */}
      <div className="mx-auto mb-8 flex max-w-6xl flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Mentor Profile &amp; Settings
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Craft a public mentor profile, tune your availability, and keep pricing in sync.
          </p>
        </div>
        <div className="flex items-center gap-3">
            {/* Status Indicator */}
          <div className="hidden items-center gap-2 rounded-full border border-zinc-200 bg-white/90 px-3 py-1.5 text-xs font-medium shadow-sm dark:border-zinc-700 dark:bg-zinc-900/90 md:flex">
             <div className={cn("h-2 w-2 rounded-full", formData.instantBooking ? "bg-emerald-500" : "bg-zinc-300")} />
             {formData.instantBooking ? "Profile Active" : "Profile Hidden"}
          </div>

          <Button
            className={cn(
                "min-w-[140px] gap-2 transition-all",
                saveStatus === "saved" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-indigo-600 hover:bg-indigo-700"
            )}
            type="button"
            onClick={handleSaveChanges}
            disabled={saveStatus === "saving"}
          >
            {saveStatus === "saving" && <Loader2 className="h-4 w-4 animate-spin" />}
            {saveStatus === "saved" && <CheckCircle2 className="h-4 w-4" />}
            {saveStatus === "idle" && <Save className="h-4 w-4" />}
            
            {saveStatus === "saving"
              ? "Saving..."
              : saveStatus === "saved"
              ? "Saved!"
              : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        
        {/* Left Column: Identity, Experience, Focus */}
        <div className="space-y-6">
          <IdentityCard
            data={formData}
            onChange={handleInputChange}
            onAvatarChange={handleAvatarChange}
            onResumeChange={handleResumeChange}
          />
          <ExperienceCard 
            data={formData} 
            onChange={handleInputChange} 
            onAddTag={addTag} 
            onRemoveTag={removeTag}
          />
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-indigo-500" />
                Mentoring Focus
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                    name="mentoringFocus"
                    className="min-h-[80px]"
                    placeholder="e.g. Product strategy, system design..."
                    value={formData.mentoringFocus}
                    onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium">Target Mentee</label>
                    <Select 
                        value={formData.idealMentee} 
                        onValueChange={(val) => handleSelectChange('idealMentee', val)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                            {MENTEE_LEVELS.map(level => (
                                <SelectItem key={level} value={level}>{level}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-medium">Languages</label>
                    <Input
                        name="languages"
                        value={formData.languages}
                        onChange={handleInputChange}
                    />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Pricing & Availability */}
        <div className="space-y-6">
          
          {/* Pricing */}
          <Card className="border-indigo-100 shadow-sm dark:border-indigo-900/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-600" />
                Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900/50 dark:bg-blue-950/30 dark:text-blue-200">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Verification Pending</AlertTitle>
                <AlertDescription className="text-xs opacity-90">
                  Rates are subject to platform approval.
                </AlertDescription>
              </Alert>
              <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Hourly (₹)</label>
                    <Input
                      type="number"
                      name="hourlyRate"
                      value={formData.hourlyRate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">30 Mins (₹)</label>
                    <Input
                      type="number"
                      name="halfHourRate"
                      value={formData.halfHourRate}
                      onChange={handleInputChange}
                    />
                  </div>
              </div>
            </CardContent>
          </Card>

          {/* Availability */}
          <AvailabilityCard 
            data={formData}
            onScheduleChange={handleScheduleChange}
            onTimezoneChange={(val) => handleSelectChange('timezone', val)}
            onToggleInstant={() => handleToggle('instantBooking')}
          />

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-zinc-500" />
                Policies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-500 uppercase">Min Notice (Hrs)</label>
                        <Input
                            type="number"
                            name="minNoticeHours"
                            value={formData.minNoticeHours}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-500 uppercase">Max Sessions/Wk</label>
                        <Input
                            type="number"
                            name="maxSessionsPerWeek"
                            value={formData.maxSessionsPerWeek}
                            onChange={handleInputChange}
                        />
                    </div>
               </div>
               <Separator />
               <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm">Require Pre-session Notes</span>
                        <Switch 
                            checked={formData.preSessionNotesRequired} 
                            onCheckedChange={() => handleToggle('preSessionNotesRequired')} 
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm">Allow Recordings</span>
                        <Switch 
                            checked={formData.allowRecording} 
                            onCheckedChange={() => handleToggle('allowRecording')} 
                        />
                    </div>
               </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}