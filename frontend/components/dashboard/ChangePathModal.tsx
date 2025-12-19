"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Briefcase,
  Rocket,
  BarChart3,
  Code,
  Brain,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  Loader2,
  Plus,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePath, CareerPath } from "@/contexts/PathContext";
import { cn } from "@/lib/utils";

interface ChangePathModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Configuration for icons and styling
const pathConfig: Record<string, { icon: React.ElementType, color: string, bgColor: string, borderColor: string }> = {
  'software-developer': { icon: Code, color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-50 dark:bg-blue-900/20', borderColor: 'border-blue-200 dark:border-blue-800' },
  'ai-startup-founder': { icon: Rocket, color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-50 dark:bg-purple-900/20', borderColor: 'border-purple-200 dark:border-purple-800' },
  'data-scientist': { icon: BarChart3, color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-50 dark:bg-emerald-900/20', borderColor: 'border-emerald-200 dark:border-emerald-800' },
  'product-manager': { icon: Users, color: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-50 dark:bg-orange-900/20', borderColor: 'border-orange-200 dark:border-orange-800' },
  'designer': { icon: Brain, color: 'text-pink-600 dark:text-pink-400', bgColor: 'bg-pink-50 dark:bg-pink-900/20', borderColor: 'border-pink-200 dark:border-pink-800' },
  'consultant': { icon: Briefcase, color: 'text-slate-600 dark:text-slate-400', bgColor: 'bg-slate-50 dark:bg-slate-900/20', borderColor: 'border-slate-200 dark:border-slate-800' },
  'custom': { icon: Sparkles, color: 'text-indigo-600 dark:text-indigo-400', bgColor: 'bg-indigo-50 dark:bg-indigo-900/20', borderColor: 'border-indigo-200 dark:border-indigo-800' }
};

const AVAILABLE_PATHS: CareerPath[] = [
  {
    id: 'software-developer',
    category: 'Software Engineering',
    title: 'Full-Stack Developer',
    description: 'Master modern web development. Build scalable applications using React, Node.js, and cloud infrastructure.',
    timeline: '6-9 months',
    nextSteps: [],
    skillGaps: ['TypeScript', 'System Design', 'Cloud Architecture'],
    resources: [],
    achievements: [],
    opportunities: [],
  },
  {
    id: 'ai-startup-founder',
    category: 'Entrepreneurship',
    title: 'AI Startup Founder',
    description: 'From zero to one. Validate ideas, build MVP prototypes, and launch your own AI-powered venture.',
    timeline: '12+ months',
    nextSteps: [],
    skillGaps: ['Product Strategy', 'GTM & Sales', 'Fundraising'],
    resources: [],
    achievements: [],
    opportunities: [],
  },
  {
    id: 'data-scientist',
    category: 'Data & AI',
    title: 'AI & Data Scientist',
    description: 'Unlock insights from data. Expertise in Machine Learning, Python, and advanced statistical modeling.',
    timeline: '8-12 months',
    nextSteps: [],
    skillGaps: ['Deep Learning', 'MLOps', 'Data Engineering'],
    resources: [],
    achievements: [],
    opportunities: [],
  },
];

const ChangePathModal: React.FC<ChangePathModalProps> = ({ isOpen, onClose }) => {
  const { currentPath, setCurrentPath } = usePath();
  const [selectedPathId, setSelectedPathId] = useState<string>(currentPath.id || 'software-developer');
  const [isChanging, setIsChanging] = useState(false);
  const [customPathTitle, setCustomPathTitle] = useState('');
  const previewRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to preview on mobile when selection changes
  useEffect(() => {
    if (window.innerWidth < 1024 && previewRef.current) {
        // Optional: smooth scroll to preview if needed on mobile selection
    }
  }, [selectedPathId]);

  const handlePathChange = async () => {
    if (selectedPathId === currentPath.id && selectedPathId !== 'custom') {
      onClose();
      return;
    }

    setIsChanging(true);
    // Simulate network delay for UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    let nextPath: CareerPath | undefined;

    if (selectedPathId === 'custom') {
        nextPath = {
            id: 'custom-path-' + Date.now(),
            category: 'Custom Path',
            title: customPathTitle || 'Custom Career Path',
            description: 'Your personalized career journey based on your unique goals.',
            timeline: 'Flexible',
            nextSteps: ['Define Goal', 'Identify Skills'],
            skillGaps: [],
            resources: [],
            achievements: [],
            opportunities: [],
        }
    } else {
        nextPath = AVAILABLE_PATHS.find((p) => p.id === selectedPathId);
    }

    if (nextPath) {
      setCurrentPath(nextPath);
    }
    setIsChanging(false);
    onClose();
  };

  const selectedPathData = selectedPathId === 'custom' 
    ? {
        title: customPathTitle || 'Custom Path',
        description: 'Define your own career trajectory. We will help you identify the necessary skills and milestones.',
        timeline: 'Flexible',
        skillGaps: ['Self-Directed Learning', 'Goal Setting']
      }
    : AVAILABLE_PATHS.find(p => p.id === selectedPathId);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-2 sm:p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative w-full max-w-5xl bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col my-4"
          >
            {/* Header - Fixed */}
            <div className="flex-shrink-0 px-6 py-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 rounded-t-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                    Choose Your Career Path
                  </h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    Select a focus area to update your personalized roadmap.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 -mr-2"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Scrollable Content Container with min-h-0 to fix flex overflow */}
            <div className="flex-1 min-h-0 overflow-hidden relative bg-zinc-50/30 dark:bg-zinc-950">
                <ScrollArea className="h-full">
                    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                        
                        {/* Left Column: Selection */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider px-1">
                                Explore Paths
                            </h3>
                            <div className="space-y-3">
                                {AVAILABLE_PATHS.map((path) => {
                                    const config = pathConfig[path.id] || pathConfig['consultant'];
                                    const Icon = config.icon;
                                    const isSelected = selectedPathId === path.id;
                                    const isCurrent = currentPath.id === path.id;

                                    return (
                                        <div
                                            key={path.id}
                                            onClick={() => !isCurrent && setSelectedPathId(path.id)}
                                            className={cn(
                                                "relative group flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer select-none",
                                                isSelected
                                                    ? cn(config.borderColor, config.bgColor)
                                                    : "border-transparent bg-white dark:bg-zinc-900 hover:border-zinc-200 dark:hover:border-zinc-800 shadow-sm",
                                                isCurrent && "opacity-60 cursor-default bg-zinc-50 dark:bg-zinc-900 grayscale"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-12 h-12 rounded-lg flex items-center justify-center transition-colors shadow-sm",
                                                isSelected ? "bg-white dark:bg-zinc-950" : "bg-zinc-100 dark:bg-zinc-800",
                                                config.color
                                            )}>
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <h4 className={cn(
                                                        "font-semibold text-base truncate",
                                                        isSelected ? "text-zinc-900 dark:text-zinc-50" : "text-zinc-700 dark:text-zinc-300"
                                                    )}>
                                                        {path.title}
                                                    </h4>
                                                    {isCurrent && (
                                                        <Badge variant="secondary" className="text-[10px] h-5 px-1.5">Current</Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-zinc-500 truncate">
                                                    {path.category}
                                                </p>
                                            </div>

                                            <div className="flex-shrink-0">
                                                {isSelected && !isCurrent ? (
                                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                                        <CheckCircle2 className={cn("w-6 h-6", config.color)} />
                                                    </motion.div>
                                                ) : (
                                                    <div className={cn(
                                                        "w-5 h-5 rounded-full border-2 border-zinc-200 dark:border-zinc-700",
                                                        !isCurrent && "group-hover:border-zinc-400"
                                                    )} />
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* Custom Path Card */}
                                <div
                                    onClick={() => setSelectedPathId('custom')}
                                    className={cn(
                                        "relative group flex items-center gap-4 p-4 rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer select-none",
                                        selectedPathId === 'custom'
                                            ? "border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20"
                                            : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 hover:bg-white dark:hover:bg-zinc-900"
                                    )}
                                >
                                    <div className={cn(
                                        "w-12 h-12 rounded-lg flex items-center justify-center transition-colors",
                                        selectedPathId === 'custom' ? "bg-white dark:bg-zinc-950 text-indigo-600" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                                    )}>
                                        <Plus className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-base text-zinc-900 dark:text-zinc-100">Create Custom Path</h4>
                                        <p className="text-sm text-zinc-500">Define your own unique goals</p>
                                    </div>
                                    <div className="flex-shrink-0">
                                        {selectedPathId === 'custom' ? (
                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                                <CheckCircle2 className="w-6 h-6 text-indigo-600" />
                                            </motion.div>
                                        ) : (
                                            <div className="w-5 h-5 rounded-full border-2 border-zinc-300 group-hover:border-zinc-400" />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Preview (Sticky on desktop, stacked on mobile) */}
                        <div className="relative" ref={previewRef}>
                            <div className="lg:sticky lg:top-0 lg:h-full">
                                <Card className={cn(
                                    "h-full border-zinc-200 dark:border-zinc-800 p-6 flex flex-col transition-all duration-300",
                                    selectedPathId === 'custom' ? "bg-indigo-50/50 dark:bg-indigo-900/10" : "bg-white dark:bg-zinc-900"
                                )}>
                                    {selectedPathData ? (
                                        <motion.div 
                                            key={selectedPathId}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="flex flex-col h-full"
                                        >
                                            <div className="mb-6">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <Badge variant="outline" className="bg-white dark:bg-zinc-950">Path Preview</Badge>
                                                    {selectedPathId === 'custom' && <Badge className="bg-indigo-600">Custom</Badge>}
                                                </div>
                                                
                                                {selectedPathId === 'custom' ? (
                                                    <div className="space-y-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor="custom-title" className="text-zinc-700 dark:text-zinc-300 font-semibold">
                                                                Path Title
                                                            </Label>
                                                            <Input 
                                                                id="custom-title"
                                                                placeholder="e.g. Blockchain Developer" 
                                                                value={customPathTitle}
                                                                onChange={(e) => setCustomPathTitle(e.target.value)}
                                                                className="bg-white dark:bg-zinc-950 border-zinc-300 dark:border-zinc-700 text-lg font-medium h-12"
                                                                autoFocus
                                                            />
                                                        </div>
                                                        <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                                                            We will analyze this title to generate a tailored curriculum, suggest mentors, and find relevant job opportunities.
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
                                                            {selectedPathData.title}
                                                        </h3>
                                                        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
                                                            {selectedPathData.description}
                                                        </p>
                                                    </>
                                                )}
                                            </div>

                                            <div className="space-y-6 flex-1">
                                                <div className="flex items-center gap-4 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                                                        <Clock className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Estimated Timeline</p>
                                                        <p className="font-medium text-zinc-900 dark:text-zinc-100">{selectedPathData.timeline}</p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-2">
                                                        <Sparkles className="w-4 h-4 text-amber-500" />
                                                        Key Skills You'll Master
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {selectedPathData.skillGaps.map((skill) => (
                                                            <Badge 
                                                                key={skill} 
                                                                variant="secondary"
                                                                className="px-2.5 py-1 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
                                                            >
                                                                {skill}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Contextual Tip */}
                                            <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                                                <div className="flex gap-3">
                                                    <div className="mt-1">
                                                        <Users className="w-5 h-5 text-zinc-400" />
                                                    </div>
                                                    <p className="text-xs text-zinc-500 leading-relaxed">
                                                        <strong className="text-zinc-800 dark:text-zinc-200">Did you know? </strong> 
                                                        Choosing a structured path increases completion rates by 3x compared to unstructured learning.
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-zinc-400 gap-4">
                                            <div className="w-16 h-16 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
                                                <ArrowRight className="w-8 h-8 opacity-20" />
                                            </div>
                                            <p>Select a path to view details</p>
                                        </div>
                                    )}
                                </Card>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </div>

            {/* Footer - Fixed */}
            <div className="flex-shrink-0 p-4 sm:p-6 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-b-2xl">
              <div className="text-sm text-zinc-500 hidden sm:block">
                {selectedPathId !== currentPath.id ? (
                  <span>
                    Switching from <span className="font-medium text-zinc-900 dark:text-zinc-100">{currentPath.title}</span>
                  </span>
                ) : (
                  <span>Current selection active</span>
                )}
              </div>
              
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  onClick={onClose}
                  disabled={isChanging}
                  className="flex-1 sm:flex-none"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePathChange}
                  disabled={isChanging || (selectedPathId === currentPath.id && selectedPathId !== 'custom') || (selectedPathId === 'custom' && !customPathTitle.trim())}
                  className="flex-1 sm:flex-none gap-2 min-w-[140px]"
                >
                  {isChanging ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      Confirm Change <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ChangePathModal;