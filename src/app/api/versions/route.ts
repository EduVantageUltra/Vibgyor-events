import { NextResponse } from "next/server";
import { getVersions } from "@/lib/versions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const page = new URL(req.url).searchParams.get("page") || "home";
  return NextResponse.json(getVersions(page));
}
