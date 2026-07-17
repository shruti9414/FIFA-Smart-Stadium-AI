"use client";

import { useEffect, useRef } from "react";
import { getSocket } from "@/lib/socket/client";
import { useSocketStatus } from "@/app/providers";
import type { SocketEventMap } from "@/lib/types/socket";

/**
 * Subscribes to a single typed Socket.io event for the lifetime of the
 * component. Returns live connection state (via the app-wide SocketProvider,
 * so it's not re-derived per hook instance) so UI can show a "reconnecting"
 * fallback (§10.1 Landing error state) instead of silently going stale.
 */
export function useSocket<E extends keyof SocketEventMap>(
  event: E,
  handler: (payload: SocketEventMap[E]) => void
): { connected: boolean } {
  const { connected } = useSocketStatus();
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    const socket = getSocket();
    const onEvent = (payload: SocketEventMap[E]) => handlerRef.current(payload);

    socket.on(event, onEvent as never);

    return () => {
      socket.off(event, onEvent as never);
    };
  }, [event]);

  return { connected };
}

/** Joins a Socket.io room for the lifetime of the component (e.g. `gate:3`, `ops`). */
export function useSocketRoom(room: string): void {
  useEffect(() => {
    const socket = getSocket();
    socket.emit("join", room);
    return () => {
      socket.emit("leave", room);
    };
  }, [room]);
}
