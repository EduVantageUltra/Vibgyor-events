import { NextResponse } from "next/server";
import { getReviews, addReview } from "@/lib/inbox";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const productId = new URL(req.url).searchParams.get("productId") || undefined;
  return NextResponse.json(getReviews(productId));
}

export async function POST(req: Request) {
  const { productId, name, rating, text } = (await req.json()) as { productId: string; name: string; rating: number; text: string };
  if (!productId || !name) return NextResponse.json({ error: "missing" }, { status: 400 });
  const rec = addReview({ productId, name, rating: Math.max(1, Math.min(5, Number(rating) || 5)), text: text || "" });
  return NextResponse.json({ ok: true, id: rec.id });
}
