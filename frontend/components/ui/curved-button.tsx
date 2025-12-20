"use client";

import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CurvedButtonProps extends ButtonProps {
  arrow?: boolean; // show right arrow
  leftIcon?: React.ReactNode; // optional left icon
  gradient?: boolean; // apply built-in gradient style
}

export const CurvedButton = React.forwardRef<HTMLButtonElement, CurvedButtonProps>(
  ({ className, arrow = true, leftIcon, gradient = false, children, size = "lg", variant, ...props }, ref) => {
    const [pressed, setPressed] = React.useState(false);
    const handleMouseDown = () => {
      setPressed(true);
      window.setTimeout(() => setPressed(false), 350);
    };
    return (
      <Button
        ref={ref}
        size={size}
        variant={variant}
        className={cn(
          "group relative overflow-hidden rounded-full px-5 py-3 text-base md:px-8 md:py-6 md:text-lg font-semibold active:scale-[0.98]",
          "transition-all duration-300 shadow-md hover:shadow-xl",
          gradient && "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:opacity-95",
          // glossy curve highlight
          "before:absolute before:inset-0 before:rounded-full before:bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.25),transparent_60%)] before:opacity-0 before:transition-opacity before:duration-300 group-hover:before:opacity-100",
          // subtle bottom glow arc
          "after:pointer-events-none after:absolute after:-inset-x-10 after:-bottom-10 after:h-20 after:rounded-[50%] after:bg-current/10 after:blur-2xl",
          className
        )}
        onMouseDown={(e) => {
          handleMouseDown();
          props.onMouseDown?.(e);
        }}
        {...props}
      >
        {/* Ripple effect (centered) */}
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-current/15"
          style={{
            width: "220%",
            height: "220%",
            transition: "transform 500ms ease, opacity 500ms ease",
            transform: pressed ? "translate(-50%, -50%) scale(1)" : "translate(-50%, -50%) scale(0)",
            opacity: pressed ? 1 : 0,
            borderRadius: 9999,
          }}
        />
        <span className="relative z-10 flex items-center justify-center">
          {leftIcon && <span className="mr-2 inline-flex items-center">{leftIcon}</span>}
          <span>{children}</span>
          {arrow && (
            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          )}
        </span>
      </Button>
    );
  }
);
CurvedButton.displayName = "CurvedButton";
