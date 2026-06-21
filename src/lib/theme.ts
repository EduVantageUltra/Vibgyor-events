import fs from "node:fs";
import path from "node:path";
import { googleFontsHref } from "@/components/freecanvas/fonts";

export type Theme = {
  ink: string;
  ink2: string;
  fog: string;
  fogDim: string;
  iris: string;
  violet: string;
  cyan: string;
  amber: string;
  rose: string;
  customCss?: string;
  design?: string;
};

/** One-click whole-site design presets (fonts + corner radius). */
export const DESIGN_PRESETS: Record<string, { name: string; display: string; body: string; radius: string }> = {
  aurora: { name: "Aurora (default)", display: "", body: "", radius: "2rem" },
  minimal: { name: "Minimal", display: "DM Sans", body: "DM Sans", radius: "1rem" },
  luxury: { name: "Luxury Serif", display: "Playfair Display", body: "Manrope", radius: "0.6rem" },
  bold: { name: "Bold", display: "Anton", body: "Sora", radius: "1.4rem" },
  playful: { name: "Playful", display: "Righteous", body: "Quicksand", radius: "2.6rem" },
  editorial: { name: "Editorial", display: "Cinzel", body: "Lora", radius: "0.5rem" },
};

/** Returns the Google-fonts URL + CSS overrides for the active design preset. */
export function designAssets(design?: string): { fontHref: string | null; css: string } {
  const p = DESIGN_PRESETS[design ?? "aurora"] ?? DESIGN_PRESETS.aurora;
  const fonts = [p.display, p.body].filter(Boolean);
  let css = `:root{--radius-squircle:${p.radius};`;
  if (p.display) css += `--font-display:'${p.display}',system-ui,sans-serif;`;
  if (p.body) css += `--font-sans:'${p.body}',system-ui,sans-serif;`;
  css += "}";
  return { fontHref: fonts.length ? googleFontsHref(fonts) : null, css };
}

export const defaultTheme: Theme = {
  ink: "#060608",
  ink2: "#0b0b12",
  fog: "#ECECF2",
  fogDim: "#9b9ba8",
  iris: "#a988ff",
  violet: "#7c5cff",
  cyan: "#39e6ff",
  amber: "#ffb86b",
  rose: "#ff6b9d",
};

const FILE = path.join(process.cwd(), "src", "data", "theme.json");

export function getTheme(): Theme {
  try {
    return { ...defaultTheme, ...(JSON.parse(fs.readFileSync(FILE, "utf-8")) as Partial<Theme>) };
  } catch {
    return defaultTheme;
  }
}

export function setTheme(theme: Theme) {
  fs.writeFileSync(FILE, JSON.stringify(theme, null, 2), "utf-8");
}

type ColorKey = "ink" | "ink2" | "fog" | "fogDim" | "iris" | "violet" | "cyan" | "amber" | "rose";

/** Maps theme keys → the CSS custom properties used across the site. */
export function themeToCssVars(theme: Theme): string {
  const map: Record<ColorKey, string> = {
    ink: "--color-ink",
    ink2: "--color-ink-2",
    fog: "--color-fog",
    fogDim: "--color-fog-dim",
    iris: "--color-iris",
    violet: "--color-violet",
    cyan: "--color-cyan",
    amber: "--color-amber",
    rose: "--color-rose",
  };
  const lines = (Object.keys(map) as ColorKey[]).map((k) => `${map[k]}:${theme[k]};`);
  return `:root{${lines.join("")}--background:${theme.ink};}`;
}
