import { NextResponse } from "next/server";
import { register, login, signSession } from "@/lib/accounts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { action: string; name?: string; email?: string; phone?: string; password?: string };
    if (body.action === "logout") {
      const res = NextResponse.json({ ok: true });
      res.cookies.set("rr-session", "", { maxAge: 0, path: "/" });
      return res;
    }
    const fn = body.action === "register"
      ? register(body.name || "", body.email || "", body.phone || "", body.password || "")
      : login(body.email || "", body.password || "");
    if (!fn.ok) return NextResponse.json({ error: fn.error }, { status: 400 });
    const res = NextResponse.json({ ok: true });
    res.cookies.set("rr-session", signSession(fn.id!), { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
    return res;
  } catch {
    return NextResponse.json({ error: "Accounts need a database in production. Works locally; ask to wire a DB for go-live." }, { status: 500 });
  }
}
