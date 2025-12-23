"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, Sparkles } from "lucide-react";

const StudentOnboardingSchema = z.object({
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

type FormValues = z.infer<typeof StudentOnboardingSchema>;

export default function StudentOnboardingPage() {
  const { getToken } = useAuth();
  const { user, isLoaded: isUserLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitState, setSubmitState] = useState<"idle" | "saving">("idle");
  const apiBase = useMemo(
    () => process.env.NEXT_PUBLIC_API_BASE_URL || "",
    []
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(StudentOnboardingSchema),
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
            "x-active-role": "student",
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
        console.error("Failed to load student onboarding data", err);
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
          "x-active-role": "student",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw new Error(errBody?.message || "Failed to complete onboarding");
      }

      router.replace("/dashboard/student/overview");
    } catch (err: any) {
      console.error("Failed to complete student onboarding", err);
      alert(err?.message || "Could not save onboarding. Please try again.");
    } finally {
      setSubmitState("idle");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-zinc-500">
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading your onboarding…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-zinc-950 p-4 md:p-8 lg:p-12 flex justify-center">
    {/* Changed md:w-2/3 to max-w-5xl and w-full to fill the screen better */}
    <div className="w-full max-w-5xl">
      <Card className="border border-white/10 bg-zinc-900/40 text-zinc-50 shadow-2xl shadow-black/50 backdrop-blur-md">
        <CardHeader className="space-y-2 pb-8 pt-10 px-8 text-center md:text-left">
          <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
            Tell us about you
          </CardTitle>
          <p className="text-base text-zinc-400">
            This helps match you to the right mentors and opportunities.
          </p>
        </CardHeader>
        <hr className="border-white/5 mx-8" />
        
        <CardContent className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            
            {/* Section: Personal Info */}
            <div className="space-y-6">
              <h3 className="text-sm font-medium uppercase tracking-widest text-zinc-500">Contact Information</h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-zinc-300">Full name</Label>
                  <Input className="bg-zinc-950/50 border-zinc-800 focus:ring-zinc-700 transition-all" placeholder="Your full name" {...register("fullName")} />
                  {errors.fullName && <p className="text-xs text-red-400">{errors.fullName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Email</Label>
                  <Input className="bg-zinc-950/50 border-zinc-800 focus:ring-zinc-700 transition-all" placeholder="you@example.com" {...register("email")} />
                  {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Phone</Label>
                  <Input className="bg-zinc-950/50 border-zinc-800 focus:ring-zinc-700 transition-all" placeholder="+91 99999 99999" {...register("phone")} />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">LinkedIn</Label>
                  <Input className="bg-zinc-950/50 border-zinc-800 focus:ring-zinc-700 transition-all" placeholder="https://linkedin.com/in/you" {...register("linkedinUrl")} />
                  {errors.linkedinUrl && <p className="text-xs text-red-400">{errors.linkedinUrl.message}</p>}
                </div>
              </div>
            </div>
  
            {/* Section: Location & Preferences */}
            <div className="space-y-6 pt-4">
              <h3 className="text-sm font-medium uppercase tracking-widest text-zinc-500">Location & Availability</h3>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <Label className="text-zinc-300">City</Label>
                  <Input className="bg-zinc-950/50 border-zinc-800 focus:ring-zinc-700 transition-all" placeholder="City" {...register("city")} />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Country</Label>
                  <Input className="bg-zinc-950/50 border-zinc-800 focus:ring-zinc-700 transition-all" placeholder="Country" {...register("country")} />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Timezone</Label>
                  <Input className="bg-zinc-950/50 border-zinc-800 focus:ring-zinc-700 transition-all" placeholder="Asia/Kolkata" {...register("timezone")} />
                </div>
              </div>
  
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <Label className="text-zinc-300">Resume (url or filename)</Label>
                  <Input className="bg-zinc-950/50 border-zinc-800 focus:ring-zinc-700 transition-all" placeholder="resume.pdf" {...register("resumeFile")} />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Work Authorization</Label>
                  <Input className="bg-zinc-950/50 border-zinc-800 focus:ring-zinc-700 transition-all" placeholder="Visa / Permit" {...register("workAuthorization")} />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Preferred Work Model</Label>
                  <Input className="bg-zinc-950/50 border-zinc-800 focus:ring-zinc-700 transition-all" placeholder="Remote / Hybrid / On-site" {...register("workModel")} />
                </div>
              </div>
            </div>
  
            {/* Section: Salary */}
            <div className="space-y-6 pt-4">
              <h3 className="text-sm font-medium uppercase tracking-widest text-zinc-500">Compensation</h3>
              <div className="grid gap-6 md:grid-cols-3 bg-zinc-950/30 p-4 rounded-lg border border-white/5">
                <div className="space-y-2">
                  <Label className="text-zinc-300">Salary Min</Label>
                  <Input type="number" className="bg-zinc-950 border-zinc-800" placeholder="500000" {...register("salaryMin")} />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Salary Max</Label>
                  <Input type="number" className="bg-zinc-950 border-zinc-800" placeholder="1200000" {...register("salaryMax")} />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Currency</Label>
                  <Input className="bg-zinc-950 border-zinc-800" placeholder="INR" {...register("salaryCurrency")} />
                </div>
              </div>
            </div>
  
            {/* Section: Expertise */}
            <div className="space-y-6 pt-4">
              <h3 className="text-sm font-medium uppercase tracking-widest text-zinc-500">Expertise & Background</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-zinc-300">Skills (comma separated)</Label>
                  <Input className="bg-zinc-950/50 border-zinc-800" placeholder="React, Node.js, MongoDB" {...register("skillsText")} />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Domains of Interest</Label>
                  <Input className="bg-zinc-950/50 border-zinc-800" placeholder="Frontend, Backend, ML" {...register("domainsText")} />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Educations</Label>
                  <Textarea className="bg-zinc-950/50 border-zinc-800 min-h-[100px]" placeholder="ABC Univ|B.Tech|CSE|2020|2024" {...register("educationsText")} />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Experiences</Label>
                  <Textarea className="bg-zinc-950/50 border-zinc-800 min-h-[100px]" placeholder="Acme|SDE|Bengaluru|India|2022-01-01|2023-12-31|Built features" {...register("experiencesText")} />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Projects</Label>
                  <Textarea className="bg-zinc-950/50 border-zinc-800 min-h-[100px]" placeholder="Portfolio|2023|2023|Next.js portfolio" {...register("projectsText")} />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Awards / Bio</Label>
                  <Textarea className="bg-zinc-950/50 border-zinc-800 min-h-[100px]" placeholder="Achievements or summary" {...register("awards")} />
                </div>
              </div>
            </div>
  
            {/* Section: Links */}
            <div className="space-y-6 pt-4">
              <h3 className="text-sm font-medium uppercase tracking-widest text-zinc-500">Profiles & Links</h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-zinc-300">Portfolio</Label>
                  <Input className="bg-zinc-950/50 border-zinc-800" placeholder="https://..." {...register("portfolio")} />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">GitHub</Label>
                  <Input className="bg-zinc-950/50 border-zinc-800" placeholder="https://github.com/you" {...register("github")} />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">LeetCode</Label>
                  <Input className="bg-zinc-950/50 border-zinc-800" placeholder="https://leetcode.com/you" {...register("leetcode")} />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">CodeChef</Label>
                  <Input className="bg-zinc-950/50 border-zinc-800" placeholder="https://www.codechef.com/users/you" {...register("codechef")} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-zinc-300">Other link</Label>
                  <Input className="bg-zinc-950/50 border-zinc-800" placeholder="Any other relevant link" {...register("otherLink")} />
                </div>
              </div>
            </div>
  
            <div className="flex flex-wrap gap-8 items-center py-4 bg-zinc-950/20 px-6 rounded-xl border border-white/5">
              <label className="flex items-center gap-3 text-sm font-medium cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 accent-white" {...register("openToInternships")} />
                <span className="text-zinc-300 group-hover:text-white transition-colors">Open to internships</span>
              </label>
              <label className="flex items-center gap-3 text-sm font-medium cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 accent-white" {...register("openToRelocation")} />
                <span className="text-zinc-300 group-hover:text-white transition-colors">Open to relocation</span>
              </label>
            </div>
  
            <div className="flex justify-end pt-6">
              <Button
                type="submit"
                disabled={submitState === "saving"}
                className="px-10 py-6 bg-white text-black hover:bg-zinc-200 transition-all font-bold text-lg rounded-full shadow-lg shadow-white/5 gap-3"
              >
                {submitState === "saving" ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Save className="h-5 w-5" />
                )}
                Complete Onboarding
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
  );
}


