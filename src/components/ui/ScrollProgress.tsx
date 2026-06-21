"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** Thin aurora progress bar fixed to the very top of the viewport. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-gradient-to-r from-iris via-cyan to-amber"
      aria-hidden
    />
  );
}
