import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getItem } from "@/lib/collections";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ collection: string; slug: string }> }): Promise<Metadata> {
  const { collection, slug } = await params;
  const found = getItem(collection, slug);
  const title = found ? String(found.item[found.collection.fields[0]?.key] ?? "Item") : "Item";
  return { title };
}

export default async function ItemPage({ params }: { params: Promise<{ collection: string; slug: string }> }) {
  const { collection, slug } = await params;
  const found = getItem(collection, slug);
  if (!found) notFound();
  const { collection: col, item } = found;
  const titleKey = col.fields[0]?.key;
  const imageField = col.fields.find((f) => f.type === "image");

  return (
    <article className="mx-auto max-w-3xl px-6 pb-16 pt-28">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-fog-dim hover:text-fog"><ChevronLeft className="h-4 w-4" /> {col.name}</Link>
      <h1 className="mt-6 font-display text-4xl font-bold tracking-tight sm:text-5xl">{String(item[titleKey] ?? "Item")}</h1>
      {imageField && Boolean(item[imageField.key]) && (
        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-[2rem] border border-white/10">
          <Image src={String(item[imageField.key])} alt="" fill priority sizes="100vw" className="object-cover" />
        </div>
      )}
      <dl className="mt-8 divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10">
        {col.fields.filter((f) => f.key !== titleKey && f.type !== "image").map((f) => (
          <div key={f.key} className="flex flex-col gap-1 px-5 py-4">
            <dt className="text-xs uppercase tracking-wider text-fog-dim">{f.label}</dt>
            <dd className="text-fog">{f.type === "boolean" ? (item[f.key] ? "Yes" : "No") : String(item[f.key] ?? "—")}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
