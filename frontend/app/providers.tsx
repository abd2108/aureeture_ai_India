"use client";

import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import ConditionalNavbar from "@/components/conditional-navbar";
import ConditionalFooter from "@/components/conditional-footer";
import SkipToContent from "@/components/skip-to-content";

const publishableKey =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  process.env.CLERK_PUBLISHABLE_KEY;

export default function Providers({ children }: { children: React.ReactNode }) {
  if (!publishableKey) {
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
    <ClerkProvider publishableKey={publishableKey}>
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
