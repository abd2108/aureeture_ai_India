"use client";

import React, {
  FC,
  ReactNode,
  useState,
  useMemo,
  useEffect,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Rocket,
  Users,
  Clock,
  Search,
  Code,
  X,
  Award,
  IndianRupee,
  CheckSquare,
  Brain,
  Briefcase,
  Filter,
  LayoutGrid,
  List,
  ChevronDown,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/* ================= WIDGET ================= */

const Widget: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
    className={`bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm ${className}`}
  >
    {children}
  </motion.div>
);

/* ================= TYPES ================= */

type ProjectDifficulty = "Beginner" | "Intermediate" | "Advanced";

type ProjectType =
  | "Internship Project"
  | "Live Project"
  | "Hackathon"
  | "Design Gig";

type BaseProject = {
  id: number;
  title: string;
  company: string;
  duration: string;
  technologies: string[];
  description: string;
  difficulty: ProjectDifficulty;
  aboutCompany: string;
  deliverables: string[];
  learningOutcomes: string[];
};

type InternshipProject = BaseProject & {
  type: "Internship Project";
  stipend: string;
  ppo: boolean;
};

type LiveProject = BaseProject & {
  type: "Live Project";
  budget: number;
};

type DesignGig = BaseProject & {
  type: "Design Gig";
  budget: number;
};

type Hackathon = BaseProject & {
  type: "Hackathon";
  prizePool: number;
};

type Project =
  | InternshipProject
  | LiveProject
  | DesignGig
  | Hackathon;

/* ================= DATA ================= */

const projectsData: Project[] = [
  {
    id: 5,
    type: "Internship Project",
    title: "Aureeture Campus Ambassador Portal",
    company: "Aureeture",
    duration: "10 weeks",
    technologies: ["Next.js", "Tailwind CSS", "Supabase"],
    description:
      "Build a portal for managing the campus ambassador program, including tasks and leaderboards.",
    difficulty: "Intermediate",
    stipend: "₹15,000 / month",
    ppo: true,
    aboutCompany:
      "Aureeture is India’s first GenAI-powered entrepreneurial platform for students.",
    deliverables: [
      "Functional user authentication",
      "Task submission module",
      "Real-time leaderboard",
    ],
    learningOutcomes: [
      "Full-stack development with Next.js",
      "Database management with Supabase",
      "Project management skills",
    ],
  },
  {
    id: 2,
    type: "Live Project",
    title: "AI-Powered Content Summarizer",
    company: "InnovateAI",
    duration: "6 weeks",
    technologies: ["Python", "Hugging Face", "FastAPI"],
    description:
      "Build a web service that summarizes long articles and documents using transformer models.",
    difficulty: "Advanced",
    budget: 40000,
    aboutCompany:
      "InnovateAI is a research lab focused on making cutting-edge AI accessible.",
    deliverables: [
      "REST API for text summarization",
      "Docker deployment",
      "Technical documentation",
    ],
    learningOutcomes: [
      "NLP with Hugging Face",
      "API development",
      "Model deployment",
    ],
  },
  {
    id: 3,
    type: "Design Gig",
    title: "Fintech Landing Page Design",
    company: "PaySphere",
    duration: "2 weeks",
    technologies: ["Figma", "UI/UX", "Webflow"],
    description:
      "Design a high-converting, modern landing page for a fintech startup.",
    difficulty: "Beginner",
    budget: 25000,
    aboutCompany:
      "PaySphere aims to simplify cross-border payments for small businesses.",
    deliverables: [
      "High-fidelity Figma mockups",
      "Clickable prototype",
      "Style guide",
    ],
    learningOutcomes: [
      "UI/UX principles",
      "Conversion-centered design",
      "Figma mastery",
    ],
  },
  {
    id: 6,
    type: "Hackathon",
    title: "Sustainable Tech Hackathon",
    company: "GreenCode",
    duration: "48 hours",
    technologies: ["Any", "Cloud", "APIs"],
    description:
      "Compete to build an innovative solution for environmental sustainability.",
    difficulty: "Advanced",
    prizePool: 100000,
    aboutCompany:
      "GreenCode promotes technology for environmental good.",
    deliverables: [
      "Working prototype",
      "5-minute pitch",
      "Source code",
    ],
    learningOutcomes: [
      "Rapid prototyping",
      "Team collaboration",
      "Pitching",
    ],
  },
];

/* ================= HELPERS ================= */

const getAllowedDifficulties = (score: number): ProjectDifficulty[] => {
  if (score < 800) return ["Beginner"];
  if (score < 1200) return ["Beginner", "Intermediate"];
  return ["Beginner", "Intermediate", "Advanced"];
};

const getDifficultyBadge = (difficulty: ProjectDifficulty) => {
  return "bg-zinc-900/5 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700";
};

/* ================= MODAL ================= */

const ProjectDetailModal: FC<{
  project: Project | null;
  onClose: () => void;
}> = ({ project, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    if (!project) {
      setIsSubmitting(false);
      setHasApplied(false);
    }
  }, [project]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black/60 p-4 flex items-center justify-center"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white dark:bg-zinc-900 rounded-2xl max-w-4xl w-full p-8"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <Badge variant="outline">{project.type}</Badge>
              <h2 className="text-3xl font-bold mt-2">
                {project.title}
              </h2>
              <p className="text-zinc-500">{project.company}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X />
            </Button>
          </div>

          <p className="text-zinc-500 mb-6">{project.description}</p>

          <Button
            className="w-full"
            disabled={isSubmitting || hasApplied}
            onClick={async () => {
              setIsSubmitting(true);
              await new Promise((r) => setTimeout(r, 800));
              setHasApplied(true);
              setIsSubmitting(false);
            }}
          >
            {isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {hasApplied ? "Application submitted" : "Continue"}
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ================= MAIN ================= */

export default function StudentProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] =
    useState<ProjectType | "All">("All");
  const [viewMode, setViewMode] =
    useState<"grid" | "list">("grid");
  const [selectedProject, setSelectedProject] =
    useState<Project | null>(null);

  /** * 🔑 CHANGE: Replaced hardcoded studentScore with state and dynamic fetching logic.
   **/
  const [studentScore, setStudentScore] = useState<number>(0);
  const [isLoadingScore, setIsLoadingScore] = useState(true);

  useEffect(() => {
    const fetchProfileScore = async () => {
      try {
        const response = await fetch('/api/profile/student');
        const result = await response.json();
        if (result.success && result.data?.analytics?.skillScore) {
          setStudentScore(result.data.analytics.skillScore);
        }
      } catch (error) {
        console.error("Failed to fetch student score:", error);
      } finally {
        setIsLoadingScore(false);
      }
    };

    fetchProfileScore();
  }, []);
  /** 🔑 END CHANGE **/

  const filteredProjects = useMemo(() => {
    const allowedDifficulties =
      getAllowedDifficulties(studentScore);

    return projectsData
      .filter(
        (project) =>
          filterType === "All" || project.type === filterType
      )
      .filter((project) =>
        project.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
      .filter((project) =>
        allowedDifficulties.includes(project.difficulty)
      );
  }, [searchTerm, filterType, studentScore]);

  const projectTypes: (ProjectType | "All")[] = [
    "All",
    "Internship Project",
    "Live Project",
    "Hackathon",
    "Design Gig",
  ];

  if (isLoadingScore) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold tracking-tight">
          Real-Time Projects
        </h1>
        {/* Added a small badge to show the score used for filtering */}
        <Badge variant="secondary">Profile Score: {studentScore}</Badge>
      </div>

      <Widget className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Search by project title..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter size={14} />
                {filterType}
                <ChevronDown size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {projectTypes.map((type) => (
                <DropdownMenuItem
                  key={type}
                  onClick={() => setFilterType(type)}
                >
                  {type}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Widget>

      <section
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "flex flex-col gap-4"
        }
      >
        {filteredProjects.map((project) => (
          <Widget key={project.id} className="p-6 flex flex-col">
            <div className="flex-grow">
              <p className="text-sm text-zinc-500">
                {project.company}
              </p>
              <h3 className="text-lg font-semibold">
                {project.title}
              </h3>
              <p className="text-sm text-zinc-500 line-clamp-3">
                {project.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between mb-4 text-sm">
                <span className="flex items-center gap-1">
                  <Clock size={14} /> {project.duration}
                </span>
                <Badge
                  variant="outline"
                  className={getDifficultyBadge(
                    project.difficulty
                  )}
                >
                  {project.difficulty}
                </Badge>
              </div>
              <Button
                className="w-full"
                onClick={() => setSelectedProject(project)}
              >
                View Project
              </Button>
            </div>
          </Widget>
        ))}
      </section>

      {filteredProjects.length === 0 && (
        <div className="text-center py-16 text-zinc-500">
          No projects found for your current profile score.
        </div>
      )}

      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}