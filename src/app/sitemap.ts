import type { MetadataRoute } from "next";
import { getPages } from "@/lib/pages";
import { getProducts } from "@/lib/products";
import { getPublishedPosts } from "@/lib/blog";

export const dynamic = "force-dynamic";

const BASE = "https://rajrishi.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = getPages().map((p) => ({
    url: `${BASE}${p.path}`,
    changeFrequency: "weekly" as const,
    priority: p.slug === "home" ? 1 : 0.7,
  }));
  const products = getProducts().map((p) => ({
    url: `${BASE}/product/${p.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));
  const posts = getPublishedPosts().map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));
  return [...pages, ...products, ...posts];
}
