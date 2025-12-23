"use client";

import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import ConditionalNavbar from "@/components/conditional-navbar";
import ConditionalFooter from "@/components/conditional-footer";
import SkipToContent from "@/components/skip-to-content";
import { clerkPublishableKey, isClerkConfigured } from "@/lib/clerk";

export default function Providers({ children }: { children: React.ReactNode }) {
  if (!isClerkConfigured) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn(
        "[auth] Clerk publishable key is missing; rendering without ClerkProvider.",
      );
    }

    return (
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SkipToContent />
        <ConditionalNavbar />
        <main id="main-content">{children}</main>
        <ConditionalFooter />
      </ThemeProvider>
    );
  }

  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SkipToContent />
        <ConditionalNavbar />
        <main id="main-content">{children}</main>
        <ConditionalFooter />
      </ThemeProvider>
    </ClerkProvider>
  );
}
