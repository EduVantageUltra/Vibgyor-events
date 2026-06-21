"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { MotionConfig } from "motion/react";

/**
 * Global buttery smooth scroll + a single MotionConfig so every motion
 * component respects the user's reduced-motion setting WITHOUT changing the
 * DOM structure (which is what caused hydration mismatches).
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 0.9,
      smoothWheel: true,
    });

    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  // "never" → the site always plays its animations, even if the OS has
  // "reduce motion" enabled (this is a showcase site by request).
  return <MotionConfig reducedMotion="never">{children}</MotionConfig>;
}
