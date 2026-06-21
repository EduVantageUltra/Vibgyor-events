import "server-only";
import fs from "node:fs";
import path from "node:path";
import { emptyCanvas, type CanvasDoc } from "./freecanvas";

const dir = path.join(process.cwd(), "src", "data");
const fileFor = (slug: string) =>
  path.join(dir, `freecanvas-${slug.replace(/[^a-z0-9-]/gi, "")}.json`);

export function getCanvas(slug: string): CanvasDoc {
  try {
    return { ...emptyCanvas, ...(JSON.parse(fs.readFileSync(fileFor(slug), "utf-8")) as CanvasDoc) };
  } catch {
    return emptyCanvas;
  }
}

export function setCanvas(slug: string, doc: CanvasDoc) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fileFor(slug), JSON.stringify(doc, null, 2), "utf-8");
}

export function deleteCanvas(slug: string) {
  try {
    fs.unlinkSync(fileFor(slug));
  } catch {
    /* no-op */
  }
}
