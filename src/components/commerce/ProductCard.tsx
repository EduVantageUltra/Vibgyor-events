"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Plus, Star, Heart } from "lucide-react";
import type { Product } from "@/lib/products";
import { useCart } from "@/store/cart";
import { useFormatPrice } from "@/store/currency";
import { useWishlist } from "@/store/wishlist";
import { TiltCard } from "@/components/ui/TiltCard";

function discount(p: Product) {
  if (!p.mrp || p.mrp <= p.price) return 0;
  return Math.round(((p.mrp - p.price) / p.mrp) * 100);
}

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const add = useCart((s) => s.add);
  const formatINR = useFormatPrice();
  const wishIds = useWishlist((s) => s.ids);
  const toggleWish = useWishlist((s) => s.toggle);
  const wished = wishIds.includes(product.id);
  const off = discount(product);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <TiltCard className="bezel h-full">
        <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(2rem-0.4rem)] bg-gradient-to-b from-white/[0.06] to-white/[0.01]">
          <Link href={`/product/${product.slug}`} className="relative block aspect-square overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width:768px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
            <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
              {product.badges.slice(0, 2).map((b) => (
                <span
                  key={b}
                  className="rounded-full bg-ink/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md"
                >
                  {b}
                </span>
              ))}
            </div>
            {off > 0 && (
              <span className="absolute bottom-3 right-3 rounded-full bg-gradient-to-r from-rose to-amber px-2.5 py-1 text-[11px] font-bold text-ink">
                -{off}%
              </span>
            )}
          </Link>
          <button
            onClick={(e) => { e.preventDefault(); toggleWish(product.id); }}
            aria-label="Add to wishlist"
            className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-ink/50 backdrop-blur-md transition-colors hover:bg-ink/70"
          >
            <Heart className={`h-4 w-4 ${wished ? "fill-rose text-rose" : "text-fog"}`} />
          </button>

          <div className="flex flex-1 flex-col p-4">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-fog-dim">
              <span>{product.brand}</span>
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber text-amber" />
                {product.rating}
              </span>
            </div>
            <Link href={`/product/${product.slug}`}>
              <h3 className="mt-1 font-display text-lg font-semibold leading-tight transition-colors group-hover:text-iris">
                {product.name}
              </h3>
            </Link>
            <p className="mt-1 line-clamp-1 text-xs text-fog-dim">{product.highlights[0]}</p>

            <div className="mt-auto flex items-end justify-between pt-4">
              <div>
                <p className="font-display text-xl font-semibold">{formatINR(product.price)}</p>
                {off > 0 && (
                  <p className="text-xs text-fog-dim line-through">{formatINR(product.mrp)}</p>
                )}
              </div>
              <button
                aria-label={`Add ${product.name} to cart`}
                onClick={() =>
                  add({
                    id: product.id,
                    slug: product.slug,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    color: product.colors[0],
                  })
                }
                className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-iris to-cyan text-ink transition-transform duration-300 hover:scale-110 active:scale-95"
              >
                <Plus className="h-5 w-5" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}
