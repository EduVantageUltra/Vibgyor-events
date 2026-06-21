"use client";

import { Component, type ReactNode } from "react";

/**
 * Catches render errors so one bad block can never crash the whole page.
 * Shows a small inline fallback instead.
 */
export class ErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode; silent?: boolean },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    if (typeof console !== "undefined") console.warn("[block error caught]", error);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.silent) return null;
      return (
        this.props.fallback ?? (
          <div className="mx-auto my-2 max-w-md rounded-2xl border border-amber/30 bg-amber/5 px-4 py-3 text-center text-xs text-amber">
            This block couldn&apos;t load. Edit or remove it in the editor — the rest of the page is fine.
          </div>
        )
      );
    }
    return this.props.children;
  }
}
