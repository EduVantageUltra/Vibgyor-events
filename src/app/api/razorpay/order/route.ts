import { NextResponse } from "next/server";
import Razorpay from "razorpay";

/**
 * Creates a Razorpay order. Requires env vars at go-live:
 *   RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
 * If they're missing we return 503 so the client gracefully falls back to
 * the WhatsApp order flow.
 */
export async function POST(req: Request) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return NextResponse.json(
      { error: "payments_not_configured", message: "Razorpay keys not set yet." },
      { status: 503 }
    );
  }

  try {
    const { amount } = (await req.json()) as { amount: number };
    if (!amount || amount < 1) {
      return NextResponse.json({ error: "invalid_amount" }, { status: 400 });
    }

    const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await rzp.orders.create({
      amount: Math.round(amount * 100), // paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    return NextResponse.json({ orderId: order.id, amount: order.amount, keyId });
  } catch (err) {
    console.error("razorpay order error", err);
    return NextResponse.json({ error: "order_failed" }, { status: 500 });
  }
}
