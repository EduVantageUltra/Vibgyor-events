"use client";

import { useEffect, useState } from "react";

type Check = { category: string; label: string; status: "pass" | "warn" | "fail"; detail: string };
type Report = { path: string; score: number; passed: number; total: number; checks: Check[] };

export function AuditPanel({ path, pageTitle, onClose }: { path: string; pageTitle: string; onClose: () => void }) {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const run = () => {
    setLoading(true);
    fetch(`/api/audit?path=${encodeURIComponent(path)}`).then((r) => r.json()).then((d) => { setReport(d); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(() => { run(); /* eslint-disable-next-line */ }, [path]);

  const copy = () => {
    if (!report) return;
    const txt = `Audit for ${pageTitle} (${path}) — score ${report.score}/100\n\n` +
      report.checks.map((c) => `[${c.status.toUpperCase()}] ${c.category} — ${c.label}: ${c.detail}`).join("\n");
    navigator.clipboard.writeText(txt);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const cats = ["SEO", "Accessibility", "AI / GEO", "Performance"];
  const color = (s: string) => (s === "pass" ? "#16a34a" : s === "warn" ? "#d97706" : "#dc2626");
  const icon = (s: string) => (s === "pass" ? "✓" : s === "warn" ? "!" : "✕");
  const scoreColor = report ? (report.score >= 85 ? "#16a34a" : report.score >= 60 ? "#d97706" : "#dc2626") : "#888";

  return (
    <div style={overlay} onClick={onClose}>
      <div style={panel} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#111" }}>🔍 Page analysis — {pageTitle}</h2>
          <button onClick={onClose} style={xBtn}>✕</button>
        </div>

        {loading ? (
          <p style={{ color: "#888", padding: "30px 0", textAlign: "center" }}>Analysing {path}…</p>
        ) : !report ? (
          <p style={{ color: "#dc2626" }}>Could not analyse this page.</p>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", display: "grid", placeItems: "center", border: `5px solid ${scoreColor}`, fontSize: 22, fontWeight: 800, color: scoreColor }}>{report.score}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#111" }}>{report.passed}/{report.total} checks passed</div>
                <div style={{ fontSize: 12, color: "#777" }}>{report.score >= 85 ? "Excellent — ready to rank." : report.score >= 60 ? "Good — a few fixes will help." : "Needs work — see issues below."}</div>
                <button onClick={run} style={{ ...miniBtn, marginTop: 6 }}>↻ Re-run</button>
                <button onClick={copy} style={{ ...miniBtn, marginTop: 6, marginLeft: 6 }}>{copied ? "Copied ✓" : "Copy report"}</button>
              </div>
            </div>
            {cats.map((cat) => {
              const items = report.checks.filter((c) => c.category === cat);
              if (!items.length) return null;
              return (
                <div key={cat} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#5b3fd6", marginBottom: 6 }}>{cat}</div>
                  {items.map((c, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, padding: "6px 8px", fontSize: 13, alignItems: "flex-start" }}>
                      <span style={{ color: color(c.status), fontWeight: 800, width: 16 }}>{icon(c.status)}</span>
                      <span style={{ flex: 1, color: "#333" }}><b>{c.label}</b> — <span style={{ color: "#777" }}>{c.detail}</span></span>
                    </div>
                  ))}
                </div>
              );
            })}
            <p style={{ fontSize: 11, color: "#999", marginTop: 8 }}>💡 Tip: hit “Copy report” and paste it to me (Claude) for a deeper fix-it plan.</p>
          </>
        )}
      </div>
    </div>
  );
}

const overlay: React.CSSProperties = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 100000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 };
const panel: React.CSSProperties = { width: 600, maxWidth: "100%", maxHeight: "92vh", overflowY: "auto", background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 30px 80px rgba(0,0,0,0.4)" };
const miniBtn: React.CSSProperties = { padding: "5px 10px", borderRadius: 7, border: "1px solid #e2e2e8", background: "#eef0f4", fontSize: 12, fontWeight: 600, cursor: "pointer", color: "#333" };
const xBtn: React.CSSProperties = { background: "#f0f0f3", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 14 };
