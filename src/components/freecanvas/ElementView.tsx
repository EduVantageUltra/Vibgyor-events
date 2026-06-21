"use client";

import { useEffect, useRef } from "react";
import type { CanvasElement } from "@/lib/freecanvas";
import { SectionPresetView, presetSize } from "./sectionPresets";
import { SHADOWS } from "./fonts";

/** Video with non-destructive trim (start/end), speed, mute and loop. */
function VideoFx({ el }: { el: CanvasElement }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.playbackRate = el.playbackRate ?? 1;
    const start = el.startTime ?? 0;
    const onMeta = () => { if (start > 0) v.currentTime = start; };
    const onTime = () => {
      const end = el.endTime && el.endTime > start ? el.endTime : v.duration;
      if (v.currentTime >= end - 0.05) {
        if (el.loop ?? true) { v.currentTime = start; v.play().catch(() => {}); }
        else v.pause();
      }
    };
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("timeupdate", onTime);
    return () => { v.removeEventListener("loadedmetadata", onMeta); v.removeEventListener("timeupdate", onTime); };
  }, [el.startTime, el.endTime, el.playbackRate, el.loop]);

  return (
    <video
      ref={ref}
      src={el.src}
      poster={el.poster}
      autoPlay
      muted={el.muted ?? true}
      loop={!el.endTime && (el.loop ?? true)}
      playsInline
      controls={false}
      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: el.radius, display: "block" }}
    />
  );
}

/** Shadow + border styling applied to an element's positioned wrapper. */
export function elementFx(el: CanvasElement): React.CSSProperties {
  const shadow = el.shadow ? SHADOWS[el.shadow] : undefined;
  const border = el.borderWidth ? `${el.borderWidth}px solid ${el.borderColor && el.borderColor !== "none" ? el.borderColor : "#ffffff"}` : undefined;
  return { boxShadow: shadow, border, borderRadius: shadow || border ? el.radius : undefined };
}

/** Pure visual render of one canvas element (used by both editor + live site). */
export function ElementView({ el, boxW, boxH }: { el: CanvasElement; boxW?: number; boxH?: number }) {
  // Section presets render at a fixed design size, then stretch to fill the box.
  if (el.kind === "section" && el.section) {
    const size = presetSize[el.section];
    const sx = (boxW ?? size.w) / size.w;
    const sy = (boxH ?? size.h) / size.h;
    return (
      <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
        <div style={{ width: size.w, height: size.h, transform: `scale(${sx}, ${sy})`, transformOrigin: "top left" }}>
          <SectionPresetView el={el} />
        </div>
      </div>
    );
  }
  return <ElementInner el={el} />;
}

export function textStyleOf(el: CanvasElement): React.CSSProperties {
  const color = el.color && el.color !== "none" ? el.color : undefined;
  const fontFamily = el.font
    ? `'${el.font}', sans-serif`
    : el.fontFamily === "sans"
    ? "var(--font-sans)"
    : "var(--font-display)";
  return {
    color: color ?? "var(--color-fog)",
    fontSize: el.fontSize,
    fontWeight: el.fontWeight,
    fontFamily,
    textAlign: el.align,
    fontStyle: el.italic ? "italic" : undefined,
    textDecoration: el.underline ? "underline" : undefined,
    letterSpacing: el.letterSpacing ? `${el.letterSpacing}px` : undefined,
    lineHeight: el.lineHeight ?? 1.15,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    overflow: "hidden",
    wordBreak: "break-word",
  };
}

function ElementInner({ el }: { el: CanvasElement }) {
  const bg = el.bg && el.bg !== "none" ? el.bg : undefined;
  const color = el.color && el.color !== "none" ? el.color : undefined;
  const fontFamily = el.fontFamily === "sans" ? "var(--font-sans)" : "var(--font-display)";
  const textStyle = textStyleOf(el);

  switch (el.kind) {
    case "heading":
      return <div style={{ ...textStyle, letterSpacing: "-0.02em" }}>{el.text}</div>;

    case "text":
      return <div style={textStyle}>{el.text}</div>;

    case "image":
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={el.src || "/products/phone-ultra.jpg"}
          alt={el.text || ""}
          style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: el.radius, display: "block" }}
        />
      );

    case "video":
      return el.src ? (
        <VideoFx el={el} />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={el.poster || "/products/phone-aurora.jpg"} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: el.radius }} />
      );

    case "button":
      return (
        <a
          href={el.href || "#"}
          style={{
            width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
            background: bg ?? "linear-gradient(110deg,var(--color-iris),var(--color-cyan),var(--color-amber))",
            color: color ?? "var(--color-ink)",
            fontFamily, fontWeight: el.fontWeight ?? 700, fontSize: el.fontSize ?? 15,
            borderRadius: el.radius ?? 999, textDecoration: "none", padding: "0 18px",
          }}
        >
          {el.text || "Button"}
        </a>
      );

    case "box":
      return (
        <div
          style={{
            width: "100%", height: "100%",
            background: bg ?? "rgba(255,255,255,0.06)",
            borderRadius: el.radius ?? 16,
          }}
        />
      );

    default:
      return null;
  }
}
