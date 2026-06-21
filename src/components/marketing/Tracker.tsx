"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Pings our own analytics on each page view (own first-party tracking). */
export function Tracker() {
  const pathname = usePathname();
  useEffect(() => {
    if (!pathname || pathname.startsWith("/editor")) return;
    fetch("/api/track", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ path: pathname }) }).catch(() => {});
  }, [pathname]);
  return null;
}
