"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CanvasDoc, CanvasElement, ElKind, Box, SectionPreset } from "@/lib/freecanvas";
import { emptyCanvas } from "@/lib/freecanvas";
import { ElementView, elementFx } from "./ElementView";
import { AnimatedWrap } from "./AnimatedWrap";
import { ANIM_GROUPS, LOOP_PRESETS, HOVER_PRESETS } from "./animations";
import { GOOGLE_FONTS, googleFontsHref } from "./fonts";
import { presetSize, presetDefaults } from "./sectionPresets";
import { MediaField } from "@/lib/puck/MediaField";
import type { ElementAnim } from "@/lib/freecanvas";

type Device = "desktop" | "mobile";
const HANDLES = ["nw", "n", "ne", "e", "se", "s", "sw", "w"] as const;
type Handle = (typeof HANDLES)[number];

let idc = 0;
const newId = () => `el-${Date.now().toString(36)}-${idc++}`;

function snap(n: number) {
  return Math.round(n / 5) * 5;
}

type SimpleKind = Exclude<ElKind, "section">;

function defaultEl(kind: SimpleKind, doc: CanvasDoc): CanvasElement {
  const base = { x: 80, y: 80, w: 420, h: 80 };
  const presets: Record<Exclude<ElKind, "section">, Partial<CanvasElement> & { box: Box }> = {
    heading: { text: "Your heading", fontSize: 52, fontWeight: 800, fontFamily: "display", align: "left", box: { ...base, h: 70 } },
    text: { text: "Write something here. Click to edit.", fontSize: 18, fontWeight: 400, fontFamily: "sans", align: "left", box: { ...base, h: 60 } },
    button: { text: "Shop now", href: "/shop", fontSize: 15, fontWeight: 700, fontFamily: "display", radius: 999, box: { x: 80, y: 80, w: 170, h: 50 } },
    image: { src: "/products/phone-ultra.jpg", radius: 16, box: { x: 80, y: 80, w: 420, h: 300 } },
    video: { src: "", poster: "/products/phone-aurora.jpg", radius: 16, muted: true, loop: true, playbackRate: 1, box: { x: 80, y: 80, w: 480, h: 270 } },
    box: { bg: "#7c5cff", radius: 16, box: { x: 80, y: 80, w: 320, h: 200 } },
  };
  const p = presets[kind];
  const d = p.box;
  const mob: Box = { x: 20, y: d.y, w: Math.min(d.w, doc.mobileW - 40), h: d.h };
  const { box, ...rest } = p;
  void box;
  return { id: newId(), kind, color: "none", bg: kind === "box" ? p.bg : "none", z: 1, desktop: d, mobile: mob, ...rest };
}

export function FreeCanvasEditor({ slug, title }: { slug: string; title: string }) {
  const [doc, setDoc] = useState<CanvasDoc>(emptyCanvas);
  const [device, setDevice] = useState<Device>("desktop");
  const [selId, setSelId] = useState<string | null>(null);
  const [fitScale, setFitScale] = useState(0.6);
  const [zoom, setZoom] = useState(1);
  const [preview, setPreview] = useState(false);
  const [showLayers, setShowLayers] = useState(false);
  const [guides, setGuides] = useState<{ x: number[]; y: number[] }>({ x: [], y: [] });
  const [toast, setToast] = useState("");
  const stageWrap = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: string; mode: "move" | Handle; box: Box; px: number; py: number } | null>(null);

  // undo / redo history
  const histRef = useRef<{ stack: CanvasDoc[]; i: number }>({ stack: [], i: -1 });
  const skipHist = useRef(false);
  const [, force] = useState(0);

  const scale = fitScale * zoom;
  const designW = device === "desktop" ? doc.desktopW : doc.mobileW;
  const designH = device === "desktop" ? doc.desktopH : doc.mobileH;
  const sel = doc.elements.find((e) => e.id === selId) || null;
  const getBox = (el: CanvasElement) => (device === "desktop" ? el.desktop : el.mobile);

  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(""), 2500); };

  // load
  useEffect(() => {
    fetch(`/api/freecanvas?page=${slug}`).then((r) => r.json()).then((d: CanvasDoc) => {
      setDoc({ ...emptyCanvas, ...d });
      histRef.current = { stack: [], i: -1 };
    });
    setSelId(null);
  }, [slug]);

  // record history (debounced; coalesces drags/sliders into one step)
  useEffect(() => {
    if (skipHist.current) { skipHist.current = false; return; }
    const t = setTimeout(() => {
      const h = histRef.current;
      if (h.stack[h.i] && JSON.stringify(h.stack[h.i]) === JSON.stringify(doc)) return;
      h.stack = h.stack.slice(0, h.i + 1);
      h.stack.push(JSON.parse(JSON.stringify(doc)));
      if (h.stack.length > 60) h.stack.shift();
      h.i = h.stack.length - 1;
      force((x) => x + 1);
    }, 400);
    return () => clearTimeout(t);
  }, [doc]);

  const undo = useCallback(() => {
    const h = histRef.current;
    if (h.i > 0) { h.i--; skipHist.current = true; setDoc(JSON.parse(JSON.stringify(h.stack[h.i]))); force((x) => x + 1); }
  }, []);
  const redo = useCallback(() => {
    const h = histRef.current;
    if (h.i < h.stack.length - 1) { h.i++; skipHist.current = true; setDoc(JSON.parse(JSON.stringify(h.stack[h.i]))); force((x) => x + 1); }
  }, []);

  // fit-to-view scale
  useEffect(() => {
    const measure = () => {
      const wrap = stageWrap.current;
      if (!wrap) return;
      const availW = wrap.clientWidth - 48;
      const availH = wrap.clientHeight - 48;
      setFitScale(Math.min(availW / designW, availH / designH, 1));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [designW, designH]);

  const setBox = useCallback((id: string, patch: Partial<Box>) => {
    setDoc((d) => ({
      ...d,
      elements: d.elements.map((e) => {
        if (e.id !== id) return e;
        const key = device === "desktop" ? "desktop" : "mobile";
        return { ...e, [key]: { ...e[key], ...patch } };
      }),
    }));
  }, [device]);

  const patchEl = (id: string, patch: Partial<CanvasElement>) =>
    setDoc((d) => ({ ...d, elements: d.elements.map((e) => (e.id === id ? { ...e, ...patch } : e)) }));

  // keep latest state available to the persistent pointer listeners
  const docRef = useRef(doc);
  docRef.current = doc;
  const scaleRef = useRef(scale);
  scaleRef.current = scale;
  const deviceRef = useRef(device);
  deviceRef.current = device;

  // global pointer move/up for drag + resize (with smart alignment guides)
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const op = drag.current;
      if (!op) return;
      const sc = scaleRef.current;
      const d = docRef.current;
      const dev = deviceRef.current;
      const dW = dev === "desktop" ? d.desktopW : d.mobileW;
      const dH = dev === "desktop" ? d.desktopH : d.mobileH;
      const dx = (e.clientX - op.px) / sc;
      const dy = (e.clientY - op.py) / sc;
      let { x, y, w, h } = op.box;
      if (op.mode === "move") { x += dx; y += dy; }
      else {
        const m = op.mode;
        if (m.includes("e")) w = op.box.w + dx;
        if (m.includes("s")) h = op.box.h + dy;
        if (m.includes("w")) { x = op.box.x + dx; w = op.box.w - dx; }
        if (m.includes("n")) { y = op.box.y + dy; h = op.box.h - dy; }
      }
      w = Math.max(24, w); h = Math.max(20, h);

      const gx: number[] = [], gy: number[] = [];
      if (op.mode === "move") {
        const T = 8;
        const vTargets = [0, dW / 2, dW];
        const hTargets = [0, dH / 2, dH];
        for (const o of d.elements) {
          if (o.id === op.id) continue;
          const b = dev === "desktop" ? o.desktop : o.mobile;
          vTargets.push(b.x, b.x + b.w / 2, b.x + b.w);
          hTargets.push(b.y, b.y + b.h / 2, b.y + b.h);
        }
        const anchorsX = [x, x + w / 2, x + w];
        let bestX = T + 1, snapX = 0, gX = NaN;
        anchorsX.forEach((a, idx) => {
          for (const t of vTargets) { const diff = Math.abs(a - t); if (diff < bestX) { bestX = diff; snapX = t - (idx === 1 ? w / 2 : idx === 2 ? w : 0); gX = t; } }
        });
        if (bestX <= T) { x = snapX; gx.push(gX); }
        const anchorsY = [y, y + h / 2, y + h];
        let bestY = T + 1, snapY = 0, gY = NaN;
        anchorsY.forEach((a, idx) => {
          for (const t of hTargets) { const diff = Math.abs(a - t); if (diff < bestY) { bestY = diff; snapY = t - (idx === 1 ? h / 2 : idx === 2 ? h : 0); gY = t; } }
        });
        if (bestY <= T) { y = snapY; gy.push(gY); }
      }
      setGuides({ x: gx, y: gy });
      setBox(op.id, { x: gx.length ? Math.round(x) : snap(x), y: gy.length ? Math.round(y) : snap(y), w: snap(w), h: snap(h) });
    };
    const onUp = () => { drag.current = null; setGuides({ x: [], y: [] }); };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); };
  }, [setBox]);

  const startDrag = (e: React.PointerEvent, id: string, mode: "move" | Handle) => {
    e.stopPropagation();
    const el = doc.elements.find((x) => x.id === id);
    if (!el) return;
    setSelId(id);
    if (el.locked) return; // selectable but not movable/resizable
    drag.current = { id, mode, box: { ...getBox(el) }, px: e.clientX, py: e.clientY };
  };

  const duplicate = useCallback(() => {
    setDoc((d) => {
      const el = d.elements.find((e) => e.id === selId);
      if (!el) return d;
      const copy: CanvasElement = {
        ...JSON.parse(JSON.stringify(el)),
        id: newId(),
        desktop: { ...el.desktop, x: el.desktop.x + 20, y: el.desktop.y + 20 },
        mobile: { ...el.mobile, x: el.mobile.x + 10, y: el.mobile.y + 10 },
        z: (el.z ?? 1) + 1,
      };
      setSelId(copy.id);
      return { ...d, elements: [...d.elements, copy] };
    });
  }, [selId]);

  const nudge = useCallback((axis: "x" | "y", amount: number) => {
    if (!selId) return;
    setDoc((d) => ({
      ...d,
      elements: d.elements.map((e) => {
        if (e.id !== selId || e.locked) return e;
        const key = deviceRef.current === "desktop" ? "desktop" : "mobile";
        return { ...e, [key]: { ...e[key], [axis]: e[key][axis] + amount } };
      }),
    }));
  }, [selId]);

  const addEl = (kind: SimpleKind) => {
    const el = defaultEl(kind, doc);
    setDoc((d) => ({ ...d, elements: [...d.elements, el] }));
    setSelId(el.id);
  };

  const addSection = (preset: SectionPreset) => {
    const size = presetSize[preset];
    const w = Math.min(size.w, doc.desktopW - 80);
    const dScale = w / size.w;
    const mw = doc.mobileW - 20;
    const el: CanvasElement = {
      id: newId(),
      kind: "section",
      section: preset,
      color: "none",
      bg: "none",
      z: 1,
      ...presetDefaults[preset],
      desktop: { x: 40, y: 40, w, h: Math.round(size.h * dScale) },
      mobile: { x: 10, y: 40, w: mw, h: Math.round(size.h * (mw / size.w)) },
    };
    setDoc((d) => ({ ...d, elements: [...d.elements, el] }));
    setSelId(el.id);
  };

  const removeSel = () => {
    if (!selId) return;
    setDoc((d) => ({ ...d, elements: d.elements.filter((e) => e.id !== selId) }));
    setSelId(null);
  };

  const bringFront = () => sel && patchEl(sel.id, { z: Math.max(0, ...doc.elements.map((e) => e.z ?? 1)) + 1 });
  const sendBack = () => sel && patchEl(sel.id, { z: Math.min(0, ...doc.elements.map((e) => e.z ?? 1)) - 1 });

  const copyDesktopToMobile = () => {
    setDoc((d) => ({ ...d, elements: d.elements.map((e) => ({ ...e, mobile: { ...e.desktop, x: Math.min(e.desktop.x, d.mobileW - 40), w: Math.min(e.desktop.w, d.mobileW - 20) } })) }));
    flash("Desktop layout copied to mobile — now tweak it");
  };

  const save = async (publish: boolean) => {
    await fetch("/api/freecanvas", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: slug, doc }),
    });
    if (publish) {
      await fetch("/api/pages", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, mode: "canvas" }),
      });
    }
    flash(publish ? "Published ✓ — live on your site" : "Saved ✓");
  };

  // keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)) return;
      const meta = e.ctrlKey || e.metaKey;
      if (meta && e.key.toLowerCase() === "z") { e.preventDefault(); e.shiftKey ? redo() : undo(); return; }
      if (meta && e.key.toLowerCase() === "y") { e.preventDefault(); redo(); return; }
      if (meta && e.key.toLowerCase() === "d") { e.preventDefault(); duplicate(); return; }
      if ((e.key === "Delete" || e.key === "Backspace") && selId) { e.preventDefault(); removeSel(); return; }
      const step = e.shiftKey ? 10 : 1;
      if (e.key === "ArrowLeft") { e.preventDefault(); nudge("x", -step); }
      else if (e.key === "ArrowRight") { e.preventDefault(); nudge("x", step); }
      else if (e.key === "ArrowUp") { e.preventDefault(); nudge("y", -step); }
      else if (e.key === "ArrowDown") { e.preventDefault(); nudge("y", step); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo, duplicate, removeSel, nudge, selId]);

  const canUndo = histRef.current.i > 0;
  const canRedo = histRef.current.i < histRef.current.stack.length - 1;
  const fontHref = googleFontsHref(doc.elements.map((e) => e.font).filter((f): f is string => !!f));

  return (
    <div style={{ display: "flex", height: "100%", background: "#f4f4f7", color: "#111" }}>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      {fontHref && <link rel="stylesheet" href={fontHref} />}
      {/* Left: add elements */}
      <div style={leftBar}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#888", padding: "4px 0 6px" }}>SECTIONS (drag & stretch)</div>
        {([["hero", "★  Hero section"], ["productRow", "▦  Product row"], ["features", "▣  Feature cards"], ["cta", "◈  CTA banner"]] as [SectionPreset, string][]).map(([k, label]) => (
          <button key={k} onClick={() => addSection(k)} style={{ ...addBtn, background: "#efeaff", color: "#5b3fd6", fontWeight: 700 }}>{label}</button>
        ))}
        <div style={{ marginTop: 12, fontSize: 11, fontWeight: 700, color: "#888", padding: "4px 0 6px" }}>ELEMENTS</div>
        {([["heading", "T  Heading"], ["text", "¶  Text"], ["image", "🖼  Image"], ["video", "🎬  Video"], ["button", "▭  Button"], ["box", "■  Box/Shape"]] as [SimpleKind, string][]).map(([k, label]) => (
          <button key={k} onClick={() => addEl(k)} style={addBtn}>{label}</button>
        ))}
        <div style={{ marginTop: 16, fontSize: 11, fontWeight: 700, color: "#888" }}>DEVICE</div>
        <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
          <button onClick={() => setDevice("desktop")} style={device === "desktop" ? tabOn : tabOff}>🖥 Desktop</button>
          <button onClick={() => setDevice("mobile")} style={device === "mobile" ? tabOn : tabOff}>📱 Mobile</button>
        </div>
        {device === "mobile" && (
          <button onClick={copyDesktopToMobile} style={{ ...addBtn, marginTop: 8, fontSize: 11 }}>⬇ Copy desktop → mobile</button>
        )}
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
          <button onClick={() => setPreview((p) => !p)} style={{ ...addBtn, background: preview ? "#111" : "#eef0f4", color: preview ? "#fff" : "#333", fontWeight: 700 }}>
            {preview ? "⏸ Stop preview" : "▶ Preview animations"}
          </button>
          <button onClick={() => save(false)} style={{ ...addBtn, background: "#eef0f4" }}>Save draft</button>
          <button onClick={() => save(true)} style={{ ...addBtn, background: "#7c5cff", color: "#fff", fontWeight: 700 }}>Publish ✦</button>
        </div>
      </div>

      {/* Center: toolbar + stage */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <div style={toolbar}>
          <button onClick={undo} disabled={!canUndo} style={tbBtn(canUndo)} title="Undo (Ctrl+Z)">↶ Undo</button>
          <button onClick={redo} disabled={!canRedo} style={tbBtn(canRedo)} title="Redo (Ctrl+Shift+Z)">↷ Redo</button>
          <div style={tbSep} />
          <button onClick={duplicate} disabled={!sel} style={tbBtn(!!sel)} title="Duplicate (Ctrl+D)">⧉ Duplicate</button>
          <button onClick={removeSel} disabled={!sel} style={tbBtn(!!sel)} title="Delete (Del)">🗑 Delete</button>
          <div style={tbSep} />
          <button onClick={() => setZoom((z) => Math.max(0.2, z - 0.15))} style={tbBtn(true)} title="Zoom out">－</button>
          <span style={{ fontSize: 12, color: "#666", minWidth: 42, textAlign: "center" }}>{Math.round(scale * 100)}%</span>
          <button onClick={() => setZoom((z) => Math.min(3, z + 0.15))} style={tbBtn(true)} title="Zoom in">＋</button>
          <button onClick={() => setZoom(1)} style={tbBtn(true)} title="Fit to screen">Fit</button>
          <div style={tbSep} />
          <button onClick={() => setShowLayers((s) => !s)} style={tbBtn(showLayers)} title="Layers">☰ Layers</button>
          <span style={{ marginLeft: "auto", fontSize: 11, color: "#aaa" }}>Ctrl+Z undo · Ctrl+D duplicate · arrows nudge</span>
        </div>

      <div ref={stageWrap} style={{ flex: 1, overflow: "auto", display: "grid", placeItems: "center", position: "relative" }}
        onPointerDown={() => setSelId(null)}>
        {toast && <div style={toastStyle}>{toast}</div>}
        {showLayers && (
          <LayersPanel
            elements={doc.elements}
            selId={selId}
            onSelect={setSelId}
            onToggleHidden={(id) => patchEl(id, { hidden: !doc.elements.find((e) => e.id === id)?.hidden })}
            onToggleLocked={(id) => patchEl(id, { locked: !doc.elements.find((e) => e.id === id)?.locked })}
            onFront={(id) => patchEl(id, { z: Math.max(0, ...doc.elements.map((e) => e.z ?? 1)) + 1 })}
            onBack={(id) => patchEl(id, { z: Math.min(0, ...doc.elements.map((e) => e.z ?? 1)) - 1 })}
            onClose={() => setShowLayers(false)}
          />
        )}
        <div
          style={{
            width: designW * scale, height: designH * scale, position: "relative",
            boxShadow: "0 20px 60px rgba(0,0,0,0.18)", flexShrink: 0,
          }}
        >
          {/* alignment guides */}
          {guides.x.map((gx, i) => (
            <div key={`gx${i}`} style={{ position: "absolute", left: gx * scale, top: 0, width: 1, height: "100%", background: "#ff3da6", zIndex: 1000, pointerEvents: "none" }} />
          ))}
          {guides.y.map((gy, i) => (
            <div key={`gy${i}`} style={{ position: "absolute", top: gy * scale, left: 0, height: 1, width: "100%", background: "#ff3da6", zIndex: 1000, pointerEvents: "none" }} />
          ))}
          <div
            style={{
              width: designW, height: designH, transform: `scale(${scale})`, transformOrigin: "top left",
              position: "absolute", top: 0, left: 0,
              background: doc.bg && doc.bg !== "none" ? doc.bg : "#070709",
              backgroundImage: "linear-gradient(rgba(124,92,255,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(124,92,255,0.06) 1px,transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          >
            {[...doc.elements].sort((a, b) => (a.z ?? 1) - (b.z ?? 1)).map((el) => {
              const box = getBox(el);
              const selected = el.id === selId;
              return (
                <div
                  key={el.id}
                  onPointerDown={(e) => startDrag(e, el.id, "move")}
                  style={{
                    position: "absolute", left: box.x, top: box.y, width: box.w, height: box.h,
                    transform: el.rotate ? `rotate(${el.rotate}deg)` : undefined,
                    opacity: el.hidden ? 0.2 : el.opacity ?? 1, zIndex: el.z ?? 1,
                    ...elementFx(el),
                    outline: selected ? (el.locked ? "2px solid #f59e0b" : "2px solid #7c5cff") : "1px dashed rgba(255,255,255,0.18)",
                    cursor: el.locked ? "default" : "move", userSelect: "none",
                  }}
                >
                  <div style={{ pointerEvents: "none", width: "100%", height: "100%" }}>
                    {preview ? (
                      <AnimatedWrap el={el} active>
                        <ElementView el={el} boxW={box.w} boxH={box.h} />
                      </AnimatedWrap>
                    ) : (
                      <ElementView el={el} boxW={box.w} boxH={box.h} />
                    )}
                  </div>
                  {selected && !preview && !el.locked && HANDLES.map((hd) => (
                    <div
                      key={hd}
                      onPointerDown={(e) => startDrag(e, el.id, hd)}
                      style={handleHit(hd, scale)}
                    >
                      <div style={handleDot(scale)} />
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      </div>

      {/* Right: properties */}
      <div style={rightBar}>
        <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 2 }}>Editing: {title}</div>
        <div style={{ fontSize: 11, color: "#999", marginBottom: 12 }}>Free canvas · {device}</div>
        {!sel ? (
          <div style={{ fontSize: 13, color: "#888", lineHeight: 1.6 }}>
            Click an element to edit it, or add one from the left. Drag to move, pull the purple
            handles to resize. Set <b>Desktop</b> and <b>Mobile</b> separately.
            <hr style={{ margin: "14px 0", border: "none", borderTop: "1px solid #eee" }} />
            <label style={lbl}>Page background</label>
            <ColorRow value={doc.bg ?? "none"} onChange={(v) => setDoc((d) => ({ ...d, bg: v }))} />
            <label style={lbl}>Page height ({device}) px</label>
            <input type="number" value={device === "desktop" ? doc.desktopH : doc.mobileH}
              onChange={(e) => setDoc((d) => ({ ...d, [device === "desktop" ? "desktopH" : "mobileH"]: Number(e.target.value) }))}
              style={inp} />
          </div>
        ) : (
          <PropPanel
            key={sel.id}
            el={sel}
            box={getBox(sel)}
            onContent={(p) => patchEl(sel.id, p)}
            onBox={(p) => setBox(sel.id, p)}
            onDelete={removeSel}
            onFront={bringFront}
            onBack={sendBack}
          />
        )}
      </div>
    </div>
  );
}

/* ---------- properties panel ---------- */
function PropPanel({
  el, box, onContent, onBox, onDelete, onFront, onBack,
}: {
  el: CanvasElement;
  box: Box;
  onContent: (p: Partial<CanvasElement>) => void;
  onBox: (p: Partial<Box>) => void;
  onDelete: () => void;
  onFront: () => void;
  onBack: () => void;
}) {
  const isText = el.kind === "heading" || el.kind === "text" || el.kind === "button";
  return (
    <div style={{ display: "grid", gap: 10, fontSize: 13 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ textTransform: "uppercase", fontSize: 11, fontWeight: 700, color: "#7c5cff" }}>{el.kind}</span>
        <button onClick={onDelete} style={delBtn}>Delete</button>
      </div>

      {el.kind === "section" && (
        <>
          <label style={lbl}>Heading</label>
          <input value={el.text || ""} onChange={(e) => onContent({ text: e.target.value })} style={inp} />
          {el.section !== "features" && el.section !== "productRow" && (
            <>
              <label style={lbl}>Sub text</label>
              <input value={el.text2 || ""} onChange={(e) => onContent({ text2: e.target.value })} style={inp} />
              <label style={lbl}>Button text</label>
              <input value={el.text3 || ""} onChange={(e) => onContent({ text3: e.target.value })} style={inp} />
              <label style={lbl}>Button link</label>
              <input value={el.href || ""} onChange={(e) => onContent({ href: e.target.value })} style={inp} />
            </>
          )}
          {el.section === "hero" && (
            <>
              <label style={lbl}>Image</label>
              <MediaField value={el.src} onChange={(v) => onContent({ src: v })} accept="image/*" label="Drop image" />
            </>
          )}
          <label style={lbl}>Heading colour</label>
          <ColorRow value={el.color ?? "none"} onChange={(v) => onContent({ color: v })} />
          <p style={{ fontSize: 11, color: "#999", margin: "2px 0" }}>Drag to move · pull handles to stretch/shrink the whole section.</p>
        </>
      )}

      {isText && (
        <>
          <label style={lbl}>Text</label>
          <textarea value={el.text || ""} onChange={(e) => onContent({ text: e.target.value })} rows={2} style={{ ...inp, resize: "vertical" }} />
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => onContent({ fontWeight: (el.fontWeight ?? 400) >= 700 ? 400 : 800 })}
              style={{ ...miniBtn, fontWeight: 800, background: (el.fontWeight ?? 400) >= 700 ? "#7c5cff" : "#eef0f4", color: (el.fontWeight ?? 400) >= 700 ? "#fff" : "#333" }}>B</button>
            <button onClick={() => onContent({ italic: !el.italic })} style={{ ...miniBtn, fontStyle: "italic", background: el.italic ? "#7c5cff" : "#eef0f4", color: el.italic ? "#fff" : "#333" }}>I</button>
            <button onClick={() => onContent({ underline: !el.underline })} style={{ ...miniBtn, textDecoration: "underline", background: el.underline ? "#7c5cff" : "#eef0f4", color: el.underline ? "#fff" : "#333" }}>U</button>
            {(["left", "center", "right"] as const).map((a) => (
              <button key={a} onClick={() => onContent({ align: a })} style={{ ...miniBtn, background: el.align === a ? "#7c5cff" : "#eef0f4", color: el.align === a ? "#fff" : "#333" }}>{a[0].toUpperCase()}</button>
            ))}
          </div>
          <label style={lbl}>Font size ({el.fontSize ?? 18}px)</label>
          <input type="range" min={10} max={140} value={el.fontSize ?? 18} onChange={(e) => onContent({ fontSize: Number(e.target.value) })} />
          <label style={lbl}>Font</label>
          <select
            value={el.font ?? (el.fontFamily === "sans" ? "__sans" : "__display")}
            onChange={(e) => {
              const v = e.target.value;
              if (v === "__display") onContent({ font: undefined, fontFamily: "display" });
              else if (v === "__sans") onContent({ font: undefined, fontFamily: "sans" });
              else onContent({ font: v });
            }}
            style={inp}
          >
            <option value="__display">Default — Display</option>
            <option value="__sans">Default — Body</option>
            <optgroup label="Google Fonts">
              {GOOGLE_FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
            </optgroup>
          </select>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            <div><label style={lbl}>Letter spc</label><input type="number" step="0.5" value={el.letterSpacing ?? 0} onChange={(e) => onContent({ letterSpacing: Number(e.target.value) })} style={inp} /></div>
            <div><label style={lbl}>Line height</label><input type="number" step="0.05" value={el.lineHeight ?? 1.15} onChange={(e) => onContent({ lineHeight: Number(e.target.value) })} style={inp} /></div>
          </div>
          <label style={lbl}>Text colour</label>
          <ColorRow value={el.color ?? "none"} onChange={(v) => onContent({ color: v })} />
        </>
      )}

      {el.kind === "button" && (
        <>
          <label style={lbl}>Link (href)</label>
          <input value={el.href || ""} onChange={(e) => onContent({ href: e.target.value })} style={inp} />
        </>
      )}

      {(el.kind === "image" || el.kind === "video") && (
        <>
          <label style={lbl}>{el.kind === "video" ? "Video file" : "Image"}</label>
          <MediaField value={el.src} onChange={(v) => onContent({ src: v })} accept={el.kind === "video" ? "video/*" : "image/*"} label={`Drop ${el.kind}`} />
          {el.kind === "video" && (
            <>
              <label style={lbl}>Poster image</label>
              <MediaField value={el.poster} onChange={(v) => onContent({ poster: v })} accept="image/*" label="Drop poster" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                <div><label style={lbl}>Trim start (s)</label><input type="number" step="0.1" min={0} value={el.startTime ?? 0} onChange={(e) => onContent({ startTime: Number(e.target.value) })} style={inp} /></div>
                <div><label style={lbl}>Trim end (s)</label><input type="number" step="0.1" min={0} value={el.endTime ?? 0} onChange={(e) => onContent({ endTime: Number(e.target.value) })} style={inp} /></div>
              </div>
              <p style={{ fontSize: 11, color: "#999", margin: "0 0 2px" }}>Plays only start→end (end 0 = full clip).</p>
              <label style={lbl}>Speed ({el.playbackRate ?? 1}×)</label>
              <input type="range" min={0.25} max={3} step={0.25} value={el.playbackRate ?? 1} onChange={(e) => onContent({ playbackRate: Number(e.target.value) })} />
              <label style={chk}><input type="checkbox" checked={el.muted ?? true} onChange={(e) => onContent({ muted: e.target.checked })} /> Muted</label>
              <label style={chk}><input type="checkbox" checked={el.loop ?? true} onChange={(e) => onContent({ loop: e.target.checked })} /> Loop</label>
            </>
          )}
        </>
      )}

      {(el.kind === "box" || el.kind === "button") && (
        <>
          <label style={lbl}>Background</label>
          <ColorRow value={el.bg ?? "none"} onChange={(v) => onContent({ bg: v })} />
        </>
      )}

      <label style={lbl}>Corner radius ({el.radius ?? 0}px)</label>
      <input type="range" min={0} max={200} value={el.radius ?? 0} onChange={(e) => onContent({ radius: Number(e.target.value) })} />

      <label style={lbl}>Opacity ({Math.round((el.opacity ?? 1) * 100)}%)</label>
      <input type="range" min={0} max={1} step={0.05} value={el.opacity ?? 1} onChange={(e) => onContent({ opacity: Number(e.target.value) })} />

      <label style={lbl}>Rotation ({el.rotate ?? 0}°)</label>
      <input type="range" min={-180} max={180} value={el.rotate ?? 0} onChange={(e) => onContent({ rotate: Number(e.target.value) })} />

      <label style={lbl}>Shadow</label>
      <select value={el.shadow ?? "none"} onChange={(e) => onContent({ shadow: e.target.value })} style={inp}>
        <option value="none">None</option>
        <option value="soft">Soft</option>
        <option value="medium">Medium</option>
        <option value="strong">Strong</option>
        <option value="glow">Glow</option>
      </select>
      <label style={lbl}>Border</label>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <input type="number" min={0} max={20} value={el.borderWidth ?? 0} onChange={(e) => onContent({ borderWidth: Number(e.target.value) })} style={{ ...inp, width: 70 }} title="Width" />
        <input type="color" value={el.borderColor && el.borderColor !== "none" ? el.borderColor : "#ffffff"} onChange={(e) => onContent({ borderColor: e.target.value })} style={{ width: 34, height: 30, border: "1px solid #ddd", borderRadius: 8 }} />
        <span style={{ fontSize: 11, color: "#999" }}>width · colour</span>
      </div>

      <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "4px 0" }} />
      <AnimControls el={el} onAnim={(patch) => onContent({ anim: { ...el.anim, ...patch } })} />

      <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "4px 0" }} />
      <label style={lbl}>Position & size (px)</label>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        <NumIn label="X" v={box.x} on={(n) => onBox({ x: n })} />
        <NumIn label="Y" v={box.y} on={(n) => onBox({ y: n })} />
        <NumIn label="W" v={box.w} on={(n) => onBox({ w: n })} />
        <NumIn label="H" v={box.h} on={(n) => onBox({ h: n })} />
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        <button onClick={onFront} style={{ ...miniBtn, flex: 1 }}>Bring front</button>
        <button onClick={onBack} style={{ ...miniBtn, flex: 1 }}>Send back</button>
      </div>
    </div>
  );
}

function AnimControls({ el, onAnim }: { el: CanvasElement; onAnim: (p: Partial<ElementAnim>) => void }) {
  const preset = el.anim?.preset ?? "none";
  const isEntrance = preset !== "none" && !LOOP_PRESETS.has(preset) && !HOVER_PRESETS.has(preset);
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <label style={{ ...lbl, color: "#7c5cff" }}>✦ Animation</label>
      <select value={preset} onChange={(e) => onAnim({ preset: e.target.value })} style={inp}>
        <option value="none">None</option>
        {ANIM_GROUPS.map((g) => (
          <optgroup key={g.group} label={g.group}>
            {g.items.map((it) => <option key={it.value} value={it.value}>{it.label}</option>)}
          </optgroup>
        ))}
      </select>
      {preset !== "none" && (
        <>
          {isEntrance && (
            <>
              <label style={lbl}>Plays</label>
              <select value={el.anim?.trigger ?? "scroll"} onChange={(e) => onAnim({ trigger: e.target.value as ElementAnim["trigger"] })} style={inp}>
                <option value="scroll">When scrolled into view</option>
                <option value="load">On page load</option>
              </select>
            </>
          )}
          <label style={lbl}>Speed ({el.anim?.duration ?? 0.8}s)</label>
          <input type="range" min={0.2} max={3} step={0.1} value={el.anim?.duration ?? 0.8} onChange={(e) => onAnim({ duration: Number(e.target.value) })} />
          <label style={lbl}>Delay ({el.anim?.delay ?? 0}s)</label>
          <input type="range" min={0} max={3} step={0.1} value={el.anim?.delay ?? 0} onChange={(e) => onAnim({ delay: Number(e.target.value) })} />
          <p style={{ fontSize: 11, color: "#999", margin: 0 }}>Tap ▶ Preview (left) to watch it play.</p>
        </>
      )}
    </div>
  );
}

function NumIn({ label, v, on }: { label: string; v: number; on: (n: number) => void }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}>
      <span style={{ width: 14, color: "#999" }}>{label}</span>
      <input type="number" value={Math.round(v)} onChange={(e) => on(Number(e.target.value))} style={{ ...inp, padding: "5px 7px" }} />
    </label>
  );
}

function ColorRow({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const cur = value && value !== "none" ? value : "";
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      <input type="color" value={cur || "#7c5cff"} onChange={(e) => onChange(e.target.value)} style={{ width: 34, height: 30, border: "1px solid #ddd", borderRadius: 8, background: "none" }} />
      <input value={value} onChange={(e) => onChange(e.target.value)} style={{ ...inp, fontFamily: "monospace", fontSize: 12 }} />
      <button onClick={() => onChange("none")} style={miniBtn}>none</button>
    </div>
  );
}

/* ---------- layers panel ---------- */
function LayersPanel({
  elements, selId, onSelect, onToggleHidden, onToggleLocked, onFront, onBack, onClose,
}: {
  elements: CanvasElement[];
  selId: string | null;
  onSelect: (id: string) => void;
  onToggleHidden: (id: string) => void;
  onToggleLocked: (id: string) => void;
  onFront: (id: string) => void;
  onBack: (id: string) => void;
  onClose: () => void;
}) {
  const ordered = [...elements].sort((a, b) => (b.z ?? 1) - (a.z ?? 1));
  const labelOf = (e: CanvasElement) =>
    e.name || (e.kind === "section" ? `Section: ${e.section}` : e.kind === "heading" || e.kind === "text" || e.kind === "button" ? `${e.kind}: ${(e.text || "").slice(0, 16)}` : e.kind);
  return (
    <div
      onPointerDown={(e) => e.stopPropagation()}
      style={{ position: "absolute", top: 12, right: 12, width: 240, maxHeight: "80%", overflowY: "auto", background: "#fff", borderRadius: 12, boxShadow: "0 20px 60px rgba(0,0,0,0.25)", zIndex: 2000, padding: 10 }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <strong style={{ fontSize: 13, color: "#111" }}>Layers</strong>
        <button onClick={onClose} style={{ ...miniBtn, padding: "3px 8px" }}>✕</button>
      </div>
      {ordered.length === 0 && <p style={{ fontSize: 12, color: "#999" }}>No elements yet.</p>}
      {ordered.map((e) => (
        <div
          key={e.id}
          onClick={() => onSelect(e.id)}
          style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 6px", borderRadius: 8, cursor: "pointer", background: e.id === selId ? "#efeaff" : "transparent", marginBottom: 2 }}
        >
          <span style={{ flex: 1, fontSize: 12, color: e.hidden ? "#bbb" : "#222", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{labelOf(e)}</span>
          <button onClick={(ev) => { ev.stopPropagation(); onFront(e.id); }} title="Bring front" style={layerIcon}>▲</button>
          <button onClick={(ev) => { ev.stopPropagation(); onBack(e.id); }} title="Send back" style={layerIcon}>▼</button>
          <button onClick={(ev) => { ev.stopPropagation(); onToggleLocked(e.id); }} title="Lock" style={layerIcon}>{e.locked ? "🔒" : "🔓"}</button>
          <button onClick={(ev) => { ev.stopPropagation(); onToggleHidden(e.id); }} title="Hide" style={layerIcon}>{e.hidden ? "🚫" : "👁"}</button>
        </div>
      ))}
    </div>
  );
}

/* ---------- styles ---------- */
const toolbar: React.CSSProperties = { display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", background: "#fff", borderBottom: "1px solid #e6e6ec" };
const tbSep: React.CSSProperties = { width: 1, height: 22, background: "#e2e2e8", margin: "0 4px" };
function tbBtn(enabled: boolean): React.CSSProperties {
  return { padding: "6px 10px", borderRadius: 7, border: "1px solid #e6e6ec", background: enabled ? "#f7f7fa" : "#fafafa", color: enabled ? "#333" : "#bbb", fontSize: 12, fontWeight: 600, cursor: enabled ? "pointer" : "not-allowed", whiteSpace: "nowrap" };
}
const layerIcon: React.CSSProperties = { border: "none", background: "transparent", cursor: "pointer", fontSize: 11, padding: "2px 3px", lineHeight: 1 };

// Big, easy-to-grab hit area (≈26px on screen at any zoom).
function handleHit(hd: Handle, scale: number): React.CSSProperties {
  const s = 26 / scale;
  const pos: React.CSSProperties = {
    position: "absolute", width: s, height: s, zIndex: 99,
    display: "flex", alignItems: "center", justifyContent: "center", background: "transparent",
  };
  const mid = `calc(50% - ${s / 2}px)`;
  const edge = -s / 2;
  if (hd === "nw") return { ...pos, left: edge, top: edge, cursor: "nwse-resize" };
  if (hd === "ne") return { ...pos, right: edge, top: edge, cursor: "nesw-resize" };
  if (hd === "sw") return { ...pos, left: edge, bottom: edge, cursor: "nesw-resize" };
  if (hd === "se") return { ...pos, right: edge, bottom: edge, cursor: "nwse-resize" };
  if (hd === "n") return { ...pos, left: mid, top: edge, cursor: "ns-resize" };
  if (hd === "s") return { ...pos, left: mid, bottom: edge, cursor: "ns-resize" };
  if (hd === "w") return { ...pos, top: mid, left: edge, cursor: "ew-resize" };
  return { ...pos, top: mid, right: edge, cursor: "ew-resize" };
}
function handleDot(scale: number): React.CSSProperties {
  const d = 13 / scale;
  return { width: d, height: d, background: "#fff", border: `${2.5 / scale}px solid #7c5cff`, borderRadius: "50%", boxShadow: "0 1px 4px rgba(0,0,0,0.3)", pointerEvents: "none" };
}

const leftBar: React.CSSProperties = { width: 170, background: "#fff", borderRight: "1px solid #e6e6ec", padding: 12, display: "flex", flexDirection: "column", gap: 6 };
const rightBar: React.CSSProperties = { width: 290, background: "#fff", borderLeft: "1px solid #e6e6ec", padding: 16, overflowY: "auto" };
const addBtn: React.CSSProperties = { textAlign: "left", padding: "9px 11px", borderRadius: 9, border: "none", background: "#f4f4f7", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#222" };
const tabOn: React.CSSProperties = { flex: 1, padding: "7px 4px", borderRadius: 8, border: "none", background: "#7c5cff", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" };
const tabOff: React.CSSProperties = { ...tabOn, background: "#eef0f4", color: "#333" };
const inp: React.CSSProperties = { width: "100%", padding: "8px 10px", border: "1px solid #e2e2e8", borderRadius: 8, fontSize: 13, boxSizing: "border-box" };
const lbl: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: "#888", textTransform: "uppercase" };
const miniBtn: React.CSSProperties = { padding: "6px 9px", borderRadius: 7, border: "1px solid #e2e2e8", background: "#eef0f4", fontSize: 12, fontWeight: 600, cursor: "pointer", color: "#333" };
const delBtn: React.CSSProperties = { padding: "5px 10px", borderRadius: 7, border: "none", background: "#fde8e8", color: "#c0392b", fontSize: 12, fontWeight: 700, cursor: "pointer" };
const chk: React.CSSProperties = { display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#444" };
const toastStyle: React.CSSProperties = { position: "fixed", top: 70, left: "50%", transform: "translateX(-50%)", background: "#111", color: "#fff", padding: "10px 18px", borderRadius: 99, fontSize: 13, zIndex: 100000, boxShadow: "0 10px 40px rgba(0,0,0,0.35)" };
