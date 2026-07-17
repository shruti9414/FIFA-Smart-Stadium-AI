import type { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import type { SocketEventMap } from "@/lib/types/socket";

/**
 * Socket.io server plumbing. The sim engine (lib/sim/engine.ts) is the
 * main emitter of domain events (crowd:update, incident:new, ...), but
 * Next.js API routes (gate approve, incident create, demo scenario
 * triggers) also need to emit — and they run through Next's own dev
 * bundler, a SEPARATE module instantiation from server.ts (which tsx
 * loads directly). A plain module-scoped `let` singleton would silently
 * split into two unrelated instances across that boundary. Storing it on
 * `globalThis` keeps it a true process-wide singleton regardless of
 * which bundler loaded this file — the same pattern Next.js docs
 * recommend for singletons like a shared Prisma client.
 */
declare global {
  var __socketIO: SocketIOServer | undefined;
}

export function initSocketServer(httpServer: HttpServer): SocketIOServer {
  if (globalThis.__socketIO) return globalThis.__socketIO;

  const io = new SocketIOServer(httpServer, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    socket.on("join", (room: string) => {
      socket.join(room);
    });
    socket.on("leave", (room: string) => {
      socket.leave(room);
    });
  });

  globalThis.__socketIO = io;
  return io;
}

export function getSocketServer(): SocketIOServer {
  if (!globalThis.__socketIO) {
    throw new Error("Socket server not initialized — call initSocketServer(httpServer) first.");
  }
  return globalThis.__socketIO;
}

/** Typed emit helper — emits an event payload to a specific room. */
export function emitToRoom<E extends keyof SocketEventMap>(
  room: string,
  event: E,
  payload: SocketEventMap[E]
): void {
  getSocketServer().to(room).emit(event, payload);
}

/** Typed emit helper — broadcasts to every connected client. */
export function emitGlobal<E extends keyof SocketEventMap>(
  event: E,
  payload: SocketEventMap[E]
): void {
  getSocketServer().emit(event, payload);
}
