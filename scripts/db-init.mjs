// Applies scripts/db-init.sql against the configured MySQL instance.
// Run with: npm run db:init  (requires DB_* env vars — see .env.example)
import mysql from "mysql2/promise";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const dir = path.dirname(fileURLToPath(import.meta.url));
const sql = readFileSync(path.join(dir, "db-init.sql"), "utf8");

const connection = await mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  multipleStatements: true,
});

try {
  await connection.query(sql);
  console.log("Database schema initialized (fifa_smart_stadium).");
} finally {
  await connection.end();
}
