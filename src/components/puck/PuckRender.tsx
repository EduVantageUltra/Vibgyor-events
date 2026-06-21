"use client";

import { Suspense } from "react";
import { Render, type Data } from "@measured/puck";
import { puckConfig } from "@/lib/puck/config";
import { ErrorBoundary } from "@/components/util/ErrorBoundary";

export function PuckRender({ data }: { data: Data }) {
  return (
    <Suspense fallback={null}>
      <ErrorBoundary>
        <Render config={puckConfig} data={data} />
      </ErrorBoundary>
    </Suspense>
  );
}
