import { NextResponse } from "next/server";
import { blockInProd } from "@/lib/guard";
import { getPosts, writePosts, type Post } from "@/lib/blog";
import { slugify } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(getPosts());
}

export async function POST(req: Request) {
  const b = blockInProd(); if (b) return b;
  const body = (await req.json()) as Partial<Post>;
  const posts = getPosts();
  const title = body.title?.trim() || "Untitled post";
  let slug = body.slug || slugify(title);
  if (posts.some((p) => p.slug === slug)) slug = `${slug}-${Date.now().toString().slice(-4)}`;
  const post: Post = {
    id: body.id || `post-${Date.now().toString(36)}`,
    slug, title,
    excerpt: body.excerpt || "",
    cover: body.cover || "/products/phone-aurora.jpg",
    date: body.date || new Date().toISOString().slice(0, 10),
    published: body.published ?? true,
    body: body.body || "",
  };
  writePosts([...posts, post]);
  return NextResponse.json(post);
}

export async function PUT(req: Request) {
  const b = blockInProd(); if (b) return b;
  const body = (await req.json()) as Post;
  const posts = getPosts();
  const idx = posts.findIndex((p) => p.id === body.id);
  if (idx === -1) return NextResponse.json({ error: "not_found" }, { status: 404 });
  posts[idx] = { ...posts[idx], ...body };
  writePosts(posts);
  return NextResponse.json(posts[idx]);
}

export async function DELETE(req: Request) {
  const b = blockInProd(); if (b) return b;
  const { id } = (await req.json()) as { id: string };
  writePosts(getPosts().filter((p) => p.id !== id));
  return NextResponse.json({ ok: true });
}
