import mysql from "mysql2/promise";
import { getEnv } from "@/lib/env";

/**
 * Singleton connection pool. MySQL is the facts layer for this product —
 * every query module in lib/db/* reads/writes through this pool. Nothing
 * in here ever calls Gemini; see lib/ai for the intelligence layer.
 *
 * Stored on globalThis (not a plain module-scoped `let`) so server.ts
 * (loaded directly by tsx) and Next's dev-bundled API routes share one
 * real pool instead of each getting a separate connectionLimit=10 pool —
 * same reasoning as lib/socket/server.ts's io singleton.
 */
declare global {
  var __dbPool: mysql.Pool | undefined;
}

export function getPool(): mysql.Pool {
  if (globalThis.__dbPool) return globalThis.__dbPool;

  const env = getEnv();
  globalThis.__dbPool = mysql.createPool({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    dateStrings: true,
  });

  return globalThis.__dbPool;
}
