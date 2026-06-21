"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart, cartTotal, cartCount } from "@/store/cart";
import { useFormatPrice } from "@/store/currency";
import { useT } from "@/store/lang";
import { site } from "@/lib/site";

export default function CartDrawer() {
  const { items, isOpen, close, setQty, remove } = useCart();
  const formatINR = useFormatPrice();
  const t = useT();
  const total = cartTotal(items);
  const count = cartCount(items);
  const freeLeft = Math.max(0, site.freeShippingOver - total);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[60] bg-ink/70 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 36 }}
            className="fixed right-0 top-0 z-[61] flex h-full w-full max-w-md flex-col bg-ink-2 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="h-5 w-5 text-iris" />
                <h2 className="font-display text-lg font-semibold">
                  {t("cart")} {count > 0 && <span className="text-fog-dim">· {count}</span>}
                </h2>
              </div>
              <button
                onClick={close}
                aria-label="Close cart"
                className="grid h-9 w-9 place-items-center rounded-full bg-white/5 hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <div className="grid h-20 w-20 place-items-center rounded-full bg-white/5">
                  <ShoppingBag className="h-8 w-8 text-fog-dim" />
                </div>
                <p className="text-fog-dim">{t("empty")}</p>
                <Link
                  href="/shop"
                  onClick={close}
                  className="rounded-full bg-gradient-to-r from-iris to-cyan px-6 py-2.5 text-sm font-semibold text-ink"
                >
                  {t("browse")}
                </Link>
              </div>
            ) : (
              <>
                {freeLeft > 0 ? (
                  <p className="bg-white/[0.03] px-6 py-3 text-center text-xs text-fog-dim">
                    Add <span className="text-cyan font-semibold">{formatINR(freeLeft)}</span> more for
                    free shipping
                  </p>
                ) : (
                  <p className="bg-emerald-500/10 px-6 py-3 text-center text-xs text-emerald-300">
                    You&apos;ve unlocked free shipping ✓
                  </p>
                )}

                <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                  <AnimatePresence initial={false}>
                    {items.map((it) => (
                      <motion.div
                        key={`${it.id}-${it.color ?? ""}`}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, x: 40 }}
                        transition={{ ease: [0.22, 1, 0.36, 1] }}
                        className="flex gap-3 rounded-2xl bg-white/[0.03] p-3"
                      >
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white/5">
                          <Image src={it.image} alt={it.name} fill className="object-cover" sizes="80px" />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-sm font-semibold leading-tight">{it.name}</p>
                              {it.color && <p className="text-xs text-fog-dim">{it.color}</p>}
                            </div>
                            <button
                              onClick={() => remove(it.id, it.color)}
                              aria-label="Remove"
                              className="text-fog-dim transition-colors hover:text-rose"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="mt-auto flex items-center justify-between">
                            <div className="flex items-center gap-2 rounded-full bg-white/5 p-1">
                              <button
                                onClick={() => setQty(it.id, it.color, it.qty - 1)}
                                aria-label="Decrease"
                                className="grid h-6 w-6 place-items-center rounded-full hover:bg-white/10"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-5 text-center text-sm tabular-nums">{it.qty}</span>
                              <button
                                onClick={() => setQty(it.id, it.color, it.qty + 1)}
                                aria-label="Increase"
                                className="grid h-6 w-6 place-items-center rounded-full hover:bg-white/10"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <span className="text-sm font-semibold">{formatINR(it.price * it.qty)}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="border-t border-white/10 px-6 py-5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-fog-dim">{t("subtotal")}</span>
                    <span className="font-display text-xl font-semibold">{formatINR(total)}</span>
                  </div>
                  <Link
                    href="/checkout"
                    onClick={close}
                    className="block w-full rounded-full bg-gradient-to-r from-iris via-cyan to-amber py-3.5 text-center text-sm font-bold text-ink transition-transform active:scale-[0.98]"
                  >
                    {t("checkout")} · {formatINR(total)}
                  </Link>
                  <Link
                    href="/cart"
                    onClick={close}
                    className="mt-2 block text-center text-xs text-fog-dim hover:text-fog"
                  >
                    {t("viewBag")}
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
