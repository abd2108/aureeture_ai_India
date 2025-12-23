"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  UploadCloud,
  Plus,
  Trash2,
  Award,
  Link2,
  X,
  MapPin,
  Calendar as CalendarIcon,
  Clock,
  Globe2,
  Mail,
  Phone,
  Linkedin,
  User,
  DollarSign,
} from "lucide-react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useProfile } from "@/contexts/ProfileContext";

type RoleKey = "student" | "mentor" | "founder";

type Education = {
  id: number;
  school: string;
  degree: string;
  major: string;
  startYear: string;
  endYear: string;
  gpa: string;
};

type Experience = {
  id: number;
  company: string;
  role: string;
  city: string;
  country: string;
  startDate: string;
  endDate: string;
  description: string;
};

type Project = {
  id: number;
  name: string;
  startYear: string;
  endYear: string;
  description: string;
};

type WorkingDay = {
  id: string;
  label: string;
  short: string;
  available: boolean;
  start: string;
  end: string;
};

const WORKING_DAYS: WorkingDay[] = [
  { id: "sun", label: "Sunday", short: "S", available: false, start: "09:00", end: "17:00" },
  { id: "mon", label: "Monday", short: "M", available: true, start: "09:00", end: "17:00" },
  { id: "tue", label: "Tuesday", short: "T", available: true, start: "09:00", end: "17:00" },
  { id: "wed", label: "Wednesday", short: "W", available: true, start: "09:00", end: "17:00" },
  { id: "thu", label: "Thursday", short: "T", available: true, start: "09:00", end: "17:00" },
  { id: "fri", label: "Friday", short: "F", available: true, start: "09:00", end: "17:00" },
  { id: "sat", label: "Saturday", short: "S", available: false, start: "09:00", end: "17:00" },
];

const DOMAIN_OPTIONS = [
  "Software Engineering",
  "Data Analysis",
  "Finance",
  "Business Operations",
  "Life, Physical, and Social Science",
  "Arts & Design",
  "Language and Audio",
  "Humanities",
  "Miscellaneous",
];

const SectionHeader = ({
  title,
  description,
}: {
  title: string;
  description?: string;
}) => (
  <div className="flex flex-col gap-1">
    <h3 className="text-sm font-semibold">{title}</h3>
    {description && (
      <p className="text-xs text-zinc-500">{description}</p>
    )}
  </div>
);

const FieldLabel = ({ label, required }: { label: string; required?: boolean }) => (
  <p className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
    {label}
    {required && <span className="text-red-500 ml-0.5">*</span>}
  </p>
);

function StudentResumeTab() {
  const { profile } = useProfile();
  const { toast } = useToast();

  const [fullName, setFullName] = useState(profile.name || "");
  const [email, setEmail] = useState(profile.email || "");
  const [phone, setPhone] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [hasLinkedin, setHasLinkedin] = useState(true);

  const [resumeFile, setResumeFile] = useState<{
    name: string;
    uploadedAt: string;
  } | null>({
    name: "Rishabh_Soni_Resume_IITBHU_250804_025501.pdf",
    uploadedAt: "Uploaded on 12/09/25",
  });

  const [educations, setEducations] = useState<Education[]>([
    {
      id: 1,
      school: "IIT (BHU) Varanasi",
      degree: "B.Tech",
      major: "Computer Science and Engineering",
      startYear: "2022",
      endYear: "2026",
      gpa: "8.6 / 10",
    },
  ]);

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [awards, setAwards] = useState<string>("");

  const [links, setLinks] = useState({
    portfolio: "",
    github: "",
    leetcode: "",
    codechef: "",
    other: "",
  });

  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([
    "Python",
    "React",
    "Machine Learning",
  ]);

  const addEducation = () => {
    setEducations((prev) => [
      ...prev,
      {
        id: Date.now(),
        school: "",
        degree: "",
        major: "",
        startYear: "",
        endYear: "",
        gpa: "",
      },
    ]);
  };

  const updateEducation = (id: number, patch: Partial<Education>) => {
    setEducations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  const removeEducation = (id: number) => {
    setEducations((prev) => prev.filter((item) => item.id !== id));
  };

  const addExperience = () => {
    setExperiences((prev) => [
      ...prev,
      {
        id: Date.now(),
        company: "",
        role: "",
        city: "",
        country: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ]);
  };

  const updateExperience = (id: number, patch: Partial<Experience>) => {
    setExperiences((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  const removeExperience = (id: number) => {
    setExperiences((prev) => prev.filter((item) => item.id !== id));
  };

  const addProject = () => {
    setProjects((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "",
        startYear: "",
        endYear: "",
        description: "",
      },
    ]);
  };

  const updateProject = (id: number, patch: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
    );
  };

  const removeProject = (id: number) => {
    setProjects((prev) => prev.filter((item) => item.id !== id));
  };

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed || skills.includes(trimmed)) return;
    setSkills((prev) => [...prev, trimmed]);
    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  const [saving, setSaving] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const url = apiBase ? `${apiBase}/api/student/profile` : `/api/student/profile`;
        const res = await fetch(url, { credentials: "include" });
        if (!res.ok) return;
        const data = await res.json();
        const s = data?.data;
        if (!s) return;

        setFullName(s.fullName || profile.name || "");
        setEmail(s.email || profile.email || "");
        setPhone(s.phone || "");
        setLinkedinUrl(s.linkedinUrl || "");
        setResumeFile(
          s.resumeFile
            ? { name: s.resumeFile, uploadedAt: "" }
            : resumeFile
        );
        setEducations(Array.isArray(s.educations) ? s.educations : []);
        setExperiences(Array.isArray(s.experiences) ? s.experiences : []);
        setProjects(Array.isArray(s.projects) ? s.projects : []);
        setAwards(s.awards || "");
        setLinks({ ...links, ...(s.links || {}) });
        setSkills(Array.isArray(s.skills) ? s.skills : []);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Failed to load student profile", err);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBase]);

  const handleSave = async () => {
    // Debug hook to confirm click
    // eslint-disable-next-line no-console
    console.log("Saving student profile...");
    setSaving(true);
    try {
      const payload = {
        fullName,
        email,
        phone,
        linkedinUrl,
        resumeFile: resumeFile?.name,
        educations,
        experiences,
        projects,
        awards,
        links,
        skills,
      };

      const url = apiBase ? `${apiBase}/api/student/profile` : `/api/student/profile`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Failed to save profile");
      }

      toast({ title: "Profile saved", description: "Your student profile was updated." });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to save student profile", err);
      toast({
        title: "Save failed",
        description: "Could not save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="border-b border-zinc-200 dark:border-zinc-800">
          <CardTitle className="text-base">Resume</CardTitle>
          <CardDescription>
            This information is used to match you with opportunities.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-10">
          {/* Personal Info */}
          <div className="grid gap-6 lg:grid-cols-[240px,1fr]">
            <SectionHeader
              title="Personal information"
              description="Tell us how employers can reach you."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <FieldLabel label="Full name" required />
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full name"
                />
              </div>
              <div className="space-y-1">
                <FieldLabel label="Email" required />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                />
              </div>
              <div className="space-y-1">
                <FieldLabel label="Phone" />
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 ..."
                />
              </div>
              <div className="space-y-1">
                <FieldLabel label="LinkedIn URL" required={hasLinkedin} />
                <Input
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                  disabled={!hasLinkedin}
                />
                <label className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
                  <Switch
                    checked={!hasLinkedin}
                    onCheckedChange={(checked) => setHasLinkedin(!checked)}
                  />
                  <span>I don’t have a LinkedIn</span>
                </label>
              </div>
            </div>
          </div>

          <Separator />

          {/* Resume upload */}
          <div className="grid gap-6 lg:grid-cols-[240px,1fr]">
            <SectionHeader
              title="Resume upload"
              description="Upload your latest resume as PDF."
            />
            <div className="space-y-3">
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-zinc-300 bg-zinc-50 px-6 py-8 text-center text-xs text-zinc-500 hover:border-zinc-400 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-500">
                <UploadCloud className="mb-2 h-6 w-6 text-zinc-400" />
                <span className="font-medium text-zinc-700 dark:text-zinc-200">
                  Click to upload or drag & drop
                </span>
                <span className="mt-1 text-[11px] text-zinc-500">
                  PDF up to 10 MB
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setResumeFile({
                        name: file.name,
                        uploadedAt: `Uploaded just now`,
                      });
                    }
                  }}
                />
              </label>

              {resumeFile && (
                <div className="flex items-center justify-between rounded-md border border-zinc-200 bg-white px-4 py-3 text-xs dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-white text-xs font-semibold">
                      PDF
                    </div>
                    <div className="space-y-0.5">
                      <p className="font-medium text-zinc-900 dark:text-zinc-50 line-clamp-1">
                        {resumeFile.name}
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        {resumeFile.uploadedAt}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setResumeFile(null)}
                    className="rounded-full p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Education */}
          <div className="grid gap-6 lg:grid-cols-[240px,1fr]">
            <SectionHeader
              title="Education"
              description="Add your academic background."
            />
            <div className="space-y-4">
              {educations.map((edu) => (
                <div
                  key={edu.id}
                  className="space-y-3 rounded-md border border-zinc-200 bg-white p-4 text-xs dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-zinc-900 dark:text-zinc-50">
                      Education entry
                    </p>
                    <button
                      type="button"
                      onClick={() => removeEducation(edu.id)}
                      className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-red-500 dark:hover:bg-zinc-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <FieldLabel label="School" required />
                      <Input
                        value={edu.school}
                        onChange={(e) =>
                          updateEducation(edu.id, { school: e.target.value })
                        }
                        placeholder="Institution name"
                      />
                    </div>
                    <div className="space-y-1">
                      <FieldLabel label="Degree" />
                      <Input
                        value={edu.degree}
                        onChange={(e) =>
                          updateEducation(edu.id, { degree: e.target.value })
                        }
                        placeholder="e.g. B.Tech"
                      />
                    </div>
                    <div className="space-y-1">
                      <FieldLabel label="Major" />
                      <Input
                        value={edu.major}
                        onChange={(e) =>
                          updateEducation(edu.id, { major: e.target.value })
                        }
                        placeholder="e.g. Computer Science"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <FieldLabel label="Start year" />
                        <Input
                          value={edu.startYear}
                          onChange={(e) =>
                            updateEducation(edu.id, {
                              startYear: e.target.value,
                            })
                          }
                          placeholder="2022"
                        />
                      </div>
                      <div className="space-y-1">
                        <FieldLabel label="End year" />
                        <Input
                          value={edu.endYear}
                          onChange={(e) =>
                            updateEducation(edu.id, {
                              endYear: e.target.value,
                            })
                          }
                          placeholder="2026"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <FieldLabel label="GPA" />
                      <Input
                        value={edu.gpa}
                        onChange={(e) =>
                          updateEducation(edu.id, { gpa: e.target.value })
                        }
                        placeholder="e.g. 8.6 / 10"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-1 flex items-center gap-2"
                onClick={addEducation}
              >
                <Plus className="h-4 w-4" />
                Add education
              </Button>
            </div>
          </div>

          <Separator />

          {/* Work Experience */}
          <div className="grid gap-6 lg:grid-cols-[240px,1fr]">
            <SectionHeader
              title="Work experience"
              description="Include internships, part‑time and full‑time roles."
            />
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="space-y-3 rounded-md border border-zinc-200 bg-white p-4 text-xs dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-zinc-900 dark:text-zinc-50">
                      Experience entry
                    </p>
                    <button
                      type="button"
                      onClick={() => removeExperience(exp.id)}
                      className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-red-500 dark:hover:bg-zinc-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <FieldLabel label="Company" required />
                      <Input
                        value={exp.company}
                        onChange={(e) =>
                          updateExperience(exp.id, { company: e.target.value })
                        }
                        placeholder="Company name"
                      />
                    </div>
                    <div className="space-y-1">
                      <FieldLabel label="Role" required />
                      <Input
                        value={exp.role}
                        onChange={(e) =>
                          updateExperience(exp.id, { role: e.target.value })
                        }
                        placeholder="e.g. SDE Intern"
                      />
                    </div>
                    <div className="space-y-1">
                      <FieldLabel label="City" />
                      <Input
                        value={exp.city}
                        onChange={(e) =>
                          updateExperience(exp.id, { city: e.target.value })
                        }
                        placeholder="City"
                      />
                    </div>
                    <div className="space-y-1">
                      <FieldLabel label="Country" />
                      <Input
                        value={exp.country}
                        onChange={(e) =>
                          updateExperience(exp.id, { country: e.target.value })
                        }
                        placeholder="Country"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <FieldLabel label="Start date" />
                        <Input
                          value={exp.startDate}
                          onChange={(e) =>
                            updateExperience(exp.id, {
                              startDate: e.target.value,
                            })
                          }
                          placeholder="MM/YYYY"
                        />
                      </div>
                      <div className="space-y-1">
                        <FieldLabel label="End date" />
                        <Input
                          value={exp.endDate}
                          onChange={(e) =>
                            updateExperience(exp.id, {
                              endDate: e.target.value,
                            })
                          }
                          placeholder="MM/YYYY or Present"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2 space-y-1">
                      <FieldLabel label="Description" />
                      <Textarea
                        value={exp.description}
                        onChange={(e) =>
                          updateExperience(exp.id, {
                            description: e.target.value,
                          })
                        }
                        rows={3}
                        placeholder="Describe your responsibilities, impact and technologies used."
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-1 flex items-center gap-2"
                onClick={addExperience}
              >
                <Plus className="h-4 w-4" />
                Add experience
              </Button>
            </div>
          </div>

          <Separator />

          {/* Projects */}
          <div className="grid gap-6 lg:grid-cols-[240px,1fr]">
            <SectionHeader
              title="Projects"
              description="Add projects that demonstrate your skills."
            />
            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="space-y-3 rounded-md border border-zinc-200 bg-white p-4 text-xs dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-zinc-900 dark:text-zinc-50">
                      Project entry
                    </p>
                    <button
                      type="button"
                      onClick={() => removeProject(project.id)}
                      className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-red-500 dark:hover:bg-zinc-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <FieldLabel label="Project name" required />
                      <Input
                        value={project.name}
                        onChange={(e) =>
                          updateProject(project.id, { name: e.target.value })
                        }
                        placeholder="e.g. GenAI Career Copilot"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <FieldLabel label="Start year" />
                        <Input
                          value={project.startYear}
                          onChange={(e) =>
                            updateProject(project.id, {
                              startYear: e.target.value,
                            })
                          }
                          placeholder="2024"
                        />
                      </div>
                      <div className="space-y-1">
                        <FieldLabel label="End year" />
                        <Input
                          value={project.endYear}
                          onChange={(e) =>
                            updateProject(project.id, {
                              endYear: e.target.value,
                            })
                          }
                          placeholder="2025"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2 space-y-1">
                      <FieldLabel label="Description" />
                      <Textarea
                        value={project.description}
                        onChange={(e) =>
                          updateProject(project.id, {
                            description: e.target.value,
                          })
                        }
                        rows={3}
                        placeholder="Describe what you built, your role, and outcomes."
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-1 flex items-center gap-2"
                onClick={addProject}
              >
                <Plus className="h-4 w-4" />
                Add project
              </Button>
            </div>
          </div>

          <Separator />

          {/* Awards */}
          <div className="grid gap-6 lg:grid-cols-[240px,1fr]">
            <SectionHeader
              title="Awards & achievements"
              description="Highlight notable achievements, scholarships, or hackathon wins."
            />
            <div className="space-y-2">
              <FieldLabel label="Awards" />
              <Textarea
                value={awards}
                onChange={(e) => setAwards(e.target.value)}
                rows={3}
                placeholder="e.g. Winner, Smart India Hackathon 2025; Dean’s List (Top 5%)"
              />
            </div>
          </div>

          <Separator />

          {/* Links & profiles */}
          <div className="grid gap-6 lg:grid-cols-[240px,1fr]">
            <SectionHeader
              title="Links & profiles"
              description="Share your portfolio and coding profiles."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <FieldLabel label="Portfolio / personal site" />
                <Input
                  value={links.portfolio}
                  onChange={(e) =>
                    setLinks({ ...links, portfolio: e.target.value })
                  }
                  placeholder="https://"
                />
              </div>
              <div className="space-y-1">
                <FieldLabel label="GitHub" />
                <Input
                  value={links.github}
                  onChange={(e) =>
                    setLinks({ ...links, github: e.target.value })
                  }
                  placeholder="https://github.com/username"
                />
              </div>
              <div className="space-y-1">
                <FieldLabel label="LeetCode" />
                <Input
                  value={links.leetcode}
                  onChange={(e) =>
                    setLinks({ ...links, leetcode: e.target.value })
                  }
                  placeholder="https://leetcode.com/username"
                />
              </div>
              <div className="space-y-1">
                <FieldLabel label="CodeChef" />
                <Input
                  value={links.codechef}
                  onChange={(e) =>
                    setLinks({ ...links, codechef: e.target.value })
                  }
                  placeholder="https://www.codechef.com/users/..."
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <FieldLabel label="Other link" />
                <Input
                  value={links.other}
                  onChange={(e) =>
                    setLinks({ ...links, other: e.target.value })
                  }
                  placeholder="Any additional portfolio or profile link"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Skills */}
          <div className="grid gap-6 lg:grid-cols-[240px,1fr]">
            <SectionHeader
              title="Skills"
              description="Add technologies and skills you want to be evaluated for."
            />
            <div className="space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="Add a skill and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addSkill}
                  className="sm:w-auto"
                >
                  Add skill
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.length === 0 && (
                  <p className="text-xs text-zinc-500">
                    No skills added yet.
                  </p>
                )}
                {skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="flex items-center gap-1 rounded-full bg-zinc-100 text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-50"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-0.5 rounded-full p-0.5 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <Button type="button">Save changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StudentLocationTab() {
  const [country, setCountry] = useState("India");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [dob, setDob] = useState("");
  const [sameLocation, setSameLocation] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [stayInIndia, setStayInIndia] = useState(false);
  const [saving, setSaving] = useState(false);
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const { toast } = useToast();

  const handleSaveLocation = async () => {
    setSaving(true);
    try {
      const payload = {
        location: {
          country,
          state,
          city,
          postalCode,
          workAuthorization: authorized,
          willingToRelocate: !stayInIndia,
        },
      };

      const url = apiBase ? `${apiBase}/api/student/profile` : `/api/student/profile`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Failed to save location");
      }

      toast({ title: "Location saved", description: "Your location details were updated." });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Failed to save location", err);
      toast({
        title: "Save failed",
        description: "Could not save location. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader className="border-b border-zinc-200 dark:border-zinc-800">
        <CardTitle className="text-base">Location & work authorization</CardTitle>
        <CardDescription>
          Tell us where you are legally authorized to work.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-8">
        <div className="grid gap-6 lg:grid-cols-[240px,1fr]">
          <SectionHeader
            title="Location of residence"
            description="Where you’re based for most of the year."
          />
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <FieldLabel label="Country" required />
                <Input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Country"
                />
              </div>
              <div className="space-y-1">
                <FieldLabel label="State / Province / Region" />
                <Input
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="State or province"
                />
              </div>
              <div className="space-y-1">
                <FieldLabel label="City" />
                <Input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                />
              </div>
              <div className="space-y-1">
                <FieldLabel label="Postal code" />
                <Input
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="Postal code"
                />
              </div>
            </div>
            <label className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
              <Switch
                checked={sameLocation}
                onCheckedChange={setSameLocation}
              />
              <span>
                My location of residence and physical working location are the
                same.
              </span>
            </label>
          </div>
        </div>

        <Separator />

        <div className="grid gap-6 lg:grid-cols-[240px,1fr]">
          <SectionHeader
            title="Legal attestation"
            description="Confirm your legally authorized work status."
          />
          <div className="space-y-4">
            <div className="space-y-1">
              <FieldLabel label="Date of birth (MM/DD/YYYY)" />
              <Input
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                placeholder="MM/DD/YYYY"
              />
            </div>
            <div className="space-y-3 text-xs text-zinc-600 dark:text-zinc-300">
              <label className="flex items-start gap-2">
                <Switch
                  checked={authorized}
                  onCheckedChange={setAuthorized}
                  className="mt-0.5"
                />
                <span>
                  I confirm that I am legally authorized to work from India.
                </span>
              </label>
              <label className="flex items-start gap-2">
                <Switch
                  checked={stayInIndia}
                  onCheckedChange={setStayInIndia}
                  className="mt-0.5"
                />
                <span>
                  I agree to remain working from India, and to notify Aureeture
                  in writing prior to any change.
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <Button type="button" onClick={handleSaveLocation} disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function StudentAvailabilityTab() {
  const [availabilityStart, setAvailabilityStart] = useState("immediately");
  const [timeCommitment, setTimeCommitment] = useState("40");
  const [timezone, setTimezone] = useState<string | undefined>(undefined);
  const [workingHours, setWorkingHours] = useState<WorkingDay[]>(WORKING_DAYS);

  const updateDay = (id: string, patch: Partial<WorkingDay>) => {
    setWorkingHours((prev) =>
      prev.map((day) => (day.id === id ? { ...day, ...patch } : day))
    );
  };

  return (
    <Card>
      <CardHeader className="border-b border-zinc-200 dark:border-zinc-800">
        <CardTitle className="text-base">Availability</CardTitle>
        <CardDescription>
          Set when you are typically available for work.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-2">
            <FieldLabel label="Availability to start" required />
            <Select
              value={availabilityStart}
              onValueChange={setAvailabilityStart}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediately">Immediately</SelectItem>
                <SelectItem value="2-weeks">In 2 weeks</SelectItem>
                <SelectItem value="1-month">In 1 month</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <FieldLabel label="Preferred time commitment (hrs / week)" required />
            <Input
              value={timeCommitment}
              onChange={(e) => setTimeCommitment(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <FieldLabel label="Timezone" required />
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger>
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Asia/Kolkata">
                  Asia / Kolkata (IST)
                </SelectItem>
                <SelectItem value="UTC">UTC</SelectItem>
                <SelectItem value="America/New_York">
                  America / New York (EST)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <SectionHeader
            title="Working hours"
            description="Select when you are typically available to work."
          />

          <div className="space-y-3">
            {workingHours.map((day) => (
              <div
                key={day.id}
                className="flex flex-col items-start gap-3 rounded-md border border-zinc-200 bg-white px-3 py-2 text-xs dark:border-zinc-800 dark:bg-zinc-900 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-100">
                    {day.short}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-zinc-900 dark:text-zinc-50">
                      {day.label}
                    </p>
                    {!day.available && (
                      <p className="text-[11px] text-zinc-500">Unavailable</p>
                    )}
                  </div>
                </div>

                {day.available ? (
                  <div className="flex items-center gap-2">
                    <Input
                      className="h-8 w-24"
                      value={day.start}
                      onChange={(e) =>
                        updateDay(day.id, { start: e.target.value })
                      }
                    />
                    <span>-</span>
                    <Input
                      className="h-8 w-24"
                      value={day.end}
                      onChange={(e) =>
                        updateDay(day.id, { end: e.target.value })
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-zinc-400 hover:text-red-500"
                      onClick={() => updateDay(day.id, { available: false })}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => updateDay(day.id, { available: true })}
                  >
                    Set hours
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <Button type="button">Save changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function StudentWorkPreferencesTab() {
  const [selectedDomains, setSelectedDomains] = useState<string[]>([
    "Software Engineering",
  ]);
  const [fullTimeComp, setFullTimeComp] = useState("0");
  const [partTimeComp, setPartTimeComp] = useState("0");

  const toggleDomain = (domain: string) => {
    setSelectedDomains((prev) =>
      prev.includes(domain)
        ? prev.filter((d) => d !== domain)
        : [...prev, domain]
    );
  };

  return (
    <Card>
      <CardHeader className="border-b border-zinc-200 dark:border-zinc-800">
        <CardTitle className="text-base">Work preferences</CardTitle>
        <CardDescription>
          Define how and where you’d like to work.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-8">
        <div className="grid gap-6 lg:grid-cols-[240px,1fr]">
          <SectionHeader
            title="Domain interests"
            description="Select all domains you’re interested in."
          />
          <div className="flex flex-wrap gap-2">
            {DOMAIN_OPTIONS.map((domain) => {
              const active = selectedDomains.includes(domain);
              return (
                <button
                  key={domain}
                  type="button"
                  onClick={() => toggleDomain(domain)}
                  className={cn(
                    "flex items-center gap-2 rounded-full border px-3 py-1 text-xs transition-colors",
                    active
                      ? "border-violet-600 bg-violet-50 text-violet-700 dark:border-violet-400 dark:bg-violet-950/40 dark:text-violet-100"
                      : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                  )}
                >
                  <CodeIcon />
                  <span>{domain}</span>
                </button>
              );
            })}
          </div>
        </div>

        <Separator />

        <div className="grid gap-6 lg:grid-cols-[240px,1fr]">
          <SectionHeader
            title="Minimum expected compensation"
            description="This stays private and won’t impact your offers."
          />
          <div className="space-y-4">
            <div className="space-y-1">
              <FieldLabel label="Full‑time (per year)" />
              <div className="flex items-center">
                <span className="flex h-10 items-center justify-center rounded-l-md border border-r-0 border-zinc-200 bg-zinc-50 px-3 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
                  <DollarSign className="mr-1 h-3 w-3" />
                  INR
                </span>
                <Input
                  className="rounded-l-none"
                  value={fullTimeComp}
                  onChange={(e) => setFullTimeComp(e.target.value)}
                />
                <span className="ml-2 text-xs text-zinc-500">/ year</span>
              </div>
            </div>

            <div className="space-y-1">
              <FieldLabel label="Part‑time (per hour)" />
              <div className="flex items-center">
                <span className="flex h-10 items-center justify-center rounded-l-md border border-r-0 border-zinc-200 bg-zinc-50 px-3 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
                  <DollarSign className="mr-1 h-3 w-3" />
                  INR
                </span>
                <Input
                  className="rounded-l-none"
                  value={partTimeComp}
                  onChange={(e) => setPartTimeComp(e.target.value)}
                />
                <span className="ml-2 text-xs text-zinc-500">/ hour</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <Button type="button">Save changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function StudentCommunicationsTab() {
  const [channels, setChannels] = useState({
    email: true,
    sms: true,
  });

  const [opportunities, setOpportunities] = useState({
    fullTime: true,
    partTime: true,
    referral: true,
  });

  const [general, setGeneral] = useState({
    jobs: true,
    updates: true,
    unsubscribeAll: false,
  });

  return (
    <Card>
      <CardHeader className="border-b border-zinc-200 dark:border-zinc-800">
        <CardTitle className="text-base">Communications</CardTitle>
        <CardDescription>
          Choose how and where you’d like to receive updates.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-8">
        <div className="grid gap-6 lg:grid-cols-[260px,1fr]">
          <SectionHeader
            title="Communication channels"
            description="Control which channels we can use to contact you."
          />
          <div className="space-y-4 text-sm">
            <ToggleRow
              label="Email"
              description="Receive updates and notifications over email."
              checked={channels.email}
              onChange={(value) =>
                setChannels((prev) => ({ ...prev, email: value }))
              }
            />
            <ToggleRow
              label="Text message (SMS)"
              description="Important updates about interviews and offers."
              checked={channels.sms}
              onChange={(value) =>
                setChannels((prev) => ({ ...prev, sms: value }))
              }
            />
          </div>
        </div>

        <Separator />

        <div className="grid gap-6 lg:grid-cols-[260px,1fr]">
          <SectionHeader
            title="Opportunity types"
            description="Choose the kind of opportunities we should contact you about."
          />
          <div className="space-y-4 text-sm">
            <ToggleRow
              label="Full‑time opportunities"
              description="Contact me about full‑time roles."
              checked={opportunities.fullTime}
              onChange={(value) =>
                setOpportunities((prev) => ({ ...prev, fullTime: value }))
              }
            />
            <ToggleRow
              label="Part‑time opportunities"
              description="Contact me about part‑time roles."
              checked={opportunities.partTime}
              onChange={(value) =>
                setOpportunities((prev) => ({ ...prev, partTime: value }))
              }
            />
            <ToggleRow
              label="Referral opportunities"
              description="Contact me about referral opportunities."
              checked={opportunities.referral}
              onChange={(value) =>
                setOpportunities((prev) => ({ ...prev, referral: value }))
              }
            />
          </div>
        </div>

        <Separator />

        <div className="grid gap-6 lg:grid-cols-[260px,1fr]">
          <SectionHeader
            title="General"
            description="High‑level toggles for communication preferences."
          />
          <div className="space-y-4 text-sm">
            <ToggleRow
              label="Job opportunities"
              description="Receive notifications about new job openings, interviews, and application invitations."
              checked={general.jobs}
              onChange={(value) =>
                setGeneral((prev) => ({ ...prev, jobs: value }))
              }
            />
            <ToggleRow
              label="Work‑related updates"
              description="Get updates about offers, work trials, contracts, and project status changes."
              checked={general.updates}
              onChange={(value) =>
                setGeneral((prev) => ({ ...prev, updates: value }))
              }
            />
            <ToggleRow
              label="Unsubscribe from all"
              description="Turn this on to stop all the outreach."
              checked={general.unsubscribeAll}
              onChange={(value) =>
                setGeneral((prev) => ({ ...prev, unsubscribeAll: value }))
              }
            />
          </div>
        </div>

        <div className="flex justify-end border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <Button type="button">Save changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function StudentAccountTab() {
  const { profile } = useProfile();
  const [generativePic, setGenerativePic] = useState(true);

  return (
    <Card>
      <CardHeader className="border-b border-zinc-200 dark:border-zinc-800">
        <CardTitle className="text-base">Account</CardTitle>
        <CardDescription>
          Update your account preferences and manage sensitive actions.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-8">
        {/* Avatar */}
        <div className="grid gap-6 lg:grid-cols-[260px,1fr]">
          <SectionHeader
            title="Profile photo"
            description="Upload a clear, professional‑looking photo."
          />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Avatar className="h-16 w-16 text-lg">
              <AvatarImage src={profile.profilePicture || ""} />
              <AvatarFallback>
                {(profile.name?.charAt(0) || "A").toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2 text-xs">
              <Button type="button" variant="outline" size="sm">
                Change avatar
              </Button>
              <p className="text-zinc-500">
                JPG, PNG, or GIF. Max 2 MB. Files over 150KB may be compressed.
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Generative profile pictures */}
        <div className="grid gap-6 lg:grid-cols-[260px,1fr]">
          <SectionHeader
            title="Generative profile pictures"
            description="Let Aureeture generate a professional photo from your AI interview."
          />
          <div className="flex items-center justify-between rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3 text-xs dark:border-zinc-800 dark:bg-zinc-900">
            <p className="max-w-md text-zinc-600 dark:text-zinc-300">
              Once your profile joins our talent pool, an AI‑generated image may
              be created and used on your profile.
            </p>
            <Switch
              checked={generativePic}
              onCheckedChange={setGenerativePic}
            />
          </div>
        </div>

        <Separator />

        {/* Payout preferences */}
        <div className="grid gap-6 lg:grid-cols-[260px,1fr]">
          <SectionHeader
            title="Payout preferences"
            description="Choose how you want to receive payouts."
          />
          <div className="space-y-3 text-xs">
            <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900 dark:border-amber-400/40 dark:bg-amber-950/40 dark:text-amber-100">
              <p className="font-medium">Payment method setup required</p>
              <p className="mt-1 text-[11px]">
                Complete your payment method setup during job acceptance to
                enable payouts.
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Referral status */}
        <div className="grid gap-6 lg:grid-cols-[260px,1fr]">
          <SectionHeader
            title="Referral status"
            description="See who referred you to Aureeture."
          />
          <div className="flex flex-col gap-2 text-xs">
            <p className="text-zinc-600 dark:text-zinc-300">
              You’ve been referred by{" "}
              <span className="font-medium">Vishal Yadav</span>.
            </p>
            <Button type="button" variant="outline" size="sm" className="w-fit">
              Not your referrer?
            </Button>
          </div>
        </div>

        <Separator />

        {/* Danger zone */}
        <div className="grid gap-6 lg:grid-cols-[260px,1fr]">
          <SectionHeader
            title="Danger zone"
            description="Sensitive actions that affect your account."
          />
          <div className="space-y-4">
            <div className="flex flex-col gap-2 rounded-md border border-zinc-200 bg-zinc-50 p-4 text-xs dark:border-zinc-800 dark:bg-zinc-900">
              <p className="font-medium text-zinc-900 dark:text-zinc-50">
                Change email
              </p>
              <p className="text-zinc-600 dark:text-zinc-300">
                Transfer all your data and account‑related communications to a
                new email address.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2 w-fit"
              >
                Change email
              </Button>
            </div>

            <div className="flex flex-col gap-2 rounded-md border border-red-200 bg-red-50 p-4 text-xs dark:border-red-600/60 dark:bg-red-950/40">
              <p className="font-medium text-red-700 dark:text-red-100">
                Delete account
              </p>
              <p className="text-red-700/80 dark:text-red-200/80">
                Permanently delete the account and all associated data from
                Aureeture. This action cannot be undone.
              </p>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="mt-2 w-fit"
              >
                Delete account
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <Button type="button">Save changes</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3 text-xs dark:border-zinc-800 dark:bg-zinc-900">
      <div>
        <p className="font-medium text-zinc-900 dark:text-zinc-50">
          {label}
        </p>
        <p className="mt-1 text-[11px] text-zinc-500">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function CodeIcon() {
  return (
    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-zinc-100 text-[9px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-200">
      {"</>"}
    </span>
  );
}

export default function RoleSettingsPage() {
  const params = useParams();
  const roleParam = (params?.role as string) || "student";
  const role: RoleKey =
    roleParam === "mentor" || roleParam === "founder" ? roleParam : "student";

  const isStudent = role === "student";

  // For now, student gets the full set of tabs; mentor/founder reuse
  // Communications + Account as a simplified settings surface.
  const initialTab = isStudent ? "resume" : "communications";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight">Profile settings</h1>
        <p className="text-sm text-zinc-500">
          Manage your profile, availability, and communication preferences.
        </p>
      </div>

      <Tabs defaultValue={initialTab} className="space-y-4">
        <TabsList className="justify-start overflow-x-auto rounded-full bg-zinc-100 px-1 py-1 dark:bg-zinc-900">
          {isStudent && (
            <>
              <TabsTrigger value="resume" className="rounded-full px-4">
                Resume
              </TabsTrigger>
              <TabsTrigger value="location" className="rounded-full px-4">
                Location & Work Auth
              </TabsTrigger>
              <TabsTrigger value="availability" className="rounded-full px-4">
                Availability
              </TabsTrigger>
              <TabsTrigger value="preferences" className="rounded-full px-4">
                Work Preferences
              </TabsTrigger>
            </>
          )}
          <TabsTrigger value="communications" className="rounded-full px-4">
            Communications
          </TabsTrigger>
          <TabsTrigger value="account" className="rounded-full px-4">
            Account
          </TabsTrigger>
        </TabsList>

        {isStudent && (
          <>
            <TabsContent value="resume">
              <StudentResumeTab />
            </TabsContent>
            <TabsContent value="location">
              <StudentLocationTab />
            </TabsContent>
            <TabsContent value="availability">
              <StudentAvailabilityTab />
            </TabsContent>
            <TabsContent value="preferences">
              <StudentWorkPreferencesTab />
            </TabsContent>
          </>
        )}

        <TabsContent value="communications">
          <StudentCommunicationsTab />
        </TabsContent>

        <TabsContent value="account">
          <StudentAccountTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}


