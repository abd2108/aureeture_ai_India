"use client";

import React, { useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

declare global {
  interface Window {
    Razorpay?: any;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const PaymentPage: React.FC = () => {
  const searchParams = useSearchParams();
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // LOGIC FIX: Ensure we extract these exactly as they are passed in the URL
  const name = searchParams.get("name") ?? "Mentor";
  const role = searchParams.get("role") ?? "";
  const company = searchParams.get("company") ?? "";
  const price = Number(searchParams.get("price") ?? "0") || 0;

  const handlePay = useCallback(async () => {
    setStatusMessage(null);
    setIsProcessing(true);

    const loaded = await loadRazorpayScript();
    if (!loaded || typeof window.Razorpay === "undefined") {
      setStatusMessage(
        "Unable to load Razorpay. Please check your network and try again."
      );
      setIsProcessing(false);
      return;
    }

    try {
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: price * 100,
          currency: "INR",
          notes: {
            mentor: name,
            role,
            company,
          },
        }),
      });

      if (!orderRes.ok) {
        throw new Error("Failed to create payment order");
      }

      const order = await orderRes.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Aureeture Mentorship",
        description: `Session with ${name}`,
        order_id: order.id,
        handler: async function (response: any) {
          try {
            const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";
            const studentId = searchParams.get("studentId") || `student_${Date.now()}`;
            const studentName = searchParams.get("studentName") || "Student";
            const studentEmail = searchParams.get("studentEmail") || "";

            const confirmRes = await fetch(`${apiBase}/api/mentor-sessions/confirm-payment`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                mentorId: searchParams.get("mentorId") || "",
                studentId: studentId,
                studentName: studentName,
                studentEmail: studentEmail,
                title: searchParams.get("title") || `Session with ${name}`,
                description: searchParams.get("description") || "",
                startTime: searchParams.get("selectedStartTime") || "",
                endTime: searchParams.get("selectedEndTime") || "",
                amount: price,
                paymentId: response.razorpay_payment_id,
                mentorEmail: searchParams.get("mentorEmail") || "",
                mentorName: name,
              }),
            });

            if (confirmRes.ok) {
              setStatusMessage("Payment successful! Session confirmed.");
              setTimeout(() => {
                window.location.href = "/dashboard/student/sessions?tab=upcoming";
              }, 2000);
            } else {
              setStatusMessage("Payment successful, but session confirmation failed.");
            }
          } catch (err) {
            setStatusMessage("Payment successful, but confirmation error occurred.");
          }
        },
        prefill: { name },
        theme: { color: "#020617" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setStatusMessage(err?.message || "Something went wrong.");
    } finally {
      setIsProcessing(false);
    }
  }, [name, role, company, price, searchParams]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Review &amp; Pay
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-zinc-500">Mentor</p>
              <p className="font-medium text-zinc-900 dark:text-zinc-50">
                {name}
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                {role} {company ? `@ ${company}` : ""}
              </p>
            </div>

            <div>
              <p className="text-sm text-zinc-500">Session price</p>
              <p className="font-mono text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                ₹{price.toLocaleString("en-IN")}{" "}
                <span className="text-xs font-normal text-zinc-500">
                  / session
                </span>
              </p>
            </div>

            <Button
              className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200"
              onClick={handlePay}
              disabled={isProcessing || price <= 0}
            >
              {isProcessing ? "Processing..." : "Pay with Razorpay"}
            </Button>

            {statusMessage && (
              <Alert className="mt-3">
                <AlertDescription>{statusMessage}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentPage;