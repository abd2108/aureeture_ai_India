"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { CurvedNavShell } from "@/components/ui/curved-nav-shell";

// Synced with the main page's section IDs
const navItems = [
  { id: "overview", label: "Overview", color: "sky" },
  { id: "pillars", label: "Features", color: "purple" },
  { id: "advantage", label: "Advantage", color: "mint" },
  { id: "about-us", label: "About", color: "yellow" },
];

const EnterpriseNavbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("overview");
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
            
            let currentSectionId = "";
            for (const item of navItems) {
                const element = document.getElementById(item.id);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    // Section is considered active if its top is within 150px of the top of the viewport
                    if (rect.top <= 150 && rect.bottom >= 150) {
                        currentSectionId = item.id;
                        break;
                    }
                }
            }

            if (currentSectionId) {
                setActiveSection(currentSectionId);
            } else if (window.scrollY < 200) {
                 setActiveSection("overview");
            }
        };
        
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const yOffset = -100; // Offset for the fixed navbar height
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: "smooth" });
        }
        setMobileMenuOpen(false);
    };

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    // Close mobile menu on outside click
    useEffect(() => {
        if (!mobileMenuOpen) return;
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMobileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [mobileMenuOpen]);

    if (!mounted) {
        return null; // Avoid rendering mismatch
    }

    return (
        <>
        <nav className="fixed top-0 left-0 right-0 z-50" role="navigation" aria-label="Enterprise navigation">
            {/* Transparent when at top and mobile menu closed */}
            <CurvedNavShell className="px-2 pt-2" transparent={!isScrolled && !mobileMenuOpen}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    <Link href="/" className="flex items-center gap-3 group" aria-label="Aureeture Home">
                        <span className="relative h-10 md:h-12 w-auto">
                            <Image
                                src="/brand/logo-dark.png"
                                alt="AureetureAI"
                                width={240}
                                height={56}
                                priority
                                className="hidden dark:block h-full w-auto"
                            />
                            <Image
                                src="/brand/logo-light.png"
                                alt="AureetureAI"
                                width={240}
                                height={56}
                                priority
                                className="block dark:hidden h-full w-auto"
                            />
                        </span>
                        <span className="sr-only">Aureeture Enterprise</span>
                    </Link>

                    <div className="hidden lg:flex items-center justify-center flex-1">
                        <ul
                            className="flex items-center gap-2 bg-background/60 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 shadow-inner dark:shadow-black/20"
                            role="menubar"
                            aria-label="Primary"
                        >
                            {navItems.map((item) => (
                                <li key={item.id} role="none">
                                    <button
                                        onClick={() => scrollToSection(item.id)}
                                        className={
                                            `px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ` +
                                            `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ` +
                                            `focus-visible:ring-offset-2 focus-visible:ring-offset-background ` +
                                            (activeSection === item.id
                                                ? `text-primary bg-primary/10`
                                                : `text-muted-foreground hover:text-white`)
                                        }
                                        role="menuitem"
                                        aria-current={activeSection === item.id ? "true" : undefined}
                                    >
                                        {item.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="hidden lg:flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
                            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        </Button>
                        <Link href="/contact" className="hidden md:block">
                            <Button variant="outline" className="rounded-full">
                                Contact
                            </Button>
                        </Link>
                        <Button onClick={() => scrollToSection("book-a-demo")} className="rounded-full shadow-lg hover:shadow-primary/50 transition-shadow">
                            Book Demo
                        </Button>
                    </div>

                    <div className="flex items-center gap-2 lg:hidden">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={toggleTheme}
                          className="rounded-full focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
                        >
                          <Sun className="size-5 dark:hidden" />
                          <Moon className="size-5 hidden dark:block" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                          className="rounded-full focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                          aria-expanded={mobileMenuOpen}
                        >
                          <AnimatePresence mode="wait">
                            {mobileMenuOpen ? <X key="x" className="size-5" /> : <Menu key="menu" className="size-5" />}
                          </AnimatePresence>
                        </Button>
                    </div>
                </div>
            </div>
            </CurvedNavShell>
        </nav>

            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                      key="enterprise-mobile-menu"
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="lg:hidden absolute right-4 top-20 w-72 z-50 origin-top-right"
                    >
                      <div
                        ref={menuRef}
                        className="rounded-2xl bg-[#0B1221]/95 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50 p-4 flex flex-col gap-3 text-sm text-white"
                      >
                        <ul className="flex flex-col gap-1">
                                {navItems.map((item) => (
                                    <li key={item.id}>
                                        <button
                                            onClick={() => scrollToSection(item.id)}
                                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                                  activeSection === item.id
                                    ? "bg-white/10 text-white"
                                    : "text-white/80 hover:bg-white/5 hover:text-white"
                                }`}
                                        >
                                            {item.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        <div className="pt-3 mt-2 border-t border-white/10 space-y-2">
                                <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                            <Button
                              variant="outline"
                              className="w-full justify-center rounded-full border-white/20 text-white hover:bg-white/5"
                            >
                              Contact
                            </Button>
                                </Link>
                          <Button
                            onClick={() => scrollToSection("book-a-demo")}
                            className="w-full justify-center rounded-full bg-white text-black hover:bg-white/90"
                          >
                            Book Demo
                          </Button>
                        </div>
                            </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default EnterpriseNavbar;