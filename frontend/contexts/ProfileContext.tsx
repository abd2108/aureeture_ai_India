"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

// Types
export interface UserProfile {
  name?: string;
  email: string;
  profilePicture?: string;
  bio?: string;
  jobTitle?: string;
  company?: string;
  education?: string;
  location?: string;
}

interface ProfileContextValue {
  profile: UserProfile;
  updateProfile: (next: Partial<UserProfile>) => void;
  setProfile: (value: UserProfile) => void;
  getDisplayName: () => string;
  getInitials: () => string;
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

const DEFAULT_PROFILE: UserProfile = {
  name: "Innovator",
  email: "user@example.com",
  profilePicture: "",
  bio: "Welcome to Aureeture! Let's turn your brilliant ideas into reality.",
  jobTitle: "Student",
  company: "Aureeture Launchpad",
  education: "B.Tech CSE (2025)",
  location: "Mumbai, India",
};

const STORAGE_KEY = "aureeture.profile.v1";

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
      if (raw) {
        const parsed = JSON.parse(raw) as UserProfile;
        setProfile((p) => ({ ...p, ...parsed }));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      }
    } catch (e) {
      // ignore
    }
  }, [profile]);

  const updateProfile = (next: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...next }));
  };

  const getDisplayName = useMemo(
    () => () => {
      if (profile.name && profile.name.trim().length > 0) {
        return profile.name.split(" ")[0];
      }
      if (profile.email) {
        const part = profile.email.split("@")[0];
        return part.charAt(0).toUpperCase() + part.slice(1);
      }
      return "Innovator";
    },
    [profile.name, profile.email]
  );

  const getInitials = useMemo(
    () => () => {
      if (profile.name && profile.name.trim().length > 0) {
        const parts = profile.name.trim().split(" ");
        const first = parts[0]?.charAt(0) ?? "I";
        const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
        return (first + last).toUpperCase();
      }
      const first = (profile.email?.charAt(0) || "I").toUpperCase();
      return first;
    },
    [profile.name, profile.email]
  );

  const value: ProfileContextValue = {
    profile,
    updateProfile,
    setProfile,
    getDisplayName,
    getInitials,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

export const useProfile = (): ProfileContextValue => {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error("useProfile must be used within a ProfileProvider");
    }
  return ctx;
};
