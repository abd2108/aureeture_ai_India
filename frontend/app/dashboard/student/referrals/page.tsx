"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// --- Data ---
const referralEntries = [
  {
    name: "Rahul Verma",
    role: "Frontend Developer",
    stage: "Signed Up",
    appliedFor: "React Engineer @ Startup X",
    reward: "₹2,000",
  },
  {
    name: "Neha Iyer",
    role: "Data Analyst",
    stage: "Under Review",
    appliedFor: "Data Analyst @ Fintech Y",
    reward: "₹3,500",
  },
  {
    name: "Arjun Mehta",
    role: "Product Manager",
    stage: "Hired",
    appliedFor: "PM @ SaaS Z",
    reward: "₹7,500",
  },
];

// --- Local Components ---
const StatCard = ({
  label,
  value,
  trend,
}: {
  label: string;
  value: string;
  trend?: string;
}) => (
  <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950">
    <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
      {label}
    </p>
    <div className="mt-2 flex items-baseline gap-2">
      <span className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {value}
      </span>
      {trend && (
        <span className="text-xs text-emerald-600 font-medium">{trend}</span>
      )}
    </div>
  </div>
);

// --- Main Page Component ---
export default function StudentReferralsPage() {
  const [copied, setCopied] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  const handleShareLink = async () => {
    try {
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      const url = `${origin}/referral?code=AUREETURE-DEMO`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      console.error("Failed to copy referral link", e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Referrals</h1>
        <p className="text-sm text-zinc-500">
          Track referral performance and invite people to your network.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="All Applicants" value="0" />
        <StatCard label="Signed Up" value="0" />
        <StatCard label="Under Review" value="0" />
        <StatCard label="Hired" value="0" />
      </div>

      {/* Pipeline & Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Referral Pipeline Table */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Referral Pipeline
            </p>
            <span className="text-xs text-zinc-400">Last 30 days</span>
          </div>
          <div className="overflow-hidden rounded-lg border border-zinc-100 dark:border-zinc-800">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 dark:bg-zinc-900/60 text-left text-xs uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-4 py-2 font-medium">Candidate</th>
                  <th className="px-4 py-2 font-medium">Applied For</th>
                  <th className="px-4 py-2 font-medium">Stage</th>
                  <th className="px-4 py-2 font-medium text-right">Reward</th>
                </tr>
              </thead>
              <tbody>
                {referralEntries.map((referral) => (
                  <tr
                    key={referral.name}
                    className="border-t border-zinc-100 dark:border-zinc-800"
                  >
                    <td className="px-4 py-2">
                      <div className="flex flex-col">
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">
                          {referral.name}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {referral.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-zinc-500">
                      {referral.appliedFor}
                    </td>
                    <td className="px-4 py-2">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300">
                        {referral.stage}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-right font-mono text-zinc-900 dark:text-zinc-100">
                      {referral.reward}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Card */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 flex flex-col justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Referral Program
            </p>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Earn rewards when your friends get hired through Aureeture. Share
              your referral link and track every step here.
            </p>
          </div>
          <div className="space-y-2 text-sm">
            <Button
              size="sm"
              className="w-full rounded-full"
              type="button"
              onClick={handleShareLink}
            >
              Share your referral link
            </Button>
            {copied && (
              <p className="text-center text-[11px] text-emerald-500">
                Referral link copied to clipboard
              </p>
            )}
            <Button
              size="sm"
              variant="outline"
              className="w-full rounded-full border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300"
              type="button"
              onClick={() => setTermsOpen(true)}
            >
              View referral terms
            </Button>
          </div>
        </div>
      </div>

      {/* Referral terms modal */}
      <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Referral program terms</DialogTitle>
            <DialogDescription className="space-y-2 text-sm text-zinc-500">
              <p>
                This is a preview of the Aureeture referral program. Rewards are
                credited only after your referred candidate is successfully
                hired and completes the required probation period.
              </p>
              <p>
                Full program terms, eligibility criteria, and payout timelines
                will be available on the public referral policy page. For now,
                reach out to the Aureeture support team if you have questions.
              </p>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}