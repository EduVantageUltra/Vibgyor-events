"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/lib/products";
import { MediaField } from "@/lib/puck/MediaField";

const CATEGORIES = ["Smartphones", "Audio", "Charging", "Wearables", "Cases & Protection", "Accessories"];
const blank: Partial<Product> = {
  name: "", brand: "", category: "Smartphones", price: 0, mrp: 0, stock: 10,
  image: "/products/phone-aurora.jpg", colors: [], badges: [], highlights: [],
  description: "", featured: false, rating: 4.5, reviews: 0, specs: {},
};

export function ProductManager({ onClose }: { onClose: () => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [status, setStatus] = useState("");

  const load = () => fetch("/api/products").then((r) => r.json()).then(setProducts);
  useEffect(() => { load(); }, []);

  const flash = (m: string) => { setStatus(m); setTimeout(() => setStatus(""), 2500); };

  const save = async () => {
    if (!editing) return;
    const method = editing.id ? "PUT" : "POST";
    await fetch("/api/products", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
    await load();
    setEditing(null);
    flash("Saved ✓ — live on the shop");
  };

  const del = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await fetch("/api/products", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    await load();
    flash("Deleted ✓");
  };

  const set = (k: keyof Product, v: unknown) => setEditing((e) => ({ ...e, [k]: v }));
  const csv = (arr?: string[]) => (arr ?? []).join(", ");
  const fromCsv = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);

  return (
    <div style={overlay} onClick={onClose}>
      <div style={panel} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#111" }}>🛍 Products</h2>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#16a34a", fontWeight: 600 }}>{status}</span>
            {!editing && <button onClick={() => setEditing({ ...blank })} style={primaryBtn}>＋ Add product</button>}
            <button onClick={onClose} style={xBtn}>✕</button>
          </div>
        </div>

        {!editing ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 10 }}>
            {products.map((p) => (
              <div key={p.id} style={card}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt={p.name} style={{ width: "100%", height: 110, objectFit: "cover", borderRadius: 8 }} />
                <div style={{ fontWeight: 700, fontSize: 13, marginTop: 6, color: "#111" }}>{p.name}</div>
                <div style={{ fontSize: 12, color: "#666" }}>₹{p.price.toLocaleString("en-IN")} · {p.category}</div>
                <div style={{ fontSize: 11, color: p.stock < 10 ? "#c0392b" : "#888" }}>Stock: {p.stock}{p.featured ? " · ⭐ featured" : ""}</div>
                <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                  <button onClick={() => setEditing(p)} style={{ ...miniBtn, flex: 1 }}>Edit</button>
                  <button onClick={() => del(p.id)} style={delBtn}>Delete</button>
                </div>
              </div>
            ))}
            {products.length === 0 && <p style={{ color: "#999", fontSize: 13 }}>No products yet — add one.</p>}
          </div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Field label="Name"><input style={inp} value={editing.name ?? ""} onChange={(e) => set("name", e.target.value)} /></Field>
              <Field label="Brand"><input style={inp} value={editing.brand ?? ""} onChange={(e) => set("brand", e.target.value)} /></Field>
              <Field label="Category">
                <select style={inp} value={editing.category} onChange={(e) => set("category", e.target.value)}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Featured">
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, paddingTop: 8 }}>
                  <input type="checkbox" checked={!!editing.featured} onChange={(e) => set("featured", e.target.checked)} /> Show in featured
                </label>
              </Field>
              <Field label="Price (₹)"><input type="number" style={inp} value={editing.price ?? 0} onChange={(e) => set("price", Number(e.target.value))} /></Field>
              <Field label="MRP (₹)"><input type="number" style={inp} value={editing.mrp ?? 0} onChange={(e) => set("mrp", Number(e.target.value))} /></Field>
              <Field label="Stock"><input type="number" style={inp} value={editing.stock ?? 0} onChange={(e) => set("stock", Number(e.target.value))} /></Field>
              <Field label="Rating"><input type="number" step="0.1" style={inp} value={editing.rating ?? 4.5} onChange={(e) => set("rating", Number(e.target.value))} /></Field>
            </div>
            <Field label="Product image"><MediaField value={editing.image} onChange={(v) => set("image", v)} accept="image/*" label="Drop product image" /></Field>
            <Field label="Description"><textarea rows={2} style={{ ...inp, resize: "vertical" }} value={editing.description ?? ""} onChange={(e) => set("description", e.target.value)} /></Field>
            <Field label="Highlights (comma separated)"><input style={inp} value={csv(editing.highlights)} onChange={(e) => set("highlights", fromCsv(e.target.value))} /></Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Field label="Colours (comma)"><input style={inp} value={csv(editing.colors)} onChange={(e) => set("colors", fromCsv(e.target.value))} /></Field>
              <Field label="Badges (comma)"><input style={inp} value={csv(editing.badges)} onChange={(e) => set("badges", fromCsv(e.target.value))} /></Field>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button onClick={save} style={primaryBtn}>Save product</button>
              <button onClick={() => setEditing(null)} style={miniBtn}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", display: "block", marginBottom: 4 }}>{label}</label>
      {children}
    </div>
  );
}

const overlay: React.CSSProperties = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 100000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 };
const panel: React.CSSProperties = { width: 860, maxWidth: "100%", maxHeight: "92vh", overflowY: "auto", background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 30px 80px rgba(0,0,0,0.4)" };
const card: React.CSSProperties = { border: "1px solid #eee", borderRadius: 12, padding: 10, background: "#fafafa" };
const inp: React.CSSProperties = { width: "100%", padding: "8px 10px", border: "1px solid #e2e2e8", borderRadius: 8, fontSize: 13, boxSizing: "border-box" };
const primaryBtn: React.CSSProperties = { background: "#7c5cff", color: "#fff", border: "none", borderRadius: 9, padding: "9px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" };
const miniBtn: React.CSSProperties = { padding: "8px 12px", borderRadius: 8, border: "1px solid #e2e2e8", background: "#eef0f4", fontSize: 12, fontWeight: 600, cursor: "pointer", color: "#333" };
const delBtn: React.CSSProperties = { padding: "8px 12px", borderRadius: 8, border: "none", background: "#fde8e8", color: "#c0392b", fontSize: 12, fontWeight: 700, cursor: "pointer" };
const xBtn: React.CSSProperties = { background: "#f0f0f3", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 14 };
