"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "motion/react";
import { Star, Plus, Minus, Check, ShieldCheck, Truck, RefreshCw, MessageCircle } from "lucide-react";
import type { Product } from "@/lib/products";
import { formatINR as formatINRbase, cn } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { useFormatPrice } from "@/store/currency";
import { useT } from "@/store/lang";
import { site } from "@/lib/site";

export function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const add = useCart((s) => s.add);
  const formatINR = useFormatPrice();
  const t = useT();
  void formatINRbase;
  const [color, setColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const off = product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

  const addToCart = () => {
    add(
      { id: product.id, slug: product.slug, name: product.name, price: product.price, image: product.image, color },
      qty
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const buyNow = () => {
    add(
      { id: product.id, slug: product.slug, name: product.name, price: product.price, image: product.image, color },
      qty
    );
    router.push("/checkout");
  };

  const waText = encodeURIComponent(
    `Hi Rajrishi Communication! I'd like to order:\n${product.name} (${color}) × ${qty}\nPrice: ${formatINR(
      product.price * qty
    )}\nIs it available?`
  );

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
      {/* Gallery */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="bezel"
        >
          <div className="relative aspect-square overflow-hidden rounded-[calc(2rem-0.4rem)] bg-white/[0.03]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(max-width:1024px) 100vw, 50vw"
              className="object-cover"
            />
            {off > 0 && (
              <span className="absolute left-4 top-4 rounded-full bg-gradient-to-r from-rose to-amber px-3 py-1 text-sm font-bold text-ink">
                Save {off}%
              </span>
            )}
          </div>
        </motion.div>
        <div className="mt-4 grid grid-cols-4 gap-3">
          {product.highlights.map((h, i) => (
            <div key={i} className="rounded-2xl bg-white/[0.03] p-3 text-center text-[11px] leading-tight text-fog-dim">
              {h}
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-fog-dim uppercase tracking-wider">{product.brand}</span>
          <span className="flex items-center gap-1 text-amber">
            <Star className="h-4 w-4 fill-amber" /> {product.rating}
            <span className="text-fog-dim">({product.reviews})</span>
          </span>
        </div>
        <h1 className="mt-2 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          {product.name}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-fog-dim">{product.description}</p>

        <div className="mt-6 flex items-end gap-3">
          <span className="font-display text-4xl font-bold">{formatINR(product.price)}</span>
          {off > 0 && <span className="mb-1 text-lg text-fog-dim line-through">{formatINR(product.mrp)}</span>}
          {off > 0 && <span className="mb-1.5 text-sm font-semibold text-emerald-300">{off}% off</span>}
        </div>
        <p className="mt-1 text-xs text-fog-dim">Inclusive of all taxes · EMI available at checkout</p>

        {/* Colors */}
        <div className="mt-8">
          <p className="mb-3 text-sm font-medium">
            Colour: <span className="text-fog-dim">{color}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm transition-all",
                  color === c
                    ? "border-iris bg-iris/10 text-fog ring-aurora"
                    : "border-white/15 text-fog-dim hover:border-white/30"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Qty + actions */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 rounded-full bg-white/5 p-1.5">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease" className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/10">
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-6 text-center tabular-nums">{qty}</span>
            <button onClick={() => setQty((q) => q + 1)} aria-label="Increase" className="grid h-9 w-9 place-items-center rounded-full hover:bg-white/10">
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <span className={cn("text-xs", product.stock < 10 ? "text-amber" : "text-fog-dim")}>
            {product.stock < 10 ? `Only ${product.stock} left` : "In stock"}
          </span>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={addToCart}
            className={cn(
              "group relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-full py-3.5 text-sm font-bold transition-transform active:scale-[0.98]",
              added ? "bg-emerald-400 text-ink" : "bg-white/10 text-fog hover:bg-white/15"
            )}
          >
            {added ? (
              <>
                <Check className="h-4 w-4" /> {t("addToBag")} ✓
              </>
            ) : (
              t("addToBag")
            )}
          </button>
          <button
            onClick={buyNow}
            className="flex-1 rounded-full bg-gradient-to-r from-iris via-cyan to-amber py-3.5 text-sm font-bold text-ink transition-transform active:scale-[0.98]"
          >
            {t("buyNow")} · {formatINR(product.price * qty)}
          </button>
        </div>
        <a
          href={`https://wa.me/${site.whatsapp}?text=${waText}`}
          target="_blank"
          rel="noreferrer"
          className="mt-3 flex items-center justify-center gap-2 rounded-full border border-[#25D366]/40 bg-[#25D366]/10 py-3 text-sm font-semibold text-[#4ee48a] transition-colors hover:bg-[#25D366]/20"
        >
          <MessageCircle className="h-4 w-4" /> {t("orderWhatsapp")}
        </a>

        {/* Trust row */}
        <div className="mt-8 grid grid-cols-3 gap-3 border-t border-white/10 pt-6 text-center text-xs text-fog-dim">
          <div className="flex flex-col items-center gap-2"><ShieldCheck className="h-5 w-5 text-iris" /> Genuine warranty</div>
          <div className="flex flex-col items-center gap-2"><Truck className="h-5 w-5 text-iris" /> Fast delivery</div>
          <div className="flex flex-col items-center gap-2"><RefreshCw className="h-5 w-5 text-iris" /> 7-day returns</div>
        </div>

        {/* Specs */}
        <div className="mt-8">
          <h3 className="mb-3 font-display text-lg font-semibold">Specifications</h3>
          <dl className="overflow-hidden rounded-2xl border border-white/10">
            {Object.entries(product.specs).map(([k, v], i) => (
              <div key={k} className={cn("flex justify-between px-5 py-3 text-sm", i % 2 === 0 ? "bg-white/[0.03]" : "")}>
                <dt className="text-fog-dim">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
