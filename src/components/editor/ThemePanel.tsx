"use client";

import { useEffect, useState } from "react";

type Theme = {
  ink: string; ink2: string; fog: string; fogDim: string;
  iris: string; violet: string; cyan: string; amber: string; rose: string;
  customCss?: string;
  design?: string;
};

const DESIGNS = [
  { id: "aurora", name: "Aurora (default)" },
  { id: "minimal", name: "Minimal" },
  { id: "luxury", name: "Luxury Serif" },
  { id: "bold", name: "Bold" },
  { id: "playful", name: "Playful" },
  { id: "editorial", name: "Editorial" },
];

type ColorKey = "ink" | "ink2" | "fog" | "fogDim" | "iris" | "violet" | "cyan" | "amber" | "rose";
const cssVar: Record<ColorKey, string> = {
  ink: "--color-ink", ink2: "--color-ink-2", fog: "--color-fog", fogDim: "--color-fog-dim",
  iris: "--color-iris", violet: "--color-violet", cyan: "--color-cyan", amber: "--color-amber", rose: "--color-rose",
};

const fields: { key: ColorKey; label: string; hint: string }[] = [
  { key: "ink", label: "Page background", hint: "Main dark background" },
  { key: "ink2", label: "Panel background", hint: "Cards / drawers" },
  { key: "fog", label: "Text", hint: "Main text colour" },
  { key: "fogDim", label: "Muted text", hint: "Secondary text" },
  { key: "violet", label: "Primary accent", hint: "Buttons / gradients" },
  { key: "iris", label: "Accent (light)", hint: "Gradient start" },
  { key: "cyan", label: "Accent 2", hint: "Gradient middle" },
  { key: "amber", label: "Accent 3", hint: "Gradient end / highlights" },
  { key: "rose", label: "Sale / pink", hint: "Discount badges" },
];

function applyLive(theme: Theme) {
  const root = document.documentElement;
  (Object.keys(cssVar) as ColorKey[]).forEach((k) => {
    root.style.setProperty(cssVar[k], theme[k]);
  });
  root.style.setProperty("--background", theme.ink);
}

export function ThemePanel({ onClose }: { onClose: () => void }) {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [status, setStatus] = useState("");
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/theme").then((r) => r.json()).then(setTheme);
  }, []);

  const copyFromUrl = async () => {
    if (!url.trim()) return;
    setBusy(true);
    setStatus("Reading website…");
    try {
      const res = await fetch(`/api/extract-style?url=${encodeURIComponent(url.trim())}`);
      const data = await res.json();
      if (data.theme) {
        setTheme(data.theme);
        applyLive(data.theme);
        setStatus(`Colours copied from ${data.source} ✓ — review & Save`);
      } else {
        setStatus(data.message || "Couldn't read colours from that site.");
      }
    } catch {
      setStatus("Couldn't reach that website.");
    } finally {
      setBusy(false);
      setTimeout(() => setStatus(""), 4000);
    }
  };

  const update = (key: keyof Theme, value: string) => {
    if (!theme) return;
    const next = { ...theme, [key]: value };
    setTheme(next);
    applyLive(next);
  };

  const save = async () => {
    if (!theme) return;
    setStatus("Saving…");
    await fetch("/api/theme", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme }),
    });
    setStatus("Saved ✓ — live on the site");
    setTimeout(() => setStatus(""), 2500);
  };

  const reset = async () => {
    setStatus("Resetting…");
    const res = await fetch("/api/theme", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reset: true }),
    });
    const def: Theme = await res.json();
    setTheme(def);
    applyLive(def);
    setStatus("Reset to default ✓");
    setTimeout(() => setStatus(""), 2500);
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={panel} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#111" }}>🎨 Site colours</h2>
          <button onClick={onClose} style={xBtn}>✕</button>
        </div>
        <p style={{ margin: "0 0 12px", fontSize: 12, color: "#777" }}>
          Change a colour and it updates the whole site instantly. Hit “Save” to make it permanent (and it ships on git push).
        </p>

        <div style={{ background: "#f6f5ff", border: "1px solid #e6e0ff", borderRadius: 12, padding: 12, marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#5b3fd6", marginBottom: 6 }}>🎨 Design preset (fonts + style)</div>
          <select
            value={theme?.design ?? "aurora"}
            onChange={(e) => theme && setTheme({ ...theme, design: e.target.value })}
            style={{ width: "100%", padding: "8px 10px", border: "1px solid #d8d2f5", borderRadius: 8, fontSize: 13 }}
          >
            {DESIGNS.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <p style={{ fontSize: 11, color: "#999", margin: "6px 0 0" }}>Changes the whole site&apos;s fonts & corner style. Save to apply everywhere.</p>
        </div>

        <div style={{ background: "#f6f5ff", border: "1px solid #e6e0ff", borderRadius: 12, padding: 12, marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#5b3fd6", marginBottom: 6 }}>🎯 Copy colours from a website</div>
          <div style={{ display: "flex", gap: 6 }}>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="paste any website link…"
              style={{ flex: 1, padding: "8px 10px", border: "1px solid #d8d2f5", borderRadius: 8, fontSize: 12 }}
            />
            <button onClick={copyFromUrl} disabled={busy} style={{ ...saveBtn, padding: "8px 14px", opacity: busy ? 0.6 : 1 }}>
              {busy ? "…" : "Copy"}
            </button>
          </div>
          <p style={{ fontSize: 11, color: "#999", margin: "6px 0 0" }}>Extracts the site&apos;s colour palette into your theme.</p>
        </div>

        {!theme ? (
          <p style={{ color: "#888" }}>Loading…</p>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {fields.map((f) => (
              <div key={f.key} style={row}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#222" }}>{f.label}</div>
                  <div style={{ fontSize: 11, color: "#999" }}>{f.hint}</div>
                </div>
                <input
                  type="color"
                  value={theme[f.key]}
                  onChange={(e) => update(f.key, e.target.value)}
                  style={swatch}
                />
                <input
                  type="text"
                  value={theme[f.key]}
                  onChange={(e) => update(f.key, e.target.value)}
                  style={hexInput}
                />
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#555", marginBottom: 6 }}>⚙️ Custom CSS (advanced)</div>
          <textarea
            value={theme?.customCss ?? ""}
            onChange={(e) => theme && setTheme({ ...theme, customCss: e.target.value })}
            placeholder=".my-class { color: red; }"
            rows={4}
            style={{ width: "100%", padding: "8px 10px", border: "1px solid #e2e2e8", borderRadius: 8, fontSize: 12, fontFamily: "monospace", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16 }}>
          <button onClick={save} style={saveBtn}>Save all</button>
          <button onClick={reset} style={resetBtn}>Reset default</button>
          <span style={{ fontSize: 12, color: "#16a34a", fontWeight: 600 }}>{status}</span>
        </div>
      </div>
    </div>
  );
}

const overlay: React.CSSProperties = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100000,
  display: "flex", alignItems: "flex-start", justifyContent: "flex-end", padding: 16,
};
const panel: React.CSSProperties = {
  width: 380, maxWidth: "100%", maxHeight: "92vh", overflowY: "auto", background: "#fff",
  borderRadius: 16, padding: 20, boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
};
const row: React.CSSProperties = { display: "flex", alignItems: "center", gap: 10 };
const swatch: React.CSSProperties = { width: 38, height: 32, border: "1px solid #ddd", borderRadius: 8, background: "none", cursor: "pointer" };
const hexInput: React.CSSProperties = { width: 84, padding: "6px 8px", border: "1px solid #e2e2e8", borderRadius: 8, fontSize: 12, fontFamily: "monospace" };
const saveBtn: React.CSSProperties = { background: "#7c5cff", color: "#fff", border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 14, fontWeight: 700, cursor: "pointer" };
const resetBtn: React.CSSProperties = { background: "#eef0f4", color: "#333", border: "none", borderRadius: 10, padding: "10px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" };
const xBtn: React.CSSProperties = { background: "#f0f0f3", border: "none", borderRadius: 8, width: 30, height: 30, cursor: "pointer", fontSize: 14 };
