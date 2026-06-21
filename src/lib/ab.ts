import "server-only";
import fs from "node:fs";
import path from "node:path";

export type AbStat = { views: number; conv: number };
export type AbStore = Record<string, { a: AbStat; b: AbStat }>;

const FILE = path.join(process.cwd(), "src", "data", "abtests.json");

export function getAb(): AbStore {
  try { return JSON.parse(fs.readFileSync(FILE, "utf-8")) as AbStore; } catch { return {}; }
}

export function trackAb(expId: string, variant: "a" | "b", event: "view" | "convert") {
  const store = getAb();
  if (!store[expId]) store[expId] = { a: { views: 0, conv: 0 }, b: { views: 0, conv: 0 } };
  const v = store[expId][variant];
  if (event === "view") v.views++; else v.conv++;
  fs.writeFileSync(FILE, JSON.stringify(store, null, 2), "utf-8");
}
