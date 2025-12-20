"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CurvedNavShellProps {
  className?: string;
  children: React.ReactNode;
  // When true, render no background UI so the navbar is fully transparent
  transparent?: boolean;
}

// A reusable shell that renders a subtle curved background from the edges.
// Works on both light/dark themes and supports translucency+blur.
export function CurvedNavShell({ className, children, transparent = false }: CurvedNavShellProps) {
  return (
    <div className={cn("relative isolate", className)}>
      {!transparent && (
        <>
          {/* Main translucent bar */}
          <div
            aria-hidden
            className="absolute inset-x-2 top-0 h-[72px] md:h-[80px] rounded-[999px] bg-background/70 backdrop-blur-xl border border-border/40 shadow-lg"
          />
          {/* Left curved glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -left-24 top-1/2 -translate-y-1/2 h-44 w-44 rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-2xl"
          />
          {/* Right curved glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 top-1/2 -translate-y-1/2 h-44 w-44 rounded-full bg-gradient-to-tr from-accent/20 to-transparent blur-2xl"
          />
        </>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default CurvedNavShell;

