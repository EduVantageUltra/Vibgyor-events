"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

export type HeroSlide = {
  id: string;
  type: "image" | "video";
  src?: string;
  poster?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  align?: "left" | "center";
};

const DURATION = 5000; // auto-advance every 5 seconds

const wordContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
const wordItem = {
  hidden: { y: "110%", opacity: 0, rotateX: 40 },
  show: {
    y: "0%",
    opacity: 1,
    rotateX: 0,
    transition: { duration: 0.9, ease: EASE },
  },
};

export default function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const timer = useRef<number>(0);
  const start = useRef<number>(0);

  // cursor parallax
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 18 });
  const sy = useSpring(py, { stiffness: 60, damping: 18 });
  const bgX = useTransform(sx, [-0.5, 0.5], [28, -28]);
  const bgY = useTransform(sy, [-0.5, 0.5], [22, -22]);
  const txX = useTransform(sx, [-0.5, 0.5], [-16, 16]);
  const txY = useTransform(sy, [-0.5, 0.5], [-10, 10]);

  const go = useCallback(
    (dir: number) => {
      setIndex((i) => (i + dir + slides.length) % slides.length);
      setProgress(0);
    },
    [slides.length]
  );
  const goTo = (i: number) => {
    setIndex(i);
    setProgress(0);
  };

  useEffect(() => {
    if (slides.length < 2) return;
    start.current = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start.current;
      const p = Math.min(1, elapsed / DURATION);
      setProgress(p);
      if (p >= 1) {
        start.current = now;
        setIndex((i) => (i + 1) % slides.length);
      }
      timer.current = requestAnimationFrame(tick);
    };
    timer.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(timer.current);
  }, [slides.length, index]);

  const onMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  if (!slides.length) return null;
  const slide = slides[index];
  const center = slide.align === "center";
  const words = slide.title.split(" ");

  return (
    <section
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden"
    >
      {/* Background layer (Ken Burns + parallax) */}
      <motion.div style={{ x: bgX, y: bgY }} className="absolute -inset-12">
        <AnimatePresence mode="sync">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, scale: 1.18 }}
            animate={{ opacity: 1, scale: 1.04 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ opacity: { duration: 1 }, scale: { duration: 7, ease: "linear" } }}
            className="absolute inset-0"
          >
            {slide.type === "video" && slide.src ? (
              <video
                className="h-full w-full object-cover"
                src={slide.src}
                poster={slide.poster}
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <Image
                src={slide.poster || "/products/phone-aurora.jpg"}
                alt={slide.title}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Overlays + decorative glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/20 to-transparent" />
      <motion.div
        aria-hidden
        animate={{ y: [0, -24, 0], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -right-24 top-10 h-96 w-96 rounded-full bg-iris/25 blur-[120px]"
      />
      <motion.div
        aria-hidden
        animate={{ y: [0, 26, 0], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -left-20 bottom-0 h-96 w-96 rounded-full bg-cyan/20 blur-[120px]"
      />

      {/* Content */}
      <motion.div
        style={{ x: txX, y: txY }}
        className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-6 pb-28 sm:pb-32"
      >
        <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-2xl"}>
          <AnimatePresence mode="wait">
            <motion.div key={slide.id + "-eb"} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
              {slide.eyebrow && (
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-fog backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse" />
                  {slide.eyebrow}
                </span>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Word-by-word title reveal */}
          <AnimatePresence mode="wait">
            <motion.h1
              key={slide.id + "-title"}
              variants={wordContainer}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
              className={`mt-5 font-display text-5xl font-bold leading-[0.92] tracking-tight [perspective:800px] sm:text-7xl md:text-8xl ${center ? "justify-center" : ""} flex flex-wrap gap-x-4`}
            >
              {words.map((w, i) => (
                <span key={i} className="inline-block overflow-hidden pb-[0.12em]">
                  <motion.span variants={wordItem} className="inline-block [transform-origin:bottom]">
                    {w}
                  </motion.span>
                </span>
              ))}
            </motion.h1>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id + "-rest"}
              initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {slide.subtitle && (
                <p className={`mt-5 max-w-xl text-lg text-fog-dim sm:text-xl ${center ? "mx-auto" : ""}`}>
                  {slide.subtitle}
                </p>
              )}
              {slide.ctaLabel && slide.ctaHref && (
                <div className={center ? "mt-8 flex justify-center" : "mt-8"}>
                  <Link
                    href={slide.ctaHref}
                    className="group inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-iris via-cyan to-amber py-2.5 pl-6 pr-2.5 text-sm font-bold text-ink shadow-[0_12px_44px_-12px_rgba(124,92,255,0.8)] transition-transform active:scale-95"
                  >
                    <span className="relative">{slide.ctaLabel}</span>
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-black/15 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                      <ArrowUpRight className="h-4 w-4" strokeWidth={2.4} />
                    </span>
                  </Link>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Slide counter */}
      <div className="absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-end gap-1 font-display sm:flex">
        <span className="text-3xl font-bold text-aurora">{String(index + 1).padStart(2, "0")}</span>
        <span className="h-px w-8 bg-white/20" />
        <span className="text-sm text-fog-dim">{String(slides.length).padStart(2, "0")}</span>
      </div>

      {/* Controls */}
      {slides.length > 1 && (
        <div className="absolute inset-x-0 bottom-8 z-20 mx-auto flex max-w-6xl items-center justify-between px-6">
          <div className="flex flex-1 items-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="group relative h-1 max-w-24 flex-1 overflow-hidden rounded-full bg-white/15"
              >
                <span
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-iris to-cyan"
                  style={{ width: i === index ? `${progress * 100}%` : i < index ? "100%" : "0%" }}
                />
              </button>
            ))}
          </div>
          <div className="ml-6 flex items-center gap-2">
            <button onClick={() => go(-1)} aria-label="Previous slide" className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/5 backdrop-blur-md transition-colors hover:bg-white/10">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={() => go(1)} aria-label="Next slide" className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/5 backdrop-blur-md transition-colors hover:bg-white/10">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Scroll hint */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 lg:block"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-fog-dim">Scroll</span>
      </motion.div>
    </section>
  );
}
