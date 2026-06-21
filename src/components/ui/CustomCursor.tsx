"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Lightweight trailing cursor — a soft aurora dot that grows over interactive
 * elements. Desktop + fine-pointer only; disabled for touch & reduced-motion.
 */
export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setEnabled(true);
    document.documentElement.classList.add("cursor-none-desktop");

    let rx = 0, ry = 0, dx = 0, dy = 0;
    const onMove = (e: MouseEvent) => {
      dx = e.clientX;
      dy = e.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      }
      const t = e.target as HTMLElement;
      const interactive = t.closest("a, button, [data-cursor], input, textarea, select, [role='button']");
      if (ring.current) {
        ring.current.dataset.active = interactive ? "true" : "false";
      }
    };

    let raf = 0;
    const loop = () => {
      rx += (dx - rx) * 0.18;
      ry += (dy - ry) * 0.18;
      if (ring.current) {
        ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("mousemove", onMove);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.classList.remove("cursor-none-desktop");
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white mix-blend-difference"
        style={{ marginLeft: -3, marginTop: -3 }}
      />
      <div
        ref={ring}
        data-active="false"
        className="pointer-events-none fixed left-0 top-0 z-[9998] h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40 transition-[width,height,background-color,border-color] duration-300 data-[active=true]:h-14 data-[active=true]:w-14 data-[active=true]:border-transparent data-[active=true]:bg-violet/20 data-[active=true]:backdrop-blur-sm"
        style={{ marginLeft: -18, marginTop: -18 }}
      />
    </>
  );
}
