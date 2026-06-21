import { NextResponse } from "next/server";
import { blockInProd } from "@/lib/guard";
import { getSubmissions, addSubmission } from "@/lib/inbox";
import { notify } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Admin read — local only.
export async function GET() {
  const b = blockInProd(); if (b) return b;
  return NextResponse.json(getSubmissions());
}

// Customer submit — works everywhere.
export async function POST(req: Request) {
  const { name, phone, message } = (await req.json()) as { name: string; phone: string; message: string };
  if (!name || !phone) return NextResponse.json({ error: "missing" }, { status: 400 });
  const rec = addSubmission({ name, phone, message: message || "" });
  await notify("New enquiry — Rajrishi", `${name} (${phone})\n\n${message}`);
  return NextResponse.json({ ok: true, id: rec.id });
}
