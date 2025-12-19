// /app/velocity-cohort/page.tsx
"use client";

/**
 * @fileoverview Velocity Cohort Landing Page (Consolidated & Corrected)
 * @description
 * ## Engineering Note:
 * This file consolidates all refactored components into a single file as requested.
 * The original code had a critical bug in the Schedule accordion where the `value` prop was
 * a static string instead of a dynamic one, preventing it from working correctly. This has been fixed.
 * Additionally, TypeScript types have been added to the data structures for improved robustness and error-checking.
 *
 * ## UI/UX Philosophy: "Clarity & Momentum"
 * The design uses a professional color palette (with light/dark modes), modern typography
 * (Sora & Inter), and subtle animations to create a trustworthy and premium user experience,
 * reflecting the high quality of the Aureeture program.
 */

//================================================================//
//  IMPORTS
//================================================================//
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, easeInOut, easeOut } from "framer-motion";
import {
  Calendar, Clock, Users, Target, Award, Lightbulb, Rocket,
  TrendingUp, Gift, Globe, Briefcase, Star, ArrowRight,
  ChevronDown, ChevronUp,
  LucideIcon, // Import LucideIcon for typing
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadModal } from "@/components/ui/lead-modal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

//================================================================//
//  TYPE DEFINITIONS
//================================================================//
interface ScheduleSessionItem {
  title: string;
  points: string[];
}

interface ScheduleSession {
  title: string;
  items: ScheduleSessionItem[];
}

interface ScheduleItem {
  day: string;
  title: string;
  description: string;
  icon: LucideIcon;
  morning: ScheduleSession;
  afternoon: ScheduleSession;
}

interface BenefitItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface AudienceItem {
  icon: LucideIcon;
  title: string;
  description: string;
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
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

//================================================================//
//  STATIC DATA
//================================================================//

// Data for the Schedule Section
const scheduleData: ScheduleItem[] = [
  {
    day: "1",
    title: "Discovery, Teaming & Intent Setting",
    description: "Kickstart your journey with team formation, career mentoring, and fun challenges to set the foundation for success.",
    icon: Calendar,
    morning: {
      title: "Morning Session",
      items: [
        { title: "🚀 Kickstart Session", points: ["Welcome & Program Overview", "Industry Insights & GenAI Landscape", "Success Stories & Case Studies"] },
        { title: "👥 Group Formation", points: ["Icebreaker Activities", "Skill Assessment & Matching", "Team Building Exercises"] },
      ]
    },
    afternoon: {
      title: "Afternoon Session",
      items: [
        { title: "🎯 Career Mentoring Sessions", points: ["1-on-1 Career Guidance", "Industry Expert Interactions", "Personalized Roadmap Creation"] },
        { title: "🎲 Fun Challenges", points: ["Creative Problem Solving", "Team Collaboration Games", "Innovation Thinking Exercises"] },
      ]
    }
  },
  {
    day: "2",
    title: "Learning by Doing + Project Development",
    description: "Dive deep into GenAI workshops, mentoring sessions, and hands-on project development with continuous expert guidance.",
    icon: Lightbulb,
    morning: {
      title: "Morning Session",
      items: [
        { title: "🤖 GenAI Workshops", points: ["Hands-on AI Tool Training", "Prompt Engineering Techniques", "AI-Powered Problem Solving"] },
        { title: "⚡ MentorMash", points: ["Speed Mentoring Sessions", "Industry Expert Q&A", "Real-world Experience Sharing"] },
      ]
    },
    afternoon: {
      title: "Afternoon Session",
      items: [
        { title: "🛠️ No-Code Prototyping", points: ["Platform Training & Setup", "Rapid Prototype Development", "User Experience Design"] },
        { title: "🚀 Project Development", points: ["Team Project Planning", "Iterative Development Process", "Continuous Mentor Feedback"] },
      ]
    }
  },
  {
    day: "3",
    title: "Showcase, Deep Dives, Recognition",
    description: "Present your projects, explore advanced concepts, and celebrate achievements with personalized career pathways.",
    icon: Award,
    morning: {
      title: "Morning Session",
      items: [
        { title: "🎭 Showcase", points: ["Team Project Presentations", "Live Prototype Demonstrations", "Peer Review & Feedback"] },
        { title: "🔍 Deep Dives", points: ["Technical Deep Dive Sessions", "Industry Expert Analysis", "Advanced Concept Exploration"] },
      ]
    },
    afternoon: {
      title: "Afternoon Session",
      items: [
        { title: "🛤️ Pathfinder Tracks", points: ["Personalized Career Pathways", "Skill Development Roadmaps", "Next Steps Planning"] },
        { title: "🏆 Awards & Recognition", points: ["Best Innovation Award", "Excellence in Collaboration", "Certificate Ceremony", "Networking & Community Building"] },
      ]
    }
  }
];

// Data for the Benefits Section
const benefitsData: BenefitItem[] = [
    { icon: Users, title: "Personalized Career Counselling", description: "30-minute 1:1 session to identify your unique career path and goals." },
    { icon: Target, title: "Personalised Career Roadmap", description: "A structured, actionable plan tailored specifically for your career goals and aspirations." },
    { icon: Rocket, title: "3-Day Immersive Bootcamp", description: "Learn directly from founders & industry experts in an intensive, hands-on environment." },
    { icon: TrendingUp, title: "Real-World Challenges", description: "Solve problem statements from top organizations like Nvidia, Swiggy, Siemens, and more." },
    { icon: Briefcase, title: "Resume-Enhancing Projects", description: "Stand out in placements with industry-backed experiences and real project implementations." },
    { icon: Gift, title: "AureetureAI Welcome Kit", description: "T-shirt, pen, letterpad, ID card, and envelope - everything to get you started." },
    { icon: Globe, title: "Lifetime Community Access", description: "Stay connected with peers, mentors, and global opportunities throughout your career journey." },
    { icon: Clock, title: "Bi-Monthly Progress Check-ins", description: "Continuous guidance for 6 months with 30-minute 1:1 sessions." },
    { icon: Award, title: "Bootcamp Completion Certificate", description: "Official certification to validate your skills and commitment to professional development." },
];

// Data for Target Audience Section
const audienceData: AudienceItem[] = [
  { icon: Users, title: 'High-schoolers', description: 'Early exposure to career possibilities and GenAI technologies.' },
  { icon: Lightbulb, title: 'UG/PG Students', description: 'Engineering, commerce, and design students seeking career clarity.' },
  { icon: Rocket, title: 'Early-career Aspirants', description: 'Professionals looking to pivot or enhance their career trajectory.' },
];

//================================================================//
//  SECTIONAL COMPONENTS
//================================================================//

const HeroSection = ({ onOpenLead }: { onOpenLead: () => void }) => (
  <section className="relative flex items-center pt-24 pb-20 px-4 min-h-[90vh]">
    <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
    <div className="absolute top-0 left-0 -z-10 h-1/3 w-full bg-gradient-to-b from-primary/10 to-transparent blur-3xl"></div>

    <div className="container mx-auto max-w-6xl z-10">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={STAGGER_CONTAINER}
          className="space-y-6"
        >
          <motion.div variants={FADE_IN_UP} className="inline-flex items-center gap-2 border border-primary/30 bg-primary/10 text-primary rounded-full px-4 py-1 text-sm font-medium">
            <Star className="size-4" />
            <span>3-Day Intensive Program</span>
          </motion.div>
          
          <motion.h1 variants={FADE_IN_UP} className="text-4xl md:text-6xl font-bold font-heading text-foreground">
            Velocity Cohort
          </motion.h1>
          
          <motion.p variants={FADE_IN_UP} className="text-lg md:text-xl text-muted-foreground">
            A career transformation experience designed to make you placement-ready and future-proof. Go from zero to a real-world project in 3 days.
          </motion.p>
          
          <motion.div variants={FADE_IN_UP} className="flex flex-wrap items-center gap-4">
            <Button
              onClick={onOpenLead}
              size="lg"
              className="rounded-full bg-accent px-8 py-6 text-lg font-bold text-accent-foreground shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-accent/30"
            >
              <span className="flex items-center justify-center">
                Join the Cohort
                <ArrowRight className="ml-2 size-5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Button>
            <Link href="#schedule" className="inline-block">
              <Button size="lg" variant="outline" className="rounded-full px-8 py-6 text-lg">
                Learn More
              </Button>
            </Link>
          </motion.div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: easeInOut }}
          className="relative"
        >
          <div className="relative group">
            {/* Floating elements for visual enhancement */}
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-tl from-accent/30 to-primary/30 rounded-full blur-2xl animate-pulse delay-1000"></div>
            
            {/* Main image with enhanced styling */}
            <div className="relative overflow-hidden rounded-2xl border border-border/50 backdrop-blur-sm bg-background/5">
              <Image
                src="/file_000000008b0c622f9fb3fd86d82e9c23 (1) 1.png"
                alt="Students collaborating on a project for the Velocity Cohort program"
                width={600}
                height={400}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 600px"
                className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
                priority
              />
              
              {/* Subtle overlay for better text contrast if needed */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/10 via-transparent to-transparent"></div>
              
              {/* Decorative corner elements */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full animate-ping"></div>
              <div className="absolute bottom-4 left-4 w-1 h-1 bg-accent rounded-full animate-ping delay-500"></div>
            </div>
            
            {/* Floating badge */}
            <div className="absolute -top-3 left-6 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium shadow-lg">
              Live Program
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const ScheduleSection = () => {
  const [openSessions, setOpenSessions] = useState<Record<string, boolean>>({});

  const toggleSession = (dayIndex: number, sessionIndex: number) => {
    const key = `${dayIndex}-${sessionIndex}`;
    setOpenSessions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <section id="schedule" className="section bg-gradient-to-br from-background via-card/30 to-background scroll-mt-28">
      <div className="section-container">
        <motion.div
          variants={FADE_IN_UP}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 text-sm font-medium mb-6">
            <Calendar className="size-4" />
            <span>3-Day Intensive Program</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-foreground mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            The 3-Day Journey
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A meticulously crafted schedule designed for maximum impact, blending expert-led sessions with hands-on project development.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={STAGGER_CONTAINER}
          className="grid lg:grid-cols-3 gap-8"
        >
          {scheduleData.map((day, index) => (
            <motion.div
              key={day.day}
              variants={FADE_IN_UP}
              className="group relative"
            >
              {/* Day Card */}
              <div className="relative bg-background/80 backdrop-blur-sm border border-border/50 rounded-3xl p-8 h-full transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 hover:border-primary/30">
                
                {/* Day Number Badge */}
                <div className="absolute -top-4 left-8 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-2xl px-6 py-3 shadow-lg">
                  <div className="flex items-center gap-2">
                    <day.icon className="size-5" />
                    <span className="font-bold text-lg">Day {day.day}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="pt-8">
                  <h3 className="text-2xl font-bold font-heading text-foreground mb-4 leading-tight">
                    {day.title}
                  </h3>
                  <p className="text-muted-foreground mb-8 leading-relaxed">
                    {day.description}
                  </p>

                  {/* Sessions */}
                  <div className="space-y-4">
                    {[day.morning, day.afternoon].map((session, sIndex) => {
                      const sessionKey = `${index}-${sIndex}`;
                      const isOpen = openSessions[sessionKey] || false;
                      
                      return (
                        <div key={sIndex} className="bg-card/50 rounded-2xl border border-border/30 overflow-hidden">
                          {/* Session Header - Clickable */}
                          <button
                            onClick={() => toggleSession(index, sIndex)}
                            className="w-full p-6 flex items-center justify-between hover:bg-card/70 transition-colors duration-200"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-primary/10 rounded-lg">
                                <Clock className="size-4 text-primary" />
                              </div>
                              <h4 className="font-semibold text-foreground text-lg">
                                {session.title}
                              </h4>
                            </div>
                            <motion.div
                              animate={{ rotate: isOpen ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                              className="text-muted-foreground"
                            >
                              <ChevronDown className="size-5" />
                            </motion.div>
                          </button>
                          
                          {/* Session Content - Collapsible */}
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: easeInOut }}
                                className="overflow-hidden"
                              >
                                <div className="px-6 pb-6 space-y-4">
                                  {session.items.map((item, itemIndex) => (
                                    <motion.div
                                      key={itemIndex}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: itemIndex * 0.1 }}
                                      className="border-l-2 border-primary/20 pl-4"
                                    >
                                      <h5 className="font-medium text-foreground mb-2 flex items-center gap-2">
                                        <span className="text-lg">{item.title.split(' ')[0]}</span>
                                        <span className="text-sm">{item.title.split(' ').slice(1).join(' ')}</span>
                                      </h5>
                                      <div className="grid grid-cols-1 gap-2">
                                        {item.points.map((point, pointIndex) => (
                                          <motion.div
                                            key={pointIndex}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: (itemIndex * 0.1) + (pointIndex * 0.05) }}
                                            className="flex items-start gap-2 text-sm text-muted-foreground"
                                          >
                                            <div className="w-1.5 h-1.5 bg-primary/60 rounded-full mt-2 flex-shrink-0"></div>
                                            <span>{point}</span>
                                          </motion.div>
                                        ))}
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-accent rounded-full animate-pulse opacity-60"></div>
                <div className="absolute bottom-4 right-6 w-1 h-1 bg-primary rounded-full animate-ping"></div>
                
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </div>

              {/* Connection Line for Desktop */}
              {index < scheduleData.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-border to-transparent"></div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          variants={FADE_IN_UP}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent-foreground rounded-full px-6 py-3 text-sm font-medium">
            <Target className="size-4" />
            <span>Ready to transform your career in just 3 days?</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const BenefitsSection = () => {
  const getPriorityStyles = (index: number) => {
    if (index < 3) {
      // High Priority - Top 3 (Gradient colors)
      const gradients = [
        "bg-gradient-to-br from-blue-500 to-purple-600",
        "bg-gradient-to-br from-purple-500 to-pink-600", 
        "bg-gradient-to-br from-pink-500 to-red-600"
      ];
      return {
        cardClass: `group relative ${gradients[index]} text-white border-0 rounded-3xl p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-3 hover:scale-105`,
        iconBg: "bg-white/20 backdrop-blur-sm",
        iconColor: "text-white",
        titleColor: "text-white",
        descColor: "text-white/90",
        priority: "",
        priorityBadge: "bg-white/20 text-white"
      };
    } else if (index < 6) {
      // Medium Priority - Middle 3 (Accent colors)
      const colors = [
        "border-blue-300 bg-blue-50/50",
        "border-green-300 bg-green-50/50",
        "border-yellow-300 bg-yellow-50/50"
      ];
      return {
        cardClass: `group relative bg-card ${colors[index - 3]} border-2 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-2`,
        iconBg: "bg-primary/15",
        iconColor: "text-primary",
        titleColor: "text-foreground",
        descColor: "text-muted-foreground",
        priority: "",
        priorityBadge: "bg-primary/10 text-primary"
      };
    } else {
      // Low Priority - Last 3 (Dark theme)
      return {
        cardClass: "group relative bg-slate-900 border border-slate-700 rounded-2xl p-6 transition-all duration-300 hover:border-slate-600 hover:shadow-lg hover:-translate-y-1",
        iconBg: "bg-slate-800",
        iconColor: "text-slate-300",
        titleColor: "text-slate-100",
        descColor: "text-slate-400",
        priority: "",
        priorityBadge: "bg-slate-800 text-slate-300"
      };
    }
  };

  return (
    <section className="section bg-background">
      <div className="section-container">
        <motion.div
          variants={FADE_IN_UP}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 text-sm font-medium mb-6">
            <Gift className="size-4" />
            <span>Complete Package</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold font-heading text-foreground mb-6">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            This isn't just a bootcamp. It's an all-inclusive career accelerator package with priority-based benefits.
          </p>
        </motion.div>

        {/* High Priority Benefits */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={STAGGER_CONTAINER}
          className="mb-16"
        >
          <div className="grid md:grid-cols-3 gap-8">
            {benefitsData.slice(0, 3).map((benefit, index) => {
              const styles = getPriorityStyles(index);
              return (
                <motion.div
                  key={benefit.title}
                  variants={FADE_IN_UP}
                  className={styles.cardClass}
                >
                  <div className={`${styles.iconBg} p-4 rounded-2xl inline-block mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    <benefit.icon className={`size-8 ${styles.iconColor}`} />
                  </div>
                  <h3 className={`text-2xl font-bold font-heading ${styles.titleColor} mb-3 leading-tight`}>
                    {benefit.title}
                  </h3>
                  <p className={`${styles.descColor} leading-relaxed`}>
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Medium Priority Benefits */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={STAGGER_CONTAINER}
          className="mb-16"
        >
          <div className="grid md:grid-cols-3 gap-8">
            {benefitsData.slice(3, 6).map((benefit, index) => {
              const styles = getPriorityStyles(index + 3);
              return (
                <motion.div
                  key={benefit.title}
                  variants={FADE_IN_UP}
                  className={styles.cardClass}
                >
                  <div className={`${styles.iconBg} p-3 rounded-xl inline-block mb-4 transition-transform duration-300 group-hover:scale-110`}>
                    <benefit.icon className={`size-6 ${styles.iconColor}`} />
                  </div>
                  <h3 className={`text-xl font-bold font-heading ${styles.titleColor} mb-2`}>
                    {benefit.title}
                  </h3>
                  <p className={`${styles.descColor}`}>
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Low Priority Benefits */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={STAGGER_CONTAINER}
        >
          <div className="grid md:grid-cols-3 gap-8">
            {benefitsData.slice(6, 9).map((benefit, index) => {
              const styles = getPriorityStyles(index + 6);
              return (
                <motion.div
                  key={benefit.title}
                  variants={FADE_IN_UP}
                  className={styles.cardClass}
                >
                  <div className={`${styles.iconBg} p-3 rounded-xl inline-block mb-4 transition-transform duration-300 group-hover:scale-105`}>
                    <benefit.icon className={`size-6 ${styles.iconColor}`} />
                  </div>
                  <h3 className={`text-xl font-bold font-heading ${styles.titleColor} mb-2`}>
                    {benefit.title}
                  </h3>
                  <p className={`${styles.descColor}`}>
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const AudienceSection = () => (
    <section className="section bg-card">
        <div className="section-container max-w-6xl">
            <motion.div
                variants={FADE_IN_UP}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="text-center mb-16"
            >
                <h2 className="text-3xl md:text-5xl font-bold font-heading text-foreground mb-4">
                    Who Is This For?
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                   Whether you're just starting out or looking to level-up, Velocity Cohort is your launchpad.
                </p>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={STAGGER_CONTAINER}
              className="grid md:grid-cols-3 gap-8"
            >
                {audienceData.map((audience) => (
                    <motion.div
                        key={audience.title}
                        variants={FADE_IN_UP}
                        className="bg-background border border-border rounded-2xl p-8 text-center"
                    >
                        <div className="p-4 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                            <audience.icon className="size-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold font-heading text-foreground mb-2">{audience.title}</h3>
                        <p className="text-muted-foreground">{audience.description}</p>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    </section>
);

const FinalCTASection = () => (
    <section className="section relative overflow-hidden bg-background">
        <div className="absolute inset-0 -z-10 pointer-events-none">
            {/* NOTE: Ensure this image path is correct and the file exists in your `/public` directory. */}
            <Image
              src="/tempImageC8u1Nc 1.png"
              alt="Abstract network pattern"
              fill
              className="object-cover opacity-5"
            />
        </div>
        <div className="section-narrow text-center relative z-10">
            <motion.div
                variants={FADE_IN_UP}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
            >
                <h2 className="text-4xl md:text-5xl font-bold font-heading text-foreground mb-6">
                    Ready to Build the Future?
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
                    Seats are limited to ensure a high-quality, personalized experience. Secure your spot and start your journey from learner to innovator.
                </p>
                <Link href="#" className="inline-block">
                  <Button
                    size="lg"
                    className="rounded-full bg-accent px-12 py-8 text-xl font-bold text-accent-foreground shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-accent/30"
                  >
                      <span className="flex items-center justify-center">
                          Apply to Velocity Cohort
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
export default function VelocityCohortPage() {
  const [leadOpen, setLeadOpen] = useState(false);
  return (
    <main className="min-h-screen bg-background text-foreground antialiased">
      <HeroSection onOpenLead={() => setLeadOpen(true)} />
      <ScheduleSection />
      <BenefitsSection />
      <AudienceSection />
      <FinalCTASection />
      <LeadModal // Render LeadModal
        open={leadOpen}
        onClose={() => setLeadOpen(false)}
        title="Join the Cohort"
        description="Share your details and we’ll follow up with cohort dates and next steps."
      />
    </main>
  );
}