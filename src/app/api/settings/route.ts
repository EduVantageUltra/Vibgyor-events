import { NextResponse } from "next/server";
import { blockInProd } from "@/lib/guard";
import { getSettings, setSettings, type SiteSettings } from "@/lib/settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getSettings());
}

export async function POST(req: Request) {
  const _blocked = blockInProd();
  if (_blocked) return _blocked;
  const body = (await req.json()) as SiteSettings;
  const cur = getSettings();
  const merged = { ...cur, ...body, popup: { ...cur.popup!, ...body.popup }, intro: { ...cur.intro!, ...body.intro } };
  setSettings(merged);
  return NextResponse.json(merged);
}
