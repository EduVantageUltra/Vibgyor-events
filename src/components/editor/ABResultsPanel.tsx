"use client";

import { useEffect, useState } from "react";
import type { AbStore } from "@/lib/ab";

export function ABResultsPanel({ onClose }: { onClose: () => void }) {
  const [data, setData] = useState<AbStore>({});
  useEffect(() => { fetch("/api/ab").then((r) => r.json()).then((d) => d && typeof d === "object" && setData(d)).catch(() => {}); }, []);

  const rate = (s: { views: number; conv: number }) => (s.views ? Math.round((s.conv / s.views) * 100) : 0);
  const ids = Object.keys(data);

  return (
    <div style={overlay} onClick={onClose}>
      <div style={panel} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#111" }}>🧪 A/B test results</h2>
          <button onClick={onClose} style={xBtn}>✕</button>
        </div>
        <p style={{ fontSize: 12, color: "#777", margin: "0 0 14px" }}>Add an “A/B test” block to a page (Widgets), give it an experiment id, and results appear here.</p>
        {ids.length === 0 ? <p style={{ color: "#999", fontSize: 13 }}>No data yet.</p> : ids.map((id) => {
          const e = data[id];
          const ra = rate(e.a), rb = rate(e.b);
          const winner = e.a.views > 5 && e.b.views > 5 ? (ra > rb ? "A" : rb > ra ? "B" : "tie") : null;
          return (
            <div key={id} style={{ border: "1px solid #eee", borderRadius: 12, padding: 14, marginBottom: 10 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#111", marginBottom: 8 }}>{id} {winner && winner !== "tie" && <span style={{ color: "#16a34a" }}>· Variant {winner} winning 🏆</span>}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {(["a", "b"] as const).map((v) => (
                  <div key={v} style={{ background: winner === v.toUpperCase() ? "#f0fff4" : "#f7f7fa", borderRadius: 10, padding: 10 }}>
                    <div style={{ fontWeight: 700, color: "#5b3fd6" }}>Variant {v.toUpperCase()}</div>
                    <div style={{ fontSize: 13, color: "#333" }}>{e[v].views} views · {e[v].conv} clicks</div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#111" }}>{rate(e[v])}%<span style={{ fontSize: 11, fontWeight: 400, color: "#888" }}> conversion</span></div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const overlay: React.CSSProperties = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 100000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 };
const panel: React.CSSProperties = { width: 560, maxWidth: "100%", maxHeight: "92vh", overflowY: "auto", background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 30px 80px rgba(0,0,0,0.4)" };
const xBtn: React.CSSProperties = { background: "#f0f0f3", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 14 };
