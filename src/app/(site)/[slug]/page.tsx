import type { Metadata } from "next";
import type { Data } from "@measured/puck";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPage, getPageMode, seoFor } from "@/lib/pages";
import { getPuckPage } from "@/lib/content";
import { getCanvas } from "@/lib/freecanvas.server";
import { PuckRender } from "@/components/puck/PuckRender";
import { FreeCanvasRender } from "@/components/freecanvas/FreeCanvasRender";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getPage(slug);
  return seoFor(slug, { title: page?.title ?? "Page", description: page?.title ?? "" });
}

export default async function CanvasPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getPage(slug);
  if (!page) notFound();

  if (getPageMode(slug) === "canvas") {
    const doc = getCanvas(slug);
    if (doc.elements && doc.elements.length > 0) {
      return <FreeCanvasRender doc={doc} />;
    }
  } else {
    const data = getPuckPage<Data>(slug, { content: [], root: {} } as Data);
    if (Array.isArray(data.content) && data.content.length > 0) {
      return (
        <div className="pt-20">
          <PuckRender data={data} />
        </div>
      );
    }
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 px-6 py-40 text-center">
      <h1 className="font-display text-4xl font-bold">{page.title}</h1>
      <p className="text-fog-dim">This page is empty. Open the editor to design it, then publish.</p>
      <Link href="/editor" className="rounded-full bg-gradient-to-r from-iris to-cyan px-7 py-3 text-sm font-bold text-ink">
        Open the editor
      </Link>
    </div>
  );
}
