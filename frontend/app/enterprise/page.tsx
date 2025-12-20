"use client";

import React, { FC, ReactNode, useEffect, useRef, MouseEvent, useState } from 'react';
import { motion, useInView, useSpring, useTransform, easeInOut, easeOut, AnimatePresence } from "framer-motion";
import { Users, BarChart3, Shield, Zap, Award, TrendingUp, Lightbulb, GitMerge, BrainCircuit, Search, Briefcase, Target, User, Mail, Building, LucideIcon, Star, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import EnterpriseNavbar from '@/components/enterprise-navbar';
import { toast } from '@/components/ui/use-toast';

// --- ANIMATION VARIANTS (aligned with Velocity page styling) ---
const FADE_IN_UP = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const STAGGER_CONTAINER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

// --- DATA DEFINITIONS ---
const pillar1Features = [
    { icon: BrainCircuit, title: "Workforce Intelligence", description: "AI-driven skills gap analysis to identify development needs and map career paths." },
    { icon: TrendingUp, title: "Personalized Upskilling", description: "Deliver targeted learning modules, mentorship, and real-world projects to close skill gaps." },
    { icon: Award, title: "Internal Mobility", description: "Create a vibrant internal talent marketplace to retain top performers and reduce hiring costs." },
    { icon: BarChart3, title: "Talent Analytics", description: "Track progress, measure ROI, and make data-driven decisions on talent strategy." },
];
const pillar2Features = [
    { icon: Search, title: "Curated Talent Pipelines", description: "Access a pre-vetted pool of top students from premier institutions, aligned with your needs." },
    { icon: Briefcase, title: "Project-Based Internships", description: "Engage students with real-world projects, assess their skills, and identify future hires." },
    { icon: Lightbulb, title: "Hackathons & Innovation", description: "Sponsor challenges to source innovative ideas and discover entrepreneurial talent." },
    { icon: GitMerge, title: "Direct Campus Integration", description: "Become a preferred employer through our deep-rooted campus ambassador and club networks." },
];
const advantagePoints = [
    { icon: Zap, title: "Reduced Hiring Costs", description: "Build a sustainable talent pipeline, decreasing reliance on expensive external recruiting." },
    { icon: Shield, title: "Increased Retention", description: "Boost employee loyalty by investing in clear career growth paths and internal opportunities." },
    { icon: Lightbulb, title: "Continuous Innovation", description: "Infuse your organization with fresh ideas from the next generation of innovators." },
];
const trustedBy = [{ name: "IIT Bombay" }, { name: "BITS Pilani" }, { name: "IIM Ahmedabad" }, { name: "SRCC" }];

// --- REUSABLE UI COMPONENTS ---

const SectionHeading: FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
    <motion.div
      variants={FADE_IN_UP}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="text-center mb-12"
    >
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2 text-sm font-medium mb-6">
          ✨
          <span>Enterprise Suite</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-3">
          {title}
        </h2>
        <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">{subtitle}</p>
    </motion.div>
);

const GlassCard: FC<{ children: ReactNode; className?: string; glowColor?: 'sky' | 'purple' | 'pink' }> = ({ children, className, glowColor = 'sky' }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const colorMap = {
        sky: 'rgba(14, 165, 233, 0.15)',
        purple: 'rgba(168, 85, 247, 0.15)',
        pink: 'rgba(236, 72, 153, 0.15)',
    };

    const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        cardRef.current.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
        cardRef.current.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    };

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={onMouseMove}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: easeInOut }}
            className={`relative group bg-card/50 dark:bg-neutral-900/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl overflow-hidden ${className}`}
        >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), ${colorMap[glowColor]}, transparent 80%)` }} />
            <div className="relative z-10">{children}</div>
        </motion.div>
    );
};

const AnimatedStat: FC<{ value: number; suffix: string; className?: string }> = ({ value, suffix, className }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const spring = useSpring(0, { stiffness: 50, damping: 30 });
    const displayValue = useTransform(spring, (latest) => Math.round(latest));

    useEffect(() => { if (isInView) spring.set(value); }, [spring, isInView, value]);

    return <div ref={ref} className={className}><motion.span>{displayValue}</motion.span>{suffix}</div>;
};

const PillarCard: FC<{ title: string; features: { icon: LucideIcon; title: string; description: string }[], glowColor: 'sky' | 'purple' }> = ({ title, features, glowColor }) => (
    <GlassCard className="p-8 md:p-10" glowColor={glowColor}>
        <h3 className="text-2xl sm:text-3xl font-bold mb-8 text-center">{title}</h3>
        <motion.div variants={STAGGER_CONTAINER} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="space-y-6">
            {features.map(feature => (
                <motion.div key={feature.title} variants={FADE_IN_UP} className="flex items-start gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br from-accent-${glowColor}/20 to-accent-purple/20 rounded-lg flex items-center justify-center text-accent-${glowColor} flex-shrink-0 mt-1 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}><feature.icon size={24}/></div>
                    <div><p className="font-semibold text-base md:text-lg">{feature.title}</p><p className="text-muted-foreground leading-relaxed">{feature.description}</p></div>
                </motion.div>
            ))}
        </motion.div>
    </GlassCard>
);

// --- MAIN PAGE COMPONENT ---
export default function EnterprisePage() {
    // Form state for demo booking
    const [formData, setFormData] = useState({ name: '', email: '', company: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formState, setFormState] = useState<'idle' | 'success' | 'error'>('idle');

    const handleDemoSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormState('idle');

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
            const res = await fetch(`${apiUrl}/api/enterprise-demo`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    page: window.location.pathname,
                }),
            });

            if (!res.ok) {
                throw new Error('Submission failed');
            }

            // On successful save, show a brief toast and then redirect to Calendly
            const calendlyUrl = 'https://cal.com/aureetureai-india/30min';
            setFormState('success');
            setFormData({ name: '', email: '', company: '' });
            toast({
                title: 'Request received',
                description: 'Redirecting to scheduling…',
            });
            setTimeout(() => {
                window.location.href = calendlyUrl;
            }, 1000);
        } catch (error) {
            console.error('Demo submission error:', error);
            setFormState('error');
            toast({
                variant: 'destructive',
                title: 'Submission failed',
                description: 'Please try again.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="min-h-screen w-full bg-background text-foreground relative overflow-x-hidden">
            <EnterpriseNavbar />
            
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute w-[600px] h-[600px] bg-purple-500/15 dark:bg-purple-500/10 rounded-full blur-3xl animate-aurora-1 opacity-60"></div>
                <div className="absolute w-[500px] h-[500px] bg-sky-500/15 dark:bg-sky-500/10 rounded-full blur-3xl animate-aurora-2 opacity-60"></div>
            </div>
      
            <main className="space-y-16 md:space-y-20 pt-28 md:pt-32 pb-20">

                <section id="overview" className="section text-center scroll-mt-28">
                    <div className="section-container">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: easeOut }}>
                        <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/10 text-primary rounded-full px-4 py-1 text-sm font-medium mb-6">
                          <Star className="size-4" />
                          <span>The Integrated Talent Operating System</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold font-heading text-foreground">
                            Aureeture Enterprise Talent Cloud
                        </h1>
                        <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                            A single, intelligent solution to upskill your workforce and build a direct pipeline to India's most ambitious student talent.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                          <Button
                            onClick={() => document.getElementById('book-a-demo')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                            size="lg"
                            className="group relative overflow-hidden rounded-full bg-accent px-8 py-6 text-lg font-bold text-accent-foreground shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-accent/30"
                          >
                            <span className="flex items-center justify-center">
                              <span className="absolute top-0 left-0 h-full w-full bg-white/20 opacity-50 animate-subtle-shine group-hover:opacity-100"></span>
                              Request a Demo
                              <ArrowRight className="ml-2 size-5 transition-transform duration-300 group-hover:translate-x-1" />
                            </span>
                          </Button>
                          <Button
                            size="lg"
                            variant="outline"
                            className="rounded-full px-8 py-6 text-lg"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                          >
                            Learn More
                          </Button>
                        </div>
                    </motion.div>
                    </div>
                </section>

                <section id="pillars" className="section scroll-mt-28">
                    <div className="section-container">
                        <SectionHeading title="Two Pillars. One Cloud." subtitle="Empower your workforce and access future innovators with a unified talent platform." />
                        <motion.div variants={STAGGER_CONTAINER} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <PillarCard title="Pillar 1: Empower Your Workforce" features={pillar1Features} glowColor="sky" />
                            <PillarCard title="Pillar 2: Access Future Innovators" features={pillar2Features} glowColor="purple" />
                        </motion.div>
                    </div>
                </section>

                <section id="advantage" className="section scroll-mt-28">
                    <div className="section-container">
                    <SectionHeading title="The Unified Advantage" subtitle="By combining internal development with external talent sourcing, our Talent Cloud offers unparalleled strategic advantages." />
                    <motion.div variants={STAGGER_CONTAINER} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} className="grid md:grid-cols-3 gap-8">
                        {advantagePoints.map((point, i) => (
                            <motion.div key={point.title} variants={FADE_IN_UP}>
                            <GlassCard className="p-8 text-center transition-transform duration-300 hover:-translate-y-1" glowColor="pink">
                                <div className="w-16 h-16 bg-gradient-to-br from-accent-pink/20 to-accent-sky/20 rounded-full flex items-center justify-center text-primary mb-6 mx-auto"><point.icon size={32} className="text-accent-pink"/></div>
                                <h3 className="text-xl font-bold">{point.title}</h3>
                                <p className="text-muted-foreground mt-2">{point.description}</p>
                            </GlassCard>
                            </motion.div>
                        ))}
                    </motion.div>
                    </div>
                </section>
                
                <section id="about-us" className="section scroll-mt-28">
                    <div className="section-container">
                    <SectionHeading title="Intelligence Behind Your Talent Strategy" subtitle="Built on cutting-edge AI and comprehensive career intelligence to transform workforce development." />
                    <div className="grid lg:grid-cols-2 gap-8 items-stretch">
                        <div className="flex flex-col gap-8">
                            <GlassCard className="p-8 flex-1"><div className="flex items-center gap-4 mb-4"><Target className="h-8 w-8 text-accent-sky" /><h3 className="text-2xl font-bold">Our Mission</h3></div><p className="text-muted-foreground leading-relaxed">To democratize career discovery, enabling organizations to unlock human potential through AI-powered insights and personalized development pathways.</p></GlassCard>
                            <GlassCard className="p-8 flex-1"><div className="flex items-center gap-4 mb-4"><Award className="h-8 w-8 text-accent-purple" /><h3 className="text-2xl font-bold">Dataset Intelligence</h3></div><p className="text-muted-foreground leading-relaxed">Powered by 500M+ career trajectories and real-time market data to provide unprecedented workforce insights.</p></GlassCard>
                        </div>
                        <GlassCard className="p-8 flex flex-col justify-between gap-8">
                            <div>
                                <h3 className="text-2xl font-bold mb-6 text-center">Proven Impact</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="text-center"><AnimatedStat value={40} suffix="%" className="text-4xl font-bold text-accent-pink mb-2" /><p className="text-sm text-muted-foreground">Reduced Turnover</p></div>
                                    <div className="text-center"><AnimatedStat value={60} suffix="%" className="text-4xl font-bold text-accent-sky mb-2" /><p className="text-sm text-muted-foreground">Increased Mobility</p></div>
                                    <div className="text-center"><AnimatedStat value={500} suffix="M+" className="text-4xl font-bold text-accent-yellow mb-2" /><p className="text-sm text-muted-foreground">Career Paths</p></div>
                                    <div className="text-center"><div className="text-4xl font-bold text-accent-purple mb-2">24/7</div><p className="text-sm text-muted-foreground">Global Support</p></div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold mb-6 text-center">Trusted By Innovators</h3>
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    {trustedBy.map((partner) => (<div key={partner.name} className="p-3 bg-background/50 rounded-lg"><p className="font-semibold">{partner.name}</p></div>))}
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                    </div>
                </section>

                <section id="book-a-demo" className="section scroll-mt-28">
                    <div className="section-container">
                    <GlassCard className="p-8 md:p-12 lg:p-16">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="text-center lg:text-left">
                                <h2 className="text-4xl font-bold mb-4">Become a Partner in Innovation</h2>
                                <p className="text-lg text-muted-foreground mb-8">Let's discuss how the Aureeture Enterprise Talent Cloud can be tailored to your goals. In a brief demo, we'll show you how to:</p>
                                <ul className="space-y-3 text-left list-inside">
                                    <li className="flex items-center gap-3"><Zap className="h-5 w-5 text-accent-sky flex-shrink-0" /> Reduce hiring costs and time-to-fill.</li>
                                    <li className="flex items-center gap-3"><TrendingUp className="h-5 w-5 text-accent-sky flex-shrink-0" /> Boost employee retention and internal mobility.</li>
                                    <li className="flex items-center gap-3"><Lightbulb className="h-5 w-5 text-accent-sky flex-shrink-0" /> Build a sustainable pipeline of future leaders.</li>
                                </ul>
                            </div>
                            <div className="bg-background/50 p-8 rounded-xl border border-white/10">
                                <AnimatePresence mode="wait">
                                    {formState === 'success' ? (
                                        <motion.div
                                            key="success"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="text-center flex flex-col items-center justify-center min-h-[300px]"
                                        >
                                            <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                                            <h3 className="text-2xl font-bold">Request Sent!</h3>
                                            <p className="text-muted-foreground mt-2">Thank you. We'll be in touch shortly to schedule your demo.</p>
                                        </motion.div>
                                    ) : (
                                        <motion.div key="form" exit={{ opacity: 0, y: -10 }}>
                                            <h3 className="text-2xl font-bold text-center mb-6">Schedule Your Demo</h3>
                                            <form className="space-y-4" onSubmit={handleDemoSubmit}>
                                                <div className="relative">
                                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                                                    <Input name="name" type="text" placeholder="Your Name" className="h-12 pl-10" required value={formData.name} onChange={handleInputChange} />
                                                </div>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                                                    <Input name="email" type="email" placeholder="Work Email" className="h-12 pl-10" required value={formData.email} onChange={handleInputChange} />
                                                </div>
                                                <div className="relative">
                                                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                                                    <Input name="company" type="text" placeholder="Company / Institution" className="h-12 pl-10" required value={formData.company} onChange={handleInputChange} />
                                                </div>
                                                {formState === 'error' && (
                                                    <p className="text-sm text-red-500 text-center">Submission failed. Please try again.</p>
                                                )}
                                                <Button type="submit" size="lg" className="relative overflow-hidden w-full font-bold text-lg h-12 mt-4 rounded-full bg-accent text-accent-foreground shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-accent/30" disabled={isSubmitting}>
                                                    <span className="absolute inset-0 pointer-events-none opacity-50 animate-subtle-shine bg-white/20" />
                                                    <span className="relative">{isSubmitting ? 'Booking...' : 'Book My Demo'}</span>
                                                </Button>
                                            </form>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </GlassCard>
                    </div>
                </section>
            </main>
        </div>
    );
}