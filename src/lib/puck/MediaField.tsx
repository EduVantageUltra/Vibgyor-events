"use client";

import { useRef, useState } from "react";

/**
 * Custom Puck field: drag-and-drop (or click, or paste URL) an image / video.
 * Uploads to /api/upload and stores the resulting URL.
 */
export function MediaField({
  value,
  onChange,
  accept = "image/*",
  label = "Drop media",
}: {
  value?: string;
  onChange: (v: string) => void;
  accept?: string;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);

  const isVideo = accept.includes("video") || /\.(mp4|webm|mov)$/i.test(value || "");

  const upload = async (file: File) => {
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (json.url) onChange(json.url);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          const f = e.dataTransfer.files?.[0];
          if (f) upload(f);
        }}
        onClick={() => inputRef.current?.click()}
        style={{
          border: `2px dashed ${drag ? "#7c5cff" : "#d0d0d8"}`,
          background: drag ? "rgba(124,92,255,0.06)" : "#fafafa",
          borderRadius: 12,
          padding: 14,
          textAlign: "center",
          cursor: "pointer",
          fontSize: 13,
          color: "#555",
          transition: "all .2s",
        }}
      >
        {busy ? "Uploading…" : value ? "Replace — drop or click" : `${label} — drop or click`}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) upload(f);
          }}
        />
      </div>

      <input
        type="text"
        value={value || ""}
        placeholder="…or paste a URL"
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "8px 10px",
          borderRadius: 8,
          border: "1px solid #e2e2e8",
          fontSize: 12,
        }}
      />

      {value && (
        <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid #eee" }}>
          {isVideo ? (
            <video src={value} muted loop autoPlay playsInline style={{ width: "100%", display: "block" }} />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="preview" style={{ width: "100%", display: "block" }} />
          )}
        </div>
      )}
    </div>
  );
}
