import { NextResponse } from "next/server";
import { blockInProd } from "@/lib/guard";
import { getCollections, writeCollections, type Collection } from "@/lib/collections";
import { slugify } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getCollections());
}

// Save the entire collections array (admin, local only).
export async function POST(req: Request) {
  const b = blockInProd(); if (b) return b;
  const cols = (await req.json()) as Collection[];
  // normalise: ensure ids/slugs
  for (const c of cols) {
    c.id ||= `col-${Date.now().toString(36)}`;
    c.slug ||= slugify(c.name || "collection");
    for (const it of c.items) {
      it.id ||= `it-${Math.random().toString(36).slice(2, 8)}`;
      it.slug ||= slugify(String(it[c.fields[0]?.key] ?? it.id));
    }
  }
  writeCollections(cols);
  return NextResponse.json({ ok: true });
}
