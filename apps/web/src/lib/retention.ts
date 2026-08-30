import "server-only";
import { and, eq, gte, lt, notInArray } from "drizzle-orm";
import { db } from "./db";
import {
  GUEST_ACCOUNT_DAYS,
  RATE_LIMIT_HIT_DAYS,
  RESERVATION_MONTHS,
} from "./retention-policy";
import {
  rateLimitHits,
  sessions,
  siteBlocks,
  siteReservations,
  sites,
  users,
  verificationTokens,
} from "./db/schema";

// Retention, as the RGPD requires it: personal data is kept "pour une durée
// n'excédant pas celle nécessaire au regard des finalités" (art. 5.1.e).
//
// A privacy policy that announces a duration and a database that keeps
// everything for ever is the gap regulators actually look for, so the
// durations below are the single source of truth: the policy quotes them,
// this module enforces them, and /api/cron/purge runs it on a schedule.
//
// The durations themselves live in retention-policy.ts, which has no
// database import, so the legal pages can quote them without dragging the
// Postgres driver into a marketing route.

export type PurgeReport = {
  rateLimitHits: number;
  guestAccounts: number;
  reservations: number;
  sessions: number;
  verificationTokens: number;
};

function daysAgo(days: number): Date {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

/**
 * Deletes everything past its retention window and reports what went.
 *
 * Idempotent and safe to run twice: every clause is a date comparison, not
 * a queue. Counts are returned rather than logged so the caller can record
 * them — being able to show *that* the purge runs is half of proving the
 * retention policy is real.
 *
 * `returning()` is called without a column list because `db` is a union of
 * the Neon HTTP and node-postgres builders, and only the no-argument
 * overload exists on both. The rows are counted, never read.
 */
export async function purgeExpiredData(): Promise<PurgeReport> {
  const hits = await db
    .delete(rateLimitHits)
    .where(lt(rateLimitHits.createdAt, daysAgo(RATE_LIMIT_HIT_DAYS)))
    .returning();

  // Guests only, and only those untouched for the whole window. "Touched"
  // means the account was created or one of their blocks was edited inside
  // the window — an abandoned draft is one nobody has come back to.
  //
  // Written as a select then a delete rather than one statement with a
  // subquery: db is either the Neon HTTP driver or node-postgres depending
  // on the environment, and raw `execute` does not return the same shape
  // from both. The query builder does.
  const guestCutoff = daysAgo(GUEST_ACCOUNT_DAYS);

  const recentlyActive = await db
    .selectDistinct({ userId: sites.userId })
    .from(sites)
    .innerJoin(siteBlocks, eq(siteBlocks.siteId, sites.id))
    .where(gte(siteBlocks.updatedAt, guestCutoff));

  const activeIds = recentlyActive.map((r) => r.userId);
  const staleGuests = await db
    .delete(users)
    .where(
      and(
        eq(users.isGuest, true),
        lt(users.createdAt, guestCutoff),
        // notInArray on an empty list is a SQL error in some drivers and a
        // no-op in others, so the clause is only added when there is
        // actually someone to protect.
        activeIds.length > 0 ? notInArray(users.id, activeIds) : undefined
      )
    )
    .returning();

  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - RESERVATION_MONTHS);
  const bookings = await db
    .delete(siteReservations)
    // serviceDate is a "YYYY-MM-DD" string, which sorts chronologically —
    // that is the whole reason it is stored in that shape.
    .where(lt(siteReservations.serviceDate, cutoff.toISOString().slice(0, 10)))
    .returning();

  const deadSessions = await db
    .delete(sessions)
    .where(lt(sessions.expires, new Date()))
    .returning();

  const deadTokens = await db
    .delete(verificationTokens)
    .where(lt(verificationTokens.expires, new Date()))
    .returning();

  return {
    rateLimitHits: hits.length,
    guestAccounts: staleGuests.length,
    reservations: bookings.length,
    sessions: deadSessions.length,
    verificationTokens: deadTokens.length,
  };
}

/** Guard so a caller cannot delete a real account through the guest path. */
export async function isGuestAccount(userId: string): Promise<boolean> {
  const [row] = await db.select({ isGuest: users.isGuest }).from(users).where(eq(users.id, userId));
  return row?.isGuest === true;
}

