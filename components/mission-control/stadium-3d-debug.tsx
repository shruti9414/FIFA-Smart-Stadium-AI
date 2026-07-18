"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const DebugCanvasComponent = dynamic(
  () => import("./stadium-3d-debug-client").then((mod) => ({ default: mod.DebugCanvasClient })),
  {
    loading: () => (
      <div style={{ width: "100%", height: "100%", background: "#000", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#0ff", fontSize: "14px" }}>Loading 3D Canvas...</div>
      </div>
    ),
    ssr: false,
  }
);

export function Stadium3DDebug() {
  return (
    <Suspense fallback={<div style={{ background: "#000", width: "100%", height: "100%" }} />}>
      <DebugCanvasComponent />
    </Suspense>
  );
}
