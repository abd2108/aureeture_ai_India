"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export interface PathResource {
  title: string;
  provider: string;
  duration: string;
  url?: string;
}

export interface PathOpportunity {
  title: string;
  company: string;
  type: "startup" | "enterprise" | "internship" | "freelance";
  location: string;
  matchPercentage: number;
  description: string;
  skills: string[];
  url?: string;
}

export interface PathAchievement {
  title: string;
  description: string;
  progress?: number;
}

export interface CareerPath {
  id: string;
  category: string;
  title: string;
  description: string;
  timeline: string;
  nextSteps: string[];
  skillGaps: string[];
  resources: PathResource[];
  achievements: PathAchievement[];
  opportunities: PathOpportunity[];
}

interface PathContextValue {
  currentPath: CareerPath;
  setCurrentPath: (path: CareerPath) => void;
}

const DEFAULT_PATH: CareerPath = {
  id: "data-scientist",
  category: "AI/ML",
  title: "Junior AI Engineer",
  description:
    "Break into AI with strong Python, ML foundations, and hands-on projects.",
  timeline: "3-6 months",
  nextSteps: [
    "Complete a mini-project using scikit-learn (classification/regression)",
    "Build a portfolio with 2-3 ML case studies and write-ups",
    "Learn Vector Databases & RAG basics",
  ],
  skillGaps: [
    "Statistics Basics",
    "Model Deployment",
    "Prompt Engineering",
    "Data Cleaning",
  ],
  resources: [
    {
      title: "Hands-On ML with Scikit-Learn, Keras & TF",
      provider: "O'Reilly",
      duration: "2-3 weeks",
    },
    {
      title: "Machine Learning Specialization",
      provider: "Coursera (Andrew Ng)",
      duration: "4-6 weeks",
    },
    {
      title: "LangChain for LLM Apps",
      provider: "YouTube",
      duration: "6 hours",
    },
  ],
  achievements: [
    {
      title: "Python Foundations",
      description: "Completed core Python + NumPy/Pandas.",
    },
    {
      title: "First ML Model",
      description: "Trained and evaluated first supervised model.",
      progress: 70,
    },
  ],
  opportunities: [
    {
      title: "AI Intern",
      company: "Aureeture Labs",
      type: "internship",
      location: "Remote",
      matchPercentage: 88,
      description: "Assist in building internal ML tooling and data pipelines.",
      skills: ["Python", "Pandas", "scikit-learn"],
    },
    {
      title: "LLM App Developer",
      company: "Startup X",
      type: "startup",
      location: "Bengaluru, India",
      matchPercentage: 76,
      description: "Prototype RAG workflows and chatbots for clients.",
      skills: ["TypeScript", "Next.js", "LangChain", "Vector DB"],
    },
    {
      title: "Data Analyst (Junior)",
      company: "Enterprise Co.",
      type: "enterprise",
      location: "Mumbai, India",
      matchPercentage: 69,
      description: "Dashboarding, basic modeling and reporting.",
      skills: ["SQL", "Excel", "Tableau"],
    },
  ],
};

const STORAGE_KEY = "aureeture.path.v1";

const PathContext = createContext<PathContextValue | undefined>(undefined);

export const PathProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState<CareerPath>(DEFAULT_PATH);

  // Load from storage
  useEffect(() => {
    try {
      const raw =
        typeof window !== "undefined"
          ? window.localStorage.getItem(STORAGE_KEY)
          : null;
      if (raw) {
        setCurrentPath(JSON.parse(raw) as CareerPath);
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist to storage
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(currentPath));
      }
    } catch {
      // ignore
    }
  }, [currentPath]);

  return (
    <PathContext.Provider value={{ currentPath, setCurrentPath }}>
      {children}
    </PathContext.Provider>
  );
};

export const usePath = (): PathContextValue => {
  const ctx = useContext(PathContext);
  if (!ctx) throw new Error("usePath must be used within a PathProvider");
  return ctx;
};
