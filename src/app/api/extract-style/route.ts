import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RGB = { r: number; g: number; b: number };

const toHex = ({ r, g, b }: RGB) =>
  "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");

function parse(c: string): RGB | null {
  c = c.trim().toLowerCase();
  let m = c.match(/^#([0-9a-f]{3})$/);
  if (m) return { r: parseInt(m[1][0] + m[1][0], 16), g: parseInt(m[1][1] + m[1][1], 16), b: parseInt(m[1][2] + m[1][2], 16) };
  m = c.match(/^#([0-9a-f]{6})(?:[0-9a-f]{2})?$/);
  if (m) return { r: parseInt(m[1].slice(0, 2), 16), g: parseInt(m[1].slice(2, 4), 16), b: parseInt(m[1].slice(4, 6), 16) };
  m = c.match(/^rgba?\(([^)]+)\)$/);
  if (m) {
    const p = m[1].split(",").map((x) => parseFloat(x));
    if (p.length >= 3 && p.every((n) => !isNaN(n))) return { r: p[0], g: p[1], b: p[2] };
  }
  return null;
}

const lum = ({ r, g, b }: RGB) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
function sat({ r, g, b }: RGB) {
  const max = Math.max(r, g, b) / 255, min = Math.min(r, g, b) / 255;
  if (max === 0) return 0;
  return (max - min) / max;
}

async function fetchText(url: string, ms = 7000): Promise<string> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; StyleBot/1.0)", Accept: "text/html,text/css,*/*" },
    });
    return await res.text();
  } finally {
    clearTimeout(t);
  }
}

export async function GET(req: Request) {
  let target = new URL(req.url).searchParams.get("url") || "";
  if (!target) return NextResponse.json({ error: "no_url" }, { status: 400 });
  if (!/^https?:\/\//.test(target)) target = "https://" + target;

  let base: URL;
  try {
    base = new URL(target);
  } catch {
    return NextResponse.json({ error: "bad_url" }, { status: 400 });
  }

  try {
    const html = await fetchText(target);
    let css = html;

    // pull in a few linked stylesheets
    const links = [...html.matchAll(/<link[^>]+rel=["']?stylesheet["']?[^>]*>/gi)]
      .map((m) => m[0].match(/href=["']([^"']+)["']/i)?.[1])
      .filter(Boolean)
      .slice(0, 5) as string[];
    const sheets = await Promise.allSettled(
      links.map((h) => fetchText(new URL(h, base).toString(), 5000))
    );
    for (const s of sheets) if (s.status === "fulfilled") css += "\n" + s.value;

    // collect colours
    const counts = new Map<string, number>();
    const re = /#[0-9a-fA-F]{3,8}\b|rgba?\([^)]+\)/g;
    let mm: RegExpExecArray | null;
    while ((mm = re.exec(css))) {
      const rgb = parse(mm[0]);
      if (!rgb) continue;
      const hex = toHex(rgb);
      counts.set(hex, (counts.get(hex) ?? 0) + 1);
    }
    if (counts.size === 0) return NextResponse.json({ error: "no_colours_found" }, { status: 422 });

    const all = [...counts.entries()]
      .map(([hex, n]) => ({ hex, n, rgb: parse(hex)!, l: lum(parse(hex)!), s: sat(parse(hex)!) }))
      .sort((a, b) => b.n - a.n);

    const darks = [...all].sort((a, b) => a.l - b.l);
    const lights = [...all].sort((a, b) => b.l - a.l);
    // vibrant = saturated, mid luminance, ordered by frequency
    const vivid = all.filter((c) => c.s > 0.35 && c.l > 0.18 && c.l < 0.9).sort((a, b) => b.n + b.s * 50 - (a.n + a.s * 50));

    const pick = (arr: typeof all, i: number, fb: string) => arr[i]?.hex ?? fb;
    const theme = {
      ink: pick(darks, 0, "#060608"),
      ink2: pick(darks, 1, "#0b0b12"),
      fog: pick(lights, 0, "#ECECF2"),
      fogDim: pick(lights, 3, "#9b9ba8"),
      violet: pick(vivid, 0, "#7c5cff"),
      iris: pick(vivid, 1, "#a988ff"),
      cyan: pick(vivid, 2, "#39e6ff"),
      amber: pick(vivid, 3, "#ffb86b"),
      rose: pick(vivid, 4, "#ff6b9d"),
    };

    return NextResponse.json({
      theme,
      palette: all.slice(0, 12).map((c) => c.hex),
      source: base.host,
    });
  } catch {
    return NextResponse.json({ error: "fetch_failed", message: "Could not read that website." }, { status: 502 });
  }
}
