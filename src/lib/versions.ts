import "server-only";
import fs from "node:fs";
import path from "node:path";

export type Version = { ts: number; type: "blocks" | "canvas"; data: unknown };

const dir = path.join(process.cwd(), "src", "data");
const fileFor = (page: string) => path.join(dir, `versions-${page.replace(/[^a-z0-9-]/gi, "")}.json`);

export function getVersions(page: string): Version[] {
  try {
    return JSON.parse(fs.readFileSync(fileFor(page), "utf-8")) as Version[];
  } catch {
    return [];
  }
}

/** Append a snapshot (keeps the most recent 20). */
export function appendVersion(page: string, type: "blocks" | "canvas", data: unknown) {
  const list = getVersions(page);
  list.unshift({ ts: Date.now(), type, data });
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fileFor(page), JSON.stringify(list.slice(0, 20), null, 2), "utf-8");
}
