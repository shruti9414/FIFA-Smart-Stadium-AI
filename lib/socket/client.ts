import { io, type Socket } from "socket.io-client";
import type { ClientEmitEvents, SocketEventMap } from "@/lib/types/socket";

type TypedSocket = Socket<SocketEventMap, ClientEmitEvents>;

let socket: TypedSocket | null = null;

/** Client-side singleton — lazily connects on first call, browser-only. */
export function getSocket(): TypedSocket {
  if (typeof window === "undefined") {
    throw new Error("getSocket() must only be called on the client.");
  }
  if (socket) return socket;

  const url = process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:3000";
  socket = io(url, { autoConnect: true, reconnection: true });
  return socket;
}
