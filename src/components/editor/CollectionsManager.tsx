"use client";

import { useEffect, useState } from "react";
import type { Collection, Field, FieldType, Item } from "@/lib/collections";
import { MediaField } from "@/lib/puck/MediaField";

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const TYPES: FieldType[] = ["text", "textarea", "image", "number", "date", "boolean", "reference"];

export function CollectionsManager({ onClose }: { onClose: () => void }) {
  const [cols, setCols] = useState<Collection[]>([]);
  const [sel, setSel] = useState(0);
  const [status, setStatus] = useState("");

  useEffect(() => { fetch("/api/collections").then((r) => r.json()).then((d) => Array.isArray(d) && setCols(d)); }, []);
  const flash = (m: string) => { setStatus(m); setTimeout(() => setStatus(""), 2500); };

  const save = async () => {
    await fetch("/api/collections", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(cols) });
    flash("Saved ✓ — live on the site");
  };
  const update = (fn: (draft: Collection[]) => void) => { const d = JSON.parse(JSON.stringify(cols)) as Collection[]; fn(d); setCols(d); };

  const addCollection = () => {
    const name = prompt("New collection name (e.g. Team, Brands, Locations):");
    if (!name?.trim()) return;
    update((d) => d.push({ id: `col-${Date.now().toString(36)}`, name, slug: slugify(name), fields: [{ key: "name", label: "Name", type: "text" }], items: [] }));
    setSel(cols.length);
  };
  const c = cols[sel];

  return (
    <div style={overlay} onClick={onClose}>
      <div style={panel} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#111" }}>🗂 Collections (CMS)</h2>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#16a34a", fontWeight: 600 }}>{status}</span>
            <button onClick={save} style={primaryBtn}>Save</button>
            <button onClick={onClose} style={xBtn}>✕</button>
          </div>
        </div>
        <div style={{ display: "flex", gap: 14 }}>
          <div style={{ width: 160 }}>
            {cols.map((col, i) => (
              <button key={col.id} onClick={() => setSel(i)} style={{ ...sideBtn, background: i === sel ? "#efeaff" : "#f4f4f7", color: i === sel ? "#5b3fd6" : "#333" }}>{col.name}</button>
            ))}
            <button onClick={addCollection} style={{ ...sideBtn, background: "#7c5cff", color: "#fff", fontWeight: 700 }}>＋ Add collection</button>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            {!c ? <p style={{ color: "#999" }}>No collections. Add one →</p> : (
              <>
                <div style={{ fontSize: 11, color: "#999", marginBottom: 8 }}>Slug: <code>{c.slug}</code> · use block “Collection list” with this slug.</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#888", marginBottom: 6 }}>FIELDS</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                  {c.fields.map((f, fi) => (
                    <span key={fi} style={chip}>{f.label} <em style={{ color: "#999" }}>({f.type})</em>
                      {f.key !== "name" && <button onClick={() => update((d) => { d[sel].fields.splice(fi, 1); })} style={chipX}>×</button>}
                    </span>
                  ))}
                  <button onClick={() => { const label = prompt("Field name:"); if (!label) return; const type = (prompt(`Type: ${TYPES.join(", ")}`, "text") || "text") as FieldType; update((d) => d[sel].fields.push({ key: slugify(label).replace(/-/g, "_"), label, type: TYPES.includes(type) ? type : "text" })); }} style={chipAdd}>＋ Field</button>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#888", margin: "10px 0 6px" }}>ITEMS ({c.items.length})</div>
                <div style={{ display: "grid", gap: 10, maxHeight: 360, overflowY: "auto" }}>
                  {c.items.map((it, ii) => (
                    <div key={it.id} style={{ border: "1px solid #eee", borderRadius: 10, padding: 10, display: "grid", gap: 6 }}>
                      {c.fields.map((f) => (
                        <FieldInput key={f.key} field={f} value={it[f.key]} onChange={(v) => update((d) => { (d[sel].items[ii] as Item)[f.key] = v; if (f.key === c.fields[0].key) d[sel].items[ii].slug = slugify(String(v)); })} />
                      ))}
                      <button onClick={() => update((d) => { d[sel].items.splice(ii, 1); })} style={{ ...delBtn, justifySelf: "start" }}>Delete item</button>
                    </div>
                  ))}
                </div>
                <button onClick={() => update((d) => d[sel].items.push({ id: `it-${Math.random().toString(36).slice(2, 8)}`, slug: `item-${d[sel].items.length + 1}` }))} style={{ ...primaryBtn, marginTop: 10 }}>＋ Add item</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldInput({ field, value, onChange }: { field: Field; value: unknown; onChange: (v: unknown) => void }) {
  const v = value ?? "";
  if (field.type === "image") return <div><label style={lbl}>{field.label}</label><MediaField value={v as string} onChange={(x) => onChange(x)} accept="image/*" label={`Drop ${field.label}`} /></div>;
  if (field.type === "textarea") return <div><label style={lbl}>{field.label}</label><textarea value={v as string} onChange={(e) => onChange(e.target.value)} rows={2} style={{ ...inp, resize: "vertical" }} /></div>;
  if (field.type === "boolean") return <label style={{ display: "flex", gap: 6, fontSize: 13, alignItems: "center" }}><input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} /> {field.label}</label>;
  return <div><label style={lbl}>{field.label}</label><input type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"} value={v as string} onChange={(e) => onChange(field.type === "number" ? Number(e.target.value) : e.target.value)} style={inp} /></div>;
}

const overlay: React.CSSProperties = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 100000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 };
const panel: React.CSSProperties = { width: 760, maxWidth: "100%", maxHeight: "92vh", overflowY: "auto", background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 30px 80px rgba(0,0,0,0.4)" };
const sideBtn: React.CSSProperties = { display: "block", width: "100%", textAlign: "left", padding: "8px 10px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 6 };
const lbl: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: "#888", display: "block", marginBottom: 3 };
const inp: React.CSSProperties = { width: "100%", padding: "7px 9px", border: "1px solid #e2e2e8", borderRadius: 8, fontSize: 13, boxSizing: "border-box" };
const chip: React.CSSProperties = { background: "#f4f4f7", borderRadius: 7, padding: "4px 8px", fontSize: 12, display: "inline-flex", alignItems: "center", gap: 4 };
const chipX: React.CSSProperties = { border: "none", background: "transparent", color: "#c0392b", cursor: "pointer", fontWeight: 800 };
const chipAdd: React.CSSProperties = { background: "#eef0f4", border: "1px dashed #c9c9d4", borderRadius: 7, padding: "4px 8px", fontSize: 12, cursor: "pointer", fontWeight: 600 };
const primaryBtn: React.CSSProperties = { background: "#7c5cff", color: "#fff", border: "none", borderRadius: 9, padding: "8px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer" };
const delBtn: React.CSSProperties = { padding: "6px 10px", borderRadius: 7, border: "none", background: "#fde8e8", color: "#c0392b", fontSize: 12, fontWeight: 700, cursor: "pointer" };
const xBtn: React.CSSProperties = { background: "#f0f0f3", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 14 };
