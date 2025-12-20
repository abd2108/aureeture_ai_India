import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import ConditionalNavbar from "@/components/conditional-navbar"
import ConditionalFooter from "@/components/conditional-footer"
import SkipToContent from "@/components/skip-to-content"
import Providers from "./providers";
// Using system fonts to avoid Google Fonts loading issues
const systemFonts = {
  inter: {
    variable: "--font-inter",
    className: "font-sans",
  },
  mono: {
    variable: "--font-mono", 
    className: "font-mono",
  },
  heading: {
    variable: "--font-heading",
    className: "font-sans",
  },
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Aureeture - India's First GenAI Career Discovery LaunchPad",
    template: "%s | AureetureAI",
  },
  description:
    "Your GenAI Career Copilot. Discover your perfect career path from 500M+ possibilities using advanced AI technology. Connect with professionals, compare trajectories, and gain real-world experience.",
  keywords: [
    "GenAI",
    "career copilot",
    "career discovery",
    "students",
    "India",
    "jobs",
    "internships",
  ],
  openGraph: {
    type: "website",
    siteName: "AureetureAI",
    title: "Aureeture - India's First GenAI Career Discovery LaunchPad",
    description:
      "Your GenAI Career Copilot. Discover your perfect career path from 500M+ possibilities using advanced AI technology.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aureeture - India's First GenAI Career Discovery LaunchPad",
    description:
      "Your GenAI Career Copilot. Discover your perfect career path from 500M+ possibilities using advanced AI technology.",
    creator: "@aureeture",
  },
  alternates: {
    canonical: "/",
  },
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${systemFonts.inter.variable} ${systemFonts.mono.variable} ${systemFonts.heading.variable}`}
    >
      <body className={systemFonts.inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
