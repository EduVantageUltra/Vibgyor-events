"use client";

import { useState } from "react";
import { TEMPLATES } from "@/lib/puck/templates";

export function TemplatesPanel({ slug, pageTitle, onClose }: { slug: string; pageTitle: string; onClose: () => void }) {
  const [status, setStatus] = useState("");

  const apply = async (id: string) => {
    const tpl = TEMPLATES.find((t) => t.id === id);
    if (!tpl) return;
    if (!confirm(`Apply "${tpl.name}" to "${pageTitle}"? This replaces the page's current content.`)) return;
    setStatus("Applying…");
    await fetch("/api/editor", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ page: slug, data: tpl.data }) });
    await fetch("/api/pages", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug, mode: "blocks" }) });
    setStatus("Applied ✓ — reloading…");
    setTimeout(() => location.reload(), 1000);
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={panel} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#111" }}>🧩 Page templates</h2>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#16a34a", fontWeight: 600 }}>{status}</span>
            <button onClick={onClose} style={xBtn}>✕</button>
          </div>
        </div>
        <p style={{ fontSize: 12, color: "#777", margin: "0 0 14px" }}>
          One click applies a ready design to <b>{pageTitle}</b>. You can edit every block afterwards.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))", gap: 12 }}>
          {TEMPLATES.map((t) => (
            <div key={t.id} style={card}>
              <div style={thumb}>
                <span style={{ fontSize: 30 }}>{thumbIcon(t.id)}</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, marginTop: 8, color: "#111" }}>{t.name}</div>
              <div style={{ fontSize: 12, color: "#777", minHeight: 32 }}>{t.desc}</div>
              <button onClick={() => apply(t.id)} style={applyBtn}>Apply</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function thumbIcon(id: string) {
  return { "shop-home": "🛍️", minimal: "⬜", "bold-agency": "🔥", launch: "🚀", contact: "✉️" }[id] ?? "📄";
}

const overlay: React.CSSProperties = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 100000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 };
const panel: React.CSSProperties = { width: 820, maxWidth: "100%", maxHeight: "92vh", overflowY: "auto", background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 30px 80px rgba(0,0,0,0.4)" };
const card: React.CSSProperties = { border: "1px solid #eee", borderRadius: 12, padding: 12, background: "#fafafa" };
const thumb: React.CSSProperties = { height: 90, borderRadius: 10, background: "linear-gradient(135deg,#efeaff,#e6f7ff)", display: "grid", placeItems: "center" };
const applyBtn: React.CSSProperties = { marginTop: 8, width: "100%", background: "#7c5cff", color: "#fff", border: "none", borderRadius: 9, padding: "8px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer" };
const xBtn: React.CSSProperties = { background: "#f0f0f3", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 14 };
