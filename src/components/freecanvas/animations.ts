import type { TargetAndTransition, Transition } from "motion/react";
import type { ElementAnim } from "@/lib/freecanvas";

/** Catalogue of animation presets, grouped for the editor dropdown. */
export const ANIM_GROUPS: { group: string; items: { value: string; label: string }[] }[] = [
  {
    group: "Entrance — Fade & Slide",
    items: [
      { value: "fade", label: "Fade in" },
      { value: "fade-up", label: "Fade up" },
      { value: "fade-down", label: "Fade down" },
      { value: "fade-left", label: "Fade from left" },
      { value: "fade-right", label: "Fade from right" },
      { value: "fade-up-big", label: "Fade up (far)" },
      { value: "fade-down-big", label: "Fade down (far)" },
      { value: "slide-up", label: "Slide up" },
      { value: "slide-down", label: "Slide down" },
      { value: "slide-left", label: "Slide from left" },
      { value: "slide-right", label: "Slide from right" },
    ],
  },
  {
    group: "Entrance — Zoom & Scale",
    items: [
      { value: "zoom-in", label: "Zoom in" },
      { value: "zoom-out", label: "Zoom out" },
      { value: "zoom-in-up", label: "Zoom in up" },
      { value: "zoom-in-down", label: "Zoom in down" },
      { value: "pop", label: "Pop (spring)" },
      { value: "back-in", label: "Back in (overshoot)" },
      { value: "back-in-up", label: "Back in up" },
      { value: "elastic", label: "Elastic" },
      { value: "expand-y", label: "Expand vertical" },
      { value: "expand-x", label: "Expand horizontal" },
    ],
  },
  {
    group: "Entrance — Flip, Rotate & 3D",
    items: [
      { value: "flip-x", label: "Flip horizontal" },
      { value: "flip-y", label: "Flip vertical" },
      { value: "rotate-in", label: "Rotate in" },
      { value: "roll-in", label: "Roll in" },
      { value: "jack-in-box", label: "Jack-in-the-box" },
      { value: "swing-in", label: "Swing in" },
      { value: "skew-in", label: "Skew in" },
      { value: "light-speed-right", label: "Light speed (right)" },
      { value: "light-speed-left", label: "Light speed (left)" },
    ],
  },
  {
    group: "Entrance — Reveal & Blur",
    items: [
      { value: "blur-in", label: "Blur in" },
      { value: "focus-in", label: "Focus in (deep blur)" },
      { value: "bounce-in", label: "Bounce in" },
      { value: "drop-in", label: "Drop in (bounce)" },
      { value: "clip-up", label: "Wipe reveal up" },
      { value: "clip-down", label: "Wipe reveal down" },
      { value: "clip-left", label: "Wipe reveal left" },
      { value: "clip-right", label: "Wipe reveal right" },
      { value: "clip-circle", label: "Circle reveal" },
    ],
  },
  {
    group: "Loop — plays forever",
    items: [
      { value: "float", label: "Float" },
      { value: "pulse", label: "Pulse" },
      { value: "spin", label: "Spin" },
      { value: "bounce", label: "Bounce" },
      { value: "shake", label: "Shake" },
      { value: "swing", label: "Swing" },
      { value: "wobble", label: "Wobble" },
      { value: "heartbeat", label: "Heartbeat" },
      { value: "breathe", label: "Breathe" },
      { value: "jello", label: "Jello" },
      { value: "tada", label: "Tada" },
      { value: "flash", label: "Flash" },
      { value: "rubber-band", label: "Rubber band" },
      { value: "vibrate", label: "Vibrate" },
      { value: "levitate", label: "Levitate" },
      { value: "pendulum", label: "Pendulum" },
      { value: "blink", label: "Blink" },
    ],
  },
  {
    group: "Loop — Colour & Glow",
    items: [
      { value: "glow", label: "Glow" },
      { value: "rainbow", label: "Rainbow hue" },
      { value: "neon-flicker", label: "Neon flicker" },
      { value: "color-pulse", label: "Colour pulse" },
    ],
  },
  {
    group: "Hover",
    items: [
      { value: "hover-grow", label: "Grow" },
      { value: "hover-lift", label: "Lift" },
      { value: "hover-shrink", label: "Shrink" },
      { value: "hover-tilt", label: "Tilt" },
      { value: "hover-glow", label: "Glow" },
      { value: "hover-rotate", label: "Rotate" },
      { value: "hover-skew", label: "Skew" },
      { value: "hover-jelly", label: "Jelly" },
      { value: "hover-float", label: "Float" },
      { value: "hover-bright", label: "Brighten" },
    ],
  },
  {
    group: "Text effects (headings & text)",
    items: [
      { value: "typewriter", label: "Typewriter" },
      { value: "word-reveal", label: "Word by word" },
      { value: "letter-pop", label: "Letter pop" },
      { value: "fade-letters", label: "Letters fade in" },
      { value: "wave", label: "Wave (letters)" },
      { value: "shimmer", label: "Shimmer gradient" },
      { value: "gradient-flow", label: "Flowing gradient" },
      { value: "glitch", label: "Glitch" },
      { value: "neon", label: "Neon sign" },
      { value: "decode", label: "Decode / scramble" },
    ],
  },
];

export const TEXT_PRESETS = new Set([
  "typewriter", "word-reveal", "letter-pop", "fade-letters", "wave",
  "shimmer", "gradient-flow", "glitch", "neon", "decode",
]);
export const HOVER_PRESETS = new Set([
  "hover-grow", "hover-lift", "hover-shrink", "hover-tilt", "hover-glow",
  "hover-rotate", "hover-skew", "hover-jelly", "hover-float", "hover-bright",
]);
export const LOOP_PRESETS = new Set([
  "float", "pulse", "spin", "bounce", "shake", "swing", "wobble", "heartbeat",
  "breathe", "jello", "tada", "flash", "rubber-band", "vibrate", "levitate",
  "pendulum", "blink", "glow", "rainbow", "neon-flicker", "color-pulse",
]);

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];
const BACK = [0.34, 1.56, 0.64, 1] as [number, number, number, number];

type Ent = { from: TargetAndTransition; to: TargetAndTransition; ease?: number[]; spring?: boolean };
const ENTRANCE: Record<string, Ent> = {
  fade: { from: { opacity: 0 }, to: { opacity: 1 } },
  "fade-up": { from: { opacity: 0, y: 50 }, to: { opacity: 1, y: 0 } },
  "fade-down": { from: { opacity: 0, y: -50 }, to: { opacity: 1, y: 0 } },
  "fade-left": { from: { opacity: 0, x: -60 }, to: { opacity: 1, x: 0 } },
  "fade-right": { from: { opacity: 0, x: 60 }, to: { opacity: 1, x: 0 } },
  "fade-up-big": { from: { opacity: 0, y: 180 }, to: { opacity: 1, y: 0 } },
  "fade-down-big": { from: { opacity: 0, y: -180 }, to: { opacity: 1, y: 0 } },
  "slide-up": { from: { y: 120 }, to: { y: 0 } },
  "slide-down": { from: { y: -120 }, to: { y: 0 } },
  "slide-left": { from: { x: 160 }, to: { x: 0 } },
  "slide-right": { from: { x: -160 }, to: { x: 0 } },
  "zoom-in": { from: { opacity: 0, scale: 0.6 }, to: { opacity: 1, scale: 1 } },
  "zoom-out": { from: { opacity: 0, scale: 1.4 }, to: { opacity: 1, scale: 1 } },
  "zoom-in-up": { from: { opacity: 0, scale: 0.6, y: 80 }, to: { opacity: 1, scale: 1, y: 0 } },
  "zoom-in-down": { from: { opacity: 0, scale: 0.6, y: -80 }, to: { opacity: 1, scale: 1, y: 0 } },
  pop: { from: { opacity: 0, scale: 0.3 }, to: { opacity: 1, scale: 1 }, spring: true },
  "back-in": { from: { opacity: 0, scale: 0.5 }, to: { opacity: 1, scale: 1 }, ease: BACK },
  "back-in-up": { from: { opacity: 0, scale: 0.7, y: 100 }, to: { opacity: 1, scale: 1, y: 0 }, ease: BACK },
  elastic: { from: { opacity: 0, scale: 0 }, to: { opacity: 1, scale: 1 }, spring: true },
  "expand-y": { from: { opacity: 0, scaleY: 0 }, to: { opacity: 1, scaleY: 1 } },
  "expand-x": { from: { opacity: 0, scaleX: 0 }, to: { opacity: 1, scaleX: 1 } },
  "flip-x": { from: { opacity: 0, rotateX: 90 }, to: { opacity: 1, rotateX: 0 } },
  "flip-y": { from: { opacity: 0, rotateY: 90 }, to: { opacity: 1, rotateY: 0 } },
  "rotate-in": { from: { opacity: 0, rotate: -25, scale: 0.8 }, to: { opacity: 1, rotate: 0, scale: 1 } },
  "roll-in": { from: { opacity: 0, x: -140, rotate: -120 }, to: { opacity: 1, x: 0, rotate: 0 } },
  "jack-in-box": { from: { opacity: 0, scale: 0.1, rotate: -30 }, to: { opacity: 1, scale: 1, rotate: 0 }, ease: BACK },
  "swing-in": { from: { opacity: 0, rotate: 18 }, to: { opacity: 1, rotate: 0 }, spring: true },
  "skew-in": { from: { opacity: 0, skewX: 18, x: 40 }, to: { opacity: 1, skewX: 0, x: 0 } },
  "light-speed-right": { from: { opacity: 0, x: 140, skewX: -25 }, to: { opacity: 1, x: 0, skewX: 0 } },
  "light-speed-left": { from: { opacity: 0, x: -140, skewX: 25 }, to: { opacity: 1, x: 0, skewX: 0 } },
  "blur-in": { from: { opacity: 0, filter: "blur(16px)" }, to: { opacity: 1, filter: "blur(0px)" } },
  "focus-in": { from: { opacity: 0, filter: "blur(30px)" }, to: { opacity: 1, filter: "blur(0px)" } },
  "bounce-in": { from: { opacity: 0, y: -60 }, to: { opacity: 1, y: 0 }, spring: true },
  "drop-in": { from: { opacity: 0, y: -200 }, to: { opacity: 1, y: 0 }, spring: true },
  "clip-up": { from: { clipPath: "inset(0 0 100% 0)" }, to: { clipPath: "inset(0 0 0% 0)" } },
  "clip-down": { from: { clipPath: "inset(100% 0 0 0)" }, to: { clipPath: "inset(0% 0 0 0)" } },
  "clip-left": { from: { clipPath: "inset(0 100% 0 0)" }, to: { clipPath: "inset(0 0% 0 0)" } },
  "clip-right": { from: { clipPath: "inset(0 0 0 100%)" }, to: { clipPath: "inset(0 0 0 0%)" } },
  "clip-circle": { from: { clipPath: "circle(0% at 50% 50%)" }, to: { clipPath: "circle(75% at 50% 50%)" } },
};

const LOOP: Record<string, { animate: TargetAndTransition; transition: Transition }> = {
  float: { animate: { y: [0, -16, 0] }, transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut" } },
  pulse: { animate: { scale: [1, 1.07, 1] }, transition: { duration: 1.8, repeat: Infinity, ease: "easeInOut" } },
  spin: { animate: { rotate: [0, 360] }, transition: { duration: 6, repeat: Infinity, ease: "linear" } },
  bounce: { animate: { y: [0, -22, 0] }, transition: { duration: 1.2, repeat: Infinity, ease: "easeOut" } },
  shake: { animate: { x: [0, -8, 8, -8, 8, 0] }, transition: { duration: 0.7, repeat: Infinity, repeatDelay: 1.5 } },
  swing: { animate: { rotate: [0, 8, -8, 6, -6, 0] }, transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" } },
  wobble: { animate: { rotate: [0, -5, 5, -3, 3, 0], x: [0, -10, 10, -6, 6, 0] }, transition: { duration: 1.6, repeat: Infinity, repeatDelay: 1 } },
  heartbeat: { animate: { scale: [1, 1.15, 1, 1.12, 1] }, transition: { duration: 1.4, repeat: Infinity, ease: "easeInOut" } },
  breathe: { animate: { scale: [1, 1.04, 1], opacity: [0.85, 1, 0.85] }, transition: { duration: 4, repeat: Infinity, ease: "easeInOut" } },
  jello: { animate: { skewX: [0, -12, 10, -6, 4, -2, 0], skewY: [0, -12, 10, -6, 4, -2, 0] }, transition: { duration: 1.4, repeat: Infinity, repeatDelay: 1.2 } },
  tada: { animate: { scale: [1, 0.9, 0.9, 1.1, 1.1, 1.1, 1], rotate: [0, -3, -3, 3, -3, 3, 0] }, transition: { duration: 1.3, repeat: Infinity, repeatDelay: 1.2 } },
  flash: { animate: { opacity: [1, 0, 1, 0, 1] }, transition: { duration: 1.4, repeat: Infinity, repeatDelay: 1 } },
  "rubber-band": { animate: { scaleX: [1, 1.25, 0.75, 1.15, 0.95, 1], scaleY: [1, 0.75, 1.25, 0.85, 1.05, 1] }, transition: { duration: 1.2, repeat: Infinity, repeatDelay: 1.4 } },
  vibrate: { animate: { x: [0, -2, 2, -2, 2, 0], y: [0, 2, -2, 2, -2, 0] }, transition: { duration: 0.3, repeat: Infinity, repeatDelay: 1.6 } },
  levitate: { animate: { y: [0, -12, 0], rotate: [0, 2, 0] }, transition: { duration: 4.5, repeat: Infinity, ease: "easeInOut" } },
  pendulum: { animate: { rotate: [0, 12, -12, 8, -8, 0] }, transition: { duration: 3, repeat: Infinity, ease: "easeInOut" } },
  blink: { animate: { opacity: [1, 0.3, 1] }, transition: { duration: 1.4, repeat: Infinity, ease: "easeInOut" } },
  glow: { animate: { filter: ["drop-shadow(0 0 0px rgba(124,92,255,0))", "drop-shadow(0 0 24px rgba(124,92,255,0.85))", "drop-shadow(0 0 0px rgba(124,92,255,0))"] }, transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" } },
  rainbow: { animate: { filter: ["hue-rotate(0deg)", "hue-rotate(360deg)"] }, transition: { duration: 6, repeat: Infinity, ease: "linear" } },
  "neon-flicker": { animate: { opacity: [1, 0.7, 1, 0.85, 1, 0.6, 1], filter: ["brightness(1)", "brightness(1.6)", "brightness(1)", "brightness(1.4)", "brightness(1)"] }, transition: { duration: 2, repeat: Infinity, repeatDelay: 0.6 } },
  "color-pulse": { animate: { filter: ["saturate(1)", "saturate(2.2)", "saturate(1)"] }, transition: { duration: 2.2, repeat: Infinity, ease: "easeInOut" } },
};

const HOVER: Record<string, { whileHover: TargetAndTransition; spring?: boolean }> = {
  "hover-grow": { whileHover: { scale: 1.08 } },
  "hover-lift": { whileHover: { y: -10 } },
  "hover-shrink": { whileHover: { scale: 0.93 } },
  "hover-tilt": { whileHover: { rotate: -4, scale: 1.03 } },
  "hover-glow": { whileHover: { filter: "drop-shadow(0 0 22px rgba(124,92,255,0.85))" } },
  "hover-rotate": { whileHover: { rotate: 6 } },
  "hover-skew": { whileHover: { skewX: -8 } },
  "hover-jelly": { whileHover: { scale: 1.12 }, spring: true },
  "hover-float": { whileHover: { y: -6, scale: 1.02 } },
  "hover-bright": { whileHover: { filter: "brightness(1.25)" } },
};

export type MotionSpec = {
  kind: "entrance" | "loop" | "hover" | "none";
  initial?: TargetAndTransition;
  animate?: TargetAndTransition;
  whileInView?: TargetAndTransition;
  whileHover?: TargetAndTransition;
  transition?: Transition;
  viewportOnce?: boolean;
};

/** Resolve an element's anim config into motion.div props. */
export function motionSpec(anim?: ElementAnim): MotionSpec {
  if (!anim?.preset || anim.preset === "none") return { kind: "none" };
  const p = anim.preset;
  const duration = anim.duration ?? 0.8;
  const delay = anim.delay ?? 0;

  if (HOVER_PRESETS.has(p)) {
    const h = HOVER[p];
    return { kind: "hover", whileHover: h.whileHover, transition: h.spring ? { type: "spring", stiffness: 400, damping: 10 } : { duration: 0.3, ease: EASE } };
  }
  if (LOOP_PRESETS.has(p)) {
    const l = LOOP[p];
    return { kind: "loop", animate: l.animate, transition: { ...l.transition, delay } };
  }
  const e = ENTRANCE[p] ?? ENTRANCE["fade-up"];
  const trigger = anim.trigger ?? "scroll";
  const transition: Transition = e.spring
    ? { type: "spring", stiffness: 300, damping: 14, delay }
    : { duration, delay, ease: (e.ease as [number, number, number, number]) ?? EASE };
  if (trigger === "load") {
    return { kind: "entrance", initial: e.from, animate: e.to, transition };
  }
  return { kind: "entrance", initial: e.from, whileInView: e.to, transition, viewportOnce: true };
}
