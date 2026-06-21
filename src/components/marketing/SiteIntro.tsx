"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export type IntroConfig = {
  enabled: boolean;
  style: string;
  brandText: string;
  color1: string;
  color2: string;
  everyVisit: boolean;
};

const EASE = [0.76, 0, 0.24, 1] as [number, number, number, number];

export function SiteIntro({ config }: { config?: IntroConfig }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!config?.enabled) return;
    if (!config.everyVisit && sessionStorage.getItem("rr-intro-seen")) return;
    sessionStorage.setItem("rr-intro-seen", "1");
    setShow(true);
    const t = setTimeout(() => setShow(false), 2200);
    return () => clearTimeout(t);
  }, [config]);

  if (!config?.enabled) return null;
  const { style, brandText, color1, color2 } = config;

  return (
    <AnimatePresence>
      {show && (
        <motion.div className="fixed inset-0 z-[200]" style={{ pointerEvents: "none" }} initial={{ opacity: 1 }} exit={{ opacity: 1 }}>
          {style === "curtain" && (
            <>
              <motion.div className="absolute inset-y-0 left-0 w-1/2" style={{ background: color1 }} initial={{ x: 0 }} exit={{ x: "-100%" }} transition={{ duration: 0.9, ease: EASE, delay: 0.4 }} />
              <motion.div className="absolute inset-y-0 right-0 w-1/2" style={{ background: color2 }} initial={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.9, ease: EASE, delay: 0.4 }} />
              <Brand text={brandText} />
            </>
          )}
          {style === "sweep" && (
            <motion.div className="absolute inset-0" style={{ background: `linear-gradient(120deg, ${color1}, ${color2})` }} initial={{ y: 0 }} exit={{ y: "-100%" }} transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}>
              <Brand text={brandText} />
            </motion.div>
          )}
          {style === "logo" && (
            <motion.div className="absolute inset-0 grid place-items-center bg-ink" exit={{ opacity: 0 }} transition={{ duration: 0.6, delay: 0.6 }}>
              <motion.span className="font-display text-6xl font-bold sm:text-8xl" style={{ backgroundImage: `linear-gradient(110deg, ${color1}, ${color2})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }} initial={{ scale: 0.7, opacity: 0, filter: "blur(12px)" }} animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
                {brandText}
              </motion.span>
            </motion.div>
          )}
          {style === "bars" && (
            <div className="absolute inset-0 flex">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div key={i} className="h-full flex-1" style={{ background: i % 2 ? color2 : color1 }} initial={{ y: 0 }} exit={{ y: "-100%" }} transition={{ duration: 0.7, ease: EASE, delay: 0.3 + i * 0.08 }} />
              ))}
              <Brand text={brandText} />
            </div>
          )}
          {style === "counter" && (
            <motion.div className="absolute inset-0 grid place-items-center bg-ink" exit={{ y: "-100%" }} transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}>
              <Counter color1={color1} color2={color2} />
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Brand({ text }: { text: string }) {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <motion.span className="font-display text-5xl font-bold text-white sm:text-7xl" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
        {text}
      </motion.span>
    </div>
  );
}

function Counter({ color1, color2 }: { color1: string; color2: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let v = 0;
    const id = setInterval(() => { v = Math.min(100, v + Math.ceil(Math.random() * 9)); setN(v); if (v >= 100) clearInterval(id); }, 90);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="font-display text-7xl font-bold sm:text-9xl" style={{ backgroundImage: `linear-gradient(110deg, ${color1}, ${color2})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
      {n}%
    </span>
  );
}
