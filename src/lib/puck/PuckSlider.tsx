"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion, type TargetAndTransition } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type Slide = {
  mediaType?: "image" | "video";
  src?: string;
  poster?: string;
  caption?: string;
  link?: string;
};

/** A reusable, generic media slider — images and/or videos, autoplay, arrows, dots. */
const TRANSITIONS: Record<string, { initial: TargetAndTransition; animate: TargetAndTransition; exit: TargetAndTransition; perspective?: boolean }> = {
  fade: { initial: { opacity: 0, scale: 1.06 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0 } },
  slide: { initial: { opacity: 0, x: "100%" }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: "-100%" } },
  zoom: { initial: { opacity: 0, scale: 0.7 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 1.25 } },
  flip: { initial: { opacity: 0, rotateY: 90 }, animate: { opacity: 1, rotateY: 0 }, exit: { opacity: 0, rotateY: -90 }, perspective: true },
  kenburns: { initial: { opacity: 0, scale: 1.18 }, animate: { opacity: 1, scale: 1.04 }, exit: { opacity: 0, scale: 1.1 } },
  parallax: { initial: { opacity: 0, x: "35%", scale: 1.12 }, animate: { opacity: 1, x: 0, scale: 1 }, exit: { opacity: 0, x: "-18%" }, perspective: true },
  vertical: { initial: { opacity: 0, y: "100%" }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: "-100%" } },
  stack: { initial: { opacity: 0, scale: 0.84, y: 70 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 1.12, y: -40 } },
  reveal: { initial: { clipPath: "inset(0 0 0 100%)" }, animate: { clipPath: "inset(0 0 0 0%)" }, exit: { clipPath: "inset(0 100% 0 0)" } },
  blur: { initial: { opacity: 0, filter: "blur(20px)", scale: 1.08 }, animate: { opacity: 1, filter: "blur(0px)", scale: 1 }, exit: { opacity: 0, filter: "blur(14px)" } },
  rotate: { initial: { opacity: 0, rotate: 8, scale: 0.9 }, animate: { opacity: 1, rotate: 0, scale: 1 }, exit: { opacity: 0, rotate: -8, scale: 0.9 } },
};

export function PuckSlider({
  slides,
  autoplay = true,
  interval = 5,
  heightVh = 70,
  radius = 24,
  design = "fade",
  showArrows = true,
  showDots = true,
}: {
  slides: Slide[];
  autoplay?: boolean;
  interval?: number;
  heightVh?: number;
  radius?: number;
  design?: string;
  showArrows?: boolean;
  showDots?: boolean;
}) {
  const tr = TRANSITIONS[design] ?? TRANSITIONS.fade;
  const [i, setI] = useState(0);
  const n = slides?.length ?? 0;
  const go = useCallback((d: number) => setI((p) => (p + d + n) % n), [n]);

  useEffect(() => {
    if (!autoplay || n < 2) return;
    const t = setInterval(() => setI((p) => (p + 1) % n), Math.max(1.5, interval) * 1000);
    return () => clearInterval(t);
  }, [autoplay, interval, n]);

  if (!n) {
    return (
      <div style={{ height: `${heightVh}svh`, borderRadius: radius }} className="grid place-items-center bg-white/[0.04] text-fog-dim">
        Add slides in the panel →
      </div>
    );
  }

  const s = slides[i] ?? slides[0];

  return (
    <div className="relative w-full overflow-hidden" style={{ height: `${heightVh}svh`, borderRadius: radius, perspective: tr.perspective ? 1200 : undefined }}>
      <AnimatePresence mode="sync">
        <motion.div
          key={i}
          initial={tr.initial}
          animate={tr.animate}
          exit={tr.exit}
          transition={{ duration: design === "kenburns" ? 1.1 : 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          {s.mediaType === "video" && s.src ? (
            <video src={s.src} poster={s.poster} autoPlay muted loop playsInline className="h-full w-full object-cover" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={s.src || s.poster || "/products/phone-aurora.jpg"} alt={s.caption || ""} className="h-full w-full object-cover" />
          )}
          {s.caption && (
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/70 to-transparent p-8">
              <div>
                <p className="font-display text-2xl font-semibold sm:text-4xl">{s.caption}</p>
                {s.link && (
                  <a href={s.link} className="mt-3 inline-block rounded-full bg-gradient-to-r from-iris to-cyan px-5 py-2 text-sm font-bold text-ink">
                    Explore
                  </a>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {showArrows && n > 1 && (
        <>
          <button onClick={() => go(-1)} aria-label="Previous" className="absolute left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-ink/40 backdrop-blur-md hover:bg-ink/60">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={() => go(1)} aria-label="Next" className="absolute right-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-ink/40 backdrop-blur-md hover:bg-ink/60">
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {showDots && n > 1 && (
        <div className="absolute inset-x-0 bottom-5 flex justify-center gap-2">
          {slides.map((_, k) => (
            <button
              key={k}
              onClick={() => setI(k)}
              aria-label={`Slide ${k + 1}`}
              className={`h-2 rounded-full transition-all ${k === i ? "w-8 bg-gradient-to-r from-iris to-cyan" : "w-2 bg-white/40"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
