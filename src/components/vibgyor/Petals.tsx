"use client";
import { useEffect, useRef } from "react";

/** Floating flower petals drifting down the page — ambient wedding effect. */
export default function Petals() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const host = ref.current;
    if (!host) return;
    const COLORS = ["#e79bb8", "#f3c39a", "#e8c87a", "#d98ca0", "#f0b6c8", "#caa14b"];
    const N = window.innerWidth < 700 ? 9 : 16;
    const made: HTMLElement[] = [];
    for (let i = 0; i < N; i++) {
      const p = document.createElement("span");
      p.className = "petal";
      const size = 8 + Math.random() * 11;
      p.style.width = size + "px";
      p.style.height = size * 0.68 + "px";
      p.style.background = COLORS[i % COLORS.length];
      p.style.left = Math.random() * 100 + "vw";
      p.style.setProperty("--sway", (24 + Math.random() * 46) + "px");
      p.style.setProperty("--spin", (Math.random() > 0.5 ? 1 : -1) * (220 + Math.random() * 260) + "deg");
      p.style.animationDuration = (10 + Math.random() * 10) + "s, " + (3 + Math.random() * 3) + "s";
      p.style.animationDelay = (-Math.random() * 14) + "s, " + (-Math.random() * 4) + "s";
      p.style.opacity = String(0.3 + Math.random() * 0.4);
      host.appendChild(p);
      made.push(p);
    }
    return () => made.forEach((p) => p.remove());
  }, []);
  return <div className="petals" ref={ref} aria-hidden />;
}
