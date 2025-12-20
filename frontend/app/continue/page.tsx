"use client";
import React, { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CurvedButton } from '@/components/ui/curved-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Users, Building2, GraduationCap, Briefcase, Target, Zap, Shield, ArrowRight,
    Award, Lightbulb, Globe, X, CheckCircle2, XCircle
} from 'lucide-react';

// --- Motion Variants (aligned with Velocity page) ---
const FADE_IN_UP = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const STAGGER_CONTAINER = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
};

// --- Reusable Components ---

const VideoModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isOpen) {
      v.currentTime = 0;
      v.muted = true; // autoplay policy
      v.play().catch(() => {});
    } else {
      v.pause();
      v.currentTime = 0;
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Button variant="ghost" size="icon" className="absolute top-4 right-4 z-10 text-white hover:bg-white/20" onClick={onClose}>
              <X className="w-6 h-6" />
            </Button>
            <video
              ref={videoRef}
              className="w-full h-full"
              src="https://res.cloudinary.com/dpisgqkxx/video/upload/v1758457882/Demo_h2jk5s.mp4"
              controls
              playsInline
              preload="metadata"
            >
              Sorry, your browser doesn't support embedded videos.
            </video>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const FeatureCard: FC<{ icon: React.ElementType; title: string; description: string; }> = ({ icon: Icon, title, description }) => (
    <div className="bg-card/50 dark:bg-neutral-900/50 p-4 sm:p-6 rounded-2xl border border-border/10 h-full text-left transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 min-w-0">
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
            <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-lg md:text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
);

// --- Main Page Component ---
const TalentMatchPage: React.FC = () => {
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

    const studentFeatures = [
        { icon: Briefcase, title: "Real Industry Experience", description: "No more simulated assignments. Solve real business challenges from top companies." },
        { icon: Award, title: "Build a Winning Portfolio", description: "Transform projects into a powerful career showcase that speaks directly to employers." },
        { icon: Zap, title: "Hybrid Opportunities", description: "Learn, freelance, and intern simultaneously in flexible formats that fit your schedule." },
    ];

    const industryFeatures = [
        { icon: Target, title: "Source Real Solutions", description: "Convert your business problems into student-led projects and discover innovative solutions." },
        { icon: Users, title: "Discover Talent Early", description: "Evaluate skills in action, not just on paper. Identify and nurture future hires." },
        { icon: Lightbulb, title: "Flexible Engagements", description: "Utilize freelance, micro-internships, or hybrid models to get work done efficiently." },
    ];

    const aureetureEdgeFeatures = [
        { icon: Zap, title: "AI-Powered Matching", description: "Dynamic pairing of projects with student skill graphs using advanced algorithms." },
        { icon: Shield, title: "Trust & Safety", description: "Comprehensive verification and structured workflows for both students and companies." },
        { icon: Globe, title: "Dynamic Formats", description: "Freelance, internships, project-based learning — a versatile platform for any need." },
        { icon: Target, title: "Career-Centric Pathways", description: "A structured roadmap for students, taking them from projects to portfolios to dream jobs." }
    ];

    return (
        <div className="min-h-screen w-full bg-background text-foreground relative overflow-hidden">
            
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="hidden sm:block absolute -top-20 -left-20 w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] md:w-[500px] md:h-[500px] bg-purple-500/10 rounded-full blur-3xl animate-aurora-1"></div>
                <div className="hidden sm:block absolute -bottom-20 -right-20 w-[220px] h-[220px] sm:w-[320px] sm:h-[320px] md:w-[400px] md:h-[400px] bg-blue-500/10 rounded-full blur-3xl animate-aurora-2"></div>
            </div>

            <main>
                {/* --- Hero Section (Increased Top Padding) --- */}
                <section className="relative text-center pt-24 md:pt-32 lg:pt-40 pb-20 px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <Badge variant="outline" className="mb-4 backdrop-blur-sm">🚀 The Future of Learning-to-Earning</Badge>
                        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight max-w-4xl mx-auto">
                            Redefining Student–Industry Collaboration
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
                            Aureeture is the ecosystem where ambitious students meet innovative companies to solve real-world challenges.
                        </p>
                        
                        {/* Additional CTA Buttons as requested */}
                        <div className="mt-4 flex flex-col sm:flex-row gap-4 justify-center">
                            <CurvedButton gradient className="w-full sm:w-auto">
                              Join as a Founder/Recruiter
                            </CurvedButton>
                            <CurvedButton variant="outline" className="backdrop-blur-sm w-full sm:w-auto">
                              Join as a Student <ArrowRight className="w-4 h-4 ml-2" />
                            </CurvedButton>
                        </div>
                    </motion.div>
                </section>
                
                {/* --- The Aureeture Difference Section --- */}
                <section id="difference" className="section bg-card/30 dark:bg-neutral-900/30 scroll-mt-28">
                    <div className="section-container">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold">The Aureeture Difference</h2>
                        </motion.div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            <motion.div variants={FADE_IN_UP} whileInView="visible" initial="hidden" viewport={{ once: true, amount: 0.3 }} className="bg-card/50 dark:bg-neutral-900/50 p-6 rounded-2xl border border-border/10">
                                <h3 className="text-xl font-bold mb-4 text-center">Other Platforms</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-start text-muted-foreground">
                                        <XCircle className="w-5 h-5 text-red-500 mr-3 mt-1 flex-shrink-0" />
                                        <span>Endless low-paying gigs</span>
                                    </li>
                                    <li className="flex items-start text-muted-foreground">
                                        <XCircle className="w-5 h-5 text-red-500 mr-3 mt-1 flex-shrink-0" />
                                        <span>Resumes that reveal nothing</span>
                                    </li>
                                    <li className="flex items-start text-muted-foreground">
                                        <XCircle className="w-5 h-5 text-red-500 mr-3 mt-1 flex-shrink-0" />
                                        <span>Simple keyword-based matches</span>
                                    </li>
                                    <li className="flex items-start text-muted-foreground">
                                        <XCircle className="w-5 h-5 text-red-500 mr-3 mt-1 flex-shrink-0" />
                                        <span>Mediocre and unreliable results</span>
                                    </li>
                                    <li className="flex items-start text-muted-foreground">
                                        <XCircle className="w-5 h-5 text-red-500 mr-3 mt-1 flex-shrink-0" />
                                        <span>Time wasted on poor candidates</span>
                                    </li>
                                </ul>
                            </motion.div>
                            <motion.div variants={FADE_IN_UP} whileInView="visible" initial="hidden" viewport={{ once: true, amount: 0.3 }} className="bg-primary/10 p-6 rounded-2xl border border-primary/20">
                                <h3 className="text-xl font-bold mb-4 text-center text-primary">Aureeture</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-start">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                                        <span>AI reads real profiles from GitHub & LeetCode</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                                        <span>Deep skill-based matching</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                                        <span>Fair pay ($15/hr+) minimum</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                                        <span>Minimum $20K+ full-time roles</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                                        <span>No bad fits, only quality matches</span>
                                    </li>
                                </ul>
                            </motion.div>
                        </div>
                    </div>
                </section>
                
                {/* --- Platform Tabs Section --- */}
                <section id="platform" className="section bg-card/30 dark:bg-neutral-900/30 scroll-mt-28">
                    <div className="section-container">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold">A Platform for Growth</h2>
                            <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
                                We've built a two-sided marketplace that creates powerful opportunities for everyone.
                            </p>
                        </motion.div>
                        <Tabs defaultValue="students" className="w-full">
                            <TabsList className="w-full max-w-md mx-auto h-auto overflow-x-auto whitespace-nowrap gap-1">
                                <TabsTrigger value="students" className="py-2"><GraduationCap className="w-4 h-4 mr-2" />For Students</TabsTrigger>
                                <TabsTrigger value="industry" className="py-2"><Building2 className="w-4 h-4 mr-2" />For Industry</TabsTrigger>
                            </TabsList>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={Date.now()} // Force re-render for animation
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <TabsContent value="students" className="mt-8">
                                        <motion.div
                                          variants={STAGGER_CONTAINER}
                                          initial="hidden"
                                          whileInView="visible"
                                          viewport={{ once: true, amount: 0.2 }}
                                          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                                        >
                                            {studentFeatures.map((card, i) => (
                                              <motion.div key={i} variants={FADE_IN_UP}>
                                                <FeatureCard {...card} />
                                              </motion.div>
                                            ))}
                                        </motion.div>
                                    </TabsContent>
                                    <TabsContent value="industry" className="mt-8">
                                        <motion.div
                                          variants={STAGGER_CONTAINER}
                                          initial="hidden"
                                          whileInView="visible"
                                          viewport={{ once: true, amount: 0.2 }}
                                          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                                        >
                                            {industryFeatures.map((card, i) => (
                                              <motion.div key={i} variants={FADE_IN_UP}>
                                                <FeatureCard {...card} />
                                              </motion.div>
                                            ))}
                                        </motion.div>
                                    </TabsContent>
                                </motion.div>
                            </AnimatePresence>
                        </Tabs>
                    </div>
                </section>

                {/* --- Aureeture Edge Section --- */}
                <section id="features" className="section scroll-mt-28">
                    <div className="section-container">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold">The AureetureAI Edge</h2>
                            <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
                                Our technology ensures a seamless, safe, and effective experience for all users.
                            </p>
                        </motion.div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {aureetureEdgeFeatures.map((card, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                >
                                    <FeatureCard {...card} />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
                
                {/* --- Vision Section --- */}
                <section id="vision" className="section scroll-mt-28">
                    <div className="section-narrow text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.7 }}
                        >
                            <h2 className="text-3xl font-bold mb-4">Why This Matters</h2>
                            <p className="text-xl text-muted-foreground leading-relaxed">
                                For decades, education and industry have lived in parallel universes. Aureeture is designed to collapse this gap, creating a fluid channel where knowledge meets application, and potential meets opportunity.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* --- Final CTA Section --- */}
                <section id="cta" className="section scroll-mt-28">
                    <div className="section-container">
                        <motion.div
                             initial={{ opacity: 0, y: 30 }}
                             whileInView={{ opacity: 1, y: 0 }}
                             viewport={{ once: true, amount: 0.5 }}
                             transition={{ duration: 0.8 }}
                             className="relative p-8 md:p-12 text-center bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-2xl overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]"></div>
                            <div className="relative z-10">
                                <h2 className="text-3xl md:text-4xl font-bold mb-4">Join the Movement</h2>
                                <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                                    Whether you're a student ready to prove your skills, an industry partner seeking fresh talent, or an institution looking to empower your students — there's a place for you here.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <CurvedButton gradient className="from-accent to-accent/80 w-full sm:w-auto">
                                      Get Started Today
                                    </CurvedButton>
                                    <CurvedButton
                                      variant="outline"
                                      className="bg-transparent border-primary-foreground/50 hover:bg-primary-foreground/10 w-full sm:w-auto"
                                      onClick={() =>
                                        window.open(
                                          "https://cal.com/aureetureai-india/30min",
                                          "_blank",
                                          "noopener,noreferrer"
                                        )
                                      }
                                    >
                                      Schedule a Demo
                                    </CurvedButton>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>

            <VideoModal isOpen={isVideoModalOpen} onClose={() => setIsVideoModalOpen(false)} />
        </div>
    );
};

export default TalentMatchPage;