"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { Product } from "@/lib/products";
import { ProductCard } from "@/components/commerce/ProductCard";
import { useWishlist } from "@/store/wishlist";

export default function WishlistPage() {
  const ids = useWishlist((s) => s.ids);
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => { fetch("/api/products").then((r) => r.json()).then(setProducts).catch(() => {}); }, []);
  const items = products.filter((p) => ids.includes(p.id));

  return (
    <div className="mx-auto max-w-6xl px-6 pb-12 pt-32">
      <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">Your <span className="text-aurora">wishlist</span></h1>
      <p className="mt-2 text-fog-dim">{items.length} saved item{items.length !== 1 && "s"}</p>
      {items.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-5 py-20 text-center">
          <div className="grid h-24 w-24 place-items-center rounded-full bg-white/5"><Heart className="h-10 w-10 text-fog-dim" /></div>
          <p className="text-fog-dim">No saved items yet. Tap the heart on any product.</p>
          <Link href="/shop" className="rounded-full bg-gradient-to-r from-iris to-cyan px-7 py-3 text-sm font-bold text-ink">Browse the shop</Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {items.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      )}
    </div>
  );
}
