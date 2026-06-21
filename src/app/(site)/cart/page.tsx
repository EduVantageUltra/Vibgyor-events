"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart, cartTotal, cartCount } from "@/store/cart";
import { formatINR } from "@/lib/utils";
import { site } from "@/lib/site";

export default function CartPage() {
  const { items, setQty, remove } = useCart();
  const total = cartTotal(items);
  const count = cartCount(items);
  const shipping = total >= site.freeShippingOver || total === 0 ? 0 : 49;

  return (
    <div className="mx-auto max-w-6xl px-6 pb-12 pt-32">
      <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
        Your <span className="text-aurora">bag</span>
      </h1>
      <p className="mt-2 text-fog-dim">{count} item{count !== 1 && "s"}</p>

      {items.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-5 py-20 text-center">
          <div className="grid h-24 w-24 place-items-center rounded-full bg-white/5">
            <ShoppingBag className="h-10 w-10 text-fog-dim" />
          </div>
          <p className="text-fog-dim">Your bag is empty — let&apos;s fix that.</p>
          <Link href="/shop" className="rounded-full bg-gradient-to-r from-iris to-cyan px-7 py-3 text-sm font-bold text-ink">
            Browse the shop
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {items.map((it) => (
                <motion.div
                  key={`${it.id}-${it.color ?? ""}`}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  className="flex gap-4 rounded-[1.5rem] bezel"
                >
                  <div className="flex w-full gap-4 rounded-[calc(1.5rem-0.4rem)] bg-white/[0.02] p-4">
                    <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-white/5">
                      <Image src={it.image} alt={it.name} fill className="object-cover" sizes="112px" />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link href={`/product/${it.slug}`} className="font-display text-lg font-semibold hover:text-iris">
                            {it.name}
                          </Link>
                          {it.color && <p className="text-sm text-fog-dim">{it.color}</p>}
                        </div>
                        <button onClick={() => remove(it.id, it.color)} aria-label="Remove" className="text-fog-dim hover:text-rose">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-2 rounded-full bg-white/5 p-1">
                          <button onClick={() => setQty(it.id, it.color, it.qty - 1)} aria-label="Decrease" className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/10">
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-6 text-center tabular-nums">{it.qty}</span>
                          <button onClick={() => setQty(it.id, it.color, it.qty + 1)} aria-label="Increase" className="grid h-8 w-8 place-items-center rounded-full hover:bg-white/10">
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <span className="font-display text-lg font-semibold">{formatINR(it.price * it.qty)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="glass rounded-[2rem] p-7">
              <h2 className="font-display text-xl font-semibold">Order summary</h2>
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between text-fog-dim">
                  <span>Subtotal</span>
                  <span className="text-fog">{formatINR(total)}</span>
                </div>
                <div className="flex justify-between text-fog-dim">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-emerald-300" : "text-fog"}>
                    {shipping === 0 ? "Free" : formatINR(shipping)}
                  </span>
                </div>
                <div className="my-3 h-px bg-white/10" />
                <div className="flex justify-between">
                  <span className="font-medium">Total</span>
                  <span className="font-display text-2xl font-bold">{formatINR(total + shipping)}</span>
                </div>
              </div>
              <Link
                href="/checkout"
                className="mt-6 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-iris via-cyan to-amber py-3.5 text-sm font-bold text-ink transition-transform active:scale-[0.98]"
              >
                Proceed to checkout <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/shop" className="mt-3 block text-center text-xs text-fog-dim hover:text-fog">
                Continue shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
