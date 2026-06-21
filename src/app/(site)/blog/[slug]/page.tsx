import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getPost, getPublishedPosts } from "@/lib/blog";
import { JsonLd } from "@/components/seo/JsonLd";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Post not found" };
  return { title: post.title, description: post.excerpt, openGraph: { images: [post.cover] } };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post || !post.published) notFound();
  const related = getPublishedPosts().filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <article className="mx-auto max-w-3xl px-6 pb-16 pt-28">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt,
          image: `https://rajrishi.example.com${post.cover}`,
          datePublished: post.date,
          dateModified: post.date,
          author: { "@type": "Organization", name: site.name },
          publisher: { "@type": "Organization", name: site.name },
          mainEntityOfPage: `https://rajrishi.example.com/blog/${post.slug}`,
        }}
      />

      <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-fog-dim hover:text-fog"><ChevronLeft className="h-4 w-4" /> All posts</Link>
      <p className="mt-6 text-xs uppercase tracking-wider text-fog-dim">{new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
      <h1 className="mt-2 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">{post.title}</h1>
      <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-[2rem] border border-white/10">
        <Image src={post.cover} alt={post.title} fill priority sizes="100vw" className="object-cover" />
      </div>
      <div className="mt-8 space-y-5 text-lg leading-relaxed text-fog-dim">
        {post.body.split("\n\n").map((para, i) => <p key={i}>{para}</p>)}
      </div>

      {related.length > 0 && (
        <div className="mt-16 border-t border-white/10 pt-10">
          <h2 className="mb-6 font-display text-2xl font-semibold">More to read</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {related.map((p) => (
              <Link key={p.id} href={`/blog/${p.slug}`} className="group rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm font-semibold leading-tight group-hover:text-iris">{p.title}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
