"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save } from "lucide-react";

const StudentSettingsSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  linkedinUrl: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  country: z.string().optional().or(z.literal("")),
  timezone: z.string().optional().or(z.literal("")),
  workAuthorization: z.string().optional().or(z.literal("")),
  resumeFile: z.string().optional().or(z.literal("")),
  skillsText: z.string().optional().or(z.literal("")),
  domainsText: z.string().optional().or(z.literal("")),
  educationsText: z.string().optional().or(z.literal("")),
  experiencesText: z.string().optional().or(z.literal("")),
  projectsText: z.string().optional().or(z.literal("")),
  awards: z.string().optional().or(z.literal("")),
  portfolio: z.string().optional().or(z.literal("")),
  github: z.string().optional().or(z.literal("")),
  leetcode: z.string().optional().or(z.literal("")),
  codechef: z.string().optional().or(z.literal("")),
  otherLink: z.string().optional().or(z.literal("")),
  workModel: z.string().optional().or(z.literal("")),
  salaryMin: z.coerce.number().optional().or(z.nan()),
  salaryMax: z.coerce.number().optional().or(z.nan()),
  salaryCurrency: z.string().optional().or(z.literal("INR")),
  openToInternships: z.boolean().optional(),
  openToRelocation: z.boolean().optional(),
});

type FormValues = z.infer<typeof StudentSettingsSchema>;

export default function StudentSettingsPage() {
  const { getToken } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser();
  const [loading, setLoading] = useState(true);
  const [submitState, setSubmitState] = useState<"idle" | "saving">("idle");
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(StudentSettingsSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      linkedinUrl: "",
      city: "",
      country: "",
      timezone: "",
      workAuthorization: "",
      resumeFile: "",
      skillsText: "",
      domainsText: "",
      educationsText: "",
      experiencesText: "",
      projectsText: "",
      awards: "",
      portfolio: "",
      github: "",
      leetcode: "",
      codechef: "",
      otherLink: "",
      workModel: "",
      salaryMin: undefined,
      salaryMax: undefined,
      salaryCurrency: "INR",
      openToInternships: false,
      openToRelocation: false,
    },
  });

  useEffect(() => {
    const load = async () => {
      try {
        const token = await getToken();
        const endpoint = apiBase
          ? `${apiBase}/api/student/profile`
          : "/api/student/profile";

        const res = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
        });

        if (!res.ok) {
          setLoading(false);
          return;
        }

        const data = await res.json();
        const profile = data?.data;
        reset({
          fullName: profile?.fullName || user?.fullName || "",
          email:
            profile?.email ||
            user?.primaryEmailAddress?.emailAddress ||
            user?.emailAddresses?.[0]?.emailAddress ||
            "",
          phone: profile?.phone || "",
          linkedinUrl: profile?.linkedinUrl || "",
          city: profile?.location?.city || "",
          country: profile?.location?.country || "",
          timezone: profile?.location?.timezone || "",
          workAuthorization: profile?.location?.workAuthorization || "",
          resumeFile: profile?.resumeFile || "",
          skillsText: (profile?.skills || []).join(", "),
          domainsText: (profile?.preferences?.domains || []).join(", "),
          educationsText: (profile?.educations || [])
            .map((e: any) => `${e.school}|${e.degree}|${e.major}|${e.startYear}|${e.endYear}`)
            .join("\n"),
          experiencesText: (profile?.experiences || [])
            .map((e: any) => `${e.company}|${e.role}|${e.city}|${e.country}|${e.startDate}|${e.endDate}|${e.description || ""}`)
            .join("\n"),
          projectsText: (profile?.projects || [])
            .map((p: any) => `${p.name}|${p.startYear}|${p.endYear}|${p.description || ""}`)
            .join("\n"),
          awards: profile?.awards || "",
          portfolio: profile?.links?.portfolio || "",
          github: profile?.links?.github || "",
          leetcode: profile?.links?.leetcode || "",
          codechef: profile?.links?.codechef || "",
          otherLink: profile?.links?.other || "",
          workModel: profile?.preferences?.workModel || "",
          salaryMin: profile?.preferences?.salaryRange?.min,
          salaryMax: profile?.preferences?.salaryRange?.max,
          salaryCurrency: profile?.preferences?.salaryRange?.currency || "INR",
          openToInternships: profile?.preferences?.openToInternships || false,
          openToRelocation: profile?.preferences?.openToRelocation || false,
        });
      } catch (err) {
        console.error("Failed to load student settings", err);
      } finally {
        setLoading(false);
      }
    };

    if (isUserLoaded) {
      load();
    }
  }, [apiBase, getToken, isUserLoaded, reset, user]);

  const onSubmit = async (values: FormValues) => {
    setSubmitState("saving");
    try {
      const token = await getToken();
      const endpoint = apiBase
        ? `${apiBase}/api/role-onboarding/student`
        : "/api/role-onboarding/student";

      const skills =
        values.skillsText
          ?.split(",")
          .map((s) => s.trim())
          .filter(Boolean) || [];

      const domains =
        values.domainsText
          ?.split(",")
          .map((s) => s.trim())
          .filter(Boolean) || [];

      const educations =
        values.educationsText
          ?.split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line) => {
            const [school, degree, major, startYear, endYear] = line.split("|").map((p) => p?.trim());
            return { school, degree, major, startYear, endYear };
          }) || [];

      const experiences =
        values.experiencesText
          ?.split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line) => {
            const [company, role, city, country, startDate, endDate, description] = line.split("|").map((p) => p?.trim());
            return { company, role, city, country, startDate, endDate, description };
          }) || [];

      const projects =
        values.projectsText
          ?.split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line) => {
            const [name, startYear, endYear, description] = line.split("|").map((p) => p?.trim());
            return { name, startYear, endYear, description };
          }) || [];

      const payload = {
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        linkedinUrl: values.linkedinUrl,
        resumeFile: values.resumeFile,
        educations,
        experiences,
        projects,
        skills,
        awards: values.awards,
        location: {
          city: values.city,
          country: values.country,
          timezone: values.timezone,
          workAuthorization: values.workAuthorization,
          willingToRelocate: values.openToRelocation,
        },
        links: {
          portfolio: values.portfolio,
          github: values.github,
          leetcode: values.leetcode,
          codechef: values.codechef,
          other: values.otherLink,
        },
        preferences: {
          domains,
          workModel: values.workModel,
          salaryRange: {
            min: Number.isFinite(values.salaryMin as number) ? Number(values.salaryMin) : undefined,
            max: Number.isFinite(values.salaryMax as number) ? Number(values.salaryMax) : undefined,
            currency: values.salaryCurrency || "INR",
          },
          openToInternships: values.openToInternships,
          openToRelocation: values.openToRelocation,
        },
      };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw new Error(errBody?.message || "Failed to save settings");
      }
    } catch (err: any) {
      console.error("Failed to save student settings", err);
      alert(err?.message || "Could not save settings. Please try again.");
    } finally {
      setSubmitState("idle");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-zinc-500">
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading your profile…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/70 p-6 dark:bg-zinc-950/60 lg:p-10">
      <Card className="mx-auto max-w-3xl border border-zinc-200/80 bg-white/95 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950/90">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Student Settings</CardTitle>
          <p className="text-sm text-zinc-500">
            Keep your profile in sync so mentors and recruiters see accurate information.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Full name</Label>
                <Input placeholder="Your full name" {...register("fullName")} />
                {errors.fullName && (
                  <p className="text-xs text-red-600">{errors.fullName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input placeholder="you@example.com" {...register("email")} />
                {errors.email && (
                  <p className="text-xs text-red-600">{errors.email.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input placeholder="+91 99999 99999" {...register("phone")} />
              </div>
              <div className="space-y-2">
                <Label>LinkedIn</Label>
                <Input placeholder="https://linkedin.com/in/you" {...register("linkedinUrl")} />
                {errors.linkedinUrl && (
                  <p className="text-xs text-red-600">{errors.linkedinUrl.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>City</Label>
                <Input placeholder="City" {...register("city")} />
              </div>
              <div className="space-y-2">
                <Label>Country</Label>
                <Input placeholder="Country" {...register("country")} />
              </div>
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Input placeholder="Asia/Kolkata" {...register("timezone")} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Resume (url or filename)</Label>
                <Input placeholder="resume.pdf" {...register("resumeFile")} />
              </div>
              <div className="space-y-2">
                <Label>Work Authorization</Label>
                <Input placeholder="Visa / Permit" {...register("workAuthorization")} />
              </div>
              <div className="space-y-2">
                <Label>Preferred Work Model</Label>
                <Input placeholder="Remote / Hybrid / On-site" {...register("workModel")} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Salary Min</Label>
                <Input type="number" placeholder="500000" {...register("salaryMin")} />
              </div>
              <div className="space-y-2">
                <Label>Salary Max</Label>
                <Input type="number" placeholder="1200000" {...register("salaryMax")} />
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Input placeholder="INR" {...register("salaryCurrency")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Skills (comma separated)</Label>
              <Input placeholder="React, Node.js, MongoDB" {...register("skillsText")} />
            </div>

            <div className="space-y-2">
              <Label>Domains of Interest (comma separated)</Label>
              <Input placeholder="Frontend, Backend, ML" {...register("domainsText")} />
            </div>

            <div className="space-y-2">
              <Label>Educations (one per line: school|degree|major|startYear|endYear)</Label>
              <Textarea rows={3} placeholder="ABC Univ|B.Tech|CSE|2020|2024" {...register("educationsText")} />
            </div>

            <div className="space-y-2">
              <Label>Experiences (one per line: company|role|city|country|startDate|endDate|description)</Label>
              <Textarea rows={3} placeholder="Acme|SDE|Bengaluru|India|2022-01-01|2023-12-31|Built features" {...register("experiencesText")} />
            </div>

            <div className="space-y-2">
              <Label>Projects (one per line: name|startYear|endYear|description)</Label>
              <Textarea rows={3} placeholder="Portfolio|2023|2023|Next.js portfolio" {...register("projectsText")} />
            </div>

            <div className="space-y-2">
              <Label>Awards / Bio</Label>
              <Textarea rows={3} placeholder="Achievements or summary" {...register("awards")} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Portfolio</Label>
                <Input placeholder="https://..." {...register("portfolio")} />
              </div>
              <div className="space-y-2">
                <Label>GitHub</Label>
                <Input placeholder="https://github.com/you" {...register("github")} />
              </div>
              <div className="space-y-2">
                <Label>LeetCode</Label>
                <Input placeholder="https://leetcode.com/you" {...register("leetcode")} />
              </div>
              <div className="space-y-2">
                <Label>CodeChef</Label>
                <Input placeholder="https://www.codechef.com/users/you" {...register("codechef")} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Other link</Label>
                <Input placeholder="Any other relevant link" {...register("otherLink")} />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...register("openToInternships")} />
                Open to internships
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...register("openToRelocation")} />
                Open to relocation
              </label>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={submitState === "saving"}
                className="gap-2"
              >
                {submitState === "saving" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Settings
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

