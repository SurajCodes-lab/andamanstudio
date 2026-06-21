import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");

// Reuse the postgres-js client across hot-reloads in dev.
const globalForDb = globalThis as unknown as { _pg?: ReturnType<typeof postgres> };
const sql = globalForDb._pg ?? postgres(connectionString, { prepare: false });
if (process.env.NODE_ENV !== "production") globalForDb._pg = sql;

export const db = drizzle(sql, { schema });
export { schema };
