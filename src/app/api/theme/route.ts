import { NextResponse } from "next/server";
import { blockInProd } from "@/lib/guard";
import { getTheme, setTheme, defaultTheme, type Theme } from "@/lib/theme";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getTheme());
}

export async function POST(req: Request) {
  const _blocked = blockInProd();
  if (_blocked) return _blocked;
  try {
    const body = (await req.json()) as { theme?: Partial<Theme>; reset?: boolean };
    if (body.reset) {
      setTheme(defaultTheme);
      return NextResponse.json(defaultTheme);
    }
    const merged = { ...getTheme(), ...(body.theme ?? {}) };
    setTheme(merged);
    return NextResponse.json(merged);
  } catch {
    return NextResponse.json({ error: "save_failed" }, { status: 500 });
  }
}
