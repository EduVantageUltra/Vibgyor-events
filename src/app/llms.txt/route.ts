import { getProducts } from "@/lib/products";
import { getNavPages } from "@/lib/pages";
import { getPublishedPosts } from "@/lib/blog";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

const BASE = "https://rajrishi.example.com";

/**
 * /llms.txt — the 2026 standard that tells AI engines (ChatGPT, Claude,
 * Perplexity, AI Overviews) what this site is and what matters, so they can
 * cite us accurately (GEO).
 */
export async function GET() {
  const products = getProducts();
  const pages = getNavPages();
  const posts = getPublishedPosts();

  const lines: string[] = [];
  lines.push(`# ${site.name}`);
  lines.push("");
  lines.push(`> ${site.description}`);
  lines.push("");
  lines.push(`${site.name} is a mobile phone & accessories store. We sell genuine, brand-warrantied smartphones, audio, charging, wearables and cases, with fast delivery, EMI and after-sales support. Contact: ${site.phone} · ${site.email} · ${site.address}. Hours: ${site.hours}.`);
  lines.push("");
  lines.push("## Pages");
  for (const p of pages) lines.push(`- [${p.title}](${BASE}${p.path})`);
  lines.push(`- [Blog](${BASE}/blog)`);
  lines.push("");
  lines.push("## Products");
  for (const p of products) {
    lines.push(`- [${p.name}](${BASE}/product/${p.slug}) — ${p.brand}, ${p.category}, ₹${p.price.toLocaleString("en-IN")} (rated ${p.rating}/5). ${p.highlights.slice(0, 3).join(", ")}.`);
  }
  if (posts.length) {
    lines.push("");
    lines.push("## Articles");
    for (const p of posts) lines.push(`- [${p.title}](${BASE}/blog/${p.slug}) — ${p.excerpt}`);
  }
  lines.push("");
  lines.push("## Contact & ordering");
  lines.push(`- WhatsApp orders: https://wa.me/${site.whatsapp}`);
  lines.push(`- Online payment via Razorpay (UPI, cards, netbanking).`);

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
