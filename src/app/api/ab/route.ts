import { NextResponse } from "next/server";
import { blockInProd } from "@/lib/guard";
import { getAb, trackAb } from "@/lib/ab";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Admin results — local only.
export async function GET() {
  const b = blockInProd(); if (b) return b;
  return NextResponse.json(getAb());
}

// Visitor tracking — works everywhere.
export async function POST(req: Request) {
  const { expId, variant, event } = (await req.json()) as { expId: string; variant: "a" | "b"; event: "view" | "convert" };
  if (!expId || (variant !== "a" && variant !== "b")) return NextResponse.json({ error: "bad" }, { status: 400 });
  trackAb(expId, variant, event === "convert" ? "convert" : "view");
  return NextResponse.json({ ok: true });
}
