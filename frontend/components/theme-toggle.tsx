"use client";

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { motion } from "framer-motion"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="theme-toggle">
        <div className="theme-toggle-slider" />
      </div>
    )
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className="theme-toggle group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <motion.div
        className="theme-toggle-slider flex items-center justify-center"
        animate={{
          x: theme === "dark" ? 26 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      >
        {theme === "dark" ? (
          <Moon className="w-4 h-4 text-foreground" />
        ) : (
          <Sun className="w-4 h-4 text-foreground" />
        )}
      </motion.div>
      
      {/* Background gradient animation */}
      <div className="absolute inset-0 rounded-full bg-gradient-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-accent blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
    </motion.button>
  )
}
