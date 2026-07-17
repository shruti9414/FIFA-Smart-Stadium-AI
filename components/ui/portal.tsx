"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";

// No-op store — subscribe never fires; this only exists to get a
// hydration-safe true-after-mount flag via useSyncExternalStore instead
// of the useEffect+useState "hasMounted" pattern (avoids an extra
// post-mount render).
const emptySubscribe = () => () => {};

/** Renders children into document.body — keeps overlays (Modal/Drawer/Sheet) out of clipped/relatively-positioned ancestors. */
export function Portal({ children }: { children: ReactNode }) {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  if (!mounted) return null;
  return createPortal(children, document.body);
}
