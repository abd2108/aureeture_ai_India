"use client";

/**
 * @component AIEngineSpecs
 * @description Horizontal scrolling cards showcasing the technology core
 * with high-tech visuals (circuit/network nodes).
 */

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Globe,
  Brain,
  Bot,
  LineChart,
  Cpu,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Neutral accent gradient
const TECH_BRAND_GRADIENT = "from-foreground to-foreground/70";

const aiSpecs = [
  {
    id: 1,
    icon: Globe,
    title: "Resume & Portfolio Crawling",
    description:
      "The crawler visits your provided GitHub/Personal sites to analyze code quality and project complexity in real-time.",
    visual: "crawler",
    accent: "emerald",
    gradient: TECH_BRAND_GRADIENT,
  },
  {
    id: 2,
    icon: Brain,
    title: "Context-Aware Semantic Matching",
    description:
      "The NLP engine interprets queries like 'Python developer for finance' to prioritize candidates with Fintech project experience, not just Python keywords.",
    visual: "neural",
    accent: "emerald",
    gradient: TECH_BRAND_GRADIENT,
  },
  {
    id: 3,
    icon: Bot,
    title: "AI-Led Evaluation Bot",
    description:
      "A bias-free, real-time evaluation agent that scores candidates purely on talent, ignoring gender, location, or prestige markers.",
    visual: "bot",
    accent: "emerald",
    gradient: TECH_BRAND_GRADIENT,
  },
  {
    id: 4,
    icon: LineChart,
    title: "Automated Scoring & Ranking",
    description:
      "Every candidate receives a dynamic 'Fit Score' based on Interview + Resume + Portfolio, ensuring the best matches appear first.",
    visual: "chart",
    accent: "emerald",
    gradient: TECH_BRAND_GRADIENT,
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// Network node visualization component
const NetworkVisualization = ({ accent }: { accent: string }) => {
  const accentColors: Record<string, string> = {
    cyan: "#06b6d4",
    violet: "#8b5cf6",
    emerald: "#10b981",
    amber: "#f59e0b",
  };
  const color = accentColors[accent] || accentColors.cyan;

  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-20"
      viewBox="0 0 400 300"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Animated network lines */}
      <motion.g>
        {[
          { x1: 50, y1: 50, x2: 150, y2: 100 },
          { x1: 150, y1: 100, x2: 250, y2: 80 },
          { x1: 250, y1: 80, x2: 350, y2: 120 },
          { x1: 100, y1: 200, x2: 200, y2: 180 },
          { x1: 200, y1: 180, x2: 300, y2: 220 },
          { x1: 150, y1: 100, x2: 200, y2: 180 },
          { x1: 250, y1: 80, x2: 300, y2: 220 },
        ].map((line, i) => (
          <motion.line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={color}
            strokeWidth="1"
            strokeDasharray="5,5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{ duration: 1.5, delay: i * 0.1 }}
          />
        ))}
      </motion.g>

      {/* Animated nodes */}
      {[
        { cx: 50, cy: 50 },
        { cx: 150, cy: 100 },
        { cx: 250, cy: 80 },
        { cx: 350, cy: 120 },
        { cx: 100, cy: 200 },
        { cx: 200, cy: 180 },
        { cx: 300, cy: 220 },
      ].map((node, i) => (
        <motion.circle
          key={i}
          cx={node.cx}
          cy={node.cy}
          r="6"
          fill={color}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.8 }}
          transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
        />
      ))}

      {/* Pulsing center node */}
      <motion.circle
        cx="200"
        cy="150"
        r="15"
        fill={color}
        initial={{ scale: 0 }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </svg>
  );
};

// Circuit pattern background
const CircuitPattern = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="circuit-ai" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
        <path d="M0 25h20M30 25h20M25 0v20M25 30v20" stroke="currentColor" strokeWidth="0.5" fill="none" />
        <rect x="22" y="22" width="6" height="6" fill="currentColor" />
        <circle cx="10" cy="25" r="2" fill="currentColor" />
        <circle cx="40" cy="25" r="2" fill="currentColor" />
        <circle cx="25" cy="10" r="2" fill="currentColor" />
        <circle cx="25" cy="40" r="2" fill="currentColor" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#circuit-ai)" />
  </svg>
);

export function AIEngineSpecs() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === "left" ? -400 : 400;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <section className="relative py-16 lg:py-20 overflow-hidden">
      {/* Deep but neutral background */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Circuit pattern */}
      <CircuitPattern />

      {/* Subtle ambient shapes */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-muted rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-muted rounded-full blur-3xl" />

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
            <Cpu className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Technology Core</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
              How Aureeture AI Thinks
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Powered by cutting-edge AI technologies that understand context, evaluate talent fairly, 
            and create perfect matches between candidates and opportunities.
          </p>
        </motion.div>

        {/* Tab Navigation (Mobile) */}
        <div className="lg:hidden mb-8">
          <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
            {aiSpecs.map((spec, index) => (
              <button
                key={spec.id}
                onClick={() => setActiveTab(index)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === index
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {spec.title.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Card Display */}
        <div className="lg:hidden">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            {(() => {
              const spec = aiSpecs[activeTab];
              return (
                <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8">
                  <NetworkVisualization accent={spec.accent} />
                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-6">
                      <spec.icon className="w-8 h-8 text-foreground" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">
                      {spec.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {spec.description}
                    </p>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        </div>

        {/* Desktop Horizontal Scrolling Cards */}
        <div className="hidden lg:block relative">
          {/* Scroll buttons */}
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 z-20">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="rounded-full bg-slate-900/80 border-slate-700 hover:bg-slate-800 disabled:opacity-30"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </div>

          <div className="absolute -right-4 top-1/2 -translate-y-1/2 z-20">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="rounded-full bg-slate-900/80 border-slate-700 hover:bg-slate-800 disabled:opacity-30"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Cards container */}
          <motion.div
            ref={scrollContainerRef}
            onScroll={checkScroll}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {aiSpecs.map((spec, index) => (
              <motion.div
                key={spec.id}
                variants={cardVariants}
                className="flex-shrink-0 w-[400px] snap-center"
              >
                <motion.div
                    className="relative h-[400px] overflow-hidden rounded-3xl border border-border bg-card cursor-pointer group"
                  whileHover={{ 
                    scale: 1.02,
                    y: -8,
                    transition: { duration: 0.3 }
                  }}
                >
                  {/* Network visualization background */}
                  <NetworkVisualization accent={spec.accent} />

                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-muted opacity-0 group-hover:opacity-60 transition-opacity duration-300" />

                  {/* Top gradient accent */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-border" />

                  {/* Content */}
                  <div className="relative z-10 p-8 h-full flex flex-col">
                    {/* Animated icon */}
                    <motion.div
                      className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-6"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.8 }}
                    >
                      <spec.icon className="w-8 h-8 text-foreground" />
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-foreground transition-colors">
                      {spec.title}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground leading-relaxed flex-1 group-hover:text-foreground/80 transition-colors">
                      {spec.description}
                    </p>

                    {/* Tech indicator */}
                    <div className="flex items-center gap-2 mt-6 pt-6 border-t border-border/60">
                      <Sparkles className={`w-4 h-4`} style={{ color: spec.accent === "cyan" ? "#06b6d4" : spec.accent === "violet" ? "#8b5cf6" : spec.accent === "emerald" ? "#10b981" : "#f59e0b" }} />
                      <span className="text-xs text-slate-500 uppercase tracking-wider">
                        AI-Powered Engine
                      </span>
                    </div>
                  </div>

                  {/* Decorative corner element */}
                  <div className={`absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl ${spec.gradient} opacity-10 rounded-tl-full`} />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll indicator dots */}
          <div className="flex justify-center gap-2 mt-6">
            {aiSpecs.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  const container = scrollContainerRef.current;
                  if (container) {
                    container.scrollTo({
                      left: index * 416,
                      behavior: "smooth",
                    });
                  }
                }}
                className="w-2 h-2 rounded-full bg-slate-700 hover:bg-slate-500 transition-colors"
              />
            ))}
          </div>
        </div>

        {/* Tech stack badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-16 flex justify-center"
        >
          <div className="inline-flex items-center gap-6 px-8 py-4 rounded-2xl bg-card border border-border">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-muted-foreground/60 animate-pulse" />
              <span className="text-sm text-muted-foreground">NLP Engine</span>
            </div>
            <div className="w-px h-6 bg-border" />
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-muted-foreground/60 animate-pulse" />
              <span className="text-sm text-muted-foreground">ML Pipeline</span>
            </div>
            <div className="w-px h-6 bg-border" />
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-muted-foreground/60 animate-pulse" />
              <span className="text-sm text-muted-foreground">Real-time Processing</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}







