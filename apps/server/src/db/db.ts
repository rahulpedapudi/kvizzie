import "dotenv/config";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

// const connectionString = process.env.DATABASE_URL;
const connectionString =
  "postgres://kvizzie_user:kvizzie@localhost:5432/kvizzie";

if (!connectionString) {
  throw new Error("DATABASE_URL env var is not set.");
}

const isSupabasePooler =
  connectionString.includes("pooler.supabase.com") ||
  connectionString.includes(":6543");

export const client = postgres(connectionString, {
  prepare: !isSupabasePooler,
  max: 10,
});

export const db = drizzle({ client });
