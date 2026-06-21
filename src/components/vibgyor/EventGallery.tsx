"use client";
import { useCallback, useEffect, useState } from "react";
import type { Media } from "@/lib/gallery";

export default function EventGallery({ media, title }: { media: Media[]; title: string }) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  const go = useCallback((d: number) => setIdx((i) => (i + d + media.length) % media.length), [media.length]);

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

  const cur = media[idx];

  return (
    <>
      <div className="media-masonry">
        {media.map((m, i) => (
          <div
            key={i}
            className={"tile reveal" + (m.type === "video" ? " video" : "")}
            onClick={() => { setIdx(i); setOpen(true); }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={m.type === "video" ? m.poster || m.src : m.src} alt={title} />
            {m.type === "video" && (<><span className="vtag">Film</span><div className="play">▶</div></>)}
          </div>
        ))}
      </div>

      <div className={"lb" + (open ? " open" : "")} onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
        <button className="lb-close" onClick={() => setOpen(false)} aria-label="Close">✕</button>
        <button className="lb-nav prev" onClick={() => go(-1)} aria-label="Prev">‹</button>
        <button className="lb-nav next" onClick={() => go(1)} aria-label="Next">›</button>
        <div className="lb-stage">
          {cur?.type === "video" ? (
            <video key={cur.src} src={cur.src} poster={cur.poster} controls playsInline autoPlay />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={cur?.src} src={cur?.src} alt={title} />
          )}
          <div className="lb-cap">{title}</div>
        </div>
      </div>
    </>
  );
}
