"use client";

import React, { useCallback, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useSearchParams, useRouter } from "next/navigation";
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
  const { getToken } = useAuth();
  const { user } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Extract Mentor details from URL
  const name = searchParams.get("name") ?? "Mentor";
  const role = searchParams.get("role") ?? "";
  const company = searchParams.get("company") ?? "";
  const price = Number(searchParams.get("price") ?? "0") || 0;

  const handlePay = useCallback(async () => {
    setStatusMessage(null);
    setIsProcessing(true);

    const loaded = await loadRazorpayScript();
    if (!loaded || typeof window.Razorpay === "undefined") {
      setStatusMessage("Unable to load Razorpay. Please check your network.");
      setIsProcessing(false);
      return;
    }

    try {
      // 1. Create Order
      const orderRes = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: price * 100,
          currency: "INR",
          notes: { mentor: name, role, company },
        }),
      });

      if (!orderRes.ok) throw new Error("Failed to create payment order");
      const order = await orderRes.json();

      // 2. Razorpay Options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Aureeture Mentorship",
        description: `Session with ${name}`,
        order_id: order.id,
        handler: async function (response: any) {
          try {
            const token = await getToken?.();
            
            // Collect data safely
            const payload = {
              mentorId: searchParams.get("mentorId"),
              studentId: user?.id || searchParams.get("studentId"),
              studentName: user?.fullName || "Student",
              studentEmail: user?.primaryEmailAddress?.emailAddress || "",
              title: searchParams.get("title") || `Session with ${name}`,
              description: searchParams.get("description") || "Mentorship Session",
              startTime: searchParams.get("selectedStartTime"),
              endTime: searchParams.get("selectedEndTime"),
              amount: price,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              mentorEmail: searchParams.get("mentorEmail"),
              mentorName: name,
            };

            // 3. Confirm Payment & Create Session
            const confirmRes = await fetch(`/api/mentor-sessions/confirm-payment`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` }),
                "x-active-role": "student",
              },
              body: JSON.stringify(payload),
            });

            if (confirmRes.ok) {
              setStatusMessage("Payment successful! Session confirmed.");
              setTimeout(() => {
                router.push("/dashboard/student/sessions?tab=upcoming");
              }, 2000);
            } else {
              const errorData = await confirmRes.json();
              console.error("Backend Error Details:", errorData);
              setStatusMessage(`Confirmation failed: ${errorData.error || "Internal Server Error"}`);
            }
          } catch (err) {
            console.error("Confirmation Crash:", err);
            setStatusMessage("Payment successful, but a technical error occurred during confirmation.");
          }
        },
        prefill: {
          name: user?.fullName || name,
          email: user?.primaryEmailAddress?.emailAddress || "",
        },
        theme: { color: "#020617" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setStatusMessage(err?.message || "Something went wrong.");
    } finally {
      setIsProcessing(false);
    }
  }, [name, role, company, price, searchParams, user, getToken, router]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Review & Pay</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-zinc-500">Mentor</p>
              <p className="font-medium text-zinc-900 dark:text-zinc-50">{name}</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                {role} {company ? `@ ${company}` : ""}
              </p>
            </div>

            <div>
              <p className="text-sm text-zinc-500">Session price</p>
              <p className="font-mono text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                ₹{price.toLocaleString("en-IN")}{" "}
                <span className="text-xs font-normal text-zinc-500">/ session</span>
              </p>
            </div>

            <Button
              className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
              onClick={handlePay}
              disabled={isProcessing || price <= 0}
            >
              {isProcessing ? "Processing..." : "Pay with Razorpay"}
            </Button>

            {statusMessage && (
              <Alert className="mt-3" variant={statusMessage.includes("successful") ? "default" : "destructive"}>
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