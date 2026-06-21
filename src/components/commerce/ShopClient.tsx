"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, SlidersHorizontal } from "lucide-react";
import type { Product } from "@/lib/products";
import { ProductCard } from "./ProductCard";
import { cn } from "@/lib/utils";

const sorts = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price ↑" },
  { id: "price-desc", label: "Price ↓" },
  { id: "rating", label: "Top rated" },
];

export function ShopClient({
  products,
  categories,
  initialCategory,
}: {
  products: Product[];
  categories: string[];
  initialCategory?: string;
}) {
  const [cat, setCat] = useState(initialCategory ?? "All");
  const [sort, setSort] = useState("featured");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    let list = products;
    if (cat !== "All") list = list.filter((p) => p.category === cat);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    list = [...list];
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    else list.sort((a, b) => Number(b.featured) - Number(a.featured));
    return list;
  }, [products, cat, sort, query]);

  const tabs = ["All", ...categories];

  return (
    <div>
      {/* Controls */}
      <div className="sticky top-24 z-30 mb-8 rounded-[1.6rem] glass p-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setCat(t)}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  cat === t ? "text-ink" : "text-fog-dim hover:text-fog"
                )}
              >
                {cat === t && (
                  <motion.span
                    layoutId="shop-tab"
                    className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-iris to-cyan"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-full bg-white/5 px-4 py-2">
              <Search className="h-4 w-4 text-fog-dim" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search devices…"
                className="w-32 bg-transparent text-sm outline-none placeholder:text-fog-dim sm:w-40"
              />
            </div>
            <div className="flex items-center gap-1 rounded-full bg-white/5 px-2 py-1.5">
              <SlidersHorizontal className="ml-1 h-4 w-4 text-fog-dim" />
              {sorts.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSort(s.id)}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                    sort === s.id ? "bg-white/10 text-fog" : "text-fog-dim hover:text-fog"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="mb-6 text-sm text-fog-dim">
        {filtered.length} product{filtered.length !== 1 && "s"}
        {cat !== "All" && <> in <span className="text-fog">{cat}</span></>}
      </p>

      <motion.div layout className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((p, i) => (
            <motion.div key={p.id} layout exit={{ opacity: 0, scale: 0.9 }}>
              <ProductCard product={p} index={i} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <div className="py-24 text-center text-fog-dim">
          No products match. Try a different filter or search.
        </div>
      )}
    </div>
  );
}
