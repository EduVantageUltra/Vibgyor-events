import fs from "node:fs";
import path from "node:path";
import type { HeroSlide } from "@/components/sections/HeroSlider";

const dataDir = path.join(process.cwd(), "src", "data");

function readJson<T>(file: string, fallback: T): T {
  try {
    return JSON.parse(fs.readFileSync(path.join(dataDir, file), "utf-8")) as T;
  } catch {
    return fallback;
  }
}

function writeJson(file: string, data: unknown) {
  fs.writeFileSync(path.join(dataDir, file), JSON.stringify(data, null, 2), "utf-8");
}

export function getHeroSlides(): HeroSlide[] {
  return readJson<{ slides: HeroSlide[] }>("hero.json", { slides: [] }).slides;
}

export function setHeroSlides(slides: HeroSlide[]) {
  writeJson("hero.json", { slides });
}

/** Generic key/value content store the visual editor writes to. */
export function getPageContent<T = unknown>(page: string, fallback: T): T {
  return readJson<T>(`page-${page}.json`, fallback);
}
export function setPageContent(page: string, data: unknown) {
  writeJson(`page-${page}.json`, data);
}

/** Puck visual-editor document for a given page (matches /api/editor naming). */
export function getPuckPage<T = unknown>(page: string, fallback: T): T {
  const safe = page.replace(/[^a-z0-9-]/gi, "");
  return readJson<T>(`puck-${safe}.json`, fallback);
}
