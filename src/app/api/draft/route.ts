import { NextResponse } from "next/server";
import { blockInProd } from "@/lib/guard";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const dir = path.join(process.cwd(), "src", "data");
const file = (page: string) => path.join(dir, `puck-${page.replace(/[^a-z0-9-]/gi, "")}-draft.json`);

export async function GET(req: Request) {
  const page = new URL(req.url).searchParams.get("page") || "home";
  try { return NextResponse.json(JSON.parse(fs.readFileSync(file(page), "utf-8"))); }
  catch { return NextResponse.json({ content: [], root: {} }); }
}

// Save a draft (separate from the published page) — preview before going live.
export async function POST(req: Request) {
  const b = blockInProd(); if (b) return b;
  const { page = "home", data } = (await req.json()) as { page?: string; data: unknown };
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file(page), JSON.stringify(data, null, 2), "utf-8");
  return NextResponse.json({ ok: true });
}
