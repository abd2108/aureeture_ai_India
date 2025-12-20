"use client"

import React from "react"

export default function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 z-[1000] bg-primary text-primary-foreground px-4 py-2 rounded-md shadow"
    >
      Skip to content
    </a>
  )
}
