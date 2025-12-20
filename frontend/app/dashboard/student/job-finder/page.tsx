"use client";

import React, { FC, ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Briefcase, MapPin, Clock, DollarSign, Bookmark, ArrowRight, 
  Search, Zap, Trophy, Building, TrendingUp, Mail, Paperclip,
  Filter, LayoutGrid, List, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// UPDATED IMPORT: Added TooltipProvider
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { 
    Dialog, DialogContent, DialogHeader, DialogTitle, 
    DialogDescription, DialogFooter 
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// --- WIDGET WRAPPER COMPONENT ---
const Widget: FC<{ children: ReactNode; className?: string }> = ({
  children,
  className,
}) => (
    <motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
    className={`bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm h-full ${className}`}
    >
        {children}
    </motion.div>
);

// --- TYPESCRIPT TYPES & MOCK DATA ---
type Job = {
    id: number;
    title: string;
    company: string;
    logoUrl: string;
    location: string;
    type: 'Full-time' | 'Contract' | 'Internship';
    salary: string;
    skills: string[];
    postedDate: string;
    matchScore: number;
    featured?: boolean;
};

const allJobs: Job[] = [
    {
        id: 1,
        title: "Senior Frontend Developer",
        company: "Aureeture",
        logoUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Aureeture",
        location: "Pune, India",
        type: "Full-time",
        salary: "₹18-25 LPA",
        skills: ["React", "TypeScript", "GenAI APIs", "Next.js"],
        postedDate: "2h ago",
        matchScore: 95,
        featured: true,
    },
    {
        id: 2,
        title: "Full Stack Developer",
        company: "Fintech Innovations",
        logoUrl: "https://api.dicebear.com/7.x/shapes/svg?seed=Fintech",
        location: "Mumbai (Remote)",
        type: "Full-time",
        salary: "₹12-20 LPA",
        skills: ["Node.js", "React", "MongoDB", "AWS"],
        postedDate: "1 day ago",
        matchScore: 88,
    },
    {
        id: 3,
        title: "Product Design Intern",
        company: "HealthTech Startup",
        logoUrl: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Health",
        location: "Bangalore",
        type: "Internship",
        salary: "₹30-50k /month",
        skills: ["Figma", "UI/UX", "User Research"],
        postedDate: "3 days ago",
        matchScore: 82,
    }
];

const currentUser = {
    name: "Aarav Sharma",
    email: "aarav.sharma@email.com",
    resume: "Aarav_Sharma_Resume_2025.pdf",
    headline: "Aspiring AI Entrepreneur | B.Tech CSE"
};

// --- MODAL COMPONENT ---
const ApplyModal: FC<{ job: Job | null; user: typeof currentUser; onClose: () => void; }> = ({ job, user, onClose }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!job) return null;

    const handleSubmit = () => {
        setIsSubmitting(true);
        setTimeout(() => {
            alert(`Successfully applied for ${job.title} at ${job.company}!`);
            setIsSubmitting(false);
            onClose();
        }, 1500);
    };

    return (
        <Dialog open={!!job} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Apply to {job.title}</DialogTitle>
                    <DialogDescription>Your profile will be shared with {job.company}.</DialogDescription>
                </DialogHeader>
                <div className='space-y-4 py-4'>
                    <div className='flex items-center gap-4 p-4 bg-muted rounded-lg'>
                        <Avatar className="h-16 w-16 border"><AvatarImage src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${user.name}`} /><AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback></Avatar>
                        <div>
                            <h4 className='font-semibold text-lg'>{user.name}</h4>
                            <p className='text-sm text-muted-foreground'>{user.headline}</p>
                        </div>
                    </div>
                    <div className='space-y-2 text-sm'>
                         <p className='flex items-center gap-2'><Mail size={16} className='text-muted-foreground'/>{user.email}</p>
                         <p className='flex items-center gap-2'><Paperclip size={16} className='text-muted-foreground'/>{user.resume}</p>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

// --- JOB CARD SUB-COMPONENT (STYLED LIKE PERSONCARD) ---
const JobCard: FC<{ job: Job; index: number; onApplyClick: (job: Job) => void }> = ({ job, index, onApplyClick }) => {
  const getMatchScoreClass = () =>
    "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700";

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between p-4"
        >
            <div className="flex items-start gap-4">
                <Avatar className="w-12 h-12 border">
                    <AvatarImage src={job.logoUrl} />
                    <AvatarFallback>{job.company.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold">{job.title}</h4>
            <Badge variant="outline" className={getMatchScoreClass()}>
                            {job.matchScore}% Match
                        </Badge>
                        {job.featured && <Badge>Top Opportunity</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1"><Building className="w-3.5 h-3.5" /> {job.company}</p>
                    <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                        <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                        <span className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" /> {job.salary}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {job.postedDate}</span>
                    </div>
                    <div className="flex gap-2 mt-2 flex-wrap">
                        {job.skills.map((skill) => (
                            <Badge key={skill} variant="secondary">{skill}</Badge>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex gap-2 mt-4 sm:mt-0 self-end sm:self-center">
                <Tooltip><TooltipTrigger asChild><Button size="icon" variant="outline" className="rounded-full"><Bookmark className="w-4 h-4" /></Button></TooltipTrigger><TooltipContent><p>Save Job</p></TooltipContent></Tooltip>
                <Button className="rounded-full" onClick={() => onApplyClick(job)}>
                    Apply Now <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </motion.div>
    );
};

// --- MAIN PAGE COMPONENT ---
const JobFinderPage: FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
    const [filteredJobs, setFilteredJobs] = useState<Job[]>(allJobs);
    const [applyingForJob, setApplyingForJob] = useState<Job | null>(null);
  const [typeFilter, setTypeFilter] = useState<"All" | Job["type"]>("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  // Effect to filter jobs when search term or filters change
    useEffect(() => {
        const lowercasedTerm = searchTerm.toLowerCase();
    let jobs = allJobs;

    if (typeFilter !== "All") {
      jobs = jobs.filter((job) => job.type === typeFilter);
    }

    if (lowercasedTerm !== "") {
      jobs = jobs.filter(
        (job) =>
                job.title.toLowerCase().includes(lowercasedTerm) ||
                job.company.toLowerCase().includes(lowercasedTerm) ||
          job.skills.some((skill) =>
            skill.toLowerCase().includes(lowercasedTerm)
          )
            );
        }

    setFilteredJobs(jobs);
  }, [searchTerm, typeFilter]);
    
    return (
    // WRAPPER ADDED: TooltipProvider prevents the runtime error
        <TooltipProvider>
      <div className="space-y-6">
        {/* Page header (aligned with Mentorship page) */}
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Explore Opportunities</h1>
          <p className="text-sm text-zinc-500">
            Discover curated roles and internships matched to your skills, interests, and current career path.
          </p>
        </div>

        <main className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <Widget className="lg:col-span-4 p-6">
                            <div className="grid md:grid-cols-2 gap-6 items-center">
                                <div className="lg:col-span-2">
                                    <h3 className="font-semibold mb-2">Find Your Next Opportunity</h3>
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full sm:max-w-xs">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                        <Input
                                            placeholder="Search by title, company, or skills..."
                        className="pl-9 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-lg focus-visible:ring-zinc-400"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="h-9 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 gap-2"
                          >
                            <Filter size={14} />
                            {typeFilter === "All" ? "All" : typeFilter}
                            <ChevronDown size={14} className="opacity-50" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => setTypeFilter("All")}>
                            All
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setTypeFilter("Full-time")}>
                            Full-time
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setTypeFilter("Contract")}>
                            Contract
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setTypeFilter("Internship")}>
                            Internship
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <div className="h-9 border border-zinc-200 dark:border-zinc-800 rounded-md flex p-0.5 bg-white dark:bg-zinc-900">
                        <button
                          onClick={() => setViewMode("grid")}
                          className={`px-2.5 rounded-sm flex items-center justify-center transition-all ${
                            viewMode === "grid"
                              ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm"
                              : "text-zinc-400"
                          }`}
                        >
                          <LayoutGrid size={16} />
                        </button>
                        <button
                          onClick={() => setViewMode("list")}
                          className={`px-2.5 rounded-sm flex items-center justify-center transition-all ${
                            viewMode === "list"
                              ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm"
                              : "text-zinc-400"
                          }`}
                        >
                          <List size={16} />
                        </button>
                      </div>
                    </div>
                                    </div>
                                </div>

                            </div>
                        </Widget>

                        <Widget className="lg:col-span-4 p-6">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                <Briefcase size={22} />
                Suggested Opportunities
              </h2>
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 gap-4"
                    : "space-y-4"
                }
              >
                                <AnimatePresence>
                                    {filteredJobs.length > 0 ? (
                                        filteredJobs.map((job, index) => (
                                            <JobCard
                                                key={job.id}
                                                job={job}
                                                index={index}
                                                onApplyClick={() => setApplyingForJob(job)}
                                            />
                                        ))
                                    ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No opportunities found matching your search.
                    </p>
                                    )}
                                </AnimatePresence>
                            </div>
                        </Widget>
                    </div>
                </main>

                <ApplyModal
                    job={applyingForJob}
                    user={currentUser}
                    onClose={() => setApplyingForJob(null)}
                />
            </div>
        </TooltipProvider>
    );
};

export default JobFinderPage;