import { createServer } from "http";
import next from "next";
import { initSocketServer } from "@/lib/socket/server";
import { startSimEngine } from "@/lib/sim/engine";
import { getEnv } from "@/lib/env";

/**
 * Custom server wrapping Next.js + Socket.io in one process (confirmed
 * architecture decision — Socket.io needs a persistent process, which
 * plain `next dev`/`next start`/serverless platforms like Vercel can't
 * hold). Replaces `next dev`/`next start` in package.json scripts.
 * Demo/deploy target: local machine or Render/Railway.
 */
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => handler(req, res));

  initSocketServer(httpServer);

  const { SOCKET_PORT } = getEnv();
  const port = Number(process.env.PORT) || SOCKET_PORT;
  httpServer.listen(port, "0.0.0.0", () => {
    console.log(`> FIFA Smart Stadium AI ready on http://localhost:${port} (${dev ? "dev" : "prod"})`);
  });

  startSimEngine().catch((err) => {
    console.error("[sim] failed to start — is MySQL running and seeded? (npm run db:init && npm run db:seed)", err);
  });
});
