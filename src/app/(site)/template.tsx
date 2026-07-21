"use client";

import { motion } from "motion/react";

/**
 * Runs on every navigation within the site group — a smooth page-enter
 * transition (fade + lift).
 *
 * Deliberately does NOT animate `filter`: motion leaves the final value on the
 * element, and a lingering `filter: blur(0px)` is still a filter as far as CSS
 * is concerned. That makes this wrapper a containing block, which silently
 * breaks `position: fixed` for everything inside the page (lightboxes, FABs).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
