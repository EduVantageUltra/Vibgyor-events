import fs from "node:fs";
import path from "node:path";

export type SiteSettings = {
  gaId?: string;        // Google Analytics measurement id (G-XXXX)
  metaPixel?: string;   // Meta pixel id
  popup?: {
    enabled: boolean;
    heading: string;
    body: string;
    ctaLabel: string;
    ctaHref: string;
    delaySec: number;
  };
  intro?: {
    enabled: boolean;
    style: string;       // curtain | sweep | logo | bars | counter
    brandText: string;
    color1: string;
    color2: string;
    everyVisit: boolean; // true = every load, false = once per session
  };
};

export const defaultSettings: SiteSettings = {
  gaId: "",
  metaPixel: "",
  popup: { enabled: false, heading: "Get 10% off", body: "Join our list for exclusive deals.", ctaLabel: "Shop now", ctaHref: "/shop", delaySec: 5 },
  intro: { enabled: false, style: "curtain", brandText: "Rajrishi", color1: "#7c5cff", color2: "#39e6ff", everyVisit: false },
};

const FILE = path.join(process.cwd(), "src", "data", "settings.json");

export function getSettings(): SiteSettings {
  try {
    return { ...defaultSettings, ...(JSON.parse(fs.readFileSync(FILE, "utf-8")) as SiteSettings) };
  } catch {
    return defaultSettings;
  }
}

export function setSettings(s: SiteSettings) {
  fs.writeFileSync(FILE, JSON.stringify(s, null, 2), "utf-8");
}
