"use client";

import { useEffect, useState } from "react";

type Coupon = { code: string; type: "percent" | "flat"; value: number; minOrder: number; active: boolean };

export function CouponsManager({ onClose }: { onClose: () => void }) {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [status, setStatus] = useState("");
  useEffect(() => { fetch("/api/coupons").then((r) => r.json()).then((d) => Array.isArray(d) && setCoupons(d)); }, []);

  const save = async (list: Coupon[]) => {
    setCoupons(list);
    await fetch("/api/coupons", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(list) });
    setStatus("Saved ✓"); setTimeout(() => setStatus(""), 2000);
  };
  const upd = (i: number, patch: Partial<Coupon>) => save(coupons.map((c, k) => (k === i ? { ...c, ...patch } : c)));

  return (
    <div style={overlay} onClick={onClose}>
      <div style={panel} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#111" }}>🎟 Coupons</h2>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#16a34a", fontWeight: 600 }}>{status}</span>
            <button onClick={() => save([...coupons, { code: "NEW10", type: "percent", value: 10, minOrder: 0, active: true }])} style={primaryBtn}>＋ Add</button>
            <button onClick={onClose} style={xBtn}>✕</button>
          </div>
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          {coupons.map((c, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 0.8fr 1fr auto auto", gap: 6, alignItems: "center", border: "1px solid #eee", borderRadius: 10, padding: 8 }}>
              <input value={c.code} onChange={(e) => upd(i, { code: e.target.value.toUpperCase() })} style={inp} placeholder="CODE" />
              <select value={c.type} onChange={(e) => upd(i, { type: e.target.value as "percent" | "flat" })} style={inp}>
                <option value="percent">% off</option>
                <option value="flat">₹ off</option>
              </select>
              <input type="number" value={c.value} onChange={(e) => upd(i, { value: Number(e.target.value) })} style={inp} title="value" />
              <input type="number" value={c.minOrder} onChange={(e) => upd(i, { minOrder: Number(e.target.value) })} style={inp} title="min order ₹" placeholder="min ₹" />
              <label style={{ fontSize: 12, display: "flex", gap: 4, alignItems: "center" }}><input type="checkbox" checked={c.active} onChange={(e) => upd(i, { active: e.target.checked })} /> on</label>
              <button onClick={() => save(coupons.filter((_, k) => k !== i))} style={delBtn}>✕</button>
            </div>
          ))}
          {coupons.length === 0 && <p style={{ color: "#999", fontSize: 13 }}>No coupons. Add one.</p>}
        </div>
        <p style={{ fontSize: 11, color: "#999", marginTop: 12 }}>Columns: code · type · value · minimum order ₹ · active. Customers enter the code at checkout.</p>
      </div>
    </div>
  );
}

const overlay: React.CSSProperties = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 100000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 };
const panel: React.CSSProperties = { width: 620, maxWidth: "100%", maxHeight: "92vh", overflowY: "auto", background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 30px 80px rgba(0,0,0,0.4)" };
const inp: React.CSSProperties = { width: "100%", padding: "7px 9px", border: "1px solid #e2e2e8", borderRadius: 8, fontSize: 13, boxSizing: "border-box" };
const primaryBtn: React.CSSProperties = { background: "#7c5cff", color: "#fff", border: "none", borderRadius: 9, padding: "8px 14px", fontSize: 13, fontWeight: 700, cursor: "pointer" };
const delBtn: React.CSSProperties = { padding: "6px 9px", borderRadius: 7, border: "none", background: "#fde8e8", color: "#c0392b", fontSize: 12, fontWeight: 700, cursor: "pointer" };
const xBtn: React.CSSProperties = { background: "#f0f0f3", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 14 };
