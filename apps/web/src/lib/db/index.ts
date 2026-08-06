import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { drizzle as drizzleNode } from "drizzle-orm/node-postgres";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

// Neon's HTTP driver only reaches Neon/Vercel Postgres over the network —
// local Postgres (dev) needs a plain TCP driver instead.
const isNeon = process.env.DATABASE_URL.includes("neon.tech");

export const db = isNeon
  ? drizzleNeon(neon(process.env.DATABASE_URL), { schema })
  : drizzleNode(process.env.DATABASE_URL, { schema });
