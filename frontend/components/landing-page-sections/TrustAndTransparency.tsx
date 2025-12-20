"use client";

/**
 * @component TrustAndTransparency
 * @description Two-column layout with Pros and FAQ Accordion
 * for transparent communication about the platform.
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  CheckCircle,
  Globe,
  Clock,
  ChevronDown,
  Sparkles,
  MessageCircleQuestion,
  ThumbsUp,
} from "lucide-react";
import { GridBackground } from "@/components/grid-background";

// Neutral accent gradient
const TRUST_BRAND_GRADIENT = "from-foreground to-foreground/70";

const prosData = [
  {
    id: 1,
    icon: CheckCircle,
    title: "Genuine Payouts",
    description: "Verified freelance and contract payments.",
    gradient: TRUST_BRAND_GRADIENT,
  },
  {
    id: 2,
    icon: Globe,
    title: "Global Exposure",
    description: "Connecting Tier-2/3 city talent with global startups.",
    gradient: TRUST_BRAND_GRADIENT,
  },
  {
    id: 3,
    icon: Clock,
    title: "Massive Time Savings",
    description: "Eliminate repetitive introduction calls.",
    gradient: TRUST_BRAND_GRADIENT,
  },
];

// FAQ data with exact copy from requirements
const faqData = [
  {
    id: 1,
    question: "What about ghosting?",
    answer:
      "While supply-demand gaps exist, we are optimizing our matching algorithms to ensure higher responsiveness for qualified candidates.",
  },
  {
    id: 2,
    question: "Are there technical glitches?",
    answer:
      "We are continuously deploying patches to improve voice recognition and platform stability during AI interviews.",
  },
  {
    id: 3,
    question: "Is it safe from scams?",
    answer:
      "Always apply via the official Aureeture Dashboard. Our closed-loop ecosystem prevents fake referral links.",
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// FAQ Accordion Item Component
const FAQItem = ({
  faq,
  isOpen,
  onToggle,
}: {
  faq: (typeof faqData)[0];
  isOpen: boolean;
  onToggle: () => void;
}) => {
  return (
    <motion.div
      variants={itemVariants}
      className="group"
    >
      <div
        className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
          isOpen
            ? "border-primary/30 bg-card/80 shadow-lg shadow-primary/5"
            : "border-border/50 bg-card/40 hover:border-border"
        }`}
      >
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-xl" />

        <button
          onClick={onToggle}
          className="relative w-full px-6 py-5 flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              isOpen ? "bg-primary/20" : "bg-muted/50"
            }`}>
              <MessageCircleQuestion className={`w-5 h-5 transition-colors ${
                isOpen ? "text-primary" : "text-muted-foreground"
              }`} />
            </div>
            <span className={`text-lg font-semibold transition-colors ${
              isOpen ? "text-foreground" : "text-foreground/80"
            }`}>
              {faq.question}
            </span>
          </div>
          
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              isOpen ? "bg-primary/20" : "bg-muted/50"
            }`}
          >
            <ChevronDown className={`w-5 h-5 transition-colors ${
              isOpen ? "text-primary" : "text-muted-foreground"
            }`} />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="relative px-6 pb-6">
                <div className="pl-14 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export function TrustAndTransparency() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  return (
    <section className="relative py-16 lg:py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background" />
      <GridBackground className="absolute inset-0 opacity-10" />

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-muted rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-muted rounded-full blur-3xl" />

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
            <Shield className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Trust & Transparency</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
              The Reality of AI Hiring:
            <br />
            <span className="text-foreground/80">Transparent & Honest</span>
          </h2>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We believe in open communication about what works, what we're improving, 
            and how we're building a trustworthy platform for everyone.
          </p>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Column A: Why Users Stay (Pros) */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-border mb-4">
                <ThumbsUp className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Why Users Stay</span>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-foreground">
                Real Benefits, Real Impact
              </h3>
            </div>

            <div className="space-y-4">
              {prosData.map((pro) => (
                <motion.div
                  key={pro.id}
                  variants={itemVariants}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-md">
                    <div className="relative flex items-start gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                          <pro.icon className="w-6 h-6 text-foreground" />
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-foreground mb-1">
                          {pro.title}
                        </h4>
                        <p className="text-muted-foreground">
                          {pro.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Trust badge */}
            <motion.div
              variants={itemVariants}
              className="mt-8 p-6 rounded-2xl bg-muted border border-border"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-background flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-muted-foreground" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-foreground">10,000+</div>
                  <div className="text-sm text-muted-foreground">Students trust Aureeture</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Column B: Addressing Concerns (FAQ) */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-border mb-4">
                <MessageCircleQuestion className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Addressing Concerns</span>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-foreground">
                Your Questions, Answered Honestly
              </h3>
            </div>

            <div className="space-y-4">
              {faqData.map((faq) => (
                <FAQItem
                  key={faq.id}
                  faq={faq}
                  isOpen={openFAQ === faq.id}
                  onToggle={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
                />
              ))}
            </div>

            {/* Contact CTA */}
            <motion.div
              variants={itemVariants}
              className="mt-8 p-6 rounded-2xl border border-border bg-card"
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h4 className="text-lg font-bold text-foreground mb-1">
                    More questions?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    We're here to help and listen
                  </p>
                </div>
                <motion.a
                  href="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-medium text-sm hover:shadow-md transition-shadow"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MessageCircleQuestion className="w-4 h-4" />
                  Contact Us
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-16 lg:mt-20"
        >
          <div className="flex flex-wrap justify-center gap-8 lg:gap-16 text-center">
            {[
              { value: "24/7", label: "Support Availability" },
              { value: "100%", label: "Secure Transactions" },
              { value: "<24h", label: "Response Time" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <div className="text-3xl lg:text-4xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}







