import { NextResponse } from "next/server";
import { blockInProd } from "@/lib/guard";
import { getOrders, addOrder } from "@/lib/inbox";
import { notify } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const b = blockInProd(); if (b) return b;
  return NextResponse.json(getOrders());
}

export async function POST(req: Request) {
  const o = (await req.json()) as { name: string; phone: string; address: string; items: string; total: number; method: string };
  if (!o.phone) return NextResponse.json({ error: "missing" }, { status: 400 });
  const rec = addOrder({ name: o.name || "", phone: o.phone, address: o.address || "", items: o.items || "", total: Number(o.total) || 0, method: o.method || "online" });
  await notify(`New order ₹${o.total} — Rajrishi`, `${o.name} (${o.phone})\n${o.address}\n\n${o.items}\n\nTotal: ₹${o.total} · ${o.method}`);
  return NextResponse.json({ ok: true, id: rec.id });
}
