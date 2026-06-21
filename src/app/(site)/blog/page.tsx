import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/sections/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { getPublishedPosts } from "@/lib/blog";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Blog", description: "Tips, guides and news from Rajrishi Communication." };

export default function BlogPage() {
  const posts = getPublishedPosts();
  return (
    <>
      <PageHeader eyebrow="Journal" title={<>The <span className="text-aurora">blog</span></>} subtitle="Buying guides, tips and the latest from the store." />
      <div className="mx-auto max-w-6xl px-6 pb-12">
        {posts.length === 0 ? (
          <p className="py-20 text-center text-fog-dim">No posts yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {posts.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.06}>
                <Link href={`/blog/${p.slug}`} className="group block overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.03]">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image src={p.cover} alt={p.title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <div className="p-5">
                    <p className="text-xs uppercase tracking-wider text-fog-dim">{new Date(p.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                    <h3 className="mt-1 font-display text-xl font-semibold leading-tight transition-colors group-hover:text-iris">{p.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-fog-dim">{p.excerpt}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
