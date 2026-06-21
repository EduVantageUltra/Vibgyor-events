import { NextResponse } from "next/server";
import { blockInProd } from "@/lib/guard";
import { getAbandoned, addAbandoned } from "@/lib/analytics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const b = blockInProd(); if (b) return b;
  return NextResponse.json(getAbandoned());
}

export async function POST(req: Request) {
  try {
    const { phone, items, total } = (await req.json()) as { phone: string; items: string; total: number };
    if (phone) addAbandoned({ phone, items: items || "", total: Number(total) || 0 });
  } catch { /* ignore */ }
  return NextResponse.json({ ok: true });
}
