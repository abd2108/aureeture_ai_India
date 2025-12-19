"use client";

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from "@/components/ui/button";

/**
 * A sleek, icon-only theme toggle component that animates seamlessly
 * between light and dark mode icons.
 */
const ThemeToggle: React.FC = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // This useEffect hook ensures the component only renders on the client,
    // preventing a hydration mismatch between the server and client.
    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    // Before the component is mounted on the client, render a disabled
    // placeholder to prevent layout shift and provide a visual cue.
    if (!mounted) {
        return (
            <Button
                variant="outline"
                size="icon"
                disabled
                aria-label="Toggle theme"
            >
                <Sun className="h-[1.2rem] w-[1.2rem] opacity-50" />
            </Button>
        );
    }

    const isDarkMode = theme === 'dark';

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="relative" // A positioning context for the icons
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={isDarkMode ? "moon" : "sun"}
                    initial={{ y: -20, opacity: 0, rotate: -90 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: 20, opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="absolute" // Position icons on top of each other
                >
                    {isDarkMode ? (
                        <Moon className="h-[1.2rem] w-[1.2rem]" />
                    ) : (
                        <Sun className="h-[1.2rem] w-[1.2rem]" />
                    )}
                </motion.div>
            </AnimatePresence>
        </Button>
    );
};

export default ThemeToggle;