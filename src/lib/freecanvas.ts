// Client-safe: types + pure constants only. (Server IO lives in freecanvas.server.ts)

export type ElKind = "heading" | "text" | "image" | "video" | "button" | "box" | "section";

export type SectionPreset = "hero" | "cta" | "features" | "productRow";

export type Box = { x: number; y: number; w: number; h: number };

export type CanvasElement = {
  id: string;
  kind: ElKind;
  section?: SectionPreset;
  text?: string;
  text2?: string;
  text3?: string;
  src?: string;
  poster?: string;
  href?: string;
  color?: string;
  bg?: string;
  fontSize?: number;
  fontWeight?: number;
  fontFamily?: "display" | "sans";
  font?: string;            // Google Font name (overrides fontFamily)
  letterSpacing?: number;
  lineHeight?: number;
  shadow?: string;          // preset: none | soft | medium | strong | glow
  borderColor?: string;
  borderWidth?: number;
  align?: "left" | "center" | "right";
  italic?: boolean;
  underline?: boolean;
  radius?: number;
  opacity?: number;
  rotate?: number;
  z?: number;
  hidden?: boolean;
  locked?: boolean;
  name?: string;
  startTime?: number;
  endTime?: number;
  playbackRate?: number;
  muted?: boolean;
  loop?: boolean;
  anim?: ElementAnim;
  desktop: Box;
  mobile: Box;
};

export type AnimTrigger = "load" | "scroll" | "hover" | "loop";
export type ElementAnim = {
  preset?: string;        // e.g. "fade-up", "zoom-in", "float", "typewriter"
  trigger?: AnimTrigger;  // when it plays
  duration?: number;      // seconds
  delay?: number;         // seconds
  repeat?: boolean;       // loop forever (for loop presets)
};

export type CanvasDoc = {
  desktopW: number;
  desktopH: number;
  mobileW: number;
  mobileH: number;
  bg?: string;
  elements: CanvasElement[];
};

export const emptyCanvas: CanvasDoc = {
  desktopW: 1280,
  desktopH: 900,
  mobileW: 390,
  mobileH: 1400,
  bg: "none",
  elements: [],
};
