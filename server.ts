import { createServer } from "http";
import next from "next";
import { initSocketServer } from "@/lib/socket/server";
import { startSimEngine } from "@/lib/sim/engine";
import { getEnv } from "@/lib/env";

process.on("uncaughtException", (err) => {
  console.error("[server] uncaught exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("[server] unhandled rejection:", reason);
  process.exit(1);
});

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handler = app.getRequestHandler();

const { SOCKET_PORT } = getEnv();
const port = Number(process.env.PORT) || SOCKET_PORT;

console.log(`[server] starting on port ${port} (NODE_ENV=${process.env.NODE_ENV})`);

app
  .prepare()
  .then(() => {
    const httpServer = createServer((req, res) => handler(req, res));

    initSocketServer(httpServer);

    httpServer.listen(port, "0.0.0.0", () => {
      console.log(`[server] ready on http://0.0.0.0:${port} (${dev ? "dev" : "prod"})`);
    });

    startSimEngine().catch((err) => {
      console.error("[sim] failed to start — DB unavailable, sim engine disabled:", err?.message ?? err);
    });
  })
  .catch((err) => {
    console.error("[server] app.prepare() failed:", err);
    process.exit(1);
  });
