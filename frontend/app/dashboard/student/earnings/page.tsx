"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDownToLine,
  ArrowUpRight,
  IndianRupee,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// --- Data (student earnings demo) ---
const earningsData = [
  { month: "Jul", amount: 3200 },
  { month: "Aug", amount: 4100 },
  { month: "Sep", amount: 3800 },
  { month: "Oct", amount: 4500 },
  { month: "Nov", amount: 5200 },
  { month: "Dec", amount: 4850 },
];

const earningsHistory = [
  {
    id: "#P-1023",
    type: "Referral Bonus",
    date: "12 Dec 2025",
    amount: "₹7,500",
    status: "Paid",
  },
  {
    id: "#P-1019",
    type: "Mentor Session",
    date: "02 Dec 2025",
    amount: "₹3,200",
    status: "Processing",
  },
  {
    id: "#P-1012",
    type: "Project Stipend",
    date: "18 Nov 2025",
    amount: "₹12,000",
    status: "Paid",
  },
];

// --- Local Components ---
const StatCard = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => (
  <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950">
    <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
      {label}
    </p>
    <div className="mt-2 flex items-baseline gap-2">
      <span className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {value}
      </span>
    </div>
  </div>
);

// --- Main Page Component ---
const StudentEarningsPage: React.FC = () => {
  const [infoModal, setInfoModal] = useState<null | "manage" | "report">(null);

  const handleExportCsv = () => {
    const header = ["Payout ID", "Type", "Date", "Amount", "Status"];
    const rows = earningsHistory.map((e) => [
      e.id,
      e.type,
      e.date,
      e.amount,
      e.status,
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "student-earnings.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-zinc-50/50 p-6 space-y-6 dark:bg-zinc-950/50 lg:p-8">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Earnings
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Monitor your payouts, track monthly trends, and download invoices.
          </p>
        </div>
        <Button className="gap-2" type="button" onClick={handleExportCsv}>
          <ArrowDownToLine className="h-4 w-4" />
          Export CSV
        </Button>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chart + stats */}
        <Card className="lg:col-span-2 border-zinc-200/80 bg-white/70 shadow-sm backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/70">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-base">
              <span>Earnings (last 6 months)</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200">
                <ArrowUpRight className="h-3 w-3" />
                +24% growth
              </span>
            </CardTitle>
            <CardDescription className="text-xs">
              Mock chart component — replace with your preferred chart library
              later.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-5">
            <div className="mt-2 flex h-48 items-end gap-3 rounded-xl bg-zinc-50 px-4 pb-4 pt-3 dark:bg-zinc-900">
              {earningsData.map((point, index) => {
                const max = Math.max(...earningsData.map((p) => p.amount));
                const height = (point.amount / max) * 100;
                return (
                  <motion.div
                    key={point.month}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: `${height}%` }}
                    transition={{ duration: 0.4, delay: index * 0.06 }}
                    className="flex flex-1 flex-col items-center justify-end gap-1"
                  >
                    <div className="relative flex w-full items-end justify-center rounded-full bg-zinc-200/60 dark:bg-zinc-800">
                      <div
                        className="w-3/4 rounded-full bg-zinc-900 shadow-sm dark:bg-zinc-50"
                        style={{ height: "100%" }}
                      />
                    </div>
                    <span className="mt-1 text-[11px] text-zinc-500">
                      {point.month}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Summary cards – EXACT labels as requested */}
        <div className="space-y-3">
          <Card className="border-zinc-200/80 bg-white/70 shadow-sm backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/70">
            <CardContent className="flex flex-col gap-2 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Total Earnings
              </p>
              <div className="flex items-baseline gap-1">
                <IndianRupee className="h-4 w-4 text-zinc-500" />
                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                  0.00
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-200/80 bg-white/70 shadow-sm backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/70">
            <CardContent className="flex flex-col gap-2 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Pending
              </p>
              <div className="flex items-baseline gap-1">
                <IndianRupee className="h-4 w-4 text-zinc-500" />
                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                  0.00
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-200/80 bg-white/70 shadow-sm backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/70">
            <CardContent className="flex flex-col gap-2 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Completed Payouts
              </p>
              <div className="flex items-baseline gap-1">
                <IndianRupee className="h-4 w-4 text-zinc-500" />
                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                  0.00
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payout history & payout settings on a single row (two separate cards) */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Payout History (left, wider) */}
        <Card className="lg:col-span-2 border-zinc-200/80 bg-white/70 shadow-sm backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/70">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Payout History</CardTitle>
            <CardDescription className="text-xs">
              Detailed view of all session payouts and invoices.
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="min-w-full text-left text-xs">
              <thead className="border-b border-zinc-200 text-[11px] uppercase tracking-wide text-zinc-500 dark:border-zinc-800">
                <tr>
                  <th className="py-2 pr-4">Payout ID</th>
                  <th className="py-2 pr-4">Type</th>
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4 text-right">Amount</th>
                  <th className="py-2 pr-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900">
                {earningsHistory.map((entry) => (
                  <tr key={entry.id} className="align-middle">
                    <td className="py-2 pr-4 font-mono text-xs text-zinc-500">
                      {entry.id}
                    </td>
                    <td className="py-2 pr-4 text-zinc-700 dark:text-zinc-200">
                      {entry.type}
                    </td>
                    <td className="py-2 pr-4 text-zinc-500">{entry.date}</td>
                    <td className="py-2 pr-4 text-right font-mono text-zinc-900 dark:text-zinc-50">
                      {entry.amount}
                    </td>
                    <td className="py-2 pr-4 text-right">
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          entry.status === "Paid"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-200"
                            : "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200"
                        }`}
                      >
                        {entry.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        {/* Payout Settings (right, separate card) */}
        <Card className="border-zinc-200/80 bg-white/70 shadow-sm backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/70">
          <CardContent className="flex h-full flex-col justify-between gap-4 p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Payout Settings
              </p>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Connect your preferred payout method and track when your
                earnings are sent. Update your bank or UPI details from here.
              </p>
            </div>
            <div className="space-y-2 text-sm">
              <Button
                size="sm"
                className="w-full rounded-full"
                type="button"
                onClick={() => setInfoModal("manage")}
              >
                Manage payout methods
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-full rounded-full border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300"
                type="button"
                onClick={() => setInfoModal("report")}
              >
                Download earnings report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coming soon modal for payout actions */}
      <Dialog
        open={infoModal !== null}
        onOpenChange={(open) => !open && setInfoModal(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {infoModal === "manage"
                ? "Payout methods coming soon"
                : "Earnings report coming soon"}
            </DialogTitle>
            <DialogDescription className="text-sm text-zinc-500">
              You&apos;ll soon be able to configure payout destinations and
              download detailed earnings reports from this section. For now,
              your balance is tracked here and payouts are handled directly by
              the Aureeture team.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentEarningsPage;