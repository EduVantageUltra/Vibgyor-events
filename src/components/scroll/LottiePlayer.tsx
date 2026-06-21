"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";

export function LottiePlayer({ url, loop, height }: { url: string; loop: boolean; height: number }) {
  const [data, setData] = useState<object | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!url) return;
    let alive = true;
    fetch(url)
      .then((r) => r.json())
      .then((d) => alive && setData(d))
      .catch(() => alive && setFailed(true));
    return () => { alive = false; };
  }, [url]);

  if (!url || failed) {
    return <div style={{ height: height || 320 }} className="grid place-items-center rounded-2xl bg-white/[0.03] text-xs text-fog-dim">Add a Lottie JSON URL</div>;
  }
  if (!data) return <div style={{ height: height || 320 }} className="grid place-items-center text-xs text-fog-dim">Loading animation…</div>;
  return (
    <div style={{ height: height || 320 }}>
      <Lottie animationData={data} loop={loop ?? true} autoplay style={{ height: "100%", width: "100%" }} />
    </div>
  );
}
