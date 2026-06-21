"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import type { CanvasDoc } from "@/lib/freecanvas";
import { ElementView, elementFx } from "./ElementView";
import { AnimatedWrap } from "./AnimatedWrap";
import { googleFontsHref } from "./fonts";
import { ErrorBoundary } from "@/components/util/ErrorBoundary";

const MOBILE_BP = 768;

/**
 * Renders a free-canvas page on the live site. Picks the desktop or mobile
 * layout based on screen width, then scales that fixed-width "stage" to fill
 * the viewport — so the design looks exactly as placed, on any device.
 */
export function FreeCanvasRender({ doc }: { doc: CanvasDoc }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const measure = () => {
      const w = wrapRef.current?.clientWidth ?? window.innerWidth;
      const mobile = window.innerWidth < MOBILE_BP;
      setIsMobile(mobile);
      const designW = mobile ? doc.mobileW : doc.desktopW;
      setScale(w / designW);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [doc.desktopW, doc.mobileW]);

  const designW = isMobile ? doc.mobileW : doc.desktopW;
  const designH = isMobile ? doc.mobileH : doc.desktopH;
  const bg = doc.bg && doc.bg !== "none" ? doc.bg : undefined;
  const fontHref = googleFontsHref(doc.elements.map((e) => e.font).filter((f): f is string => !!f));

  return (
    <div ref={wrapRef} style={{ width: "100%", height: designH * scale, overflow: "hidden", position: "relative" }}>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      {fontHref && <link rel="stylesheet" href={fontHref} />}
      <div
        style={{
          width: designW,
          height: designH,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          position: "relative",
          background: bg,
        }}
      >
        {doc.elements.filter((el) => !el.hidden).map((el) => {
          const box = isMobile ? el.mobile : el.desktop;
          return (
            <div
              key={el.id}
              style={{
                position: "absolute",
                left: box.x,
                top: box.y,
                width: box.w,
                height: box.h,
                transform: el.rotate ? `rotate(${el.rotate}deg)` : undefined,
                opacity: el.opacity ?? 1,
                zIndex: el.z ?? 1,
                ...elementFx(el),
              }}
            >
              <Suspense fallback={null}>
                <ErrorBoundary silent>
                  <AnimatedWrap el={el} active>
                    <ElementView el={el} boxW={box.w} boxH={box.h} />
                  </AnimatedWrap>
                </ErrorBoundary>
              </Suspense>
            </div>
          );
        })}
      </div>
    </div>
  );
}
