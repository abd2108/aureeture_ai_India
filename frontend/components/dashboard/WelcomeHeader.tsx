"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Sparkles, MessageSquare } from 'lucide-react';
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfile } from "@/contexts/ProfileContext";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Reusable Widget Component (Modified) ---

// We are temporarily removing the 'cardVariants' constant to debug the issue.
const Widget: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <motion.div
    // Animation properties are now directly inline
    initial={{ opacity: 0, scale: 0.95, y: 20 }}
    whileInView={{
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }}
    whileHover={{ scale: 1.01, y: -4 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.3, ease: 'easeInOut' }}
    className={cn(
      "overflow-hidden",
      "bg-card/60 dark:bg-neutral-900/60",
      "backdrop-blur-xl",
      "border border-border/20 dark:border-white/10",
      "rounded-2xl shadow-lg dark:shadow-2xl dark:shadow-black/20",
      className
    )}
  >
    {children}
  </motion.div>
);


// --- Enhanced WelcomeHeader Component (No changes needed here) ---

const getDisplayName = (userName?: string, userEmail?: string): string => {
  if (userName) { return userName.split(' ')[0]; }
  if (userEmail) {
    const namePart = userEmail.split('@')[0];
    return namePart.charAt(0).toUpperCase() + namePart.slice(1);
  }
  return "Innovator";
};

interface WelcomeHeaderProps {
  // No props needed - using profile context
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = () => {
  const { profile, getDisplayName, getInitials } = useProfile();
  return (
    <Widget className="p-6 sm:p-8">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        <div className="flex items-center gap-5">
          <div className="relative">
            <Avatar className="w-16 h-16 border-2 border-primary/20">
              <AvatarImage src={profile.profilePicture} alt={getDisplayName()} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-xl font-bold">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Ready to Innovate, <span className="text-primary">{getDisplayName()}</span>?
            </h1>
            <p className="text-muted-foreground mt-1 max-w-lg">
              {profile.bio || "Welcome to Aureeture! Let's turn your brilliant ideas into reality. Here's what you can do next."}
            </p>
            {profile.jobTitle && profile.company && (
              <p className="text-sm text-muted-foreground/80 mt-1">
                {profile.jobTitle} at {profile.company}
              </p>
            )}
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto self-end lg:self-center"
        >
          <Button variant="outline" className="w-full sm:w-auto justify-center">
            <MessageSquare className="w-4 h-4 mr-2" />
            Give Feedback
          </Button>
          <Button className="w-full sm:w-auto justify-center shadow-lg shadow-primary/40 hover:shadow-xl hover:shadow-primary/30 transition-shadow">
            <Bot className="w-4 h-4 mr-2" />
            Launch Copilot
          </Button>
        </motion.div>
      </div>
    </Widget>
  );
};

export default WelcomeHeader;