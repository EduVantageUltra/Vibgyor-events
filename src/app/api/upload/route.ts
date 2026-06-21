import { NextResponse } from "next/server";
import { blockInProd } from "@/lib/guard";
import fs from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

/** Saves a dropped image/video into /public/uploads and returns its URL. */
export async function POST(req: Request) {
  const _blocked = blockInProd();
  if (_blocked) return _blocked;
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "no_file" }, { status: 400 });

    const bytes = Buffer.from(await file.arrayBuffer());
    const dir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(dir, { recursive: true });

    const safe = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const filename = `${Date.now()}-${safe}`;
    await fs.writeFile(path.join(dir, filename), bytes);

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (err) {
    console.error("upload error", err);
    return NextResponse.json({ error: "upload_failed" }, { status: 500 });
  }
}
