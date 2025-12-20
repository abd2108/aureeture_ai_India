"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { X, CheckCircle2 } from "lucide-react"; // <-- Import the success icon

interface LeadModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  onSubmit?: (data: { name: string; email: string; mobile: string }) => void;
}

export const LeadModal: React.FC<LeadModalProps> = ({
  open,
  onClose,
  title = "Start your journey",
  description = "Share your details and we’ll follow up with next steps.",
  onSubmit,
}) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const firstFieldRef = useRef<HTMLInputElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [countryCode, setCountryCode] = useState("+91");
  const { toast } = useToast();
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; mobile?: string }>({});
  const [success, setSuccess] = useState(false);

  // Analytics helper
  const trackEvent = (event: string, payload: Record<string, any> = {}) => {
    try {
      (window as any).dataLayer?.push({ event, ...payload });
    } catch {}
  };

  // Handle ESC key to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Set default country code
  useEffect(() => {
    try {
      const fromEnv = (process.env.NEXT_PUBLIC_DEFAULT_COUNTRY || "").trim();
      if (fromEnv.startsWith("+")) {
        setCountryCode(fromEnv);
        return;
      }
      const lang = navigator.language || "en-US";
      if (/-IN$/i.test(lang)) setCountryCode("+91");
      else if (/-US$/i.test(lang)) setCountryCode("+1");
    } catch {}
  }, []);

  // Autofocus on the first field when the modal opens
  useEffect(() => {
    if (open) {
      setTimeout(() => firstFieldRef.current?.focus(), 0);
    }
  }, [open]);

  // Derived state for form validation
  const isValidName = useMemo(() => name.trim().length >= 2, [name]);
  const isValidEmail = useMemo(() => /.+@.+\..+/.test(email.trim()), [email]);
  const isValidMobile = useMemo(() => mobile.replace(/\D/g, "").length >= 7 && mobile.replace(/\D/g, "").length <= 15, [mobile]);
  const canSubmit = isValidName && isValidEmail && isValidMobile && !submitting;

  // Main Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    
    setSubmitting(true);
    
    try {
      const url = new URL(window.location.href);
      const utm = Object.fromEntries(Array.from(url.searchParams.entries()).filter(([k]) => k.startsWith("utm_")));
      trackEvent("lead_submit_attempt", { page: url.pathname });

      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
      
      const res = await fetch(`${apiUrl}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          mobile: `${countryCode} ${mobile}`,
          utm,
          page: url.pathname,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFieldErrors(data?.errors || {});
        toast({ title: "Submission failed", description: data?.message || "Please check your details and try again.", variant: "destructive" });
        trackEvent("lead_submit_error", { page: url.pathname, message: data?.message });
        return;
      }
      
      toast({ title: "Success!", description: "Your submission has been received." });
      setSuccess(true);
      trackEvent("lead_submit_success", { page: url.pathname });

    } catch (error) {
        console.error("Submission error:", error);
        toast({ title: "An error occurred", description: "Could not connect to the server. Please try again later.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] bg-black/40 flex items-center justify-center p-2 sm:p-4"
          onClick={onClose}
        >
          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg bg-background text-foreground border border-border rounded-xl shadow-xl overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label={title}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              aria-label="Close"
              className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-md border border-border hover:bg-muted transition"
              onClick={onClose}
              ref={closeBtnRef}
            >
              <X className="h-4 w-4" />
            </button>
            <div className="p-6 md:p-8">
              <AnimatePresence mode="wait">
                {success ? (
                  // --- UPDATED SUCCESS MESSAGE ---
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-center py-6 flex flex-col items-center"
                  >
                    <CheckCircle2 className="w-12 h-12 text-green-500 mb-4" />
                    <h4 className="text-xl font-semibold">Application Submitted!</h4>
                    <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                      Thank you for your interest. Our team will review your details and reach out to you shortly.
                    </p>
                    <div className="mt-6">
                      <Button onClick={onClose}>Close</Button>
                    </div>
                  </motion.div>
                ) : (
                  // --- FORM VIEW ---
                  <motion.div
                    key="form"
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="text-center mb-6">
                      <h3 className="text-xl md:text-2xl font-semibold tracking-tight">{title}</h3>
                      <p className="text-muted-foreground mt-2 text-sm">{description}</p>
                    </div>
                    <form onSubmit={handleSubmit} className="grid gap-4">
                      {/* Name */}
                      <div>
                        <label htmlFor="lead-name" className="block text-sm font-medium mb-1">Full name</label>
                        <Input id="lead-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., John Doe" required className="h-11" ref={firstFieldRef} />
                        {fieldErrors.name && <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>}
                      </div>
                      {/* Email */}
                      <div>
                        <label htmlFor="lead-email" className="block text-sm font-medium mb-1">Email</label>
                        <Input id="lead-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" required className="h-11"/>
                        {fieldErrors.email && <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>}
                      </div>
                      {/* Mobile */}
                      <div>
                        <label htmlFor="lead-mobile" className="block text-sm font-medium mb-1">Mobile</label>
                        <div className="flex gap-2">
                           <select aria-label="Country code" value={countryCode} onChange={(e) => setCountryCode(e.target.value)} className="h-11 w-[100px] rounded-md border bg-background px-2" >
                             <option value="+91">+91 (IN)</option>
                             <option value="+1">+1 (US)</option>
                             <option value="+44">+44 (UK)</option>
                           </select>
                           <Input id="lead-mobile" type="tel" value={mobile} onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, ''))} placeholder="98765 43210" required className="h-11 flex-1"/>
                        </div>
                         {fieldErrors.mobile && <p className="text-xs text-red-500 mt-1">{fieldErrors.mobile}</p>}
                      </div>
                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-end">
                        <Button type="submit" className="sm:w-auto" disabled={!canSubmit}>
                          {submitting ? "Submitting…" : "Submit"}
                        </Button>
                        <Button type="button" variant="outline" onClick={onClose} className="sm:w-auto">Cancel</Button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};