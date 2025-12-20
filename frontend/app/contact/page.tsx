"use client"

import React from "react"
import { useForm } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { MapPin, Phone, Mail, Clock, MailCheck, PhoneCall, MessageSquareText, Loader2, Linkedin, Twitter, Github, User } from "lucide-react"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

type ContactFormValues = {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

export default function ContactPage() {
  const form = useForm<ContactFormValues>({
    defaultValues: { name: "", email: "", phone: "", subject: "", message: "" },
  })
  const { toast } = useToast()
  const [submitting, setSubmitting] = React.useState(false)
  const [showSuccess, setShowSuccess] = React.useState(false)
  const messageValue = form.watch("message") || ""
  const messageLimit = 1000

  async function onSubmit(values: ContactFormValues) {
    try {
      setSubmitting(true)
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || ""
      const res = await fetch(`${apiUrl}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      if (!res.ok) throw new Error("Failed to submit")
      form.reset()
      setShowSuccess(true)
    } catch (e) {
      toast({ title: "Something went wrong", description: "Please try again later.", variant: "destructive" })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen pt-28 pb-16">
      <Toaster />
      {showSuccess && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-success-title"
          onClick={() => setShowSuccess(false)}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="relative z-10 w-full max-w-md rounded-xl border bg-background p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center space-y-2">
              <h3 id="contact-success-title" className="text-2xl font-semibold">Thank you!</h3>
              <p className="text-muted-foreground">Thank you for contacting us. Our team will reach out to you very shortly.</p>
            </div>
            <div className="mt-6 flex justify-center">
              <Button className="rounded-full" onClick={() => setShowSuccess(false)}>Okay</Button>
            </div>
          </div>
        </div>
      )}
      <section className="container mx-auto px-4 max-w-6xl">
        {/* Breadcrumb + Hero */}
        <div className="mb-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Contact</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Contact Us</h1>
          <p className="text-muted-foreground mt-3 max-w-3xl mx-auto">Have questions about your career journey? Want to learn more about our AI copilots? We're here to help you every step of the way.</p>
          <p className="text-base mt-3 max-w-2xl mx-auto">Ready to transform your career with AI-powered guidance? Reach out to us and let's start your journey to success.</p>
        </div>

        {/* Quick Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <Card>
            <CardContent className="p-5 flex items-start gap-4">
              <div className="p-3 rounded-full bg-primary/10 text-primary"><MailCheck className="h-5 w-5" /></div>
              <div>
                <div className="font-medium">Email Us</div>
                <a href="mailto:career@aureeture.in" className="text-sm text-primary hover:underline">career@aureeture.in</a>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-start gap-4">
              <div className="p-3 rounded-full bg-primary/10 text-primary"><PhoneCall className="h-5 w-5" /></div>
              <div>
                <div className="font-medium">Call Us</div>
                <a href="tel:+917518496446" className="text-sm text-primary hover:underline">+91 7518496446</a>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-start gap-4">
              <div className="p-3 rounded-full bg-primary/10 text-primary"><MessageSquareText className="h-5 w-5" /></div>
              <div>
                <div className="font-medium">Socials</div>
                <div className="flex items-center gap-3 mt-1 text-muted-foreground">
                  <a href="https://www.linkedin.com/company/aureeture" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin className="h-4 w-4 hover:text-primary" /></a>
                  <a href="https://twitter.com/" target="_blank" rel="noreferrer" aria-label="Twitter"><Twitter className="h-4 w-4 hover:text-primary" /></a>
                  <a href="https://github.com/" target="_blank" rel="noreferrer" aria-label="GitHub"><Github className="h-4 w-4 hover:text-primary" /></a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>Fill out the form and our team will reach out to you shortly.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    rules={{ required: "Name is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input placeholder="Your full name" {...field} disabled={submitting} className="pl-10" />
                            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                              <User className="h-4 w-4" />
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    rules={{ required: "Email is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input type="email" placeholder="you@example.com" {...field} disabled={submitting} className="pl-10" />
                            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                              <Mail className="h-4 w-4" />
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone (optional)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input type="tel" placeholder="+91 75184 96446" {...field} disabled={submitting} className="pl-10" />
                            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                              <Phone className="h-4 w-4" />
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subject"
                    rules={{ required: "Subject is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input placeholder="How can we help?" {...field} disabled={submitting} className="pl-10" />
                            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                              <MessageSquareText className="h-4 w-4" />
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    rules={{ required: "Message is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message *</FormLabel>
                        <FormControl>
                          <div>
                            <Textarea rows={6} placeholder="Write your message here..." {...field} disabled={submitting} maxLength={messageLimit} />
                            <div className="mt-1 text-xs text-muted-foreground text-right">{messageValue.length}/{messageLimit}</div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-2">
                    <Button type="submit" className="rounded-full" disabled={submitting}>
                      {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 
                      {submitting ? "Sending..." : "Send Message"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Reach out directly via the details below.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <span className="block font-medium">Location</span>
                    <p className="text-muted-foreground">Bangalore, Karnataka, India</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <span className="block font-medium">Phone</span>
                    <a href="tel:+917518496446" className="text-primary hover:underline">+91 7518496446</a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <span className="block font-medium">Email</span>
                    <a href="mailto:career@aureeture.in" className="text-primary hover:underline">career@aureeture.in</a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <span className="block font-medium">Business Hours</span>
                    <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 6:00 PM IST</p>
                    <p className="text-muted-foreground">Saturday: 10:00 AM - 4:00 PM IST</p>
                    <p className="text-muted-foreground">Sunday: Closed</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Our Location</CardTitle>
              <CardDescription>Find us on the map</CardDescription>
            </CardHeader>
            <CardContent>
              <AspectRatio ratio={16 / 9}>
                <iframe
                  title="AureetureAI Location"
                  src="https://www.google.com/maps?q=Bangalore,+Karnataka,+India&output=embed"
                  className="h-full w-full rounded-md border"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </AspectRatio>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold tracking-tight">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Quick answers to common questions about Aureeture</p>
          </div>
          <Accordion type="single" collapsible className="w-full grid gap-4 lg:grid-cols-2">
            <AccordionItem value="q1">
              <AccordionTrigger>How does the AI copilot matching work?</AccordionTrigger>
              <AccordionContent>
                Our AI analyzes your skills, interests, and career goals through a comprehensive assessment to match you with the most suitable copilot for your journey.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>Are the projects from real companies?</AccordionTrigger>
              <AccordionContent>
                Yes! We partner with top companies like Netflix, Amazon, and Google to provide authentic, real-world challenges that build your portfolio.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>How long does it take to see results?</AccordionTrigger>
              <AccordionContent>
                Most students see significant progress within 4-6 weeks, with many landing their first job within 3-4 months of starting their journey.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>Is there a free trial available?</AccordionTrigger>
              <AccordionContent>
                Yes! You can take our career assessment and explore your matched copilot for free. No credit card required to get started.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* CTA Band */}
        <div className="mt-12 rounded-xl border bg-muted/30 p-6 text-center">
          <h3 className="text-xl font-semibold">Prefer a quick call?</h3>
          <p className="text-muted-foreground mt-1">Schedule a 15-minute intro and get answers faster.</p>
          <div className="mt-3">
            <a href="mailto:career@aureeture.in?subject=Book%20a%20quick%20call" className="inline-block">
              <Button className="rounded-full">Book a quick call</Button>
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
