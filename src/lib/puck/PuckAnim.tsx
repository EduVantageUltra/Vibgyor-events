"use client";

import { useContext } from "react";
import { motion } from "motion/react";
import { motionSpec } from "@/components/freecanvas/animations";
import { PuckPreviewCtx } from "./previewContext";
import type { AnimTrigger } from "@/lib/freecanvas";

/**
 * Wraps any Puck block with a scroll/entrance/loop/hover animation.
 * Stays static while editing (so the canvas is usable), animates on the live site.
 */
export function PuckAnim({
  preset,
  trigger,
  duration,
  delay,
  editing,
  children,
}: {
  preset?: string;
  trigger?: AnimTrigger;
  duration?: number;
  delay?: number;
  editing?: boolean;
  children: React.ReactNode;
}) {
  const preview = useContext(PuckPreviewCtx);
  // Live site: always animate. Editor: only when "Preview" is on.
  if ((editing && !preview) || !preset || preset === "none") return <>{children}</>;

  const spec = motionSpec({ preset, trigger, duration, delay });
  if (spec.kind === "none") return <>{children}</>;

  return (
    <motion.div
      initial={spec.initial}
      animate={spec.animate}
      whileInView={spec.whileInView}
      whileHover={spec.whileHover}
      viewport={spec.viewportOnce ? { once: true, margin: "-60px" } : undefined}
      transition={spec.transition}
      style={{ willChange: "transform" }}
    >
      {children}
    </motion.div>
  );
}
