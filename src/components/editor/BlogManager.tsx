"use client";

import { useEffect, useState } from "react";
import type { Post } from "@/lib/blog";
import { MediaField } from "@/lib/puck/MediaField";

const blank: Partial<Post> = { title: "", excerpt: "", cover: "/products/phone-aurora.jpg", date: new Date().toISOString().slice(0, 10), published: true, body: "" };

export function BlogManager({ onClose }: { onClose: () => void }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [editing, setEditing] = useState<Partial<Post> | null>(null);
  const [status, setStatus] = useState("");

  const load = () => fetch("/api/posts").then((r) => r.json()).then(setPosts);
  useEffect(() => { load(); }, []);
  const flash = (m: string) => { setStatus(m); setTimeout(() => setStatus(""), 2500); };

  const save = async () => {
    if (!editing) return;
    await fetch("/api/posts", { method: editing.id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
    await load(); setEditing(null); flash("Saved ✓ — live on /blog");
  };
  const del = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    await fetch("/api/posts", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    await load(); flash("Deleted ✓");
  };
  const set = (k: keyof Post, v: unknown) => setEditing((e) => ({ ...e, [k]: v }));

  return (
    <div style={overlay} onClick={onClose}>
      <div style={panel} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#111" }}>📝 Blog posts</h2>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#16a34a", fontWeight: 600 }}>{status}</span>
            {!editing && <button onClick={() => setEditing({ ...blank })} style={primaryBtn}>＋ New post</button>}
            <button onClick={onClose} style={xBtn}>✕</button>
          </div>
        </div>
        {!editing ? (
          <div style={{ display: "grid", gap: 8 }}>
            {posts.map((p) => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, border: "1px solid #eee", borderRadius: 10, padding: 8 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.cover} alt="" style={{ width: 64, height: 44, objectFit: "cover", borderRadius: 6 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "#111" }}>{p.title} {!p.published && <span style={{ color: "#c0392b", fontSize: 11 }}>(draft)</span>}</div>
                  <div style={{ fontSize: 11, color: "#888" }}>{p.date} · /blog/{p.slug}</div>
                </div>
                <button onClick={() => setEditing(p)} style={miniBtn}>Edit</button>
                <button onClick={() => del(p.id)} style={delBtn}>Delete</button>
              </div>
            ))}
            {posts.length === 0 && <p style={{ color: "#999", fontSize: 13 }}>No posts yet.</p>}
          </div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            <L label="Title"><input style={inp} value={editing.title ?? ""} onChange={(e) => set("title", e.target.value)} /></L>
            <L label="Excerpt (short summary)"><input style={inp} value={editing.excerpt ?? ""} onChange={(e) => set("excerpt", e.target.value)} /></L>
            <L label="Cover image"><MediaField value={editing.cover} onChange={(v) => set("cover", v)} accept="image/*" label="Drop cover image" /></L>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "end" }}>
              <L label="Date"><input type="date" style={inp} value={editing.date ?? ""} onChange={(e) => set("date", e.target.value)} /></L>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, paddingBottom: 8 }}>
                <input type="checkbox" checked={editing.published ?? true} onChange={(e) => set("published", e.target.checked)} /> Published
              </label>
            </div>
            <L label="Body (blank line = new paragraph)"><textarea rows={8} style={{ ...inp, resize: "vertical", fontFamily: "inherit" }} value={editing.body ?? ""} onChange={(e) => set("body", e.target.value)} /></L>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={save} style={primaryBtn}>Save post</button>
              <button onClick={() => setEditing(null)} style={miniBtn}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function L({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", display: "block", marginBottom: 4 }}>{label}</label>{children}</div>;
}
const overlay: React.CSSProperties = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 100000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 };
const panel: React.CSSProperties = { width: 640, maxWidth: "100%", maxHeight: "92vh", overflowY: "auto", background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 30px 80px rgba(0,0,0,0.4)" };
const inp: React.CSSProperties = { width: "100%", padding: "8px 10px", border: "1px solid #e2e2e8", borderRadius: 8, fontSize: 13, boxSizing: "border-box" };
const primaryBtn: React.CSSProperties = { background: "#7c5cff", color: "#fff", border: "none", borderRadius: 9, padding: "9px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" };
const miniBtn: React.CSSProperties = { padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e2e8", background: "#eef0f4", fontSize: 12, fontWeight: 600, cursor: "pointer", color: "#333" };
const delBtn: React.CSSProperties = { padding: "8px 12px", borderRadius: 8, border: "none", background: "#fde8e8", color: "#c0392b", fontSize: 12, fontWeight: 700, cursor: "pointer" };
const xBtn: React.CSSProperties = { background: "#f0f0f3", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 14 };
