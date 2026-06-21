import { NextResponse } from "next/server";
import { blockInProd } from "@/lib/guard";
import { getAnalytics, trackView } from "@/lib/analytics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const b = blockInProd(); if (b) return b;
  return NextResponse.json(getAnalytics());
}

export async function POST(req: Request) {
  try {
    const { path } = (await req.json()) as { path: string };
    if (path && !path.startsWith("/editor") && !path.startsWith("/api")) trackView(path.slice(0, 120));
  } catch { /* ignore */ }
  return NextResponse.json({ ok: true });
}
