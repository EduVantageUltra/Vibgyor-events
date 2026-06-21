import type { Data } from "@measured/puck";
import { getPuckPage } from "@/lib/content";
import { getPageMode } from "@/lib/pages";
import { getCanvas } from "@/lib/freecanvas.server";
import { PuckRender } from "./PuckRender";
import { FreeCanvasRender } from "@/components/freecanvas/FreeCanvasRender";

/**
 * Renders a page in priority order:
 *   1. Free-canvas design (if the page is in canvas mode and has elements)
 *   2. Published block (Puck) content
 *   3. The page's hand-built default design (only runs when needed)
 */
export function renderEditable(slug: string, fallback: () => React.ReactNode) {
  if (getPageMode(slug) === "canvas") {
    const doc = getCanvas(slug);
    if (doc.elements && doc.elements.length > 0) {
      return <FreeCanvasRender doc={doc} />;
    }
  }

  const data = getPuckPage<Data>(slug, { content: [], root: {} } as Data);
  if (Array.isArray(data.content) && data.content.length > 0) {
    return (
      <div className="pt-20">
        <PuckRender data={data} />
      </div>
    );
  }

  return fallback();
}
