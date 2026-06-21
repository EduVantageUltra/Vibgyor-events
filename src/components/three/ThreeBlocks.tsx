"use client";

import dynamic from "next/dynamic";

const Loading = () => (
  <div className="grid h-full w-full place-items-center text-xs text-fog-dim">Loading 3D…</div>
);

const ThreeShapeScene = dynamic(() => import("./scenes").then((m) => m.ThreeShapeScene), { ssr: false, loading: Loading });
const Model3DScene = dynamic(() => import("./scenes").then((m) => m.Model3DScene), { ssr: false, loading: Loading });
const WebGLBgScene = dynamic(() => import("./scenes").then((m) => m.WebGLBgScene), { ssr: false, loading: Loading });

export function ThreeShape({ shape, color, metalness, autoRotate, height }: { shape: string; color: string; metalness: number; autoRotate: boolean; height: number }) {
  return (
    <div style={{ height: height || 360, width: "100%" }}>
      <ThreeShapeScene shape={shape} color={color} metalness={metalness} autoRotate={autoRotate} />
    </div>
  );
}

export function Model3D({ url, autoRotate, height }: { url: string; autoRotate: boolean; height: number }) {
  return (
    <div style={{ height: height || 420, width: "100%" }}>
      <Model3DScene url={url} autoRotate={autoRotate} />
    </div>
  );
}

export function WebGLBackground({ color, count, height, heading, subheading }: { color: string; count: number; height: number; heading: string; subheading: string }) {
  return (
    <div className="relative overflow-hidden rounded-[2rem]" style={{ height: height || 420, width: "100%", background: "linear-gradient(135deg,#0b0b12,#070709)" }}>
      <div className="absolute inset-0">
        <WebGLBgScene color={color} count={count} />
      </div>
      {(heading || subheading) && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          {heading && <h2 className="font-display text-4xl font-bold sm:text-6xl">{heading}</h2>}
          {subheading && <p className="mt-3 text-fog-dim">{subheading}</p>}
        </div>
      )}
    </div>
  );
}
