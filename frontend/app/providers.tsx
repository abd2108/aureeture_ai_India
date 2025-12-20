"use client";

import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import ConditionalNavbar from "@/components/conditional-navbar";
import ConditionalFooter from "@/components/conditional-footer";
import SkipToContent from "@/components/skip-to-content";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
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
