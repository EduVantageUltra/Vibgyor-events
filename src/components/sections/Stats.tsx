"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const startTime = performance.now();
    const dur = 1600;
    const loop = (now: number) => {
      const p = Math.min(1, (now - startTime) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return (
    <span ref={ref}>
      {val.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

const stats = [
  { to: 12, suffix: "+", label: "Years serving the city" },
  { to: 48000, suffix: "+", label: "Happy customers" },
  { to: 300, suffix: "+", label: "Products in store" },
  { to: 24, suffix: "h", label: "Avg. delivery time" },
];

export function Stats() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="bezel">
          <div className="rounded-[calc(2rem-0.4rem)] bg-white/[0.03] px-6 py-8 text-center">
            <p className="font-display text-4xl font-bold text-aurora sm:text-5xl">
              <Counter to={s.to} suffix={s.suffix} />
            </p>
            <p className="mt-2 text-xs text-fog-dim sm:text-sm">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
