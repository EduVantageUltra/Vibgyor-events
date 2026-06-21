"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { Accordion } from "@/components/ui/Accordion";
import { Marquee } from "@/components/ui/Marquee";
import { site } from "@/lib/site";

/* ---------------- Animated stat counters ---------------- */
function CountUp({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let raf = 0; const start = performance.now();
    const loop = (n: number) => { const p = Math.min(1, (n - start) / 1500); setV(Math.round(to * (1 - Math.pow(1 - p, 3)))); if (p < 1) raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return <span ref={ref}>{v.toLocaleString("en-IN")}{suffix}</span>;
}
export function StatsCounter({ items }: { items: { value: number; suffix: string; label: string }[] }) {
  if (!items?.length) return null;
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {items.map((s, i) => (
        <div key={i} className="bezel">
          <div className="rounded-[calc(2rem-0.4rem)] bg-white/[0.03] px-6 py-8 text-center">
            <p className="font-display text-4xl font-bold text-aurora sm:text-5xl"><CountUp to={s.value} suffix={s.suffix} /></p>
            <p className="mt-2 text-xs text-fog-dim sm:text-sm">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Bento grid ---------------- */
export function BentoGrid({ items }: { items: { title: string; body: string; big: boolean; image: string }[] }) {
  if (!items?.length) return null;
  return (
    <div className="grid auto-rows-[180px] grid-cols-2 gap-4 md:grid-cols-4">
      {items.map((it, i) => (
        <div key={i} className={`group relative overflow-hidden rounded-[1.6rem] border border-white/10 ${it.big ? "md:col-span-2 md:row-span-2" : ""}`}>
          {it.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={it.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-110" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-5">
            <h3 className="font-display text-lg font-semibold sm:text-2xl">{it.title}</h3>
            {it.body && <p className="mt-1 text-xs text-fog-dim">{it.body}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Logo marquee ---------------- */
export function LogoMarquee({ text }: { text: string }) {
  const items = (text || "").split(",").map((s) => s.trim()).filter(Boolean);
  if (!items.length) return null;
  return (
    <Marquee className="border-y border-white/10 py-8">
      {items.map((w, i) => (
        <span key={i} className="mx-10 font-display text-2xl font-semibold tracking-tight text-fog-dim/60 sm:text-3xl">{w}</span>
      ))}
    </Marquee>
  );
}

/* ---------------- Before / after compare ---------------- */
export function ImageCompare({ before, after, height }: { before: string; after: string; height: number }) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (clientX: number) => {
    const r = ref.current!.getBoundingClientRect();
    setPos(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
  };
  return (
    <div ref={ref} className="relative select-none overflow-hidden rounded-[2rem] border border-white/10"
      style={{ height: height || 420 }}
      onPointerMove={(e) => e.buttons === 1 && onMove(e.clientX)}
      onPointerDown={(e) => onMove(e.clientX)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={after || "/products/phone-ultra.jpg"} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={before || "/products/phone-noir.jpg"} alt="" className="h-full object-cover" style={{ width: ref.current?.clientWidth || "100%", maxWidth: "none" }} />
      </div>
      <div className="absolute inset-y-0 w-0.5 bg-white" style={{ left: `${pos}%` }}>
        <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-white text-ink shadow-lg">⇆</div>
      </div>
    </div>
  );
}

/* ---------------- Tabs ---------------- */
export function TabsWidget({ tabs }: { tabs: { label: string; body: string }[] }) {
  const [i, setI] = useState(0);
  const t = tabs?.[i] ?? tabs?.[0];
  if (!tabs?.length) return null;
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {tabs.map((tb, k) => (
          <button
            key={k}
            onClick={() => setI(k)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${k === i ? "bg-gradient-to-r from-iris to-cyan text-ink" : "bg-white/5 text-fog-dim hover:text-fog"}`}
          >
            {tb.label}
          </button>
        ))}
      </div>
      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-fog-dim">{t?.body}</div>
    </div>
  );
}

/* ---------------- Countdown ---------------- */
export function Countdown({ target, label }: { target: string; label: string }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  if (now === null) return <div className="h-24" />;
  const end = new Date(target).getTime();
  const diff = Math.max(0, end - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const cell = (v: number, l: string) => (
    <div className="flex flex-col items-center">
      <span className="bezel">
        <span className="block min-w-16 rounded-[calc(2rem-0.4rem)] bg-white/[0.04] px-4 py-3 text-center font-display text-3xl font-bold tabular-nums sm:text-4xl">
          {String(v).padStart(2, "0")}
        </span>
      </span>
      <span className="mt-2 text-xs uppercase tracking-wider text-fog-dim">{l}</span>
    </div>
  );
  return (
    <div className="text-center">
      {label && <p className="mb-4 font-display text-xl font-semibold">{label}</p>}
      <div className="flex justify-center gap-3 sm:gap-4">
        {cell(d, "Days")}{cell(h, "Hours")}{cell(m, "Mins")}{cell(s, "Secs")}
      </div>
    </div>
  );
}

/* ---------------- Gallery + lightbox ---------------- */
export function Gallery({ images, columns }: { images: { src: string }[]; columns: number }) {
  const [open, setOpen] = useState<string | null>(null);
  if (!images?.length) return null;
  return (
    <>
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${columns || 3}, minmax(0,1fr))` }}>
        {images.map((im, i) => (
          <button key={i} onClick={() => setOpen(im.src)} className="group relative aspect-square overflow-hidden rounded-2xl border border-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={im.src} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
          </button>
        ))}
      </div>
      {open && (
        <div onClick={() => setOpen(null)} className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/90 p-6 backdrop-blur-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={open} alt="" className="max-h-[90vh] max-w-[90vw] rounded-2xl" />
        </div>
      )}
    </>
  );
}

/* ---------------- Pricing ---------------- */
export function Pricing({ plans }: { plans: { name: string; price: string; period: string; features: string; featured: boolean; ctaLabel: string; ctaHref: string }[] }) {
  if (!plans?.length) return null;
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {plans.map((p, i) => (
        <div key={i} className={`bezel ${p.featured ? "ring-aurora" : ""}`}>
          <div className="flex h-full flex-col rounded-[calc(2rem-0.4rem)] bg-gradient-to-b from-white/[0.06] to-transparent p-7">
            {p.featured && <span className="mb-3 inline-block w-max rounded-full bg-gradient-to-r from-iris to-cyan px-3 py-1 text-[11px] font-bold text-ink">POPULAR</span>}
            <h3 className="font-display text-xl font-semibold">{p.name}</h3>
            <p className="mt-3 font-display text-4xl font-bold">{p.price}<span className="text-base font-normal text-fog-dim">{p.period}</span></p>
            <ul className="mt-5 flex-1 space-y-2 text-sm text-fog-dim">
              {(p.features || "").split("\n").filter(Boolean).map((f, k) => <li key={k}>✓ {f}</li>)}
            </ul>
            <a href={p.ctaHref || "#"} className="mt-6 block rounded-full bg-gradient-to-r from-iris to-cyan py-3 text-center text-sm font-bold text-ink">{p.ctaLabel || "Choose"}</a>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Form ---------------- */
export function FormBlock({ heading, button }: { heading: string; button: string }) {
  const [f, setF] = useState({ name: "", phone: "", message: "" });
  const valid = f.name && f.phone.length >= 10;
  const text = encodeURIComponent(`${heading}\n\nName: ${f.name}\nPhone: ${f.phone}\n\n${f.message}`);
  return (
    <div className="glass mx-auto max-w-xl rounded-[2rem] p-7">
      {heading && <h3 className="mb-5 font-display text-xl font-semibold">{heading}</h3>}
      <div className="grid gap-3">
        <input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Your name" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-iris/60" />
        <input value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} placeholder="Phone" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-iris/60" />
        <textarea value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} placeholder="Message" rows={3} className="resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-iris/60" />
      </div>
      <a
        href={valid ? `https://wa.me/${site.whatsapp}?text=${text}` : undefined}
        target="_blank"
        rel="noreferrer"
        onClick={(e) => {
          if (!valid) { e.preventDefault(); return; }
          fetch("/api/submissions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: f.name, phone: f.phone, message: f.message }) }).catch(() => {});
        }}
        className={`mt-4 block rounded-full py-3.5 text-center text-sm font-bold ${valid ? "bg-gradient-to-r from-iris via-cyan to-amber text-ink" : "cursor-not-allowed bg-white/10 text-fog-dim"}`}
      >
        {button || "Send"}
      </a>
    </div>
  );
}

/* ---------------- Map ---------------- */
export function MapEmbed({ query, height }: { query: string; height: number }) {
  const src = `https://www.google.com/maps?q=${encodeURIComponent(query || "India")}&output=embed`;
  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/10" style={{ height: height || 360 }}>
      <iframe src={src} title="map" width="100%" height="100%" style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
    </div>
  );
}

/* ---------------- Accordion / FAQ ---------------- */
export function FaqWidget({ items }: { items: { q: string; a: string }[] }) {
  if (!items?.length) return null;
  return <Accordion items={items} />;
}
