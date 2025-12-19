"use client";

/**
 * @component CandidateJourneyFlow
 * @description Interactive vertical stepper showcasing the student/candidate workflow
 * with AI-powered career automation features. Uses pulse effects on active steps.
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus,
  FileSearch,
  Video,
  Target,
  MousePointerClick,
  FileSignature,
  Sparkles,
  ChevronDown,
  Check,
} from "lucide-react";
import { GridBackground } from "@/components/grid-background";

// Step data with a neutral brand accent (monochrome-friendly)
const BRAND_GRADIENT = "from-foreground to-foreground/70";

const candidateSteps = [
  {
    id: 1,
    icon: UserPlus,
    title: "Smart Signup & Profiling",
    description:
      "Create your Aureeture account. Upload your resume and define your core expertise areas (Coding, Design, Product). The system prepares your digital twin.",
    gradient: BRAND_GRADIENT,
    glowColor: "emerald",
  },
  {
    id: 2,
    icon: FileSearch,
    title: "Deep Resume Parsing & Data Enrichment",
    description:
      "Our system utilizes Data Enrichment techniques to line-by-line scan your resume. We verify GitHub, LinkedIn, and Portfolio links to extract implicit skills you might have missed.",
    gradient: BRAND_GRADIENT,
    glowColor: "blue",
  },
  {
    id: 3,
    icon: Video,
    title: "GenAI Interview (The Core Differentiator)",
    description:
      "A 20-minute video interview conducted by the Aureeture AI Bot. It asks dynamic questions tailored to your background—assessing not just technical logic, but communication style and behavioral confidence.",
    gradient: BRAND_GRADIENT,
    glowColor: "violet",
    featured: true,
  },
  {
    id: 4,
    icon: Target,
    title: "Auto-Matching & Opportunity Suggestions",
    description:
      "Based on your Resume Data + AI Interview Score, the Aureeture Algorithm automatically matches you to global opportunities. (e.g., 'Your profile is a 95% match for Company X').",
    gradient: BRAND_GRADIENT,
    glowColor: "amber",
  },
  {
    id: 5,
    icon: MousePointerClick,
    title: "One-Click Application",
    description:
      "Apply instantly using your Verified Profile and Interview Transcripts. No repetitive forms.",
    gradient: BRAND_GRADIENT,
    glowColor: "pink",
  },
  {
    id: 6,
    icon: FileSignature,
    title: "Seamless Contract & Payment",
    description:
      "Selected? The platform handles legal contracts and payments to prevent delays or fraud.",
    gradient: BRAND_GRADIENT,
    glowColor: "cyan",
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const pulseVariants = {
  pulse: {
    scale: [1, 1.05, 1],
    opacity: [0.5, 0.8, 0.5],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export function CandidateJourneyFlow() {
  const [activeStep, setActiveStep] = useState(0);
  const [expandedStep, setExpandedStep] = useState<number | null>(2); // GenAI Interview expanded by default

  return (
    <section className="relative py-16 lg:py-20 overflow-hidden">
      {/* Deep tech background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      
      {/* Animated circuit pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit-candidate" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M0 50h40M60 50h40M50 0v40M50 60v40" stroke="currentColor" strokeWidth="0.5" fill="none" />
              <circle cx="50" cy="50" r="3" fill="currentColor" />
              <circle cx="0" cy="50" r="2" fill="currentColor" />
              <circle cx="100" cy="50" r="2" fill="currentColor" />
              <circle cx="50" cy="0" r="2" fill="currentColor" />
              <circle cx="50" cy="100" r="2" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit-candidate)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 lg:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-foreground border border-border mb-6">
            <Sparkles className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Student Workflow</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="block text-foreground">
              From Registration to Launch:
            </span>
            <span className="block text-foreground/80 mt-2">
              Your AI-Automated Career Path
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Experience a zero-friction hiring process where your skills speak louder than your network.
          </p>
        </motion.div>

        {/* Interactive Timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="relative"
        >
          {/* Vertical timeline line */}
          <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-px lg:-translate-x-1/2">
            <div className="absolute inset-0 bg-border" />
            <motion.div
              className="absolute top-0 w-full bg-primary/70"
              style={{ height: `${((activeStep + 1) / candidateSteps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <div className="space-y-6 lg:space-y-8">
            {candidateSteps.map((step, index) => {
              const isActive = index === activeStep;
              const isExpanded = expandedStep === index;
              const isCompleted = index < activeStep;

              return (
                <motion.div
                  key={step.id}
                  variants={itemVariants}
                  className={`relative flex items-start gap-6 lg:gap-0 ${
                    index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
                  onMouseEnter={() => setActiveStep(index)}
                >
                  {/* Timeline node */}
                  <div className="absolute left-8 lg:left-1/2 -translate-x-1/2 z-20">
                    <motion.div
                      className={`relative w-16 h-16 rounded-2xl bg-muted p-[2px] cursor-pointer`}
                      whileHover={{ scale: 1.1 }}
                      onClick={() => setExpandedStep(isExpanded ? null : index)}
                    >
                      {/* Pulse effect for active step */}
                      {isActive && (
                        <motion.div
                          variants={pulseVariants}
                          animate="pulse"
                          className="absolute inset-0 rounded-2xl bg-primary/10 blur-xl"
                        />
                      )}
                      
                      <div className="relative w-full h-full rounded-2xl bg-background/90 backdrop-blur-sm flex items-center justify-center">
                        {isCompleted ? (
                          <Check className="w-6 h-6 text-primary" />
                        ) : (
                          <step.icon className={`w-6 h-6 ${isActive ? "text-foreground" : "text-muted-foreground"}`} />
                        )}
                      </div>
                    </motion.div>
                    
                    {/* Step number badge */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-background border-2 border-border flex items-center justify-center">
                      <span className="text-xs font-bold">{step.id}</span>
                    </div>
                  </div>

                  {/* Content card */}
                  <div
                    className={`ml-24 lg:ml-0 lg:w-[calc(50%-4rem)] ${
                      index % 2 === 0 ? "lg:pr-16" : "lg:pl-16"
                    }`}
                  >
                    <motion.div
                      className={`relative group cursor-pointer overflow-hidden rounded-2xl border transition-all duration-300 ${
                        isActive
                          ? "border-primary/40 bg-card"
                          : "border-border/60 bg-card"
                      } ${step.featured ? "ring-1 ring-primary/20" : ""}`}
                      onClick={() => setExpandedStep(isExpanded ? null : index)}
                      whileHover={{ y: -4 }}
                    >
                      {/* Glassmorphism overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-background/90 to-background/90" />
                      
                      {/* Gradient accent */}
                      <div className="absolute top-0 left-0 right-0 h-px bg-border" />

                      <div className="relative p-6 lg:p-8">
                        {/* Featured badge */}
                        {step.featured && (
                          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-muted border border-border">
                            <span className="text-xs font-semibold text-foreground/80">Core Differentiator</span>
                          </div>
                        )}

                        <h3 className={`text-xl lg:text-2xl font-bold mb-3 transition-colors ${
                          isActive ? "text-foreground" : "text-foreground/80"
                        }`}>
                          {step.title}
                        </h3>

                        <AnimatePresence>
                          <motion.p
                            initial={false}
                            animate={{ height: "auto", opacity: 1 }}
                            className={`text-muted-foreground leading-relaxed ${
                              isExpanded ? "" : "line-clamp-2 lg:line-clamp-none"
                            }`}
                          >
                            {step.description}
                          </motion.p>
                        </AnimatePresence>

                        {/* Expand indicator for mobile */}
                        <div className="flex items-center gap-2 mt-4 lg:hidden">
                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          </motion.div>
                          <span className="text-xs text-muted-foreground">
                            {isExpanded ? "Show less" : "Show more"}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Feature Highlight Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-16 lg:mt-20"
        >
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-muted rounded-3xl blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 lg:p-10">

              <div className="relative flex flex-col lg:flex-row items-center gap-6 text-center lg:text-left">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center">
                    <div className="w-14 h-14 rounded-2xl bg-background flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-muted-foreground" />
                    </div>
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-2xl lg:text-3xl font-bold mb-3 text-foreground">
                    One-Time Interview Policy
                  </h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Clear the AI assessment once, and deploy your result across hundreds of applications. 
                    <span className="text-foreground font-semibold"> Never interview for the same role twice.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}







