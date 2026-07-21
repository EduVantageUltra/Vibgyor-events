"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import Pic, { BACKDROP_SIZES } from "./Pic";
import { MEDIA as M } from "@/lib/media";

type Slide = { img: string; pos?: string; eyebrow: string; title: string[]; grad: number; sub: string };

// 6 slides — swap img/text freely. Real videos can replace images later.
const SLIDES: Slide[] = [
  { img: M.coupleCanopy, pos: "center 28%", eyebrow: "India · Destination · 20+ Years", title: ["We Don’t Plan", "Weddings. We Craft", "Forever."], grad: 2, sub: "From the first phera to the last dance — we design Indian celebrations that feel like a memory before they even begin." },
  { img: M.mandapStage, pos: "center 35%", eyebrow: "The Mandap", title: ["Where two worlds", "become", "one."], grad: 2, sub: "A canopy of light, flowers and a thousand held breaths — engineered to feel eternal." },
  { img: M.brideRed, pos: "center 22%", eyebrow: "The Bride", title: ["For the bride who", "dreamed in", "colour."], grad: 2, sub: "Couture moments and cinematic memories, styled down to the last petal." },
  { img: M.traditionalCouple, pos: "center 25%", eyebrow: "The Families", title: ["Two families.", "One unforgettable", "celebration."], grad: 2, sub: "Twenty years and 850+ weddings — we carry the weight so you carry only the joy." },
  { img: M.mandapEntrance, pos: "center 40%", eyebrow: "Destination", title: ["Celebrations", "designed for", "wonder."], grad: 2, sub: "From Udaipur palaces to Kerala backwaters — anywhere your heart points." },
  { img: M.couple1, pos: "center 26%", eyebrow: "Your Story", title: ["Your love story,", "told", "beautifully."], grad: 2, sub: "Tell us your date. We’ll bring the magic." },
];

/** How long each hero slide stays. Long enough to read the headline + the line under it. */
const DURATION = 13000;

export default function HeroSlider() {
  const [i, setI] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const schedule = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setI((x) => (x + 1) % SLIDES.length), DURATION);
  }, []);

  useEffect(() => { schedule(); return () => { if (timer.current) clearTimeout(timer.current); }; }, [i, schedule]);

  // Which slide images are allowed to download: the current one + the next.
  const [armed, setArmed] = useState<Set<number>>(() => new Set([0, 1]));
  useEffect(() => {
    setArmed((prev) => {
      const next = (i + 1) % SLIDES.length;
      if (prev.has(i) && prev.has(next)) return prev;
      return new Set([...prev, i, next]);
    });
  }, [i]);

  const go = (n: number) => setI((n + SLIDES.length) % SLIDES.length);
  const s = SLIDES[i];

  return (
    <header className="hslider">
      {/* images — all six sit stacked in the viewport, so `loading=lazy` would not
          defer them. Mount only what has been seen plus the next one instead. */}
      {SLIDES.map((sl, k) => (
        <div className={"hslide" + (k === i ? " on" : "")} key={k}>
          {armed.has(k) && (
            <Pic
              src={sl.img}
              alt="Indian wedding"
              sizes={BACKDROP_SIZES}
              priority={k === 0}
              style={{ objectPosition: sl.pos || "center 30%" }}
            />
          )}
          <div className="ov" />
        </div>
      ))}

      {/* progress bar */}
      <div className="hslider-prog" key={i} style={{ animation: `hprog ${DURATION}ms linear forwards` }} />

      {/* text */}
      <div className="hslider-inner">
        <AnimatePresence mode="wait">
          <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.45 }}>
            <motion.span className="hero-eyebrow" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}>
              {s.eyebrow}
            </motion.span>
            <h1 className="hero-h1">
              {s.title.map((ln, k) => (
                <span key={k} style={{ overflow: "hidden", display: "block" }}>
                  <motion.span
                    className={k === s.grad ? "grad-text" : ""}
                    style={{ display: "inline-block" }}
                    initial={{ y: "115%" }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.15 + k * 0.11, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {k === s.grad ? <em>{ln}</em> : ln}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.p className="lead-p" style={{ maxWidth: 580, margin: "1.8rem auto 2.4rem" }} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.7 }}>
              {s.sub}
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.62, duration: 0.7 }}>
              <Link href="/contact" className="btn-pill" data-hover>Begin Your Story <span className="dot">→</span></Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <button className="hslider-arrow prev" onClick={() => go(i - 1)} aria-label="Previous">‹</button>
      <button className="hslider-arrow next" onClick={() => go(i + 1)} aria-label="Next">›</button>

      <div className="hslider-dots">
        {SLIDES.map((_, k) => (
          <i key={k} className={k === i ? "on" : ""} onClick={() => go(k)} />
        ))}
      </div>
    </header>
  );
}
