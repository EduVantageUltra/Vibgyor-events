import type { MetadataRoute } from "next";

const BASE = "https://rajrishi.example.com";

/** Allow all crawlers — incl. AI bots (GPTBot, ClaudeBot, PerplexityBot) for GEO. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/editor", "/api/"] }],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
