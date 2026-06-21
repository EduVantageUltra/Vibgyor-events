"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import type { CanvasElement } from "@/lib/freecanvas";
import { motionSpec, TEXT_PRESETS } from "./animations";
import { textStyleOf } from "./ElementView";

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

export function AnimatedWrap({
  el,
  active,
  children,
}: {
  el: CanvasElement;
  active: boolean;
  children: React.ReactNode;
}) {
  const preset = el.anim?.preset;
  if (!active || !preset || preset === "none") return <>{children}</>;

  if (TEXT_PRESETS.has(preset) && (el.kind === "heading" || el.kind === "text")) {
    return <AnimatedText el={el} />;
  }

  const spec = motionSpec(el.anim);
  if (spec.kind === "none") return <>{children}</>;

  return (
    <motion.div
      style={{ width: "100%", height: "100%" }}
      initial={spec.initial}
      animate={spec.animate}
      whileInView={spec.whileInView}
      whileHover={spec.whileHover}
      viewport={spec.viewportOnce ? { once: true, margin: "-40px" } : undefined}
      transition={spec.transition}
    >
      {children}
    </motion.div>
  );
}

function AnimatedText({ el }: { el: CanvasElement }) {
  const preset = el.anim?.preset;
  const style = textStyleOf(el);
  const text = el.text || "";
  const dur = el.anim?.duration ?? 0.7;
  const delay = el.anim?.delay ?? 0;

  // ---- gradient fills ----
  if (preset === "shimmer" || preset === "gradient-flow") {
    return (
      <div style={style}>
        <span
          style={{
            backgroundImage: "linear-gradient(110deg,var(--color-iris),var(--color-cyan),var(--color-amber),var(--color-rose),var(--color-iris))",
            backgroundSize: "260% auto",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            animation: `aurora-shimmer ${preset === "gradient-flow" ? 8 : 4}s linear infinite`,
          }}
        >
          {text}
        </span>
      </div>
    );
  }

  // ---- neon sign ----
  if (preset === "neon") {
    const c = el.color && el.color !== "none" ? el.color : "#39e6ff";
    return (
      <div style={style}>
        <motion.span
          animate={{ opacity: [1, 0.75, 1, 0.85, 1, 0.65, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 0.4 }}
          style={{ color: "#fff", textShadow: `0 0 4px ${c},0 0 10px ${c},0 0 22px ${c},0 0 40px ${c}` }}
        >
          {text}
        </motion.span>
      </div>
    );
  }

  // ---- glitch ----
  if (preset === "glitch") {
    return (
      <div style={style}>
        <motion.span
          animate={{
            x: [0, -2, 2, -1, 1, 0],
            textShadow: [
              "0 0 0 transparent",
              "2px 0 #ff003c, -2px 0 #00e5ff",
              "-2px 0 #ff003c, 2px 0 #00e5ff",
              "1px 0 #ff003c, -1px 0 #00e5ff",
              "0 0 0 transparent",
            ],
            skewX: [0, 6, -6, 3, 0],
          }}
          transition={{ duration: 0.45, repeat: Infinity, repeatDelay: 1.4 }}
          style={{ display: "inline-block" }}
        >
          {text}
        </motion.span>
      </div>
    );
  }

  // ---- decode / scramble ----
  if (preset === "decode") {
    return <Decode text={text} style={style} delay={delay} />;
  }

  // ---- typewriter ----
  if (preset === "typewriter") {
    return (
      <div style={style}>
        <motion.span initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ staggerChildren: 0.04, delayChildren: delay }}>
          {text.split("").map((c, i) => (
            <motion.span key={i} variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} transition={{ duration: 0.04 }}>
              {c}
            </motion.span>
          ))}
        </motion.span>
      </div>
    );
  }

  // ---- wave (looping letters) ----
  if (preset === "wave") {
    return (
      <div style={style}>
        <span style={{ display: "inline-flex", flexWrap: "wrap" }}>
          {text.split("").map((c, i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.06 }}
              style={{ display: "inline-block", whiteSpace: "pre" }}
            >
              {c}
            </motion.span>
          ))}
        </span>
      </div>
    );
  }

  // ---- word-reveal / letter-pop / fade-letters ----
  const byLetter = preset === "letter-pop" || preset === "fade-letters";
  const units = byLetter ? text.split("") : text.split(" ");
  const variant =
    preset === "letter-pop"
      ? { hidden: { opacity: 0, scale: 0, y: 10 }, show: { opacity: 1, scale: 1, y: 0 } }
      : preset === "fade-letters"
      ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
      : { hidden: { opacity: 0, y: "0.6em" }, show: { opacity: 1, y: 0 } };

  return (
    <div style={style}>
      <motion.span
        style={{ display: "inline-block" }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
        transition={{ staggerChildren: byLetter ? 0.04 : 0.08, delayChildren: delay }}
      >
        {units.map((u, i) => (
          <motion.span key={i} style={{ display: "inline-block", whiteSpace: "pre" }} variants={variant} transition={{ duration: dur, ease: EASE }}>
            {u}
            {preset === "word-reveal" ? " " : ""}
          </motion.span>
        ))}
      </motion.span>
    </div>
  );
}

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&@!?0123456789";
function Decode({ text, style, delay }: { text: string; style: React.CSSProperties; delay: number }) {
  const [out, setOut] = useState(text);
  const started = useRef(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !started.current) {
        started.current = true;
        let frame = 0;
        const total = text.length;
        const run = () => {
          const revealed = Math.floor(frame / 2);
          setOut(
            text
              .split("")
              .map((ch, i) => (ch === " " ? " " : i < revealed ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
              .join("")
          );
          frame++;
          if (revealed <= total) setTimeout(run, 35);
          else setOut(text);
        };
        setTimeout(run, delay * 1000);
      }
    }, { threshold: 0.2 });
    io.observe(node);
    return () => io.disconnect();
  }, [text, delay]);

  return <div ref={ref} style={style}>{out}</div>;
}
