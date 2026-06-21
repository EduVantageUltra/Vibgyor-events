import type { Metadata } from "next";
import "@measured/puck/dist/index.css";
import "../globals.css";

export const metadata: Metadata = {
  title: "Canvas Editor",
  robots: { index: false, follow: false },
};

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return <div className="puck-editor-root">{children}</div>;
}
