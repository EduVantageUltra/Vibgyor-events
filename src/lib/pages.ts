import fs from "node:fs";
import path from "node:path";

export type PageMeta = {
  slug: string;
  title: string;
  path: string;
  /** system pages have code (cannot be deleted). user pages are pure-canvas. */
  system?: boolean;
  /** false → page is app-logic (e.g. Shop) and not edited via the canvas. */
  editable?: boolean;
  /** which editor this page uses: structured blocks (Puck) or the free canvas. */
  mode?: "blocks" | "canvas";
  seo?: { title?: string; description?: string; ogImage?: string; keywords?: string };
  inNav: boolean;
  order: number;
};

export function getPageMode(slug: string): "blocks" | "canvas" {
  return getPage(slug)?.mode ?? "blocks";
}

/** Merge a page's editor-set SEO over a code fallback, for generateMetadata. */
export function seoFor(slug: string, fallback: { title: string; description: string }) {
  const seo = getPage(slug)?.seo;
  const title = seo?.title?.trim() || fallback.title;
  const description = seo?.description?.trim() || fallback.description;
  return {
    title,
    description,
    keywords: seo?.keywords ? seo.keywords.split(",").map((k) => k.trim()) : undefined,
    openGraph: { title, description, images: seo?.ogImage ? [seo.ogImage] : undefined },
  };
}

const FILE = path.join(process.cwd(), "src", "data", "pages.json");

export function getPages(): PageMeta[] {
  try {
    const raw = fs.readFileSync(FILE, "utf-8");
    const list = (JSON.parse(raw) as { pages: PageMeta[] }).pages || [];
    return list.sort((a, b) => a.order - b.order);
  } catch {
    return [];
  }
}

export function getPage(slug: string): PageMeta | undefined {
  return getPages().find((p) => p.slug === slug);
}

export function getNavPages(): PageMeta[] {
  return getPages().filter((p) => p.inNav);
}

export function writePages(pages: PageMeta[]) {
  fs.writeFileSync(FILE, JSON.stringify({ pages }, null, 2), "utf-8");
}

export function slugifyPage(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

/** Delete the Puck content file for a page (used when a page is removed). */
export function deletePuckFile(slug: string) {
  const safe = slug.replace(/[^a-z0-9-]/gi, "");
  const p = path.join(process.cwd(), "src", "data", `puck-${safe}.json`);
  try {
    fs.unlinkSync(p);
  } catch {
    /* no-op if it never had saved content */
  }
}
