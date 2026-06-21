"use client";

import { useEffect, useRef, useState } from "react";

type Version = { ts: number; type: "blocks" | "canvas"; data: unknown };

export function BackupPanel({ slug, onClose }: { slug: string; onClose: () => void }) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [status, setStatus] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`/api/versions?page=${slug}`).then((r) => r.json()).then(setVersions);
  }, [slug]);
  const flash = (m: string) => { setStatus(m); setTimeout(() => setStatus(""), 3000); };

  const exportBackup = async () => {
    const data = await (await fetch("/api/backup")).json();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rajrishi-backup.json";
    a.click();
    URL.revokeObjectURL(url);
    flash("Backup downloaded ✓");
  };

  const importBackup = async (file: File) => {
    const text = await file.text();
    const bundle = JSON.parse(text);
    await fetch("/api/backup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ files: bundle.files }) });
    flash("Backup restored ✓ — reloading…");
    setTimeout(() => location.reload(), 1200);
  };

  const restore = async (v: Version) => {
    if (!confirm("Restore this version? Current page will be replaced.")) return;
    if (v.type === "canvas") {
      await fetch("/api/freecanvas", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ page: slug, doc: v.data }) });
      await fetch("/api/pages", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug, mode: "canvas" }) });
    } else {
      await fetch("/api/editor", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ page: slug, data: v.data }) });
      await fetch("/api/pages", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug, mode: "blocks" }) });
    }
    flash("Restored ✓ — reloading…");
    setTimeout(() => location.reload(), 1200);
  };

  const fmt = (ts: number) => new Date(ts).toLocaleString();

  return (
    <div style={overlay} onClick={onClose}>
      <div style={panel} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#111" }}>💾 Backup & Versions</h2>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#16a34a", fontWeight: 600 }}>{status}</span>
            <button onClick={onClose} style={xBtn}>✕</button>
          </div>
        </div>

        <div style={{ background: "#f6f5ff", borderRadius: 12, padding: 12, marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#5b3fd6", marginBottom: 8 }}>Whole-site backup</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={exportBackup} style={primaryBtn}>⬇ Download backup</button>
            <button onClick={() => fileRef.current?.click()} style={miniBtn}>⬆ Restore from file</button>
            <input ref={fileRef} type="file" accept="application/json" hidden onChange={(e) => e.target.files?.[0] && importBackup(e.target.files[0])} />
          </div>
          <p style={{ fontSize: 11, color: "#999", margin: "8px 0 0" }}>Downloads all pages, products, theme & settings as one file.</p>
        </div>

        <div style={{ fontSize: 13, fontWeight: 700, color: "#333", marginBottom: 8 }}>
          Version history — <b>{slug}</b> ({versions.length})
        </div>
        {versions.length === 0 ? (
          <p style={{ fontSize: 12, color: "#999" }}>No saved versions yet. Each Publish creates a restore point.</p>
        ) : (
          <div style={{ display: "grid", gap: 6, maxHeight: 280, overflowY: "auto" }}>
            {versions.map((v, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 8, background: "#f7f7fa" }}>
                <span style={{ flex: 1, fontSize: 12, color: "#333" }}>{fmt(v.ts)} · <b>{v.type}</b></span>
                <button onClick={() => restore(v)} style={miniBtn}>Restore</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const overlay: React.CSSProperties = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 100000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 };
const panel: React.CSSProperties = { width: 520, maxWidth: "100%", maxHeight: "92vh", overflowY: "auto", background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 30px 80px rgba(0,0,0,0.4)" };
const primaryBtn: React.CSSProperties = { background: "#7c5cff", color: "#fff", border: "none", borderRadius: 9, padding: "9px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer" };
const miniBtn: React.CSSProperties = { padding: "9px 12px", borderRadius: 8, border: "1px solid #e2e2e8", background: "#eef0f4", fontSize: 12, fontWeight: 600, cursor: "pointer", color: "#333" };
const xBtn: React.CSSProperties = { background: "#f0f0f3", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 14 };
