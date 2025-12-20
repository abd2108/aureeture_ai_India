"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  ArrowDownToLine,
  ArrowUpRight,
  IndianRupee,
  Wallet,
  Loader2,
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

type EarningsPoint = {
  month: string;
  amount: number;
};

type Transaction = {
  id: string;
  date: string;
  student: string;
  service: string;
  amount: string;
  status: "Paid" | "Pending";
  sessionId?: string;
};

type EarningsResponse = {
  earningsChart: EarningsPoint[];
  growth: number;
  pendingPayout: number;
  totalPaidOut: number;
  totalSessions: number;
  avgHourlyRate: number;
  paymentHistory: Transaction[];
};

const MentorEarningsPage: React.FC = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [isInvoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [earningsData, setEarningsData] = useState<EarningsPoint[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pendingPayout, setPendingPayout] = useState(0);
  const [totalPaidOut, setTotalPaidOut] = useState(0);
  const [avgHourlyRate, setAvgHourlyRate] = useState(0);
  const [growth, setGrowth] = useState(0);
  const [totalSessions, setTotalSessions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<"all" | "this_month" | "last_90_days">("all");

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  const canLoad = useMemo(
    () => isLoaded && isSignedIn && !!user?.id,
    [isLoaded, isSignedIn, user?.id]
  );

  const fetchEarnings = async () => {
    if (!user?.id || !apiBase) {
      if (!apiBase) {
        setError("API base URL is not configured. Please set NEXT_PUBLIC_API_BASE_URL in your environment variables.");
      }
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${apiBase}/api/mentor/earnings?mentorId=${encodeURIComponent(user.id)}&period=${period}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!res.ok) {
        let errorMessage = "Failed to fetch earnings";
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = `HTTP ${res.status}: ${res.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = (await res.json()) as EarningsResponse;
      setEarningsData(data.earningsChart || []);
      setTransactions(data.paymentHistory || []);
      setPendingPayout(data.pendingPayout || 0);
      setTotalPaidOut(data.totalPaidOut || 0);
      setAvgHourlyRate(data.avgHourlyRate || 0);
      setGrowth(data.growth || 0);
      setTotalSessions(data.totalSessions || 0);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching earnings:", err);
      setError(err.message || "Unable to load earnings. Please try again.");
      setEarningsData([]);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canLoad) {
      fetchEarnings();
    }
  }, [canLoad, user?.id, apiBase, period]);

  const handleExportCsv = () => {
    const header = ["Date", "Student", "Service", "Amount", "Status"];
    const rows = transactions.map((t) => [
      t.date,
      t.student,
      t.service,
      t.amount,
      t.status,
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mentor-earnings-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="min-h-screen bg-zinc-50/70 p-6 space-y-8 dark:bg-zinc-950/60 lg:p-10">
      <header className="mx-auto flex max-w-6xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Earnings
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Monitor your payouts, track monthly trends, and download invoices.
          </p>
        </div>
        <Button
          className="gap-2 rounded-full bg-zinc-900 px-4 text-sm text-zinc-50 shadow-sm hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          type="button"
          onClick={handleExportCsv}
        >
          <ArrowDownToLine className="h-4 w-4" />
          Export CSV
        </Button>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-3">
        {/* Chart + stats */}
        <Card className="lg:col-span-2 rounded-2xl border border-zinc-200/80 bg-white/95 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950/90">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-base">
              <span>Earnings (last 6 months)</span>
              {loading ? (
                <Loader2 className="h-3 w-3 animate-spin text-zinc-400" />
              ) : (
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                  growth >= 0
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200"
                    : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-200"
                }`}>
                  <ArrowUpRight className={`h-3 w-3 ${growth < 0 ? "rotate-180" : ""}`} />
                  {growth >= 0 ? "+" : ""}{growth}% growth
                </span>
              )}
            </CardTitle>
            <CardDescription className="text-xs">
              Mock chart component — replace with your preferred chart library
              later.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-5">
            {loading ? (
              <div className="mt-2 flex h-52 items-center justify-center rounded-xl bg-zinc-50 dark:bg-zinc-900">
                <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
              </div>
            ) : earningsData.length === 0 ? (
              <div className="mt-2 flex h-52 items-center justify-center rounded-xl bg-zinc-50 dark:bg-zinc-900">
                <p className="text-sm text-zinc-500">No earnings data available</p>
              </div>
            ) : (
              <div className="mt-2 flex h-52 items-end gap-3 rounded-xl bg-zinc-50 px-4 pb-4 pt-3 dark:bg-zinc-900">
                {earningsData.map((point, index) => {
                  const max = Math.max(...earningsData.map((p) => p.amount), 1);
                  const height = max > 0 ? (point.amount / max) * 100 : 0;
                  return (
                    <motion.div
                      key={point.month}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: `${height}%` }}
                      transition={{ duration: 0.4, delay: index * 0.06 }}
                      className="flex flex-1 flex-col items-center justify-end gap-1"
                    >
                      <div className="relative flex w-full items-end justify-center rounded-full bg-zinc-200/60 dark:bg-zinc-800">
                        <div className="w-3/4 rounded-full bg-zinc-900 shadow-sm dark:bg-zinc-50" style={{ height: "100%" }} />
                      </div>
                      <span className="mt-1 text-[11px] text-zinc-500">
                        {point.month}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary cards */}
        <div className="space-y-3">
          <Card className="rounded-2xl border border-zinc-200/80 bg-white/95 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950/90">
            <CardContent className="flex flex-col gap-2 p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Pending payout
                </p>
                <Badge variant="outline" className="text-[10px]">
                  Next cycle
                </Badge>
              </div>
              <div className="flex items-baseline gap-1">
                <IndianRupee className="h-4 w-4 text-zinc-500" />
                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                  {loading ? "..." : formatCurrency(pendingPayout).replace("₹", "")}
                </p>
              </div>
              <p className="text-[11px] text-zinc-500">
                Will be processed to your payout method in the next cycle.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-zinc-200/80 bg-white/95 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950/90">
            <CardContent className="flex flex-col gap-2 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Total paid out
              </p>
              <div className="flex items-baseline gap-1">
                <IndianRupee className="h-4 w-4 text-zinc-500" />
                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                  {loading ? "..." : formatCurrency(totalPaidOut).replace("₹", "")}
                </p>
              </div>
              <p className="text-[11px] text-zinc-500">
                Across {loading ? "..." : totalSessions} completed sessions.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-zinc-200/80 bg-white/95 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950/90">
            <CardContent className="flex flex-col gap-2 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Avg hourly rate
              </p>
              <div className="flex items-baseline gap-1">
                <IndianRupee className="h-4 w-4 text-zinc-500" />
                <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                  {loading ? "..." : formatCurrency(avgHourlyRate).replace("₹", "")}
                </p>
              </div>
              <p className="text-[11px] text-zinc-500">
                Weighted average across sessions and services.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Transactions table */}
      <Card className="mx-auto max-w-6xl rounded-2xl border border-zinc-200/80 bg-white/95 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950/90">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base">Payment history</CardTitle>
              <CardDescription className="text-xs">
                Detailed view of all session payouts and invoices.
              </CardDescription>
            </div>
            <div className="hidden gap-2 md:flex">
              <Button
                variant={period === "this_month" ? "default" : "outline"}
                size="sm"
                type="button"
                className="h-7 rounded-full px-3 text-[11px]"
                onClick={() => setPeriod("this_month")}
              >
                This month
              </Button>
              <Button
                variant={period === "last_90_days" ? "default" : "outline"}
                size="sm"
                type="button"
                className="h-7 rounded-full px-3 text-[11px]"
                onClick={() => setPeriod("last_90_days")}
              >
                Last 90 days
              </Button>
              <Button
                variant={period === "all" ? "default" : "outline"}
                size="sm"
                type="button"
                className="h-7 rounded-full px-3 text-[11px]"
                onClick={() => setPeriod("all")}
              >
                All time
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-10">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Wallet className="h-10 w-10 text-zinc-400 mb-3" />
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                No payment history
              </p>
              <p className="text-xs text-zinc-500">
                Completed sessions with payments will appear here.
              </p>
            </div>
          ) : (
            <table className="min-w-full text-left text-xs">
              <thead className="border-b border-zinc-200 text-[11px] uppercase tracking-wide text-zinc-500 dark:border-zinc-800">
                <tr>
                  <th className="py-2 pr-4">Date</th>
                  <th className="py-2 pr-4">Student</th>
                  <th className="py-2 pr-4">Service</th>
                  <th className="py-2 pr-4">Amount</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900">
                {transactions.map((txn) => (
                  <tr key={txn.id} className="align-middle">
                    <td className="py-2 pr-4 text-zinc-700 dark:text-zinc-200">
                      {txn.date}
                    </td>
                    <td className="py-2 pr-4 text-zinc-700 dark:text-zinc-200">
                      {txn.student}
                    </td>
                    <td className="py-2 pr-4 text-zinc-500 dark:text-zinc-400">
                      {txn.service}
                    </td>
                    <td className="py-2 pr-4 text-zinc-900 dark:text-zinc-50">
                      {txn.amount}
                    </td>
                    <td className="py-2 pr-4">
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          txn.status === "Paid"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-200"
                            : "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200"
                        }`}
                      >
                        {txn.status}
                      </Badge>
                    </td>
                    <td className="py-2 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 gap-1 text-[11px]"
                        type="button"
                        onClick={() => setInvoiceModalOpen(true)}
                      >
                        <ArrowDownToLine className="h-3.5 w-3.5" />
                        Invoice
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Invoice modal - coming soon */}
      <Dialog open={isInvoiceModalOpen} onOpenChange={setInvoiceModalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Invoices coming soon</DialogTitle>
            <DialogDescription>
              You&apos;ll soon be able to download branded PDF invoices for each
              completed payout directly from this page. For now, please contact
              the Aureeture team if you need a detailed statement.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MentorEarningsPage;


