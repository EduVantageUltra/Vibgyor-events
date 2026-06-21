"use client";
import { useEffect, useState } from "react";

// The big day — change this date freely (or wire it per-wedding later).
const TARGET = new Date("2026-12-12T11:00:00");

const ac = (c: string) => ({ ["--accent"]: c } as React.CSSProperties);

export default function Countdown() {
  const [t, setT] = useState<{ d: number; h: number; m: number; s: number } | null>(null);
  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, TARGET.getTime() - Date.now());
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor(diff / 3600000) % 24,
        m: Math.floor(diff / 60000) % 60,
        s: Math.floor(diff / 1000) % 60,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");
  const units = t ? [
    { v: t.d, l: "Days" }, { v: t.h, l: "Hours" }, { v: t.m, l: "Minutes" }, { v: t.s, l: "Seconds" },
  ] : [{ v: 0, l: "Days" }, { v: 0, l: "Hours" }, { v: 0, l: "Minutes" }, { v: 0, l: "Seconds" }];

  return (
    <section style={ac("var(--orange)")}>
      <div className="countdown reveal">
        <div className="sec-tag center" style={{ justifyContent: "center" }}>The Big Day</div>
        <h2 className="sec-title" style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          Counting down to <em>forever.</em>
        </h2>
        <div className="cd-grid">
          {units.map((u, i) => (
            <div className="cd-cell" key={i}>
              <div className="cd-num gold-shimmer">{i === 0 ? u.v : pad(u.v)}</div>
              <div className="cd-lbl">{u.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
