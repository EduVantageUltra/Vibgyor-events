"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Puck, type Data } from "@measured/puck";
import { puckConfig } from "@/lib/puck/config";
import { starterFor } from "@/lib/puck/starter";
import { ThemePanel } from "@/components/editor/ThemePanel";
import { MarketingPanel } from "@/components/editor/MarketingPanel";
import { BackupPanel } from "@/components/editor/BackupPanel";
import { TemplatesPanel } from "@/components/editor/TemplatesPanel";
import { BlogManager } from "@/components/editor/BlogManager";
import { CollectionsManager } from "@/components/editor/CollectionsManager";
import { InboxPanel } from "@/components/editor/InboxPanel";
import { AuditPanel } from "@/components/editor/AuditPanel";
import { AnalyticsPanel } from "@/components/editor/AnalyticsPanel";
import { ABResultsPanel } from "@/components/editor/ABResultsPanel";
import { FreeCanvasEditor } from "@/components/freecanvas/FreeCanvasEditor";
import { PuckPreviewCtx } from "@/lib/puck/previewContext";

type Mode = "blocks" | "canvas";
type PageMeta = { slug: string; title: string; path: string; system?: boolean; editable?: boolean; mode?: Mode; inNav: boolean; order: number };

const EMPTY: Data = { content: [], root: {} } as Data;

export default function EditorPage() {
  const [pages, setPages] = useState<PageMeta[]>([]);
  const [slug, setSlug] = useState("home");
  const [mode, setMode] = useState<Mode>("blocks");
  const [data, setData] = useState<Data | null>(null);
  const [toast, setToast] = useState("");
  const [themeOpen, setThemeOpen] = useState(false);
  const [seoOpen, setSeoOpen] = useState(false);
  const [backupOpen, setBackupOpen] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [blogOpen, setBlogOpen] = useState(false);
  const [colsOpen, setColsOpen] = useState(false);
  const [inboxOpen, setInboxOpen] = useState(false);
  const [auditOpen, setAuditOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [abOpen, setAbOpen] = useState(false);
  const [blockPreview, setBlockPreview] = useState(false);
  const live = useRef<Data | null>(null);

  const current = pages.find((p) => p.slug === slug);
  const livePath = current?.path ?? (slug === "home" ? "/" : `/${slug}`);
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(""), 3500); };

  const loadPages = useCallback(async () => {
    const list: PageMeta[] = await (await fetch("/api/pages")).json();
    setPages(list.filter((p) => p.editable !== false));
    return list;
  }, []);

  const loadData = useCallback(async (s: string) => {
    setData(null);
    const d: Data = await (await fetch(`/api/editor?page=${s}`)).json();
    const has = Array.isArray(d?.content) && d.content.length > 0;
    setData(has ? d : starterFor(s));
  }, []);

  useEffect(() => {
    loadPages().then((list) => {
      const home = list.find((p) => p.slug === "home");
      setMode(home?.mode ?? "blocks");
      loadData("home");
    });
  }, [loadPages, loadData]);

  const saveBlocks = async (d: Data, makeLive: boolean, target = slug) => {
    await fetch("/api/editor", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ page: target, data: makeLive ? d : EMPTY }) });
  };

  const switchTo = async (s: string) => {
    if (s === slug) return;
    if (mode === "blocks" && live.current) await saveBlocks(live.current, true);
    const p = pages.find((x) => x.slug === s);
    setSlug(s);
    setMode(p?.mode ?? "blocks");
    loadData(s);
  };

  const previewDraft = async () => {
    const d = live.current ?? data;
    await fetch("/api/draft", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ page: slug, data: d }) });
    window.open(`/preview/${slug}`, "_blank");
  };

  const switchMode = async (m: Mode) => {
    if (m === mode) return;
    await fetch("/api/pages", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug, mode: m }) });
    setMode(m);
    await loadPages();
    flash(m === "canvas" ? "Free-canvas mode — drag anything anywhere ✦" : "Block mode");
  };

  const newPage = async () => {
    const title = prompt("New page name (e.g. Real Weddings, Packages, Venues, FAQ):");
    if (!title?.trim()) return;
    const created: PageMeta = await (await fetch("/api/pages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title }) })).json();
    await loadPages();
    setSlug(created.slug);
    setMode("blocks");
    setData(EMPTY);
    live.current = null;
    flash(`Page “${created.title}” created — design it & Publish`);
  };

  const renamePage = async () => {
    if (!current) return;
    const title = prompt("Rename page:", current.title);
    if (!title?.trim()) return;
    await fetch("/api/pages", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug, title }) });
    await loadPages();
    flash("Renamed ✓");
  };

  const deletePage = async () => {
    if (!current || current.system) return;
    if (!confirm(`Delete page “${current.title}”? This cannot be undone.`)) return;
    await fetch("/api/pages", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug }) });
    await loadPages();
    setSlug("home"); setMode("blocks"); loadData("home");
    flash("Page deleted ✓");
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#0b0b12" }}>
      {themeOpen && <ThemePanel onClose={() => setThemeOpen(false)} />}
      {seoOpen && <MarketingPanel slug={slug} pageTitle={current?.title ?? slug} onClose={() => setSeoOpen(false)} />}
      {backupOpen && <BackupPanel slug={slug} onClose={() => setBackupOpen(false)} />}
      {templatesOpen && <TemplatesPanel slug={slug} pageTitle={current?.title ?? slug} onClose={() => setTemplatesOpen(false)} />}
      {blogOpen && <BlogManager onClose={() => setBlogOpen(false)} />}
      {colsOpen && <CollectionsManager onClose={() => setColsOpen(false)} />}
      {inboxOpen && <InboxPanel onClose={() => setInboxOpen(false)} />}
      {auditOpen && <AuditPanel path={livePath} pageTitle={current?.title ?? slug} onClose={() => setAuditOpen(false)} />}
      {abOpen && <ABResultsPanel onClose={() => setAbOpen(false)} />}
      {analyticsOpen && <AnalyticsPanel onClose={() => setAnalyticsOpen(false)} />}
      {toast && <div style={toastStyle}>{toast}</div>}

      {/* Persistent top bar — works in both modes */}
      <div style={topBar}>
        <strong style={{ fontSize: 13, color: "#fff" }}>📄</strong>
        <select value={slug} onChange={(e) => switchTo(e.target.value)} style={selStyle}>
          {pages.map((p) => <option key={p.slug} value={p.slug}>{p.title}</option>)}
        </select>
        <button onClick={newPage} style={pill("#7c5cff", "#fff")}>＋ New page</button>
        <button onClick={renamePage} style={pill("#1c1c28", "#ddd")}>Rename</button>
        <button onClick={deletePage} disabled={current?.system} style={{ ...pill("#1c1c28", "#ddd"), opacity: current?.system ? 0.4 : 1, cursor: current?.system ? "not-allowed" : "pointer" }}>Delete</button>
        <button onClick={() => setTemplatesOpen(true)} style={pill("#1c1c28", "#ddd")}>🧩 Templates</button>
        <button onClick={() => setThemeOpen(true)} style={pill("#1c1c28", "#ddd")}>🎨 Design</button>
        <button onClick={() => setBlogOpen(true)} style={pill("#1c1c28", "#ddd")}>📝 Blog</button>
        <button onClick={() => setColsOpen(true)} style={pill("#1c1c28", "#ddd")}>🗂 CMS</button>
        <button onClick={() => setInboxOpen(true)} style={pill("#1c1c28", "#ddd")}>📥 Inbox</button>
        <button onClick={() => setSeoOpen(true)} style={pill("#1c1c28", "#ddd")}>📈 SEO</button>
        <button onClick={() => setAuditOpen(true)} style={pill("#7c5cff", "#fff")}>🔍 Analyze</button>
        <button onClick={() => setAbOpen(true)} style={pill("#1c1c28", "#ddd")}>🧪 A/B</button>
        <button onClick={() => setAnalyticsOpen(true)} style={pill("#1c1c28", "#ddd")}>📊 Stats</button>
        <button onClick={() => setBackupOpen(true)} style={pill("#1c1c28", "#ddd")}>💾 Backup</button>

        <div style={{ display: "flex", background: "#1c1c28", borderRadius: 9, padding: 3, marginLeft: 6 }}>
          <button onClick={() => switchMode("blocks")} style={modeTab(mode === "blocks")}>▦ Blocks</button>
          <button onClick={() => switchMode("canvas")} style={modeTab(mode === "canvas")}>✦ Free canvas</button>
        </div>

        {mode === "blocks" && (
          <button onClick={() => setBlockPreview((p) => !p)} style={pill(blockPreview ? "#111" : "#1c1c28", "#fff")}>
            {blockPreview ? "⏸ Stop preview" : "▶ Preview animations"}
          </button>
        )}
        {mode === "blocks" && (
          <button onClick={previewDraft} style={pill("#1c1c28", "#ddd")}>👁 Preview draft ↗</button>
        )}

        <a href={livePath} target="_blank" rel="noreferrer" style={{ ...pill("#1c1c28", "#ddd"), marginLeft: "auto", textDecoration: "none" }}>View live ↗</a>
      </div>

      {/* Editor body */}
      <div style={{ flex: 1, minHeight: 0, position: "relative", background: "#fff" }}>
        {mode === "canvas" ? (
          <FreeCanvasEditor key={slug} slug={slug} title={current?.title ?? slug} />
        ) : !data ? (
          <div style={{ display: "grid", placeItems: "center", height: "100%", color: "#333" }}>Loading…</div>
        ) : (
          <PuckPreviewCtx.Provider value={blockPreview}>
          <Puck
            key={slug}
            config={puckConfig}
            data={data}
            iframe={{ enabled: false }}
            onChange={(d) => (live.current = d)}
            onPublish={async (d) => { await saveBlocks(d, true); flash(slug === "home" ? "Published — homepage live ✓" : "Published ✓"); }}
            headerTitle={`Editing: ${current?.title ?? slug}`}
            overrides={{
              headerActions: ({ children }) => (
                <>
                  {(slug === "home" || current?.system) && (
                    <button onClick={() => { if (confirm("Revert this page to its built-in default design?")) { saveBlocks(EMPTY, false); setData(starterFor(slug)); live.current = null; flash("Reverted to default ✓"); } }} style={hdrBtn}>Reset</button>
                  )}
                  {children}
                </>
              ),
            }}
          />
          </PuckPreviewCtx.Provider>
        )}
      </div>
    </div>
  );
}

const topBar: React.CSSProperties = { display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "#0b0b12", borderBottom: "1px solid #23232e", flexWrap: "wrap" };
const selStyle: React.CSSProperties = { background: "#16161f", color: "#fff", border: "1px solid #2c2c3a", borderRadius: 8, padding: "7px 10px", fontSize: 13, fontWeight: 600, minWidth: 150 };
const toastStyle: React.CSSProperties = { position: "fixed", top: 60, left: "50%", transform: "translateX(-50%)", zIndex: 100001, background: "#111", color: "#fff", padding: "10px 18px", borderRadius: 99, fontSize: 13, boxShadow: "0 10px 40px rgba(0,0,0,0.4)" };
function pill(bg: string, color: string): React.CSSProperties {
  return { background: bg, color, border: "none", borderRadius: 8, padding: "7px 12px", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" };
}
function modeTab(on: boolean): React.CSSProperties {
  return { background: on ? "#7c5cff" : "transparent", color: on ? "#fff" : "#aaa", border: "none", borderRadius: 7, padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" };
}
const hdrBtn: React.CSSProperties = { padding: "8px 14px", borderRadius: 8, border: "1px solid #e2e2e8", background: "#fff", color: "#444", fontSize: 13, fontWeight: 600, cursor: "pointer" };
