import { NextResponse } from "next/server";
import crypto from "node:crypto";

/** Verifies the Razorpay payment signature after checkout. */
export async function POST(req: Request) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  try {
    const { orderId, paymentId, signature } = (await req.json()) as {
      orderId: string;
      paymentId: string;
      signature: string;
    };
    const expected = crypto
      .createHmac("sha256", secret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    const valid = crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(signature)
    );
    return NextResponse.json({ valid });
  } catch {
    return NextResponse.json({ valid: false }, { status: 400 });
  }
}
