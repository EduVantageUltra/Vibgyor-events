"use client";

import { useEffect, useState } from "react";
import type { Collection } from "@/lib/collections";

export function PuckCollectionList({ collectionSlug, title, columns }: { collectionSlug: string; title: string; columns: number }) {
  const [col, setCol] = useState<Collection | null>(null);
  useEffect(() => {
    fetch("/api/collections").then((r) => r.json()).then((all: Collection[]) => setCol(all.find((c) => c.slug === collectionSlug) || null));
  }, [collectionSlug]);

  if (!col) return <p className="text-sm text-fog-dim">Pick a collection in the panel.</p>;
  const titleKey = col.fields[0]?.key;
  const imageField = col.fields.find((f) => f.type === "image");

  return (
    <div>
      {title && <h2 className="mb-8 font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>}
      <div className="grid gap-5" style={{ gridTemplateColumns: `repeat(${columns || 3}, minmax(0,1fr))` }}>
        {col.items.map((it) => (
          <a key={it.id} href={`/c/${col.slug}/${it.slug}`} className="group overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.03]">
            {imageField && it[imageField.key] ? (
              <div className="relative aspect-[16/10] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={String(it[imageField.key])} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
            ) : null}
            <div className="p-5">
              <h3 className="font-display text-lg font-semibold group-hover:text-iris">{String(it[titleKey] ?? "Item")}</h3>
            </div>
          </a>
        ))}
        {col.items.length === 0 && <p className="text-sm text-fog-dim">No items yet.</p>}
      </div>
    </div>
  );
}
