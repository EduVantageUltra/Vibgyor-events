import { NextResponse } from "next/server";
import { blockInProd } from "@/lib/guard";
import { getPages, writePages, slugifyPage, deletePuckFile, type PageMeta } from "@/lib/pages";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Slugs that collide with real app routes — cannot be used for canvas pages.
const RESERVED = new Set([
  "shop", "product", "cart", "checkout", "editor", "api", "uploads",
  "home", "_next",
]);

export async function GET() {
  return NextResponse.json(getPages());
}

export async function POST(req: Request) {
  const _blocked = blockInProd();
  if (_blocked) return _blocked;
  const { title } = (await req.json()) as { title: string };
  if (!title?.trim()) return NextResponse.json({ error: "title_required" }, { status: 400 });

  const pages = getPages();
  let slug = slugifyPage(title);
  if (!slug) slug = `page-${pages.length + 1}`;
  if (RESERVED.has(slug) || pages.some((p) => p.slug === slug)) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  const newPage: PageMeta = {
    slug,
    title: title.trim(),
    path: `/${slug}`,
    system: false,
    editable: true,
    inNav: true,
    order: Math.max(0, ...pages.map((p) => p.order)) + 1,
  };
  writePages([...pages, newPage]);
  return NextResponse.json(newPage);
}

export async function PATCH(req: Request) {
  const _blocked = blockInProd();
  if (_blocked) return _blocked;
  const { slug, title, inNav, order, mode, seo } = (await req.json()) as Partial<PageMeta> & { slug: string };
  const pages = getPages();
  const idx = pages.findIndex((p) => p.slug === slug);
  if (idx === -1) return NextResponse.json({ error: "not_found" }, { status: 404 });

  if (typeof title === "string" && title.trim()) pages[idx].title = title.trim();
  if (typeof inNav === "boolean") pages[idx].inNav = inNav;
  if (typeof order === "number") pages[idx].order = order;
  if (mode === "blocks" || mode === "canvas") pages[idx].mode = mode;
  if (seo && typeof seo === "object") pages[idx].seo = { ...pages[idx].seo, ...seo };

  writePages(pages);
  return NextResponse.json(pages[idx]);
}

export async function DELETE(req: Request) {
  const _blocked = blockInProd();
  if (_blocked) return _blocked;
  const { slug } = (await req.json()) as { slug: string };
  const pages = getPages();
  const target = pages.find((p) => p.slug === slug);
  if (!target) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (target.system) return NextResponse.json({ error: "cannot_delete_system" }, { status: 400 });

  writePages(pages.filter((p) => p.slug !== slug));
  deletePuckFile(slug);
  return NextResponse.json({ ok: true });
}
