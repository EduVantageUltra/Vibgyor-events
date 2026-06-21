"use client";

import { useEffect, useState } from "react";
import type { Analytics, Abandoned } from "@/lib/analytics";

export function AnalyticsPanel({ onClose }: { onClose: () => void }) {
  const [a, setA] = useState<Analytics | null>(null);
  const [ab, setAb] = useState<Abandoned[]>([]);
  useEffect(() => {
    fetch("/api/track").then((r) => r.json()).then((d) => d && d.paths && setA(d)).catch(() => {});
    fetch("/api/abandoned").then((r) => r.json()).then((d) => Array.isArray(d) && setAb(d)).catch(() => {});
  }, []);

  const topPaths = a ? Object.entries(a.paths).sort((x, y) => y[1] - x[1]).slice(0, 8) : [];
  const days = a ? Object.entries(a.days).sort((x, y) => (x[0] < y[0] ? 1 : -1)).slice(0, 7) : [];
  const maxDay = Math.max(1, ...days.map((d) => d[1]));

  return (
    <div style={overlay} onClick={onClose}>
      <div style={panel} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#111" }}>📊 Analytics</h2>
          <button onClick={onClose} style={xBtn}>✕</button>
        </div>
        {!a ? <p style={{ color: "#888" }}>Loading…</p> : (
          <>
            <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
              <Stat label="Total views" value={a.total} />
              <Stat label="Pages tracked" value={Object.keys(a.paths).length} />
              <Stat label="Abandoned carts" value={ab.length} />
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#5b3fd6", marginBottom: 6 }}>Last 7 days</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80, marginBottom: 16 }}>
              {days.length === 0 ? <span style={{ fontSize: 12, color: "#999" }}>No data yet</span> : days.reverse().map(([d, n]) => (
                <div key={d} style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ height: `${(n / maxDay) * 64}px`, background: "linear-gradient(#7c5cff,#39e6ff)", borderRadius: 4 }} />
                  <div style={{ fontSize: 9, color: "#999", marginTop: 3 }}>{d.slice(5)}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#5b3fd6", marginBottom: 6 }}>Top pages</div>
            <div style={{ display: "grid", gap: 4, marginBottom: 16 }}>
              {topPaths.map(([p, n]) => (
                <div key={p} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 8px", background: "#f7f7fa", borderRadius: 6 }}>
                  <span style={{ color: "#333" }}>{p}</span><b>{n}</b>
                </div>
              ))}
            </div>
            {ab.length > 0 && (
              <>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#5b3fd6", marginBottom: 6 }}>Abandoned carts — follow up!</div>
                <div style={{ display: "grid", gap: 4 }}>
                  {ab.slice(0, 6).map((x) => (
                    <div key={x.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, padding: "6px 8px", background: "#fff7ed", borderRadius: 6 }}>
                      <span>₹{x.total} · {x.items}</span>
                      <a href={`https://wa.me/${x.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer" style={{ color: "#25D366", fontWeight: 700, textDecoration: "none" }}>WhatsApp {x.phone}</a>
                    </div>
                  ))}
                </div>
              </>
            )}
            <p style={{ fontSize: 11, color: "#999", marginTop: 12 }}>First-party analytics (no cookies). On the deployed site this needs a database — ask to wire one for go-live.</p>
          </>
        )}
      </div>
    </div>
  );
}

const Stat = ({ label, value }: { label: string; value: number }) => (
  <div style={{ flex: 1, background: "#f7f7fa", borderRadius: 12, padding: 14, textAlign: "center" }}>
    <div style={{ fontSize: 26, fontWeight: 800, color: "#111" }}>{value.toLocaleString("en-IN")}</div>
    <div style={{ fontSize: 11, color: "#888" }}>{label}</div>
  </div>
);
const overlay: React.CSSProperties = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 100000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 };
const panel: React.CSSProperties = { width: 560, maxWidth: "100%", maxHeight: "92vh", overflowY: "auto", background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 30px 80px rgba(0,0,0,0.4)" };
const xBtn: React.CSSProperties = { background: "#f0f0f3", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 14 };
