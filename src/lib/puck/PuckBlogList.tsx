"use client";

import { useEffect, useState } from "react";
import type { Post } from "@/lib/blog";

export function PuckBlogList({ title, count }: { title: string; count: number }) {
  const [posts, setPosts] = useState<Post[]>([]);
  useEffect(() => {
    fetch("/api/posts").then((r) => r.json()).then((all: Post[]) => setPosts(all.filter((p) => p.published).slice(0, count)));
  }, [count]);

  return (
    <div>
      {title && <h2 className="mb-8 font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>}
      {posts.length === 0 ? (
        <p className="text-sm text-fog-dim">No posts yet — add some in the Blog manager.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((p) => (
            <a key={p.id} href={`/blog/${p.slug}`} className="group block overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.03]">
              <div className="relative aspect-[16/10] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.cover} alt={p.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div className="p-5">
                <p className="text-xs uppercase tracking-wider text-fog-dim">{new Date(p.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                <h3 className="mt-1 font-display text-lg font-semibold leading-tight group-hover:text-iris">{p.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-fog-dim">{p.excerpt}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
