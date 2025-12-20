// /app/page.tsx
"use client";

/**
 * @fileoverview AureetureAI Platform Landing Page
 * @description
 * ## Engineering Note:
 * This file consolidates all platform journey components into a single file.
 * The content has been updated to reflect the full AureetureAI ecosystem, including the
 * student and enterprise pathways. TypeScript types are used for all data structures.
 *
 * ## UI/UX Philosophy: "Clarity & Momentum"
 * The design uses a professional color palette, modern typography, and subtle animations
 * to create a trustworthy and premium user experience, reflecting the high quality
 * of the Aureeture program.
 */

//================================================================//
//  IMPORTS
//================================================================//
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button"
import { GridBackground } from "@/components/grid-background"
import { motion, useReducedMotion, easeInOut, easeOut } from "framer-motion"
import { Sparkles, Users, Zap, Target, TrendingUp, Award, Building2, Briefcase, ArrowRight, CheckCircle, Star, Globe, Rocket, Shield, BookOpen, ShieldCheck, DollarSign, FileSignature, UserCheck, Bot, Route, FolderKanban, Map, Network } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { LeadModal } from "@/components/ui/lead-modal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// New Landing Page Sections
import {
  CandidateJourneyFlow,
  RecruiterIntelligenceGrid,
  AIEngineSpecs,
  TrustAndTransparency,
} from "@/components/landing-page-sections";

//================================================================//
//  TYPE DEFINITIONS
//================================================================//
interface JourneyStep {
    level: string;
    title: string;
    description: string;
    icon: LucideIcon;
    points: string[];
}

interface EnterpriseStep {
    icon: LucideIcon;
    title: string;
    description: string;
}

interface EcosystemFeature {
    icon: LucideIcon;
    title: string;
    forStudents: string;
    forEnterprises: string;
}

interface StudentFeature {
    icon: LucideIcon;
    title: string;
    description: string;
    benefits: string[];
    color: string;
}

//================================================================//
//  ANIMATION VARIANTS
//================================================================//
const FADE_IN_UP = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
};

const STAGGER_CONTAINER = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
        },
    },
};

const DRAW_SVG = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
        pathLength: 1, 
        opacity: 1,
        transition: { 
            pathLength: { duration: 1.5, ease: easeInOut },
            opacity: { duration: 0.5 }
        }
    },
};

//================================================================//
//  STATIC DATA
//================================================================//

// Data for the Student Journey Section
const studentJourneyData: JourneyStep[] = [
    {
        level: "1",
        title: "The Proving Ground",
        description: "Build your proof-of-work with real industry projects, establishing your skills and credibility from day one.",
        icon: ShieldCheck,
        points: [
            "Verified Onboarding: Create a professional, KYC-verified portfolio.",
            "Real Industry Projects: Engage with mentored challenges to build foundational skills.",
            "Dynamic Performance Score: Earn a score reflecting your reliability and quality of work.",
        ],
    },
    {
        level: "2",
        title: "The Freelance Arena",
        description: "Unlock paid gigs in a student-first marketplace with reduced competition and secure payments.",
        icon: DollarSign,
        points: [
            "Access Paid Gigs: High performance unlocks the freelance marketplace.",
            "Secure Escrow Payments: All project funds are secured upfront.",
            "Build Your Reputation: Client reviews boost your score and attract better projects.",
        ],
    },
    {
        level: "3",
        title: "The Career Launchpad",
        description: "Gain exclusive access to premium internships and full-time jobs reserved for top-performing talent.",
        icon: Rocket,
        points: [
            "Become 'Top 5% Talent': Consistently high scores grant you elite status.",
            "Exclusive Opportunities: Access internships and jobs not available elsewhere.",
            "AI-Powered Matching: Get matched with roles that align perfectly with your proven skills.",
        ],
    },
];

// Data for the Enterprise Journey Section
const enterpriseJourneyData: EnterpriseStep[] = [
    { icon: FileSignature, title: "Post an Opportunity", description: "Create a detailed project listing with clear scope, deliverables, and budget to attract the right student talent." },
    { icon: UserCheck, title: "Vet & Hire Proven Talent", description: "Engage with students based on their dynamic Performance Score—investing in demonstrated ability, not just a resume." },
    { icon: Briefcase, title: "Seamless Project Management", description: "Manage projects and provide feedback through the platform, with secure escrow payments protecting every transaction." },
    { icon: TrendingUp, title: "Build Your Talent Pipeline", description: "Use freelance gigs as low-risk trials and seamlessly transition impressive students into internships or full-time roles." },
];

// Data for the Ecosystem Engine Section
const ecosystemFeaturesData: EcosystemFeature[] = [
    { icon: Bot, title: "CARO (AI Assistant)", forStudents: "A mentor-bot providing personalized guidance.", forEnterprises: "AI tools to help craft the perfect project brief." },
    { icon: Route, title: "Pathfinder", forStudents: "Explores career transitions and shows skill gaps.", forEnterprises: "Provides insights into the available talent pool." },
    { icon: FolderKanban, title: "Real-Time Project Hub", forStudents: "Central marketplace for all projects and jobs.", forEnterprises: "Single portal to post opportunities and manage talent." },
];

// Data for Student-Specific Features Section

//================================================================//
//  REUSABLE COMPONENTS
//================================================================//

// GridBackground is imported from @/components/grid-background

//================================================================//
//  SECTIONAL COMPONENTS
//================================================================//

// Extracted left side content of the Hero section to ensure a clean JSX boundary
const LeftHeroContent = ({ onOpenLead }: { onOpenLead: () => void }) => (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={STAGGER_CONTAINER}
      className="text-left space-y-8"
    >
      <motion.div variants={FADE_IN_UP}>
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 text-sm font-medium mb-6">
          <Sparkles className="size-4" />
          <span>TRUSTED By</span>
          <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-bold">
            10k+ STUDENTS
          </span>
        </div>
      </motion.div>
      
      <motion.h1
        variants={FADE_IN_UP}
        className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-foreground leading-tight max-w-2xl"
      >
        Discover the joy of career building with the
        <span className="block mt-2 text-foreground/80">
        world's first AI-powered career + ecosystem.
        </span>
      </motion.h1>
      
      <motion.p
        variants={FADE_IN_UP}
        className="text-xl text-muted-foreground max-w-2xl leading-relaxed"
      >
        A transparent meritocracy where every step is measurable, performance-based, and tailored to ensure that effort translates into real career outcomes.
      </motion.p>
      
      <motion.div variants={FADE_IN_UP} className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto max-w-md sm:max-w-none">
        <Button size="lg" onClick={onOpenLead} className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold rounded-full">
          Start Your Journey
        </Button>
        <Button asChild size="lg" variant="outline" className="border-2 border-foreground text-foreground hover:bg-foreground hover:text-background w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold rounded-full">
          <a href="https://cal.com/aureetureai-india/30min" target="_blank" rel="noopener noreferrer">Book Free 1:1 Workshop</a>
        </Button>
      </motion.div>
    </motion.div>
  );

const HeroSection = ({ onOpenLead }: { onOpenLead: () => void }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;
        // Increase playback speed (adjust as needed)
        v.playbackRate = 1.5;
        // Ensure autoplay starts when possible
        const tryPlay = () => v.play().catch(() => {});
        if (v.readyState >= 2) {
            tryPlay();
        } else {
            const onCanPlay = () => {
                tryPlay();
                v.removeEventListener('canplay', onCanPlay);
            };
            v.addEventListener('canplay', onCanPlay);
        }
    }, []);

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 sm:pt-24 lg:pt-28">
            <GridBackground className="absolute inset-0" />
            
            {/* Moving Text Background */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden opacity-5 reduce-motion">
                <motion.div
                    animate={{ x: [-2000, 2000] }}
                    transition={{ 
                        duration: 30, 
                        repeat: Infinity, 
                        ease: (t: number) => t,
                        repeatType: "loop"
                    }}
                    className="whitespace-nowrap text-[6rem] sm:text-[10rem] md:text-[14rem] lg:text-[20rem] font-bold text-foreground select-none"
                >
                    Build Launch Succeed • Build Launch Succeed • Build Launch Succeed •
                </motion.div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Side - Text Content */}
                    <LeftHeroContent onOpenLead={onOpenLead} />
                    
                    {/* Right Side - Video Section */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="relative"
                    >
                        <div className="relative bg-card/20 backdrop-blur-sm border border-border/30 rounded-3xl p-6 shadow-2xl">
                            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden">
                                {/* Embedded Demo Video */}
                                <video
                                    ref={videoRef}
                                    className="absolute inset-0 w-full h-full object-contain bg-black"
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    preload="metadata"
                                    poster="/placeholder.jpg"
                                >
                                    <source src="https://res.cloudinary.com/dpisgqkxx/video/upload/v1758457882/Demo_h2jk5s.mp4" type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                            
                            {/* Profile Badge */}
                            <div className="absolute -bottom-4 -right-4 bg-card border border-border rounded-full p-2 shadow-lg">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Users className="w-6 h-6 text-primary" />
                                </div>
                            </div>
                        </div>

                        {/* Floating Elements */}
                        <motion.div
                            animate={{ y: [-10, 10, -10] }}
                            transition={{ duration: 4, repeat: Infinity, ease: easeInOut }}
                            className="absolute -top-8 -left-8 w-16 h-16 bg-primary/20 rounded-full blur-xl"
                        />
                        <motion.div
                            animate={{ y: [10, -10, 10] }}
                            transition={{ duration: 6, repeat: Infinity, ease: easeInOut }}
                            className="absolute -bottom-8 -right-8 w-24 h-24 bg-accent/20 rounded-full blur-xl"
                        />
                    </motion.div>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-20 left-20 w-2 h-2 bg-primary rounded-full animate-pulse" />
            <div className="absolute top-40 right-32 w-2 h-2 bg-accent rounded-full animate-pulse delay-1000" />
            <div className="absolute bottom-32 left-32 w-2 h-2 bg-primary rounded-full animate-pulse delay-500" />
        </section>
    );
};

// Enhanced Student Features data and components (updated per request)
const studentFeaturesData = [
  {
    icon: Bot,
    title: "CARO (AI Assistant)",
    description: "Personal mentor-bot that provides step-by-step career guidance, project recommendations, and feedback.",
    benefits: ["Task-by-task guidance", "Project feedback", "24/7 assistance"],
    color: "from-yellow-500 to-orange-500"
  },
  {
    icon: Route,
    title: "Pathfinder",
    description: "Visual roadmap showing career transitions, skill gaps, and required projects to advance.",
    benefits: ["Transition paths", "Gap analysis", "Actionable steps"],
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: FolderKanban,
    title: "Real-Time Project Hub",
    description: "Central marketplace for unpaid projects, freelance gigs, internships, and jobs.",
    benefits: ["Single project feed", "Live updates", "Seamless applications"],
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Map,
    title: "Personalized Roadmaps",
    description: "AI-adaptive career journeys that evolve with each project and performance milestone.",
    benefits: ["Adaptive plan", "Milestone tracking", "Skill growth"],
    color: "from-green-500 to-teal-500"
  },
  {
    icon: Network,
    title: "Networking (People Finder)",
    description: "Curated connections with peers, alumni, and industry mentors (with LinkedIn integration).",
    benefits: ["Curated matches", "Alumni network", "Mentor access"],
    color: "from-indigo-500 to-purple-500"
  },
  {
    icon: TrendingUp,
    title: "Verified Performance Score",
    description: "Dynamic score reflecting reliability and quality—auto-updates with project outcomes and feedback.",
    benefits: ["Proof-of-work", "Client-backed ratings", "Trust & visibility"],
    color: "from-orange-500 to-red-500"
  }
];

// Enhanced animation variants
const ENHANCED_FADE_IN_UP = {
  hidden: { 
    opacity: 0, 
    y: 40,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.6,
      ease: easeInOut
    }
  }
};

const CARD_HOVER = {
  hover: {
    y: -8,
    transition: { duration: 0.3, ease: easeOut }
  }
};

interface FeatureCardProps {
  feature: StudentFeature;
  index: number;
  isHovered: boolean;
  onHover: (index: number) => void;
  onLeave: () => void;
}

const FeatureCard = ({ feature, index, isHovered, onHover, onLeave }: FeatureCardProps) => {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div
      variants={ENHANCED_FADE_IN_UP}
      whileHover={!prefersReducedMotion ? CARD_HOVER.hover : {}}
      onHoverStart={() => onHover(index)}
      onHoverEnd={onLeave}
      className="group relative bg-card backdrop-blur-sm border border-border rounded-3xl p-8 text-left transition-all duration-500 hover:border-primary/40 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20 overflow-hidden"
      role="article"
      tabIndex={0}
      aria-labelledby={`feature-title-${index}`}
      aria-describedby={`feature-description-${index}`}
    >
      {/* Gradient background effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
      
      {/* Icon with enhanced styling */}
      <div className="relative mb-6">
        <div className={`inline-flex p-4 rounded-2xl bg-primary/10 shadow-lg`}>
          <feature.icon 
            className="size-8 text-white" 
            aria-hidden="true"
          />
        </div>
        {/* Subtle glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-primary/5 blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
      </div>

      <div className="relative z-10">
        <h3 
          id={`feature-title-${index}`}
          className="text-2xl font-bold text-foreground mb-4 group-hover:text-foreground transition-colors duration-300"
        >
          {feature.title}
        </h3>
        
        <p 
          id={`feature-description-${index}`}
          className="text-muted-foreground leading-relaxed mb-6 text-lg"
        >
          {feature.description}
        </p>

        {/* Benefits list with smooth reveal */}
        <motion.ul 
          className="space-y-2 mb-6"
          initial={{ opacity: 0, height: 0 }}
          animate={{ 
            opacity: isHovered ? 1 : 0.7, 
            height: "auto"
          }}
          transition={{ duration: 0.3 }}
        >
          {feature.benefits.map((benefit: string, benefitIndex: number) => (
            <motion.li 
              key={benefit}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: benefitIndex * 0.1 + 0.2 }}
              className="flex items-center text-sm text-muted-foreground"
            >
              <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${feature.color} mr-3 flex-shrink-0`} />
              {benefit}
            </motion.li>
          ))}
        </motion.ul>

        {/* Subtle call-to-action */}
        <div className="flex items-center text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
          <span>Learn more</span>
          <ArrowRight className="ml-2 size-4 transform group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </div>
    </motion.div>
  );
};

const StudentJourneySection = () => (
    <section id="student-journey" className="section bg-background scroll-mt-28">
        <div className="section-container">
            {/* Section Header */}
            <motion.div
                variants={FADE_IN_UP}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                className="text-center mb-20"
            >
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 text-sm font-medium mb-6">
                    🌱
                    <span>The Student Journey</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold font-heading text-foreground mb-4">
                    Your Pathway from Idea to Impact
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                    A transparent meritocracy where every step is measurable, performance-based, and tailored to ensure your effort translates into real career outcomes.
                </p>
            </motion.div>

            {/* Journey Steps Container */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={STAGGER_CONTAINER}
                className="relative"
            >
                {/* Vertical line for mobile view */}
                <div className="absolute left-6 top-6 h-full w-0.5 bg-border -translate-x-1/2 lg:hidden" aria-hidden="true" />

                <div className="flex flex-col lg:flex-row lg:justify-between gap-16 lg:gap-8">
                    {studentJourneyData.map((step, index) => (
                        <motion.div
                            key={step.level}
                            variants={FADE_IN_UP}
                            className="flex-1 flex items-start gap-6 lg:gap-0 lg:flex-col lg:items-center group"
                        >
                            {/* --- Card & Content --- */}
                            <div className="flex-1 relative">
                                {/* Dot on the timeline for mobile */}
                                <div className="lg:hidden absolute -left-0 top-1 w-6 h-6 bg-background border-2 border-primary rounded-full flex items-center justify-center -translate-x-1/2">
                                    <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>
                                </div>

                                {/* The Card */}
                                <div className="relative bg-background/80 backdrop-blur-sm border border-border/80 rounded-2xl p-6 transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-xl group-hover:shadow-primary/10 group-hover:-translate-y-1">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="bg-primary/10 p-3 rounded-xl border border-primary/20">
                                            <step.icon className="size-6 text-primary" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-primary">LEVEL {step.level}</span>
                                            <h3 className="text-xl font-bold font-heading text-foreground leading-tight">
                                                {step.title}
                                            </h3>
                                        </div>
                                    </div>

                                    <p className="text-muted-foreground mb-5 text-sm leading-relaxed">
                                        {step.description}
                                    </p>
                                    <div className="space-y-2">
                                        {step.points.map((point, pIndex) => (
                                            <div key={pIndex} className="flex items-start gap-2.5">
                                                <svg className="w-4 h-4 text-primary/70 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-xs text-muted-foreground">{point}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            {/* --- Arrow Connector for Desktop --- */}
                            {index < studentJourneyData.length - 1 && (
                                <div className="hidden lg:block lg:mt-6">
                                    <motion.svg
                                        width="100"
                                        height="30"
                                        viewBox="0 0 100 30"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="text-border group-hover:text-primary transition-colors duration-300"
                                    >
                                        <motion.path
                                            d="M5 15 C 30 25, 70 5, 95 15"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeDasharray="4 4"
                                            variants={DRAW_SVG}
                                        />
                                        <motion.path
                                             d="M90 10 L 95 15 L 90 20"
                                             stroke="currentColor"
                                             strokeWidth="2"
                                             strokeLinecap="round"
                                             strokeLinejoin="round"
                                             variants={DRAW_SVG}
                                        />
                                    </motion.svg>
                                </div>
                            )}

                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    </section>
);

  const StudentFeaturesSection = () => {
    return (
      <section className="section">
        <GridBackground>
          <div className="section-container">
            {/* Header styled like EnterpriseJourneySection */}
            <motion.div
              variants={FADE_IN_UP}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="text-center mb-20"
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 text-sm font-medium mb-6">
                <Zap className="size-4" />
                <span>Student Platform Features</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-bold font-heading text-foreground mb-6">
                AI-Powered Career Acceleration
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Our comprehensive platform provides students with intelligent tools and personalized guidance to accelerate their career journey from learning to earning.
              </p>
            </motion.div>

            {/* Journey-style layout with arrow connectors */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={STAGGER_CONTAINER}
              className="relative"
            >
              {/* Vertical line for mobile view */}
              <div className="absolute left-6 top-6 h-full w-0.5 bg-border -translate-x-1/2 lg:hidden" aria-hidden="true" />

              <div className="space-y-16">
                {[studentFeaturesData.slice(0,3), studentFeaturesData.slice(3,6)].map((row, rowIndex) => (
                  <div key={rowIndex} className="flex flex-col lg:flex-row lg:justify-between gap-16 lg:gap-8">
                    {row.map((feature, index) => (
                      <motion.div
                        key={feature.title}
                        variants={FADE_IN_UP}
                        className="flex-1 flex items-start gap-6 lg:gap-0 lg:flex-col lg:items-center group"
                      >
                        {/* Card & Content */}
                        <div className="flex-1 relative">
                          {/* Dot on the timeline for mobile */}
                          <div className="lg:hidden absolute -left-0 top-1 w-6 h-6 bg-background border-2 border-primary rounded-full flex items-center justify-center -translate-x-1/2">
                            <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>
                          </div>

                          {/* The Card */}
                          <div className="relative bg-background/80 backdrop-blur-sm border border-border/80 rounded-2xl p-8 transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-xl group-hover:shadow-primary/10 group-hover:-translate-y-1">
                            <div className="flex items-start gap-4 mb-4">
                              <div className="bg-primary/10 p-3 rounded-xl border border-primary/20">
                                <feature.icon className="size-6 text-primary" />
                              </div>
                              <h3 className="text-2xl font-bold font-heading text-foreground leading-tight">
                                {feature.title}
                              </h3>
                            </div>
                            <p className="text-muted-foreground leading-relaxed text-base">
                              {feature.description}
                            </p>
                          </div>
                        </div>

                        {/* Arrow Connector for Desktop */}
                        {index < row.length - 1 && (
                          <div className="hidden lg:block lg:mt-6">
                            <motion.svg
                              width="100"
                              height="30"
                              viewBox="0 0 100 30"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="text-border group-hover:text-primary transition-colors duration-300"
                            >
                              <motion.path
                                d="M5 15 C 30 25, 70 5, 95 15"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeDasharray="4 4"
                                variants={DRAW_SVG}
                              />
                              <motion.path
                                d="M90 10 L 95 15 L 90 20"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                variants={DRAW_SVG}
                              />
                            </motion.svg>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </GridBackground>
      </section>
    );
  };

const EnterpriseJourneySection = () => (
    <section id="enterprise-journey" className="section scroll-mt-28">
        <GridBackground>
            <div className="section-container">
                <motion.div
                    variants={FADE_IN_UP}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 text-sm font-medium mb-6">
                        🏢
                        <span>The Enterprise Journey</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold font-heading text-foreground mb-6">
                        From a Single Gig to Your Next Great Hire
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        Access a curated pipeline of motivated, verified, and proven student talent. Start with low-risk freelance gigs and seamlessly transition to full-time hires.
                    </p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={STAGGER_CONTAINER}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {enterpriseJourneyData.map((step) => (
                        <motion.div key={step.title} variants={FADE_IN_UP} className="bg-background border border-border/50 rounded-2xl p-8 flex flex-col items-start text-left hover:border-primary/30 hover:-translate-y-1 transition-all">
                            <div className="p-3 bg-primary/10 rounded-lg mb-4">
                                <step.icon className="size-7 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold font-heading text-foreground mb-2">{step.title}</h3>
                            <p className="text-muted-foreground">{step.description}</p>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    variants={FADE_IN_UP}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="mt-16 text-center"
                >
                    <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-12 border border-primary/20">
                        <h3 className="text-2xl md:text-3xl font-bold font-heading text-foreground mb-4">
                            The Long-Term Advantage: Talent Pipeline
                        </h3>
                        <p className="text-lg text-muted-foreground mb-6 max-w-3xl mx-auto">
                            This is Aureeture's true differentiator. You come for a gig. You stay for the talent. Build sustainable, de-risked hiring pipelines that reduce recruitment costs and ensure cultural fit.
                        </p>
                        <div className="inline-flex items-center gap-2 text-primary font-medium">
                            <Users className="size-5" />
                            <span>Start building your talent network today</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </GridBackground>
    </section>
);

const EcosystemEngineSection = () => (
    <section className="py-24 px-4">
        <GridBackground>
            <div className="container mx-auto max-w-6xl">
                <motion.div
                    variants={FADE_IN_UP}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="text-center mb-16"
                >
                     <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 text-sm font-medium mb-6">
                        🔑
                        <span>The Ecosystem Engine</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold font-heading text-foreground mb-4">
                        Dual-Purpose AI Platform
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Our intelligent ecosystem serves both students and enterprises with tailored AI-driven features that create seamless experiences for all stakeholders.
                    </p>
                </motion.div>
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={STAGGER_CONTAINER}
                    className="grid md:grid-cols-3 gap-8"
                >
                    {ecosystemFeaturesData.map((feature) => (
                        <motion.div
                            key={feature.title}
                            variants={FADE_IN_UP}
                            className="bg-card/50 border border-border rounded-2xl p-8 text-center hover:border-primary/30 transition-all duration-300"
                        >
                            <div className="p-4 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                                <feature.icon className="size-8 text-primary" />
                            </div>
                         <h3 className="text-xl font-bold font-heading text-foreground mb-4">{feature.title}</h3>
                            <div className="text-left space-y-3">
                               <p><strong className='font-semibold text-foreground'>For Students:</strong> <span className='text-muted-foreground'>{feature.forStudents}</span></p>
                               <p><strong className='font-semibold text-foreground'>For Enterprises:</strong> <span className='text-muted-foreground'>{feature.forEnterprises}</span></p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </GridBackground>
    </section>
);

const PartnerLogosSection = () => (
  <section className="py-12 px-4">
    <div className="container mx-auto max-w-6xl">
      <div className="rounded-2xl border bg-card/50 p-6">
        <div className="text-center mb-6">
          <p className="text-sm uppercase tracking-wider text-muted-foreground">Trusted by learners and inspired by challenges from</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 text-muted-foreground">
          {['Netflix','Amazon','Google','Microsoft','Airbnb','Stripe'].map((brand) => (
            <div key={brand} className="flex items-center justify-center">
              <span className="text-sm sm:text-base md:text-lg font-semibold opacity-70">{brand}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const TestimonialsSection = () => (
  <section className="py-24 px-4">
    <GridBackground>
      <div className="container mx-auto max-w-6xl">
        <motion.div
          variants={FADE_IN_UP}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 text-sm font-medium mb-6">
            <Star className="size-4" />
            <span>What our learners say</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-foreground mb-4">Real outcomes. Real stories.</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Aureeture empowers students to turn effort into experience and experience into opportunities.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[{
            name: 'Ananya', role: 'Data Science Intern', quote: 'Within 6 weeks, I built a portfolio with real projects and landed an internship I love.', img: '/avatar-ananya.jpg', initials: 'AN'
          },{
            name: 'Rohit', role: 'Frontend Developer', quote: 'The performance score and feedback gave me credibility with hiring managers.', img: '/avatar-rohit.jpg', initials: 'RO'
          },{
            name: 'Sara', role: 'Product Analyst', quote: 'Pathfinder showed me exactly what to learn next. The roadmap kept me focused.', img: '/avatar-sara.jpg', initials: 'SA'
          }].map((t) => (
            <motion.div key={t.name} variants={FADE_IN_UP} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="bg-card/60 border border-border rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Avatar>
                  <AvatarImage src={t.img} alt={t.name} />
                  <AvatarFallback>{t.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">“{t.quote}”</p>
            </motion.div>
          ))}
        </div>
      </div>
    </GridBackground>
  </section>
);

const FAQPreviewSection = () => (
  <section className="py-20 px-4">
    <div className="container mx-auto max-w-5xl">
      <motion.div
        variants={FADE_IN_UP}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 text-sm font-medium mb-6">
          <BookOpen className="size-4" />
          <span>FAQ</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold font-heading text-foreground mb-4">Questions, answered.</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Here are the most common questions about Aureeture. For more, visit our Contact page.</p>
      </motion.div>

      <Accordion type="single" collapsible className="w-full grid gap-4 md:grid-cols-2">
        <AccordionItem value="q1">
          <AccordionTrigger>How does the AI copilot matching work?</AccordionTrigger>
          <AccordionContent>
            Our AI analyzes your skills, interests, and career goals to match you with the most suitable copilot.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="q2">
          <AccordionTrigger>Are the projects from real companies?</AccordionTrigger>
          <AccordionContent>
            Yes. We curate challenges inspired by real company problems and partner with organizations for opportunities.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="q3">
          <AccordionTrigger>How quickly can I see results?</AccordionTrigger>
          <AccordionContent>
            Many learners see portfolio-ready work in 4–6 weeks and interview-ready confidence shortly after.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="q4">
          <AccordionTrigger>Is there a free trial?</AccordionTrigger>
          <AccordionContent>
            Yes. Start with our career assessment and explore your matched copilot free of charge.
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="text-center mt-8">
        <Link href="/contact">
          <Button variant="outline" className="rounded-full">More questions? Contact us</Button>
        </Link>
      </div>
    </div>
  </section>
);

const FinalCTASection = () => (
    <section className="py-20 px-4 relative overflow-hidden bg-background">
        <div className="absolute inset-0 -z-10 pointer-events-none">
            <Image
              src="/tempImageC8u1Nc 1.png"
              alt="Abstract network pattern"
              fill
              sizes="100vw"
              className="object-cover opacity-5"
            />
        </div>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
            <motion.div
                variants={FADE_IN_UP}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
            >
                <h2 className="text-4xl md:text-5xl font-bold font-heading text-foreground mb-6">
                    We Are Not Just a Marketplace
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                    We are an ecosystem where students grow, prove, and launch their careers, while enterprises gain verified, reliable, and future-ready talent.
                </p>
                <div className="bg-card border border-border rounded-2xl p-8 mb-12 text-left">
                    <div className="grid md:grid-cols-2 gap-8 text-left">
                        <div>
                            <h3 className="text-2xl font-bold text-foreground mb-4">For Students</h3>
                            <p className="text-muted-foreground">
                              A structured path from zero experience to being a top-tier, employable professional with verified
                              skills and proven track record.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-foreground mb-4">For Enterprises</h3>
                            <p className="text-muted-foreground">
                              A curated, de-risked pipeline to the top 5% of student talent, reducing recruitment costs and
                              ensuring quality hires.
                            </p>
                        </div>
                    </div>
                </div>
                <Link href="#" className="inline-block">
                    <Button size="lg" className="group relative overflow-hidden rounded-full bg-primary px-12 py-8 text-xl font-bold text-primary-foreground shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-primary/30">
                        <span className="flex items-center justify-center">
                            <span className="absolute top-0 left-0 h-full w-full bg-white/20 opacity-50 animate-subtle-shine group-hover:opacity-100"></span>
                            Join the Ecosystem
                            <ArrowRight className="ml-3 size-6 transition-transform duration-300 group-hover:translate-x-1.5" />
                        </span>
                    </Button>
                </Link>
            </motion.div>
        </div>
    </section>
);

//================================================================//
//  FINAL PAGE ASSEMBLY
//================================================================//
export default function AureeturePlatformPage() {
    const [leadOpen, setLeadOpen] = useState(false);
    return (
        <main className="min-h-screen bg-background text-foreground antialiased">
            <HeroSection onOpenLead={() => setLeadOpen(true)} />
            
            {/* ============================================== */}
            {/* NEW FEATURE-RICH SECTIONS - AI Workflow Explainers */}
            {/* ============================================== */}
            
            {/* Section 1: Student/Candidate Workflow - Interactive Stepper */}
            <CandidateJourneyFlow />
            
            {/* Section 2: Employer Command Center - Bento Grid */}
            <RecruiterIntelligenceGrid />
            
            {/* Section 3: Technology Core - Horizontal Cards */}
            <AIEngineSpecs />
            
            {/* Section 4: Trust & Transparency - Pros + FAQ */}
            <TrustAndTransparency />
            
            {/* ============================================== */}
            {/* EXISTING SECTIONS */}
            {/* ============================================== */}
            <StudentJourneySection />
            <StudentFeaturesSection />
            <EnterpriseJourneySection />
            <EcosystemEngineSection />
            <FinalCTASection />
            <LeadModal
              open={leadOpen}
              onClose={() => setLeadOpen(false)}
              title="Start Your Journey"
              description="Share your details and we'll reach out with next steps."
            />
        </main>
    );
}
