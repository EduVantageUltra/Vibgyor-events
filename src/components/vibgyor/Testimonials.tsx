"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { TESTIMONIALS } from "@/lib/gallery";

export default function Testimonials() {
  const [i, setI] = useState(0);
  const q = useRef<HTMLQuoteElement | null>(null);
  const w = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // long enough to actually read the quote before it changes
    const id = setInterval(() => setI((x) => (x + 1) % TESTIMONIALS.length), 14000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (q.current && w.current) {
      gsap.fromTo([q.current, w.current], { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.05 });
    }
  }, [i]);

  const [text, name, place] = TESTIMONIALS[i];
  return (
    <section style={{ "--accent": "var(--red)" } as React.CSSProperties}>
      <div className="testi">
        <div className="sec-tag center reveal">Kind Words</div>
        <blockquote ref={q}>{text}</blockquote>
        <div className="who" ref={w}>{name} — <span>{place}</span></div>
        <div className="t-dots">
          {TESTIMONIALS.map((_, k) => (
            <i key={k} className={k === i ? "on" : ""} onClick={() => setI(k)} />
          ))}
        </div>
      </div>
    </section>
  );
}
