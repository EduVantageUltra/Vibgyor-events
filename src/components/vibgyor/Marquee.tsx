"use client";
import { useEffect, useRef, useState } from "react";

const ITEMS = ["Mehendi", "Haldi", "Sangeet", "The Wedding", "Reception", "Destination"];

/** Scroll speed in pixels per second. Lower = slower & easier to read. */
const SPEED_PX_PER_SEC = 6;
/** Hard floor so one loop can never be quicker than this, whatever the screen. */
const MIN_DURATION_SEC = 220;

export default function Marquee() {
  const track = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(MIN_DURATION_SEC);

  // The track holds the row twice, so one loop travels exactly half its width.
  // Measuring keeps the reading speed identical on every screen size.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => {
      const half = el.scrollWidth / 2;
      if (half > 0) setDuration(Math.max(MIN_DURATION_SEC, half / SPEED_PX_PER_SEC));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const row = (
    <>
      {ITEMS.map((it, i) => (
        <span key={i} style={{ display: "inline-flex", gap: "2.6rem", alignItems: "center" }}>
          <b>✦</b> {it}
        </span>
      ))}
    </>
  );
  return (
    <div className="marquee">
      {/* passed as a custom property so the reduce-motion !important rule can still read it */}
      <div ref={track} className="marquee-track" style={{ "--marq-dur": `${duration}s` } as React.CSSProperties}>
        {row}
        {row}
      </div>
    </div>
  );
}
