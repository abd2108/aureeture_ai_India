"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Menu, X, ArrowRight } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { CurvedNavShell } from "@/components/ui/curved-nav-shell"
import { usePathname } from "next/navigation"

// Define navigation items in an array for easier mapping and maintenance
const navItems = [
  { href: "/", label: "Home" },
  { href: "/velocity-cohort", label: "Velocity Cohort" },
  { href: "/enterprise", label: "Enterprise" },
  { href: "/continue", label: "Continue" },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  // Effect for mounting and scroll listener
  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
  
  // Effect to close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }
  
  const NavLink = ({
    href,
    label,
    variant = "desktop",
  }: {
    href: string
    label: string
    variant?: "desktop" | "mobile"
  }) => {
    const isActive = pathname === href
    const baseClasses =
      "block px-4 py-2 text-sm font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"

    const desktopClasses =
      "lg:inline-block rounded-full " +
      (isActive
        ? "text-primary bg-primary/10"
        : "text-muted-foreground hover:text-primary hover:bg-muted/50")

    const mobileClasses =
      "w-full text-left rounded-lg " +
      (isActive
        ? "text-white bg-white/10"
        : "text-white/80 hover:bg-white/10 hover:text-white")

    return (
      <li role="none">
        <Link
          href={href}
          onClick={() => setMobileMenuOpen(false)}
          className={`${baseClasses} ${
            variant === "desktop" ? desktopClasses : mobileClasses
          }`}
          aria-current={isActive ? "page" : undefined}
          role="menuitem"
        >
          {label}
        </Link>
      </li>
    )
  }

  // ✨ NEW: Grouped action items into a reusable component for clarity
  const ActionButtons = ({ inMobileMenu = false }: { inMobileMenu?: boolean }) => {
    const primaryMobileClasses = inMobileMenu
      ? "bg-white text-black hover:bg-white/90"
      : ""

    return (
    <div className={`flex items-center gap-2 ${inMobileMenu ? 'flex-col w-full' : ''}`}>
      <div className={`flex items-center gap-2 ${inMobileMenu ? 'w-full justify-center' : ''}`}>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        >
          {mounted && (theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />)}
        </Button>
        <Button asChild variant="ghost" className="rounded-full text-muted-foreground">
          <Link href="/contact">Contact</Link>
        </Button>
      </div>

      <div className={inMobileMenu ? 'w-full' : ''}>
        <Button
          asChild
          size={inMobileMenu ? "default" : "sm"}
          className={`rounded-full shadow-lg hover:shadow-xl transition-shadow w-full ${
            !inMobileMenu && 'h-9 px-4 text-sm'
          } ${primaryMobileClasses}`}
        >
          <Link href="/career-explorer">
              Career Explorer
              <ArrowRight className="size-4 ml-2" />
            </Link>
          </Button>
      </div>
    </div>
  )};

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        role="navigation"
        aria-label="Main navigation"
      >
        <CurvedNavShell className={`px-2 ${pathname === "/" ? "pt-3" : "pt-2"}`} transparent={!isScrolled && !mobileMenuOpen}>
          <div className="container mx-auto px-2 md:px-4">
            <div className="flex items-center justify-between h-16 md:h-20">
            
              {/* Logo */}
              <Link 
                href="/" 
                className="flex items-center gap-2 group"
                aria-label="Aureeture - Go to homepage"
              >
                <span className="relative h-12 md:h-14 w-auto">
                  <Image
                    src="/brand/logo-dark.png"
                    alt="AureetureAI"
                    width={280}
                    height={64}
                    priority
                    className="hidden dark:block h-full w-auto"
                  />
                  <Image
                    src="/brand/logo-light.png"
                    alt="AureetureAI"
                    width={280}
                    height={64}
                    priority
                    className="block dark:hidden h-full w-auto"
                  />
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center gap-4">
                <ul
                  className={`flex items-center gap-1 rounded-full px-2 py-1 border 
                  ${!isScrolled && !mobileMenuOpen
                    ? "bg-transparent border-transparent"
                    : "bg-background/60 backdrop-blur-md border-border/50 shadow-sm"}
                  `}
                  role="menubar"
                  aria-label="Primary"
                >
                  {navItems.map((item) => <NavLink key={item.href} {...item} variant="desktop" />)}
                </ul>
                
                {/* ✨ CHANGE: Unified action group */}
                <div className="flex items-center gap-2">
                   <ActionButtons />
                </div>
              </div>

              {/* Mobile Menu Toggle */}
              <div className="flex items-center lg:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                  aria-expanded={mobileMenuOpen}
                  aria-controls="mobile-menu"
                  className="rounded-full focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
                </Button>
              </div>
            </div>
          </div>
        </CurvedNavShell>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              key="mobile-menu-panel"
              initial={{ opacity: 0, scale: 0.9, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute right-4 top-20 w-full max-w-xs rounded-2xl bg-black/90 text-white shadow-xl shadow-black/40 border border-white/10 backdrop-blur-md p-4 flex flex-col gap-4 origin-top-right"
              onClick={(e) => e.stopPropagation()}
              id="mobile-menu"
            >
              <ul className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <NavLink key={item.href} {...item} variant="mobile" />
                ))}
              </ul>
              <div className="pt-3 border-t border-white/10">
                <ActionButtons inMobileMenu={true} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}