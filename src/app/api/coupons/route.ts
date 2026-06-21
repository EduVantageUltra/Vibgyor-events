import { NextResponse } from "next/server";
import { blockInProd } from "@/lib/guard";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export type Coupon = { code: string; type: "percent" | "flat"; value: number; minOrder: number; active: boolean };
const FILE = path.join(process.cwd(), "src", "data", "coupons.json");
const read = (): Coupon[] => { try { return JSON.parse(fs.readFileSync(FILE, "utf-8")); } catch { return []; } };

export async function GET() {
  return NextResponse.json(read());
}

// Admin save (local only).
export async function POST(req: Request) {
  const b = blockInProd(); if (b) return b;
  const coupons = (await req.json()) as Coupon[];
  fs.writeFileSync(FILE, JSON.stringify(coupons.map((c) => ({ ...c, code: c.code.toUpperCase().trim() })), null, 2), "utf-8");
  return NextResponse.json({ ok: true });
}
