import type { Data } from "@measured/puck";
import fs from "node:fs";
import path from "node:path";
import { PuckRender } from "@/components/puck/PuckRender";
import "../../globals.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Draft preview", robots: { index: false, follow: false } };

function readDraft(slug: string): Data {
  try {
    const p = path.join(process.cwd(), "src", "data", `puck-${slug.replace(/[^a-z0-9-]/gi, "")}-draft.json`);
    return JSON.parse(fs.readFileSync(p, "utf-8"));
  } catch {
    return { content: [], root: {} } as Data;
  }
}

export default async function PreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = readDraft(slug);
  const has = Array.isArray(data.content) && data.content.length > 0;
  return (
    <div className="min-h-screen bg-ink text-fog">
      <div className="aurora-field" aria-hidden />
      <div className="fixed left-1/2 top-3 z-[200] -translate-x-1/2 rounded-full bg-amber px-4 py-1.5 text-xs font-bold text-ink shadow-lg">
        DRAFT PREVIEW — not live
      </div>
      {has ? <div className="pt-20"><PuckRender data={data} /></div> : (
        <div className="grid min-h-screen place-items-center text-fog-dim">No draft saved for “{slug}”.</div>
      )}
    </div>
  );
}
