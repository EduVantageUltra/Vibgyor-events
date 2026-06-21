import fs from "node:fs";
import path from "node:path";

export type FieldType = "text" | "textarea" | "image" | "number" | "date" | "boolean" | "reference";
export type Field = { key: string; label: string; type: FieldType; refCollection?: string };
export type Item = { id: string; slug: string; [key: string]: unknown };
export type Collection = { id: string; name: string; slug: string; fields: Field[]; items: Item[] };

const FILE = path.join(process.cwd(), "src", "data", "collections.json");

export function getCollections(): Collection[] {
  try { return JSON.parse(fs.readFileSync(FILE, "utf-8")) as Collection[]; } catch { return []; }
}
export function getCollection(slug: string): Collection | undefined {
  return getCollections().find((c) => c.slug === slug);
}
export function getItem(colSlug: string, itemSlug: string): { collection: Collection; item: Item } | undefined {
  const c = getCollection(colSlug);
  const item = c?.items.find((i) => i.slug === itemSlug);
  return c && item ? { collection: c, item } : undefined;
}
export function writeCollections(cols: Collection[]) {
  fs.writeFileSync(FILE, JSON.stringify(cols, null, 2), "utf-8");
}
