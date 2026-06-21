"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "motion/react";

const LottiePlayer = dynamic(() => import("./LottiePlayer").then((m) => m.LottiePlayer), {
  ssr: false,
  loading: () => <div className="grid h-40 place-items-center text-xs text-fog-dim">Loading animation…</div>,
});

export function LottieBlock({ url, loop, height }: { url: string; loop: boolean; height: number }) {
  return <LottiePlayer url={url} loop={loop} height={height} />;
}

/** Image that drifts at a different speed as you scroll past — depth/parallax. */
export function ParallaxImage({ src, height, strength, caption }: { src: string; height: number; strength: number; caption: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const s = strength || 90;
  const y = useTransform(scrollYProgress, [0, 1], [s, -s]);

  return (
    <div ref={ref} className="relative overflow-hidden rounded-[2rem] border border-white/10" style={{ height: height || 440 }}>
      <motion.img
        src={src || "/products/phone-ultra.jpg"}
        alt=""
        style={{ y, position: "absolute", left: 0, right: 0, top: "-12%", width: "100%", height: "124%", objectFit: "cover" }}
      />
      {caption && (
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/70 to-transparent p-8">
          <p className="font-display text-3xl font-bold sm:text-5xl">{caption}</p>
        </div>
      )}
    </div>
  );
}
