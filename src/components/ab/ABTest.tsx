"use client";

import { useEffect, useState } from "react";

/** Shows variant A or B per visitor (50/50, sticky) and tracks views + conversions. */
export function ABTest({ expId, headingA, headingB, subA, subB, ctaLabel, ctaHref }: {
  expId: string; headingA: string; headingB: string; subA: string; subB: string; ctaLabel: string; ctaHref: string;
}) {
  const [variant, setVariant] = useState<"a" | "b" | null>(null);

  useEffect(() => {
    if (!expId) return;
    const key = `ab-${expId}`;
    let v = localStorage.getItem(key) as "a" | "b" | null;
    if (v !== "a" && v !== "b") { v = Math.random() < 0.5 ? "a" : "b"; localStorage.setItem(key, v); }
    setVariant(v);
    fetch("/api/ab", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ expId, variant: v, event: "view" }) }).catch(() => {});
  }, [expId]);

  const heading = variant === "b" ? headingB : headingA;
  const sub = variant === "b" ? subB : subA;
  const convert = () => { if (variant) fetch("/api/ab", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ expId, variant, event: "convert" }) }).catch(() => {}); };

  return (
    <div className="mx-auto max-w-2xl text-center" style={{ opacity: variant ? 1 : 0, transition: "opacity .3s" }}>
      <h2 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">{heading || headingA}</h2>
      {(sub || subA) && <p className="mt-4 text-lg text-fog-dim">{sub || subA}</p>}
      {ctaLabel && (
        <a href={ctaHref || "/shop"} onClick={convert} className="mt-7 inline-block rounded-full bg-gradient-to-r from-iris via-cyan to-amber px-8 py-3.5 text-sm font-bold text-ink">
          {ctaLabel}
        </a>
      )}
    </div>
  );
}
