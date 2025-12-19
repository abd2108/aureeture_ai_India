"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

const policyLinks = [
  { href: "/policies/privacy-policy", label: "Privacy Policy" },
  { href: "/policies/terms", label: "Terms & Conditions" },
  { href: "/policies/refund-cancellation", label: "Refund & Cancellation" },
  { href: "/policies/return-policy", label: "Return Policy" },
];

interface PolicyLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function PolicyLayout({ title, children }: PolicyLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 md:py-12">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="mb-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <span className="text-muted-foreground">Legal</span>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </nav>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[240px_1fr] lg:gap-12">
        {/* Sticky Sidebar Navigation */}
        <aside className="hidden md:block">
          <nav className="sticky top-24 space-y-1">
            <h2 className="mb-4 px-3 text-sm font-semibold tracking-tight text-foreground/90">
              Legal Documents
            </h2>
            <ul className="space-y-1">
              {policyLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Mobile Navigation (Dropdown or Horizontal Scroll can be added here if needed) */}
        
        {/* Main Content Area */}
        <main className="min-w-0">
          <header className="mb-8 border-b pb-4">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {title}
            </h1>
          </header>
          
          <article className="prose prose-neutral max-w-none dark:prose-invert prose-headings:scroll-mt-20 prose-headings:font-semibold prose-a:text-primary hover:prose-a:underline">
            {children}
          </article>
        </main>
      </div>
    </div>
  );
}