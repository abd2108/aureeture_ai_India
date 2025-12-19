import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us | AureetureAI",
  description:
    "Have questions about your career journey or our AI copilots? Get in touch with AureetureAI – we're here to help every step of the way.",
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
