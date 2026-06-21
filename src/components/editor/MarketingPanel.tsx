"use client";

import { useEffect, useState } from "react";
import type { SiteSettings } from "@/lib/settings";

type Seo = { title?: string; description?: string; ogImage?: string; keywords?: string };

export function MarketingPanel({ slug, pageTitle, onClose }: { slug: string; pageTitle: string; onClose: () => void }) {
  const [tab, setTab] = useState<"seo" | "marketing">("seo");
  const [seo, setSeo] = useState<Seo>({});
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("/api/pages").then((r) => r.json()).then((list) => setSeo(list.find((p: { slug: string }) => p.slug === slug)?.seo ?? {}));
    fetch("/api/settings").then((r) => r.json()).then(setSettings);
  }, [slug]);

  const flash = (m: string) => { setStatus(m); setTimeout(() => setStatus(""), 2500); };

  const saveSeo = async () => {
    await fetch("/api/pages", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug, seo }) });
    flash("SEO saved ✓");
  };
  const saveSettings = async () => {
    await fetch("/api/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
    flash("Settings saved ✓");
  };

  const setP = (k: keyof NonNullable<SiteSettings["popup"]>, v: unknown) =>
    setSettings((s) => (s ? { ...s, popup: { ...s.popup!, [k]: v } } : s));
  const setI = (k: keyof NonNullable<SiteSettings["intro"]>, v: unknown) =>
    setSettings((s) => (s ? { ...s, intro: { ...s.intro!, [k]: v } } : s));

  return (
    <div style={overlay} onClick={onClose}>
      <div style={panel} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setTab("seo")} style={tab === "seo" ? tabOn : tabOff}>🔍 SEO</button>
            <button onClick={() => setTab("marketing")} style={tab === "marketing" ? tabOn : tabOff}>📣 Marketing</button>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "#16a34a", fontWeight: 600 }}>{status}</span>
            <button onClick={onClose} style={xBtn}>✕</button>
          </div>
        </div>

        {tab === "seo" ? (
          <div style={{ display: "grid", gap: 10 }}>
            <p style={{ fontSize: 12, color: "#777", margin: 0 }}>SEO for page: <b>{pageTitle}</b></p>
            <L label="Meta title"><input style={inp} value={seo.title ?? ""} onChange={(e) => setSeo({ ...seo, title: e.target.value })} placeholder="Page title for Google" /></L>
            <L label="Meta description"><textarea rows={3} style={{ ...inp, resize: "vertical" }} value={seo.description ?? ""} onChange={(e) => setSeo({ ...seo, description: e.target.value })} placeholder="155-char summary" /></L>
            <L label="Keywords (comma separated)"><input style={inp} value={seo.keywords ?? ""} onChange={(e) => setSeo({ ...seo, keywords: e.target.value })} /></L>
            <L label="Social share image URL"><input style={inp} value={seo.ogImage ?? ""} onChange={(e) => setSeo({ ...seo, ogImage: e.target.value })} placeholder="/products/...jpg" /></L>
            <button onClick={saveSeo} style={primaryBtn}>Save SEO</button>
          </div>
        ) : settings ? (
          <div style={{ display: "grid", gap: 10 }}>
            <L label="Google Analytics ID"><input style={inp} value={settings.gaId ?? ""} onChange={(e) => setSettings({ ...settings, gaId: e.target.value })} placeholder="G-XXXXXXX" /></L>
            <L label="Meta Pixel ID"><input style={inp} value={settings.metaPixel ?? ""} onChange={(e) => setSettings({ ...settings, metaPixel: e.target.value })} placeholder="1234567890" /></L>
            <hr style={{ border: "none", borderTop: "1px solid #eee" }} />
            <div style={{ fontSize: 13, fontWeight: 700, color: "#5b3fd6" }}>🎁 Promo popup</div>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
              <input type="checkbox" checked={!!settings.popup?.enabled} onChange={(e) => setP("enabled", e.target.checked)} /> Show popup on the site
            </label>
            <L label="Heading"><input style={inp} value={settings.popup?.heading ?? ""} onChange={(e) => setP("heading", e.target.value)} /></L>
            <L label="Body"><input style={inp} value={settings.popup?.body ?? ""} onChange={(e) => setP("body", e.target.value)} /></L>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <L label="Button text"><input style={inp} value={settings.popup?.ctaLabel ?? ""} onChange={(e) => setP("ctaLabel", e.target.value)} /></L>
              <L label="Button link"><input style={inp} value={settings.popup?.ctaHref ?? ""} onChange={(e) => setP("ctaHref", e.target.value)} /></L>
            </div>
            <L label="Show after (seconds)"><input type="number" style={inp} value={settings.popup?.delaySec ?? 5} onChange={(e) => setP("delaySec", Number(e.target.value))} /></L>
            <hr style={{ border: "none", borderTop: "1px solid #eee" }} />
            <div style={{ fontSize: 13, fontWeight: 700, color: "#5b3fd6" }}>✨ Page-load intro (reveal animation)</div>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
              <input type="checkbox" checked={!!settings.intro?.enabled} onChange={(e) => setI("enabled", e.target.checked)} /> Show intro when the site opens
            </label>
            <L label="Style">
              <select style={inp} value={settings.intro?.style ?? "curtain"} onChange={(e) => setI("style", e.target.value)}>
                <option value="curtain">Curtain split</option>
                <option value="sweep">Colour sweep</option>
                <option value="logo">Logo zoom</option>
                <option value="bars">Colour bars</option>
                <option value="counter">Loading counter</option>
              </select>
            </L>
            <L label="Brand text"><input style={inp} value={settings.intro?.brandText ?? ""} onChange={(e) => setI("brandText", e.target.value)} /></L>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <L label="Colour 1"><input type="color" style={{ ...inp, height: 38 }} value={settings.intro?.color1 ?? "#7c5cff"} onChange={(e) => setI("color1", e.target.value)} /></L>
              <L label="Colour 2"><input type="color" style={{ ...inp, height: 38 }} value={settings.intro?.color2 ?? "#39e6ff"} onChange={(e) => setI("color2", e.target.value)} /></L>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
              <input type="checkbox" checked={!!settings.intro?.everyVisit} onChange={(e) => setI("everyVisit", e.target.checked)} /> Show every visit (off = once per session)
            </label>
            <button onClick={saveSettings} style={primaryBtn}>Save marketing</button>
          </div>
        ) : <p>Loading…</p>}
      </div>
    </div>
  );
}

function L({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label style={{ fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase", display: "block", marginBottom: 4 }}>{label}</label>{children}</div>;
}

const overlay: React.CSSProperties = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 100000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 };
const panel: React.CSSProperties = { width: 540, maxWidth: "100%", maxHeight: "92vh", overflowY: "auto", background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 30px 80px rgba(0,0,0,0.4)" };
const inp: React.CSSProperties = { width: "100%", padding: "8px 10px", border: "1px solid #e2e2e8", borderRadius: 8, fontSize: 13, boxSizing: "border-box" };
const primaryBtn: React.CSSProperties = { background: "#7c5cff", color: "#fff", border: "none", borderRadius: 9, padding: "10px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer" };
const tabOn: React.CSSProperties = { padding: "7px 14px", borderRadius: 8, border: "none", background: "#7c5cff", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" };
const tabOff: React.CSSProperties = { ...tabOn, background: "#eef0f4", color: "#333" };
const xBtn: React.CSSProperties = { background: "#f0f0f3", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 14 };
