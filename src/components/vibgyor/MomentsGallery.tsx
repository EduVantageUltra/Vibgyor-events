"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MOMENTS, MOMENT_CATS, momentPoster, momentVideo, type MomentCat } from "@/lib/moments";

type Filter = "All" | MomentCat;

export default function MomentsGallery() {
  const [filter, setFilter] = useState<Filter>("All");
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const player = useRef<HTMLVideoElement>(null);
  // The lightbox is portalled to <body>: any ancestor with a filter/transform
  // would otherwise become its containing block and knock position:fixed off-screen.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const list = useMemo(
    () => (filter === "All" ? MOMENTS : MOMENTS.filter((m) => m.cat === filter)),
    [filter]
  );

  const go = useCallback((d: number) => setIdx((i) => (i + d + list.length) % list.length), [list.length]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, go]);

  // Browsers block autoplay of anything with sound. Try with audio first, and
  // fall back to a muted start rather than leaving the viewer on a frozen frame.
  const cur = list[idx];
  useEffect(() => {
    if (!open) return;
    const v = player.current;
    if (!v) return;
    v.play().catch(() => {
      v.muted = true;
      v.play().catch(() => {});
    });
  }, [open, cur?.id]);

  const pick = (f: Filter) => { setFilter(f); setOpen(false); setIdx(0); };

  return (
    <>
      <div className="mo-filters">
        {(["All", ...MOMENT_CATS] as Filter[]).map((c) => (
          <button key={c} className={"mo-chip" + (filter === c ? " on" : "")} onClick={() => pick(c)} data-hover>
            {c}
          </button>
        ))}
      </div>
      <div className="mo-count">
        {list.length} {list.length === 1 ? "film" : "films"}
        {filter !== "All" && ` · ${filter}`}
      </div>

      <div className="media-masonry" key={filter}>
        {list.map((m, i) => (
          <div key={m.id} className="tile video mo" onClick={() => { setIdx(i); setOpen(true); }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={momentPoster(m.id)} alt={`${m.title} — ${m.note}`} loading="lazy" />
            <span className="vtag">Film</span>
            <div className="play">▶</div>
            <div className="mcap"><div className="t">{m.title}</div><div className="s">{m.note}</div></div>
          </div>
        ))}
      </div>

      {mounted && createPortal(
        <div className={"lb" + (open ? " open" : "")} onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
          <button className="lb-close" onClick={() => setOpen(false)} aria-label="Close">✕</button>
          <button className="lb-nav prev" onClick={() => go(-1)} aria-label="Previous">‹</button>
          <button className="lb-nav next" onClick={() => go(1)} aria-label="Next">›</button>
          <div className="lb-stage">
            {open && cur && (
              <video
                ref={player}
                key={cur.id}
                src={momentVideo(cur.id)}
                poster={momentPoster(cur.id)}
                controls
                playsInline
                preload="auto"
              />
            )}
            <div className="lb-cap">{cur ? `${cur.title} — ${cur.note}` : ""}</div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
