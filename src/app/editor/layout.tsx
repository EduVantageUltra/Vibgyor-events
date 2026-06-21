import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "@measured/puck/dist/index.css";
import "../globals.css";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Canvas Editor",
  robots: { index: false, follow: false },
};

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  // LOCAL-ONLY: the editor can NEVER open anywhere except a local dev machine.
  // In any production/deployed build it returns 404 — no override, by design.
  if (process.env.NODE_ENV === "production") notFound();
  return <div className="puck-editor-root">{children}</div>;
}
