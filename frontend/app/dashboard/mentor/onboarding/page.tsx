"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileText,
  Globe2,
  Linkedin,
  Loader2,
  MapPin,
  Star,
  Tag,
  User,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { MentorProfile, MentorWeeklySlot, MentorOverrideSlot, Weekday } from "@/types/mentor";

const ONBOARDING_KEY = "aureeture_mentor_onboarding_complete";

const SUGGESTED_TAGS = [
  "System Design",
  "DSA Interview Prep",
  "Product Strategy",
  "Startup Fundraising",
  "Career Coaching",
  "Resume Review",
];

type StepId = "BASIC" | "EXPERIENCE" | "PRICING" | "AVAILABILITY";

const STEP_ORDER: StepId[] = [
  "BASIC",
  "EXPERIENCE",
  "PRICING",
  "AVAILABILITY",
];

const StepLabel: Record<StepId, string> = {
  BASIC: "Basic information",
  EXPERIENCE: "Experience",
  PRICING: "Pricing strategy",
  AVAILABILITY: "Availability & schedule",
};

function createEmptyProfile(): MentorProfile {
  return {
    name: "",
    currentRole: "",
    company: "",
    linkedinUrl: "",
    resumeUrl: "",
    totalExperienceYears: null,
    educationDegree: "",
    educationCollege: "",
    specializationTags: [],
    pricing: {
      expectedHalfHourRate: null,
      expectedHourlyRate: null,
      currency: "INR",
    },
    timezone: "Asia/Kolkata",
    weeklyAvailability: [],
    overrideAvailability: [],
    isVerified: false,
    isOnline: true,
  };
}

export default function MentorOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<StepId>("BASIC");
  const [profile, setProfile] = useState<MentorProfile>(createEmptyProfile);
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const currentStepIndex = STEP_ORDER.indexOf(step);
  const isLastStep = currentStepIndex === STEP_ORDER.length - 1;

  const goNext = () => {
    if (!isLastStep) {
      setStep(STEP_ORDER[currentStepIndex + 1]);
    }
  };

  const goPrev = () => {
    if (currentStepIndex > 0) {
      setStep(STEP_ORDER[currentStepIndex - 1]);
    }
  };

  const toggleTag = (tag: string) => {
    setProfile((prev) => {
      const exists = prev.specializationTags.includes(tag);
      return {
        ...prev,
        specializationTags: exists
          ? prev.specializationTags.filter((t) => t !== tag)
          : [...prev.specializationTags, tag],
      };
    });
  };

  const handleComplete = async () => {
    setIsSaving(true);

    // Placeholder for real backend call.
    await new Promise((resolve) => setTimeout(resolve, 700));

    if (typeof window !== "undefined") {
      window.localStorage.setItem(ONBOARDING_KEY, "true");
    }
    setIsSaving(false);
    router.replace("/dashboard/mentor/overview");
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
              Mentor onboarding
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Set up your Aureeture mentor profile
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              We&apos;ll ask a few quick questions to understand your background,
              pricing expectations, and availability before activating your
              dashboard.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex flex-col">
              <span className="font-medium text-zinc-900 dark:text-zinc-50">
                Step {currentStepIndex + 1} of {STEP_ORDER.length}
              </span>
              <span className="text-[11px] text-zinc-500">
                {StepLabel[step]}
              </span>
            </div>
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          </div>
        </header>

        {/* Stepper */}
        <div className="flex flex-wrap gap-2 rounded-xl border border-zinc-200 bg-white p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900">
          {STEP_ORDER.map((id, index) => {
            const active = id === step;
            const done = STEP_ORDER.indexOf(id) < currentStepIndex;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setStep(id)}
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 transition-colors ${
                  active
                    ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900"
                    : done
                    ? "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                    : "text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                }`}
              >
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-zinc-400 text-[11px]">
                  {index + 1}
                </span>
                <span>{StepLabel[id]}</span>
              </button>
            );
          })}
        </div>

        {/* Step content */}
        <Card className="border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          {step === "BASIC" && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="h-4 w-4 text-zinc-500" />
                  Basic information
                </CardTitle>
                <CardDescription>
                  Tell us who you are and how students can find you.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                      Full name<span className="ml-0.5 text-red-500">*</span>
                    </label>
                    <Input
                      value={profile.name}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, name: e.target.value }))
                      }
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                      Current role<span className="ml-0.5 text-red-500">*</span>
                    </label>
                    <Input
                      value={profile.currentRole}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, currentRole: e.target.value }))
                      }
                      placeholder="Staff Engineer, Product Manager, etc."
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                      Company
                    </label>
                    <Input
                      value={profile.company}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, company: e.target.value }))
                      }
                      placeholder="e.g. Google, Early-stage startup"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="flex items-center gap-1 text-xs font-medium text-zinc-600 dark:text-zinc-300">
                      <Linkedin className="h-3 w-3" />
                      LinkedIn URL<span className="ml-0.5 text-red-500">*</span>
                    </label>
                    <Input
                      value={profile.linkedinUrl}
                      onChange={(e) =>
                        setProfile((p) => ({ ...p, linkedinUrl: e.target.value }))
                      }
                      placeholder="https://linkedin.com/in/your-handle"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-xs font-medium text-zinc-600 dark:text-zinc-300">
                    <FileText className="h-3.5 w-3.5" />
                    Upload resume (PDF)
                  </label>
                  <div className="rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-4 py-6 text-center text-xs text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900">
                    <p className="mb-2 font-medium text-zinc-700 dark:text-zinc-200">
                      Drop your resume here, or{" "}
                      <span className="underline">click to browse</span>
                    </p>
                    <p className="text-[11px]">
                      PDF up to 10 MB. We&apos;ll use this to verify your profile.
                    </p>
                    <input
                      type="file"
                      accept="application/pdf"
                      className="mt-3 block w-full cursor-pointer text-xs"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setResumeFileName(file.name);
                          setProfile((p) => ({ ...p, resumeUrl: file.name }));
                        }
                      }}
                    />
                    {resumeFileName && (
                      <p className="mt-2 text-[11px] text-emerald-600 dark:text-emerald-400">
                        Uploaded: {resumeFileName}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </>
          )}

          {step === "EXPERIENCE" && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Star className="h-4 w-4 text-zinc-500" />
                  Experience & background
                </CardTitle>
                <CardDescription>
                  Highlight your experience so students understand your depth of
                  expertise.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-1 md:col-span-1">
                    <label className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                      Total years of experience
                    </label>
                    <Input
                      type="number"
                      min={0}
                      value={profile.totalExperienceYears ?? ""}
                      onChange={(e) =>
                        setProfile((p) => ({
                          ...p,
                          totalExperienceYears: e.target.value
                            ? Number(e.target.value)
                            : null,
                        }))
                      }
                      placeholder="e.g. 5"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                      Highest degree
                    </label>
                    <Input
                      value={profile.educationDegree}
                      onChange={(e) =>
                        setProfile((p) => ({
                          ...p,
                          educationDegree: e.target.value,
                        }))
                      }
                      placeholder="B.Tech, MBA, MS, etc."
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                      College / University
                    </label>
                    <Input
                      value={profile.educationCollege}
                      onChange={(e) =>
                        setProfile((p) => ({
                          ...p,
                          educationCollege: e.target.value,
                        }))
                      }
                      placeholder="Institute name"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="flex items-center gap-1 text-xs font-medium text-zinc-600 dark:text-zinc-300">
                        <Tag className="h-3 w-3" />
                        Specialisation tags
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        Choose topics you&apos;re comfortable mentoring on.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_TAGS.map((tag) => {
                      const active = profile.specializationTags.includes(tag);
                      return (
                        <Badge
                          key={tag}
                          variant={active ? "default" : "outline"}
                          className={`cursor-pointer rounded-full px-3 py-1 text-[11px] ${
                            active
                              ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900"
                              : "border-dashed"
                          }`}
                          onClick={() => toggleTag(tag)}
                        >
                          {tag}
                        </Badge>
                      );
                    })}
                  </div>
                  <Textarea
                    rows={3}
                    placeholder="Optional: add any additional context about your experience, industries, or tools you focus on."
                  />
                </div>
              </CardContent>
            </>
          )}

          {step === "PRICING" && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <MapPin className="h-4 w-4 text-zinc-500" />
                  Pricing expectations
                </CardTitle>
                <CardDescription>
                  Share what compensation range feels fair. Aureeture AI will
                  verify and finalise your public rates.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900 dark:border-amber-400/40 dark:bg-amber-950/40 dark:text-amber-100">
                  <p className="font-medium">
                    Disclaimer: final rates are algorithmically determined
                  </p>
                  <p className="mt-1 text-[11px]">
                    Aureeture AI will verify your credentials and finalise your
                    public rating/charge based on verification, demand, and
                    student feedback. The values below are used as a guideline
                    only.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                      Expected compensation (per hour)
                    </label>
                    <div className="flex items-center">
                      <span className="flex h-10 items-center justify-center rounded-l-md border border-r-0 border-zinc-200 bg-zinc-50 px-3 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900">
                        ₹ / hour
                      </span>
                      <Input
                        type="number"
                        min={0}
                        className="rounded-l-none"
                        value={profile.pricing.expectedHourlyRate ?? ""}
                        onChange={(e) =>
                          setProfile((p) => ({
                            ...p,
                            pricing: {
                              ...p.pricing,
                              expectedHourlyRate: e.target.value
                                ? Number(e.target.value)
                                : null,
                            },
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
                      Expected compensation (per 30 minutes)
                    </label>
                    <div className="flex items-center">
                      <span className="flex h-10 items-center justify-center rounded-l-md border border-r-0 border-zinc-200 bg-zinc-50 px-3 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900">
                        ₹ / 30 min
                      </span>
                      <Input
                        type="number"
                        min={0}
                        className="rounded-l-none"
                        value={profile.pricing.expectedHalfHourRate ?? ""}
                        onChange={(e) =>
                          setProfile((p) => ({
                            ...p,
                            pricing: {
                              ...p.pricing,
                              expectedHalfHourRate: e.target.value
                                ? Number(e.target.value)
                                : null,
                            },
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </>
          )}

          {step === "AVAILABILITY" && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Globe2 className="h-4 w-4 text-zinc-500" />
                  Availability &amp; schedule
                </CardTitle>
                <CardDescription>
                  Control your timezone and whether students can request sessions
                  instantly.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-2">
                  <label className="flex items-center gap-1 text-xs font-medium text-zinc-600 dark:text-zinc-300">
                    Timezone
                  </label>
                  <Select
                    value={profile.timezone}
                    onValueChange={(value) =>
                      setProfile((p) => ({ ...p, timezone: value }))
                    }
                  >
                    <SelectTrigger className="w-full md:w-80">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Kolkata">
                        Asia / Kolkata (IST)
                      </SelectItem>
                      <SelectItem value="Europe/London">
                        Europe / London (GMT)
                      </SelectItem>
                      <SelectItem value="America/New_York">
                        America / New York (ET)
                      </SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-xs dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="max-w-md">
                    <p className="font-medium text-zinc-900 dark:text-zinc-50">
                      Allow instant bookings
                    </p>
                    <p className="mt-1 text-[11px] text-zinc-500">
                      When enabled, students can book directly into your
                      available slots without manual approval.
                    </p>
                  </div>
                  <Switch
                    checked={profile.isOnline}
                    onCheckedChange={(value) =>
                      setProfile((p) => ({ ...p, isOnline: value }))
                    }
                  />
                </div>
              </CardContent>
            </>
          )}

          {/* Footer buttons */}
          <div className="flex items-center justify-between border-t border-zinc-200 bg-zinc-50 px-6 py-4 text-xs dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center gap-2 text-[11px] text-zinc-500">
              <Switch checked={profile.isOnline} onCheckedChange={(value) =>
                setProfile((p) => ({ ...p, isOnline: value }))
              } />
              <span>
                Show me as <span className="font-medium">online</span> once my
                profile is approved.
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={goPrev}
                disabled={currentStepIndex === 0 || isSaving}
              >
                <ArrowLeft className="mr-1 h-3 w-3" />
                Back
              </Button>
              {!isLastStep && (
                <Button
                  type="button"
                  size="sm"
                  onClick={goNext}
                  disabled={isSaving}
                >
                  Continue
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              )}
              {isLastStep && (
                <Button
                  type="button"
                  size="sm"
                  onClick={handleComplete}
                  disabled={isSaving}
                  className="gap-1"
                >
                  {isSaving && (
                    <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                  )}
                  Complete onboarding
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}


