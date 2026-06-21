import { NextResponse } from "next/server";
import { blockInProd } from "@/lib/guard";
import { getCanvas, setCanvas } from "@/lib/freecanvas.server";
import type { CanvasDoc } from "@/lib/freecanvas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get("page") || "home";
  return NextResponse.json(getCanvas(slug));
}

export async function POST(req: Request) {
  const _blocked = blockInProd();
  if (_blocked) return _blocked;
  try {
    const { page = "home", doc } = (await req.json()) as { page?: string; doc: CanvasDoc };
    setCanvas(page, doc);
    if (Array.isArray(doc?.elements) && doc.elements.length > 0) {
      const { appendVersion } = await import("@/lib/versions");
      appendVersion(page, "canvas", doc);
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "save_failed" }, { status: 500 });
  }
}
