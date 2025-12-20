"use client";

/**
 * @component RecruiterIntelligenceGrid
 * @description Bento Grid Layout showcasing B2B employer features
 * with uneven cards for visual density and depth.
 */

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MessageSquarePlus,
  Search,
  Video,
  Settings2,
  Zap,
  Building2,
  ArrowRight,
} from "lucide-react";
import { GridBackground } from "@/components/grid-background";

// Neutral accent gradient for a more professional monochrome look
const RECRUITER_BRAND_GRADIENT = "from-foreground to-foreground/70";

const recruiterCards = [
  {
    id: 1,
    icon: MessageSquarePlus,
    title: "Intelligent Job Posting",
    description:
      "Define roles naturally. Post 'Need a React Native Developer with 2 years experience,' and let the AI parse the context requirements.",
    gradient: RECRUITER_BRAND_GRADIENT,
    size: "large", // Takes up more space
    pattern: "diagonal",
  },
  {
    id: 2,
    icon: Search,
    title: "Semantic Search Engine",
    description:
      "Go beyond keywords. If you search for 'Frontend Wizard,' our engine maps it to HTML/CSS/JS experts using context-aware matching.",
    gradient: RECRUITER_BRAND_GRADIENT,
    size: "medium",
    pattern: "dots",
  },
  {
    id: 3,
    icon: Video,
    title: "Direct Verification",
    description:
      "Skip the resume pile. Recruiters can view AI-Interview Transcripts and video highlights directly to judge technical and soft skills instantly.",
    gradient: RECRUITER_BRAND_GRADIENT,
    size: "medium",
    pattern: "grid",
  },
  {
    id: 4,
    icon: Settings2,
    title: "End-to-End Management",
    description:
      "We handle the friction. From contract generation to international payments and onboarding, Aureeture AI manages the administrative lifecycle.",
    gradient: RECRUITER_BRAND_GRADIENT,
    size: "large",
    pattern: "waves",
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// Pattern components for card backgrounds
const PatternDiagonal = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="diagonal" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M0 20L20 0M-5 5L5 -5M15 25L25 15" stroke="currentColor" strokeWidth="1" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#diagonal)" />
  </svg>
);

const PatternDots = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.5" fill="currentColor" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#dots)" />
  </svg>
);

const PatternGrid = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M40 0H0V40" fill="none" stroke="currentColor" strokeWidth="0.5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
  </svg>
);

const PatternWaves = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="waves" x="0" y="0" width="100" height="20" patternUnits="userSpaceOnUse">
        <path d="M0 10 Q25 0 50 10 T100 10" fill="none" stroke="currentColor" strokeWidth="1" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#waves)" />
  </svg>
);

const patterns: Record<string, React.FC> = {
  diagonal: PatternDiagonal,
  dots: PatternDots,
  grid: PatternGrid,
  waves: PatternWaves,
};

export function RecruiterIntelligenceGrid() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section className="relative py-16 lg:py-20 overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Subtle grid overlay */}
      <GridBackground className="absolute inset-0 opacity-50" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 lg:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-6">
            <Building2 className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Employer Command Center</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
              Hiring at the Speed of GenAI
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Transform your recruitment workflow with AI-powered tools that understand context, 
            verify skills, and manage the entire hiring lifecycle.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 auto-rows-[minmax(280px,auto)]"
        >
          {recruiterCards.map((card, index) => {
            const PatternComponent = patterns[card.pattern];
            const isHovered = hoveredCard === card.id;
            
            // Determine grid span based on card size and position
            const getGridClass = () => {
              if (card.size === "large") {
                return index === 0 ? "lg:col-span-7" : "lg:col-span-7";
              }
              return "lg:col-span-5";
            };

            return (
              <motion.div
                key={card.id}
                variants={cardVariants}
                className={`relative group ${getGridClass()}`}
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <motion.div
                  className="relative h-full overflow-hidden rounded-3xl border border-border/70 bg-secondary transition-all duration-300"
                  whileHover={{ 
                    y: -8, 
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                  style={{
                    boxShadow: isHovered 
                      ? `0 25px 60px -15px rgba(0, 0, 0, 0.3), 0 0 40px -10px var(--primary)` 
                      : "0 10px 40px -15px rgba(0, 0, 0, 0.1)"
                  }}
                >
                  {/* Pattern background */}
                  <PatternComponent />

                  {/* Gradient border effect */}
                  <div className="absolute inset-0 rounded-3xl bg-muted opacity-0 group-hover:opacity-60 transition-opacity duration-300" />

                  {/* Animated gradient accent on top */}
                  <motion.div
                    className="absolute top-0 left-0 right-0 h-px bg-border"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    style={{ transformOrigin: "left" }}
                  />

                  {/* Glowing orb effect on hover */}
                  <motion.div
                    className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-muted blur-3xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 0.15 : 0 }}
                    transition={{ duration: 0.5 }}
                  />

                  {/* Content */}
                  <div className="relative p-8 lg:p-10 h-full flex flex-col">
                    {/* Icon */}
                    <motion.div
                      className="w-14 h-14 rounded-2xl bg-muted p-[2px] mb-6"
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="w-full h-full rounded-2xl bg-background/90 backdrop-blur-sm flex items-center justify-center">
                        <card.icon className="w-7 h-7 text-foreground" />
                      </div>
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-2xl lg:text-3xl font-bold mb-4 text-foreground group-hover:text-foreground transition-colors">
                      {card.title}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground text-lg leading-relaxed flex-1">
                      {card.description}
                    </p>

                    {/* Learn more link */}
                    <motion.div
                      className="flex items-center gap-2 mt-6 text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: isHovered ? 1 : 0.5, x: isHovered ? 0 : -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span>Learn more</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </motion.div>
                  </div>

                  {/* Corner accent */}
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-muted opacity-40 rounded-tl-full" />
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Speed indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-16 flex justify-center"
        >
            <div className="inline-flex items-center gap-4 px-6 py-4 rounded-2xl bg-card border border-border/60">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Average time to hire:</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-foreground">
                72%
              </span>
              <span className="text-sm text-muted-foreground">faster</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}







