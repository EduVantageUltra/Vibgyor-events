import { NextResponse } from "next/server";
import { blockInProd } from "@/lib/guard";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const dir = path.join(process.cwd(), "src", "data");

/** Export every editable data file as one JSON backup bundle. */
export async function GET() {
  const files: Record<string, unknown> = {};
  for (const name of fs.readdirSync(dir)) {
    if (!name.endsWith(".json")) continue;
    try {
      files[name] = JSON.parse(fs.readFileSync(path.join(dir, name), "utf-8"));
    } catch {
      /* skip unreadable */
    }
  }
  return NextResponse.json({ version: 1, exportedKeys: Object.keys(files), files });
}

/** Restore a backup bundle (overwrites data files). */
export async function POST(req: Request) {
  const _blocked = blockInProd();
  if (_blocked) return _blocked;
  try {
    const { files } = (await req.json()) as { files: Record<string, unknown> };
    if (!files || typeof files !== "object") return NextResponse.json({ error: "bad_bundle" }, { status: 400 });
    let restored = 0;
    for (const [name, content] of Object.entries(files)) {
      if (!/^[a-z0-9._-]+\.json$/i.test(name)) continue; // safety: simple names only
      fs.writeFileSync(path.join(dir, name), JSON.stringify(content, null, 2), "utf-8");
      restored++;
    }
    return NextResponse.json({ ok: true, restored });
  } catch {
    return NextResponse.json({ error: "restore_failed" }, { status: 500 });
  }
}
