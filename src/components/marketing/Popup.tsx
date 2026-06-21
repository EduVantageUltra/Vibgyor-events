"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";

export type PopupConfig = {
  enabled: boolean;
  heading: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  delaySec: number;
};

export function Popup({ config }: { config?: PopupConfig }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!config?.enabled) return;
    if (sessionStorage.getItem("rr-popup-seen")) return;
    const t = setTimeout(() => setOpen(true), Math.max(0, config.delaySec) * 1000);
    return () => clearTimeout(t);
  }, [config]);

  const close = () => {
    setOpen(false);
    sessionStorage.setItem("rr-popup-seen", "1");
  };

  if (!config?.enabled) return null;
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/70 p-6 backdrop-blur-md" onClick={close}>
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/10 bg-ink-2 p-8 text-center"
          >
            <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-iris/30 blur-[80px]" />
            <button onClick={close} aria-label="Close" className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/5 hover:bg-white/10">
              <X className="h-4 w-4" />
            </button>
            <h3 className="relative font-display text-3xl font-bold">{config.heading}</h3>
            <p className="relative mt-3 text-fog-dim">{config.body}</p>
            <Link href={config.ctaHref || "/shop"} onClick={close} className="relative mt-6 inline-block rounded-full bg-gradient-to-r from-iris via-cyan to-amber px-7 py-3 text-sm font-bold text-ink">
              {config.ctaLabel || "Shop now"}
            </Link>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
