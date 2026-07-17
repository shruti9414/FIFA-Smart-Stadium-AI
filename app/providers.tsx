"use client";

import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { getSocket } from "@/lib/socket/client";

interface SocketContextValue {
  connected: boolean;
}

const SocketContext = createContext<SocketContextValue>({ connected: false });

export function useSocketStatus(): SocketContextValue {
  return useContext(SocketContext);
}

function subscribeToSocket(callback: () => void) {
  const socket = getSocket();
  socket.on("connect", callback);
  socket.on("disconnect", callback);
  return () => {
    socket.off("connect", callback);
    socket.off("disconnect", callback);
  };
}

function getConnectedSnapshot(): boolean {
  return getSocket().connected;
}

function getServerConnectedSnapshot(): boolean {
  return false;
}

function SocketProvider({ children }: { children: ReactNode }) {
  // useSyncExternalStore over useEffect+useState: socket.connected is an
  // external mutable source, so this avoids an extra render-after-mount
  // and the setState-in-effect cascading-render pitfall entirely.
  const connected = useSyncExternalStore(subscribeToSocket, getConnectedSnapshot, getServerConnectedSnapshot);

  return <SocketContext.Provider value={{ connected }}>{children}</SocketContext.Provider>;
}

/**
 * Root provider stack. MotionConfig reducedMotion="user" makes every
 * Framer Motion animation in the app automatically honor
 * prefers-reduced-motion (§9.9) without each component opting in
 * individually; hooks/useReducedMotion.ts still covers non-Framer
 * (CSS class / plain-JS) decisions like zoneHeatPulse intensity.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}>
      <SocketProvider>{children}</SocketProvider>
    </MotionConfig>
  );
}
