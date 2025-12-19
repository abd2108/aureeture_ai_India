"use client"

import React from "react"
import Link from "next/link"
import { Mail, Phone, MapPin, Heart, Linkedin, Twitter, Github } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export default function Footer() {
  const { toast } = useToast()
  const [email, setEmail] = React.useState("")
  const [submitting, setSubmitting] = React.useState(false)

  async function onSubscribe(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    try {
      setSubmitting(true)
      // TODO: Wire to newsletter provider (e.g., Resend, Mailchimp, Buttondown)
      await new Promise((r) => setTimeout(r, 700))
      toast({ title: "Subscribed", description: "You will receive updates from Aureeture." })
      setEmail("")
    } catch (e) {
      toast({ title: "Subscription failed", description: "Please try again later.", variant: "destructive" })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <footer className="border-t bg-background relative">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary/5" aria-hidden="true" />
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand blurb */}
          <div>
            <h3 className="text-lg font-semibold">Aureeture</h3>
            <p className="mt-3 text-sm text-muted-foreground">
              Shaping the Future of Careers with GenAI. Empowering students to discover, plan, and achieve their dream careers through personalized AI guidance.
            </p>
            <div className="mt-4 flex items-center gap-3 text-muted-foreground">
              <a href="https://www.linkedin.com/company/aureeture" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-primary"><Linkedin className="h-5 w-5" /></a>
              <a href="https://twitter.com/" target="_blank" rel="noreferrer" aria-label="Twitter" className="hover:text-primary"><Twitter className="h-5 w-5" /></a>
              <a href="https://github.com/" target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-primary"><Github className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-semibold">Quick Links</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/enterprise" className="hover:text-primary">Enterprise</Link></li>
              <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
              <li><Link href="/continue" className="hover:text-primary">Continue</Link></li>
              <li><Link href="/velocity-cohort" className="hover:text-primary">Velocity Cohort</Link></li>
            </ul>
            <div className="mt-4">
              <h5 className="text-sm font-medium">Reserved</h5>
              <ul className="mt-2 space-y-2 text-xs text-muted-foreground">
                <li><Link href="/policies/privacy-policy" className="hover:text-primary">Privacy Policy</Link></li>
                <li><Link href="/policies/terms" className="hover:text-primary">Terms & Conditions</Link></li>
                <li><Link href="/policies/refund-cancellation" className="hover:text-primary">Refund & Cancellation Policy</Link></li>
                <li><Link href="/policies/return-policy" className="hover:text-primary">Return Policy</Link></li>
              </ul>
            </div>
          </div>

          {/* Get in Touch */}
          <div>
            <h4 className="text-base font-semibold">Get in Touch</h4>
            <ul className="mt-3 space-y-3 text-sm">
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /><a href="mailto:career@aureeture.in" className="hover:underline">career@aureeture.in</a></li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /><a href="tel:+917518496446" className="hover:underline">+91 7518496446</a></li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /><span>Bangalore, Karnataka</span></li>
            </ul>
          </div>

          {/* Subscribe */}
          <div>
            <h4 className="text-base font-semibold">Stay Updated</h4>
            <p className="mt-2 text-sm text-muted-foreground">Get updates on new features and career opportunities.</p>
            <form onSubmit={onSubscribe} className="mt-4 flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={submitting}
                aria-label="Email address"
              />
              <Button type="submit" disabled={submitting}>Subscribe</Button>
            </form>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 text-xs md:text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-3">
          <div>© 2025 Aureeture. All rights reserved.</div>
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-primary" aria-hidden="true" />
            <span>for the next generation of professionals</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
