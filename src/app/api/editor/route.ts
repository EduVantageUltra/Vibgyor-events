import { NextResponse } from "next/server";
import { blockInProd } from "@/lib/guard";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const dir = path.join(process.cwd(), "src", "data");
const fileFor = (page: string) =>
  path.join(dir, `puck-${page.replace(/[^a-z0-9-]/gi, "")}.json`);

/** Load a page's saved canvas document. */
export async function GET(req: Request) {
  const page = new URL(req.url).searchParams.get("page") || "home";
  try {
    const raw = fs.readFileSync(fileFor(page), "utf-8");
    return NextResponse.json(JSON.parse(raw));
  } catch {
    return NextResponse.json({ content: [], root: {} });
  }
}

/** Save (publish) a page's block (Puck) document. */
export async function POST(req: Request) {
  const _blocked = blockInProd();
  if (_blocked) return _blocked;
  try {
    const { page = "home", data } = (await req.json()) as { page?: string; data: { content?: unknown[] } };
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(fileFor(page), JSON.stringify(data, null, 2), "utf-8");
    if (Array.isArray(data?.content) && data.content.length > 0) {
      const { appendVersion } = await import("@/lib/versions");
      appendVersion(page, "blocks", data);
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("editor save error", err);
    return NextResponse.json({ error: "save_failed" }, { status: 500 });
  }
}
