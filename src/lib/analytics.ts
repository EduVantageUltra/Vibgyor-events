import "server-only";
import fs from "node:fs";
import path from "node:path";

export type Analytics = { total: number; paths: Record<string, number>; days: Record<string, number> };
export type Abandoned = { id: string; phone: string; items: string; total: number; date: string };

const dir = path.join(process.cwd(), "src", "data");
const aFile = path.join(dir, "analytics.json");
const abFile = path.join(dir, "abandoned.json");

export function getAnalytics(): Analytics {
  try { return JSON.parse(fs.readFileSync(aFile, "utf-8")); } catch { return { total: 0, paths: {}, days: {} }; }
}
export function trackView(p: string) {
  const a = getAnalytics();
  a.total++;
  a.paths[p] = (a.paths[p] || 0) + 1;
  const day = new Date().toISOString().slice(0, 10);
  a.days[day] = (a.days[day] || 0) + 1;
  fs.writeFileSync(aFile, JSON.stringify(a), "utf-8");
}

export function getAbandoned(): Abandoned[] {
  try { return JSON.parse(fs.readFileSync(abFile, "utf-8")); } catch { return []; }
}
export function addAbandoned(a: Omit<Abandoned, "id" | "date">) {
  const all = getAbandoned();
  all.unshift({ ...a, id: `ab-${Date.now().toString(36)}`, date: new Date().toISOString() });
  fs.writeFileSync(abFile, JSON.stringify(all.slice(0, 500), null, 2), "utf-8");
}
