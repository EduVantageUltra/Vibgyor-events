import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Check = { category: "SEO" | "Accessibility" | "AI / GEO" | "Performance"; label: string; status: "pass" | "warn" | "fail"; detail: string };

export async function GET(req: Request) {
  const u = new URL(req.url);
  const path = u.searchParams.get("path") || "/";
  const origin = u.origin;

  let html = "";
  try {
    html = await (await fetch(origin + path, { headers: { "User-Agent": "RajrishiAudit/1.0" } })).text();
  } catch {
    return NextResponse.json({ error: "fetch_failed" }, { status: 502 });
  }

  const checks: Check[] = [];
  const add = (category: Check["category"], label: string, ok: boolean, warn: boolean, detail: string) =>
    checks.push({ category, label, status: ok ? "pass" : warn ? "warn" : "fail", detail });

  // ---- SEO ----
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() || "";
  add("SEO", "Title tag", !!title, false, title ? `“${title}” (${title.length} chars)` : "Missing <title>");
  add("SEO", "Title length", title.length >= 20 && title.length <= 65, title.length > 0, `${title.length} chars (ideal 30–60)`);
  const desc = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([\s\S]*?)["']/i)?.[1] || "";
  add("SEO", "Meta description", !!desc, false, desc ? `${desc.length} chars` : "Missing meta description");
  add("SEO", "Description length", desc.length >= 50 && desc.length <= 165, desc.length > 0, `${desc.length} chars (ideal 70–160)`);
  const h1s = (html.match(/<h1[\s>]/gi) || []).length;
  add("SEO", "Single H1", h1s === 1, h1s > 1, `${h1s} <h1> found (ideal: exactly 1)`);
  add("SEO", "Open Graph tags", /property=["']og:(title|image)["']/i.test(html), false, /og:/i.test(html) ? "OG tags present" : "Add og:title & og:image for social shares");
  add("SEO", "Canonical / metadata", /<meta[^>]+property=["']og:/i.test(html) || !!title, !!title, "Page metadata present");

  // ---- Accessibility ----
  const imgs = html.match(/<img\b[^>]*>/gi) || [];
  const imgNoAlt = imgs.filter((t) => !/\balt=/.test(t)).length;
  add("Accessibility", "Image alt text", imgNoAlt === 0, imgNoAlt <= 2, imgNoAlt === 0 ? `All ${imgs.length} images have alt` : `${imgNoAlt} of ${imgs.length} images missing alt`);
  add("Accessibility", "Page language", /<html[^>]*\blang=/i.test(html), false, /lang=/i.test(html) ? "lang attribute set" : "Add lang to <html>");
  const btnsNoLabel = (html.match(/<button\b(?![^>]*aria-label)[^>]*>\s*<\/button>/gi) || []).length;
  add("Accessibility", "Buttons labelled", btnsNoLabel === 0, btnsNoLabel <= 1, btnsNoLabel === 0 ? "Interactive controls have labels" : `${btnsNoLabel} empty buttons without aria-label`);
  add("Accessibility", "Heading structure", h1s >= 1, true, h1s >= 1 ? "Has an H1 heading" : "No H1 — add a main heading");

  // ---- AI / GEO ----
  add("AI / GEO", "Structured data (JSON-LD)", html.includes("application/ld+json"), false, html.includes("application/ld+json") ? "Schema markup present (great for AI citations)" : "Add JSON-LD schema");
  let llms = false;
  try { llms = (await fetch(origin + "/llms.txt")).ok; } catch { /* ignore */ }
  add("AI / GEO", "llms.txt", llms, false, llms ? "/llms.txt found — AI engines can read your site" : "Add /llms.txt");
  add("AI / GEO", "Server-rendered content", html.length > 5000, html.length > 1000, `${Math.round(html.length / 1000)}KB of HTML — AI crawlers see your content`);

  // ---- Performance (rough) ----
  const imgCount = imgs.length;
  add("Performance", "Image count", imgCount <= 25, imgCount <= 40, `${imgCount} images on the page`);
  const inlineScripts = (html.match(/<script\b/gi) || []).length;
  add("Performance", "Scripts", inlineScripts <= 20, inlineScripts <= 35, `${inlineScripts} script tags`);

  const passed = checks.filter((c) => c.status === "pass").length;
  const warns = checks.filter((c) => c.status === "warn").length;
  const score = Math.round(((passed + warns * 0.5) / checks.length) * 100);

  return NextResponse.json({ path, score, passed, total: checks.length, checks });
}
