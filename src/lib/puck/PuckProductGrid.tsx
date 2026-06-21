"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/products";
import { ProductCard } from "@/components/commerce/ProductCard";

export function PuckProductGrid({
  category,
  onlyFeatured,
  count,
}: {
  category: string;
  onlyFeatured: boolean;
  count: number;
}) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then(setProducts)
      .catch(() => setProducts([]));
  }, []);

  let list = products;
  if (category && category !== "All") list = list.filter((p) => p.category === category);
  if (onlyFeatured) list = list.filter((p) => p.featured);
  list = list.slice(0, count);

  if (products.length === 0) {
    return <div className="py-10 text-center text-sm text-fog-dim">Loading products…</div>;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
      {list.map((p, i) => (
        <ProductCard key={p.id} product={p} index={i} />
      ))}
    </div>
  );
}
