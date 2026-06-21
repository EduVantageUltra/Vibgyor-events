"use client";

import type { CanvasElement, SectionPreset } from "@/lib/freecanvas";
import { PuckProductGrid } from "@/lib/puck/PuckProductGrid";

/** Fixed design size of each section preset (scaled to fit its box on the canvas). */
export const presetSize: Record<SectionPreset, { w: number; h: number }> = {
  hero: { w: 1200, h: 540 },
  cta: { w: 1200, h: 360 },
  features: { w: 1200, h: 360 },
  productRow: { w: 1200, h: 560 },
};

export const presetDefaults: Record<SectionPreset, Partial<CanvasElement>> = {
  hero: { text: "Big headline here", text2: "A short supporting line about your offer.", text3: "Shop now", href: "/shop", src: "/products/phone-aurora.jpg" },
  cta: { text: "Ready to upgrade?", text2: "Browse online or order on WhatsApp.", text3: "Start shopping", href: "/shop" },
  features: { text: "Why shop with us", text2: "" },
  productRow: { text: "Featured products", text2: "" },
};

export function SectionPresetView({ el }: { el: CanvasElement }) {
  const heading = el.text || "Heading";
  const sub = el.text2 || "";
  const btn = el.text3 || "";
  const color = el.color && el.color !== "none" ? el.color : undefined;

  switch (el.section) {
    case "hero":
      return (
        <div className="grid h-full grid-cols-2 items-center gap-8 overflow-hidden rounded-[28px] bg-gradient-to-br from-ink-2 to-ink px-12">
          <div>
            <h2 className="font-display text-6xl font-bold leading-[0.95] tracking-tight" style={{ color: color ?? undefined }}>
              {heading}
            </h2>
            {sub && <p className="mt-5 text-xl text-fog-dim">{sub}</p>}
            {btn && (
              <span className="mt-7 inline-flex rounded-full bg-gradient-to-r from-iris via-cyan to-amber px-7 py-3 text-base font-bold text-ink">
                {btn}
              </span>
            )}
          </div>
          <div className="relative h-full overflow-hidden rounded-[24px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={el.src || "/products/phone-aurora.jpg"} alt="" className="h-full w-full object-cover" />
          </div>
        </div>
      );

    case "cta":
      return (
        <div className="relative flex h-full flex-col items-center justify-center gap-5 overflow-hidden rounded-[28px] px-10 text-center"
          style={{ background: el.bg && el.bg !== "none" ? el.bg : "linear-gradient(135deg,rgba(124,92,255,0.35),#070709,rgba(57,230,255,0.25))" }}>
          <h2 className="font-display text-5xl font-bold tracking-tight" style={{ color: color ?? undefined }}>{heading}</h2>
          {sub && <p className="max-w-xl text-lg text-fog-dim">{sub}</p>}
          {btn && <span className="rounded-full bg-gradient-to-r from-iris via-cyan to-amber px-7 py-3 text-base font-bold text-ink">{btn}</span>}
        </div>
      );

    case "features":
      return (
        <div className="h-full">
          <h2 className="mb-7 text-center font-display text-4xl font-bold tracking-tight" style={{ color: color ?? undefined }}>{heading}</h2>
          <div className="grid grid-cols-3 gap-5">
            {["Genuine warranty", "Fast delivery", "Easy EMI"].map((t, i) => (
              <div key={i} className="rounded-[24px] border border-white/10 bg-white/[0.04] p-7">
                <div className="mb-3 h-10 w-10 rounded-xl bg-gradient-to-br from-iris/30 to-cyan/20" />
                <h3 className="font-display text-xl font-semibold">{t}</h3>
                <p className="mt-2 text-sm text-fog-dim">Short supporting detail about this benefit.</p>
              </div>
            ))}
          </div>
        </div>
      );

    case "productRow":
      return (
        <div className="h-full">
          <h2 className="mb-7 font-display text-4xl font-bold tracking-tight" style={{ color: color ?? undefined }}>{heading}</h2>
          <PuckProductGrid category="All" onlyFeatured count={4} />
        </div>
      );

    default:
      return null;
  }
}
