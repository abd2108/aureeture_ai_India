"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Users,
  Filter,
  Target,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const DashboardCard = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, delay }}
    className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm"
  >
    {children}
  </motion.div>
);

const FounderOverviewPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
              Founder / Recruiter workspace
            </p>
            <h1 className="mt-1 text-2xl md:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Build your next team from proof‑of‑work talent
            </h1>
            <p className="mt-2 text-sm text-zinc-500 max-w-xl">
              Post roles, review shortlists, and run structured hiring flows –
              all based on what candidates have actually built.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="rounded-full border-zinc-200 dark:border-zinc-800 text-xs md:text-sm"
            >
              Invite teammates
            </Button>
            <Button className="rounded-full text-xs md:text-sm">
              Post a new role
              <Briefcase className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Top stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DashboardCard delay={0.05}>
            <div className="p-4 space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Open roles
              </p>
              <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                3
              </p>
              <p className="text-xs text-zinc-500">
                2 engineering · 1 product · avg time to hire 21 days
              </p>
            </div>
          </DashboardCard>
          <DashboardCard delay={0.1}>
            <div className="p-4 space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Active candidates
              </p>
              <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                48
              </p>
              <p className="text-xs text-zinc-500">
                9 in onsite / final rounds across roles
              </p>
            </div>
          </DashboardCard>
          <DashboardCard delay={0.15}>
            <div className="p-4 space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Hires via Aureeture
              </p>
              <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                7
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400">
                4 backend · 2 frontend · 1 data science
              </p>
            </div>
          </DashboardCard>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <DashboardCard delay={0.2}>
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                      Active pipelines
                    </p>
                    <p className="text-sm text-zinc-500">
                      A snapshot of your most important hiring funnels.
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-full">
                    Manage roles
                  </Button>
                </div>
                <div className="grid gap-3 md:grid-cols-3 text-sm">
                  {[
                    {
                      role: "Senior Backend Engineer",
                      company: "Aureeture",
                      stages: "18 candidates · 5 in final",
                    },
                    {
                      role: "Founding Frontend Engineer",
                      company: "Stealth SaaS",
                      stages: "12 candidates · 2 in onsite",
                    },
                    {
                      role: "Product Analyst",
                      company: "Fintech X",
                      stages: "18 candidates · 2 offers out",
                    },
                  ].map((pipeline) => (
                    <div
                      key={pipeline.role}
                      className="rounded-lg border border-zinc-100 dark:border-zinc-900 bg-zinc-50/60 dark:bg-zinc-950/40 p-3 space-y-1.5"
                    >
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                        {pipeline.role}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {pipeline.company}
                      </p>
                      <p className="text-[11px] text-zinc-500">
                        {pipeline.stages}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </DashboardCard>

            <DashboardCard delay={0.25}>
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                      Recommended shortlists
                    </p>
                    <p className="text-sm text-zinc-500">
                      AI‑curated candidates based on proof‑of‑work.
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" className="rounded-full">
                    View all
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
                <div className="space-y-2 text-sm">
                  {[
                    {
                      title:
                        "Backend engineers who have shipped fintech projects",
                      count: "12 candidates · avg score 4.6/5",
                    },
                    {
                      title:
                        "Product generalists with 2+ live case studies",
                      count: "9 candidates · avg score 4.4/5",
                    },
                    {
                      title:
                        "Data talent with strong SQL + dashboards",
                      count: "7 candidates · avg score 4.5/5",
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="rounded-lg border border-zinc-100 dark:border-zinc-900 bg-zinc-50/60 dark:bg-zinc-950/40 p-3"
                    >
                      <p className="text-sm text-zinc-900 dark:text-zinc-50">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-zinc-500 mt-1">
                        {item.count}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </DashboardCard>
          </div>

          <div className="space-y-4">
            <DashboardCard delay={0.22}>
              <div className="p-5 space-y-3">
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Filters & talent pools
                </p>
                <div className="space-y-2 text-sm text-zinc-500">
                  <p className="flex items-start gap-2">
                    <Filter className="w-4 h-4 mt-[2px]" />
                    <span>
                      Save your favourite filters (stack, experience, CTC
                      range) as reusable talent pools.
                    </span>
                  </p>
                  <p className="flex items-start gap-2">
                    <Users className="w-4 h-4 mt-[2px]" />
                    <span>
                      Quickly jump back to &quot;Warm intros&quot; or
                      &quot;Top performers&quot; lists created by your team.
                    </span>
                  </p>
                </div>
              </div>
            </DashboardCard>

            <DashboardCard delay={0.26}>
              <div className="p-5 space-y-3">
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Hiring health
                </p>
                <ul className="space-y-2 text-sm text-zinc-500">
                  <li className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 mt-[2px] text-emerald-500" />
                    <span>
                      Time‑to‑first‑shortlist is{" "}
                      <span className="font-medium text-zinc-900 dark:text-zinc-50">
                        48 hours
                      </span>{" "}
                      across active roles.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <Target className="w-4 h-4 mt-[2px]" />
                    <span>
                      Most declined offers cite compensation mismatch – consider
                      revisiting ranges.
                    </span>
                  </li>
                </ul>
              </div>
            </DashboardCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FounderOverviewPage;

