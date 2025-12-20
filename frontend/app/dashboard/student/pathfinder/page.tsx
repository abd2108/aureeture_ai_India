"use client";

import React, { FC, ReactNode, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
    ArrowRight, Briefcase, GraduationCap, Lightbulb, Target, Check,
    Award, MapPin, Wrench, Star, Sparkles, Bookmark, Search,
    Zap, Rocket, Loader2, Info, Trophy
} from 'lucide-react';

// --- UI Components (from shadcn/ui or similar) ---
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ChangePathModal from '@/components/dashboard/ChangePathModal';

// --- TYPESCRIPT TYPES ---
type PathStep = { year: number; title: string; institution: string; icon: FC<any>; status: 'completed' | 'future'; };
type Job = { id: string; title: string; company: string; category: 'Startup' | 'Internship' | 'Leadership'; link: string; featured?: boolean; };
type UserStats = { ideas: number; hackathons: number; connections: number; };
type SimpleSkill = { name: string };
type ModalType = 'EDIT_PATH' | 'LAUNCHPAD_INFO' | 'HACKATHON_INFO' | 'JOB_DETAILS' | 'CHANGE_PATH';

// --- MOCK DATA ---
const user = { name: "Rishabh Soni", avatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=Aarav", status: "Aspiring AI Entrepreneur" };
const initialCareerPath: { steps: PathStep[], goal: string } = {
    steps: [
        { year: 2025, title: 'B.Tech CSE', institution: 'IIT Bombay', icon: GraduationCap, status: 'completed' }, 
        { year: 2026, title: 'AI Startup Founder', institution: 'Aureeture Launchpad', icon: Rocket, status: 'future' }
    ],
    goal: "To build a GenAI platform for sustainable farming in India."
};
const skillGaps: SimpleSkill[] = [{ name: 'Financial Modeling' }, { name: 'Pitch Deck Creation' }, { name: 'Market Research' }, { name: 'Agile Project Management' }];
const allJobRecommendations: Job[] = [
    { id: 'job1', title: 'Co-Founder for HealthTech Idea', company: 'Aureeture Launchpad', category: 'Startup', link: '#', featured: true },
    { id: 'job2', title: 'Product Management Intern', company: 'A Fintech Startup', category: 'Internship', link: '#' },
    { id: 'job3', title: 'Campus Ambassador', company: 'Aureeture', category: 'Leadership', link: '#' },
    { id: 'job4', title: 'AI/ML Research Intern', company: 'Tech Innovations Inc.', category: 'Internship', link: '#' }
];
const userStats: UserStats = { ideas: 3, hackathons: 4, connections: 42 };

// --- HELPER & REUSABLE COMPONENTS ---

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

const simulateApiCall = (duration = 1000) => new Promise(resolve => setTimeout(resolve, duration));

// --- INTERACTIVE WIDGETS ---

const ProfileHeader: FC = () => (
    // ... (no changes needed)
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/50"><AvatarImage src={user.avatarUrl} /><AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback></Avatar>
            <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{user.name}</h1>
                <p className="text-muted-foreground">{user.status}</p>
            </div>
        </div>
    </motion.div>
);

const CareerPathTimeline: FC<{ onOpenModal: (type: ModalType, data?: any) => void, careerGoal: string, careerSteps: PathStep[] }> = ({ onOpenModal, careerGoal, careerSteps }) => (
    <Widget className="p-6 md:p-8 flex flex-col lg:flex-row lg:items-center gap-8">
        <div className="flex-grow">
            <CardTitle className="flex items-center gap-2 mb-2"><MapPin size={20} /> My Entrepreneurial Path</CardTitle>
            <CardDescription className="italic mb-6">"{careerGoal}"</CardDescription>
            {/* ... timeline steps mapping ... */}
            {careerSteps.map((step) => (
                <div key={step.year} className={`relative flex items-start gap-4 mb-6 last:mb-0 pl-10 ${step.status === 'completed' ? 'opacity-60' : ''}`}>
                    <div className="absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center bg-muted border">
                        <step.icon className={`w-4 h-4 ${step.status === 'completed' ? 'text-green-500' : 'text-primary'}`} />
                    </div>
                    <div>
                        <p className="font-bold">{step.title} <span className="text-sm font-normal text-muted-foreground">({step.year})</span></p>
                        <p className="text-sm text-muted-foreground">{step.institution}</p>
                    </div>
                </div>
            ))}
        </div>
        <div className="lg:w-1/3 flex-shrink-0 text-center lg:text-left p-6 bg-primary/10 rounded-xl border border-primary/20">
            <h3 className="text-lg font-bold flex items-center gap-2 justify-center lg:justify-start"><Sparkles className="text-primary" size={20}/> Your Next Step</h3>
            <p className="text-muted-foreground mt-1 mb-4">Focus on acquiring foundational startup skills to launch your venture.</p>
             <Button className="w-full bg-gradient-to-r from-primary to-primary/80" onClick={() => onOpenModal('LAUNCHPAD_INFO')}>
                <Info className="w-4 h-4 mr-2" /> Explore Launchpad
            </Button>
             <Button variant="ghost" size="sm" className="mt-2 text-muted-foreground" onClick={() => onOpenModal('CHANGE_PATH')}>
                <Target className="w-4 h-4 mr-2" /> Change Path
            </Button>
        </div>
    </Widget>
);

const RecommendedResources: FC<{ onOpenModal: (type: ModalType, data?: any) => void }> = ({ onOpenModal }) => (
    <Widget className="p-6">
        <CardTitle className="flex items-center gap-2 mb-2"><Lightbulb size={20} /> Recommended Resources</CardTitle>
        <CardDescription>Bridge your skill gaps with Aureeture.</CardDescription>
        <div className="space-y-4 mt-4">
            <Alert className="bg-primary/10 border-primary/20">
                <Zap className="h-4 w-4 text-primary" />
                <AlertTitle>Upcoming Bootcamp!</AlertTitle>
                <AlertDescription>Join 'Idea to MVP in 30 Days' to master product development.</AlertDescription>
            </Alert>
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <p className="font-semibold text-sm">National Innovation Hackathon</p>
                <Button size="sm" variant="ghost" onClick={() => onOpenModal('HACKATHON_INFO')}>Participate</Button>
            </div>
        </div>
    </Widget>
);

const JobRecommendations: FC<{ onOpenModal: (type: ModalType, data?: any) => void }> = ({ onOpenModal }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState<'All' | Job['category']>('All');
    const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
    const [filteredJobs, setFilteredJobs] = useState(allJobRecommendations);

    useEffect(() => {
        let jobs = allJobRecommendations;
        if (activeFilter !== 'All') {
            jobs = jobs.filter(job => job.category === activeFilter);
        }
        if (searchTerm) {
            jobs = jobs.filter(job =>
                job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.company.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredJobs(jobs);
    }, [searchTerm, activeFilter]);

    const handleSave = (jobId: string) => {
        setSavedJobs(prev => {
            const newSet = new Set(prev);
            if (newSet.has(jobId)) {
                newSet.delete(jobId);
            } else {
                newSet.add(jobId);
            }
            return newSet;
        });
    };

    const filters: ('All' | Job['category'])[] = ['All', 'Startup', 'Internship', 'Leadership'];

    return (
        <Widget className="p-6 md:p-8">
            <CardTitle className="flex items-center gap-2 mb-2"><Briefcase size={20} /> Curated Opportunities</CardTitle>
            <CardDescription className="mb-4">Roles and projects matched to your profile.</CardDescription>

            <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search opportunities..." className="pl-9" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <div className="flex gap-2 p-1 bg-muted rounded-md">
                    {filters.map(filter => (
                        <Button key={filter} variant={activeFilter === filter ? 'secondary' : 'ghost'} size="sm" className="flex-1" onClick={() => setActiveFilter(filter)}>
                            {filter}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                {filteredJobs.length > 0 ? filteredJobs.map(job => {
                    const isSaved = savedJobs.has(job.id);
                    return (
                        <div
                            key={job.id}
                            className={`p-4 rounded-lg gap-4 transition-colors flex flex-col sm:flex-row sm:items-start sm:justify-between ${
                                job.featured ? 'bg-primary/10 border border-primary/20' : 'bg-muted/30'
                            }`}
                        >
                            <div className="flex-grow">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <p className="font-semibold leading-snug">{job.title}</p>
                                    {job.featured && <Badge>Featured</Badge>}
                                </div>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {job.company} • {job.category}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 sm:flex-shrink-0 mt-3 sm:mt-0 self-stretch sm:self-center justify-between sm:justify-end">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => handleSave(job.id)}
                                                className="flex-shrink-0"
                                            >
                                                {isSaved ? (
                                                    <Check className="h-4 w-4 text-green-500" />
                                                ) : (
                                                    <Bookmark className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{isSaved ? 'Saved!' : 'Save for later'}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <Button
                                    size="sm"
                                    className="px-4 sm:px-5"
                                    onClick={() => onOpenModal('JOB_DETAILS', { job })}
                                >
                                    Details <ArrowRight className="h-4 w-4 ml-2" />
                                    </Button>
                            </div>
                        </div>
                    );
                }) : <p className="text-center text-muted-foreground py-4">No opportunities match your criteria.</p>}
            </div>
        </Widget>
    );
};

// ... other components like SkillGapAnalysis, StatsAndAchievements remain the same ...
const SkillGapAnalysis: FC = () => (
    <Widget className="p-6">
        <CardTitle className="flex items-center gap-2 mb-2"><Wrench size={20} /> Skill Gap Analysis</CardTitle>
        <CardDescription>For your 'AI Startup Founder' goal.</CardDescription>
        <div className="flex flex-wrap gap-2 mt-4">
            {skillGaps.map(skill => (
                <Badge key={skill.name} variant="outline" className="text-sm py-1 px-3">{skill.name}</Badge>
            ))}
        </div>
    </Widget>
);
const AnimatedStat: FC<{ label: string; value: number }> = ({ label, value }) => {
    const ref = React.useRef(null);
    return (
        <motion.div ref={ref} className="text-center">
            <p className="text-3xl font-bold tracking-tighter">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
        </motion.div>
    );
};
const StatsAndAchievements: FC = () => (
    <Widget className="p-6">
        <CardTitle className="flex items-center gap-2 mb-4"><Star size={20} /> Stats & Achievements</CardTitle>
        <div className="flex justify-around items-center mb-4">
            <AnimatedStat label="Ideas Submitted" value={userStats.ideas} />
            <AnimatedStat label="Hackathons" value={userStats.hackathons} />
            <AnimatedStat label="Connections" value={userStats.connections} />
        </div>
        <Alert className="bg-amber-500/10 border-amber-500/20"><Award className="h-4 w-4 !text-amber-500" /><AlertTitle>Latest Badge</AlertTitle><AlertDescription>Won 'Best Pitch' at Innovate India '25!</AlertDescription></Alert>
    </Widget>
);


// --- MAIN DASHBOARD PAGE ---
const FounderDashboard: FC = () => {
    const [modal, setModal] = useState<{ type: ModalType | null; data?: any }>({ type: null });
    const [careerPath, setCareerPath] = useState(initialCareerPath);
    const [isSaving, setIsSaving] = useState(false);

    const handleOpenModal = (type: ModalType, data: any = {}) => setModal({ type, data });
    const handleCloseModal = () => setModal({ type: null });

    const handleUpdateGoal = async (newGoal: string) => {
        setIsSaving(true);
        await simulateApiCall();
        setCareerPath(prev => ({ ...prev, goal: newGoal }));
        setIsSaving(false);
        handleCloseModal();
    };

    return (
        <div className="space-y-6">
            {/* Page header (aligned with Mentorship page) */}
            <div>
                <h1 className="text-xl font-semibold tracking-tight">Path Finder</h1>
                <p className="text-sm text-zinc-500">
                    Navigate your career journey with a guided, AI-powered roadmap tailored to your goals.
                </p>
            </div>

            <main className="space-y-8">
                <ProfileHeader />
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-4"><CareerPathTimeline onOpenModal={handleOpenModal} careerGoal={careerPath.goal} careerSteps={careerPath.steps} /></div>
                    <div className="lg:col-span-2"><SkillGapAnalysis /></div>
                    <div className="lg:col-span-2"><RecommendedResources onOpenModal={handleOpenModal} /></div>
                    <div className="lg:col-span-2"><StatsAndAchievements /></div>
                    <div className="lg:col-span-2"><JobRecommendations onOpenModal={handleOpenModal} /></div>
                </div>
            </main>

            {/* --- MODALS --- */}
            <Dialog open={modal.type === 'EDIT_PATH'} onOpenChange={handleCloseModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Your Entrepreneurial Goal</DialogTitle>
                        <DialogDescription>What is the new vision you're working towards?</DialogDescription>
                    </DialogHeader>
                    <Textarea defaultValue={modal.data?.currentGoal} id="goal-input" className="my-4" />
                    <Button onClick={() => handleUpdateGoal((document.getElementById('goal-input') as HTMLTextAreaElement).value)} disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </DialogContent>
            </Dialog>

            <Dialog open={modal.type === 'LAUNCHPAD_INFO'} onOpenChange={handleCloseModal}>
                <DialogContent>
                    <DialogHeader><DialogTitle className="flex items-center gap-2"><Rocket /> The Aureeture Launchpad</DialogTitle></DialogHeader>
                    <p className="text-muted-foreground">A guided ecosystem designed to take your idea from concept to reality. As part of the Launchpad, you get:</p>
                    <ul className="list-disc pl-5 space-y-2 mt-4 text-sm">
                        <li><b>Experiential Curriculum:</b> Learn by doing with real-world projects.</li>
                        <li><b>Industry Mentorship:</b> Get guidance from seasoned entrepreneurs.</li>
                        <li><b>Idea Accelerators:</b> Fast-track your startup's development.</li>
                        <li><b>Founder's Club Access:</b> Network with a community of innovators.</li>
                    </ul>
                </DialogContent>
            </Dialog>

            <Dialog open={modal.type === 'HACKATHON_INFO'} onOpenChange={handleCloseModal}>
                <DialogContent>
                    <DialogHeader><DialogTitle className="flex items-center gap-2"><Trophy /> National Innovation Hackathon</DialogTitle></DialogHeader>
                    <p>Join the brightest minds to solve real-world problems using technology. Winners get mentorship, funding opportunities, and national recognition.</p>
                    <div className="text-sm mt-4 space-y-1">
                        <p><b>Dates:</b> Oct 15 - Oct 17, 2025</p>
                        <p><b>Location:</b> Pune, Maharashtra</p>
                        <p><b>Prizes:</b> Up to ₹5,00,000 in seed funding.</p>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={modal.type === 'JOB_DETAILS'} onOpenChange={handleCloseModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{modal.data?.job?.title}</DialogTitle>
                        <DialogDescription>{modal.data?.job?.company} • {modal.data?.job?.category}</DialogDescription>
                    </DialogHeader>
                    <p className="mt-4">
                        This is a premier {modal.data?.job?.category.toLowerCase()} opportunity for aspiring entrepreneurs on the Aureeture platform.
                        We are seeking a dynamic individual to join a promising {modal.data?.job?.company.toLowerCase()}.
                    </p>
                </DialogContent>
            </Dialog>

            {/* Global Change Path modal from dashboard/ChangePathModal.tsx */}
            <ChangePathModal
                isOpen={modal.type === 'CHANGE_PATH'}
                onClose={handleCloseModal}
            />
        </div>
    );
};

export default FounderDashboard;