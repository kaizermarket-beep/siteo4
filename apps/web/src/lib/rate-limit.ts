import { and, gt, sql } from "drizzle-orm";
import { db } from "./db";
import { rateLimitHits } from "./db/schema";

// DB-backed fixed-window rate limiter (not in-memory): Server Actions don't
// reliably share module state across invocations — confirmed even in local
// dev under Turbopack, and true by construction on serverless in
// production — so a plain in-process Map silently doesn't work here.
export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<{ allowed: boolean }> {
  const windowStart = new Date(Date.now() - windowMs);

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(rateLimitHits)
    .where(and(sql`${rateLimitHits.key} = ${key}`, gt(rateLimitHits.createdAt, windowStart)));

  if (count >= limit) {
    return { allowed: false };
  }

  await db.insert(rateLimitHits).values({ key });
  return { allowed: true };
}
