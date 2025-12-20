"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Camera,
  Save,
  X,
  Upload,
  Plus,
  Star,
  Linkedin,
  Calendar,
  Target,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserProfile as ContextUserProfile } from "@/contexts/ProfileContext";

// --- Extended Type Definition ---
// This ensures we capture all the specific fields from your dashboard requirement
type ModalProfile = ContextUserProfile & {
  firstName: string;
  lastName: string;
  phone: string;
  skills: string[];
  linkedIn: string;
  careerStage: string;
  longTermGoal: string;
  currentRoleStartDate: string;
};

interface ProfileSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: ContextUserProfile;
  onSave: (profile: ContextUserProfile) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSave,
}) => {
  // --- Hydration Logic ---
  // Merges current context data with the new fields
  const hydrate = (p: ContextUserProfile): ModalProfile => {
    const name = (p.name || "").trim();
    const parts = name.split(" ").filter(Boolean);
    const firstName = parts[0] || "";
    const lastName = parts.length > 1 ? parts.slice(1).join(" ") : "";
    
    return {
      ...p,
      firstName,
      lastName,
      // Map existing or use defaults for new dashboard fields
      phone: (p as any).phone ?? "",
      skills: (p as any).skills ?? [],
      linkedIn: (p as any).linkedIn ?? "",
      careerStage: (p as any).careerStage ?? "Professional",
      longTermGoal: (p as any).longTermGoal ?? "",
      currentRoleStartDate: (p as any).currentRoleStartDate ?? "",
      profilePicture: p.profilePicture ?? "",
      bio: p.bio ?? "",
      jobTitle: p.jobTitle ?? "",
      company: p.company ?? "",
      education: p.education ?? "",
      location: p.location ?? "",
      email: p.email ?? "",
    };
  };

  const [profile, setProfile] = useState<ModalProfile>(hydrate(currentProfile));
  const [isLoading, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setProfile(hydrate(currentProfile));
    }
  }, [currentProfile, isOpen]);

  const handleInputChange = (field: keyof ModalProfile, value: string) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleProfilePictureChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfile((prev) => ({
          ...prev,
          profilePicture: result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Combine fields back into the main profile object
    // Note: We cast to any to allow saving the extra fields back to context
    const merged: ContextUserProfile = {
      name:
        [profile.firstName, profile.lastName].filter(Boolean).join(" ").trim() ||
        profile.name ||
        "",
      email: profile.email || "",
      profilePicture: profile.profilePicture || "",
      bio: profile.bio || "",
      jobTitle: profile.jobTitle || "",
      company: profile.company || "",
      education: profile.education || "",
      location: profile.location || "",
      // @ts-ignore - Custom fields persistence
      phone: profile.phone,
      skills: profile.skills,
      linkedIn: profile.linkedIn,
      careerStage: profile.careerStage,
      longTermGoal: profile.longTermGoal,
      currentRoleStartDate: profile.currentRoleStartDate,
    };
    onSave(merged);
    setSaving(false);
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newSkill.trim()) {
      e.preventDefault();
      handleAddSkill();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  Complete Your Profile
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  This information will be displayed on your dashboard and matched with jobs.
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-9 w-9 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-full"
              >
                <X size={20} />
              </Button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-10 scrollbar-hide">
              
              {/* --- SECTION 1: IDENTITY & PHOTO --- */}
              <div className="flex flex-col sm:flex-row gap-8 items-start">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative group">
                    <Avatar className="h-28 w-28 border-4 border-white dark:border-zinc-900 shadow-md ring-1 ring-zinc-200 dark:ring-zinc-800">
                      <AvatarImage src={profile.profilePicture || ""} className="object-cover"/>
                      <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-3xl font-bold">
                        {(profile.firstName?.[0] || profile.name?.[0] || "U").toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="text-white w-8 h-8" />
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-8 border-zinc-200 dark:border-zinc-800 rounded-full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-3 h-3 mr-2" />
                    Upload Photo
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                  />
                </div>

                <div className="flex-1 w-full space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profile.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className="bg-zinc-50 dark:bg-zinc-900/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profile.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className="bg-zinc-50 dark:bg-zinc-900/50"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="careerStage" className="flex items-center gap-2">
                      <Globe size={14} className="text-zinc-500" /> Career Stage
                    </Label>
                    <select
                      id="careerStage"
                      value={profile.careerStage}
                      onChange={(e) => handleInputChange("careerStage", e.target.value)}
                      className="flex h-10 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900/50 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300"
                    >
                      <option value="Student">Student / Fresher</option>
                      <option value="Professional">Working Professional</option>
                      <option value="Freelancer">Freelancer</option>
                      <option value="Job Seeker">Job Seeker</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="longTermGoal" className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                      <Target size={14} /> Long-term Goal
                    </Label>
                    <Textarea
                      id="longTermGoal"
                      rows={2}
                      value={profile.longTermGoal}
                      onChange={(e) => handleInputChange("longTermGoal", e.target.value)}
                      placeholder="e.g. Become a lead animator at a top studio..."
                      className="bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30 focus-visible:ring-emerald-500 resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="h-px bg-zinc-100 dark:bg-zinc-800 w-full" />

              {/* --- SECTION 2: PROFESSIONAL & EDUCATION --- */}
              <div className="space-y-5">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 uppercase tracking-wide">
                  <Briefcase size={16} className="text-zinc-500" /> Current Role & Education
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title / Role</Label>
                    <Input
                      id="jobTitle"
                      value={profile.jobTitle}
                      onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                      placeholder="e.g. Animator"
                      className="bg-zinc-50 dark:bg-zinc-900/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company / Organization</Label>
                    <Input
                      id="company"
                      value={profile.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      placeholder="e.g. Disney"
                      className="bg-zinc-50 dark:bg-zinc-900/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentRoleStartDate" className="flex items-center gap-2">
                      <Calendar size={14} className="text-zinc-500"/> Start Date
                    </Label>
                    <Input
                      id="currentRoleStartDate"
                      type="month"
                      value={profile.currentRoleStartDate}
                      onChange={(e) => handleInputChange("currentRoleStartDate", e.target.value)}
                      className="bg-zinc-50 dark:bg-zinc-900/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="education" className="flex items-center gap-2">
                      <GraduationCap size={14} className="text-zinc-500" /> Latest Education
                    </Label>
                    <Input
                      id="education"
                      value={profile.education}
                      onChange={(e) => handleInputChange("education", e.target.value)}
                      placeholder="e.g. IIT Data Science (2021-2025)"
                      className="bg-zinc-50 dark:bg-zinc-900/50"
                    />
                  </div>
                </div>
              </div>

              <div className="h-px bg-zinc-100 dark:bg-zinc-800 w-full" />

              {/* --- SECTION 3: CONTACT DETAILS --- */}
              <div className="space-y-5">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 uppercase tracking-wide">
                  <User size={16} className="text-zinc-500" /> Contact Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail size={14} /> Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="bg-zinc-50 dark:bg-zinc-900/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone size={14} /> Phone
                    </Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+91 98765 43210"
                      className="bg-zinc-50 dark:bg-zinc-900/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location" className="flex items-center gap-2">
                      <MapPin size={14} /> Location
                    </Label>
                    <Input
                      id="location"
                      value={profile.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      placeholder="Mumbai, India"
                      className="bg-zinc-50 dark:bg-zinc-900/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedIn" className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                      <Linkedin size={14} /> LinkedIn Profile
                    </Label>
                    <Input
                      id="linkedIn"
                      value={profile.linkedIn}
                      onChange={(e) => handleInputChange("linkedIn", e.target.value)}
                      placeholder="linkedin.com/in/username"
                      className="bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30 focus-visible:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="h-px bg-zinc-100 dark:bg-zinc-800 w-full" />

              {/* --- SECTION 4: SKILLS --- */}
              <div className="space-y-5">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 uppercase tracking-wide">
                  <Star size={16} className="text-zinc-500" /> Skills & Expertise
                </h3>
                <div className="flex gap-3">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a skill (e.g. Maya, Blender, After Effects)..."
                    className="flex-1 bg-zinc-50 dark:bg-zinc-900/50"
                  />
                  <Button
                    onClick={handleAddSkill}
                    disabled={!newSkill.trim()}
                    className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200"
                  >
                    <Plus size={16} className="mr-2" /> Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {profile.skills.length > 0 ? (
                    profile.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="pl-3 pr-2 py-1 gap-2 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-normal hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 hover:border-red-200 dark:hover:border-red-900 transition-colors cursor-pointer group"
                        onClick={() => handleRemoveSkill(skill)}
                      >
                        {skill}
                        <X size={12} className="opacity-50 group-hover:opacity-100" />
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-zinc-400 italic">
                      Add key skills like '3D Animation', 'Maya', etc.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-5 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
              >
                Skip for Now
              </Button>
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 min-w-[140px]"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-4 h-4 border-2 border-zinc-400 border-t-zinc-100 rounded-full"
                  />
                ) : (
                  <>
                    <Save size={16} className="mr-2" /> Save & Proceed
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProfileSettings;