import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const amount = Number(body.amount);
    const currency = body.currency || "INR";
    const notes = body.notes || {};

    // Resolve keys from server env first, fall back to public env only if set
    const keyId =
      process.env.RAZORPAY_KEY_ID ||
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
      "";
    const keySecret =
      process.env.RAZORPAY_KEY_SECRET ||
      process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET ||
      "";

    if (!keyId || !keySecret) {
      return NextResponse.json(
        {
          error:
            "Razorpay keys are not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in the server environment.",
        },
        { status: 500 }
      );
    }

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        currency,
        notes,
        receipt: `mentorship_${Date.now()}`,
      }),
    });

    const text = await res.text();
    if (!res.ok) {
      // Pass through Razorpay error details to help debug
      return NextResponse.json(
        {
          error: "Failed to create Razorpay order",
          details: text || res.statusText,
          status: res.status,
        },
        { status: res.status }
      );
    }

    try {
      const data = JSON.parse(text);
      return NextResponse.json(data);
    } catch (e) {
      return NextResponse.json(
        { error: "Failed to parse Razorpay response", details: text },
        { status: 500 }
      );
    }
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Unexpected error creating Razorpay order" },
      { status: 500 }
    );
  }
}


