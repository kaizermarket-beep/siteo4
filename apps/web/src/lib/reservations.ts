import "server-only";
import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "./db";
import { siteReservations } from "./db/schema";
import { loadPublishedBlock } from "./published-block";
import { reservationContentSchema, type ReservationContent } from "@/validation/blocks/reservation.schema";

/** A calendar day as "YYYY-MM-DD", the form the browser's date input uses. */
export type ServiceDate = string;

export type SlotAvailability = {
  slot: string;
  seatsLeft: number;
  tablesLeft: number;
  /** False when this slot cannot take the requested party. */
  available: boolean;
};

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * The reservation settings of a published site, or null when it takes none.
 * See loadPublishedBlock for why the settings live in the block itself.
 */
export async function loadReservationSettings(
  siteSlug: string
): Promise<{ siteId: string; settings: ReservationContent } | null> {
  const found = await loadPublishedBlock(siteSlug, "reservation");
  if (!found) return null;

  const parsed = reservationContentSchema.safeParse(found.content);
  if (!parsed.success) return null;

  return { siteId: found.siteId, settings: parsed.data };
}

/** Local calendar day in Europe/Paris, where the restaurants are. */
export function todayInParis(): ServiceDate {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/**
 * Milliseconds from now until a "YYYY-MM-DD" + "HH:MM" service.
 *
 * The wall-clock time is the restaurant's, so it is read as Europe/Paris.
 * The offset is resolved for that particular instant rather than assumed:
 * Paris is UTC+1 in winter and UTC+2 in summer, and hard-coding either puts
 * every booking an hour out for half the year.
 */
export function msUntil(date: ServiceDate, slot: string): number {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = slot.split(":").map(Number);
  const asIfUtc = Date.UTC(y, m - 1, d, hh, mm);

  const offsetLabel = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Paris",
    timeZoneName: "longOffset",
  })
    .formatToParts(new Date(asIfUtc))
    .find((part) => part.type === "timeZoneName")?.value;

  const match = offsetLabel?.match(/GMT([+-])(\d{2}):(\d{2})/);
  const offsetMs = match
    ? (match[1] === "-" ? 1 : -1) * (Number(match[2]) * 60 + Number(match[3])) * 60_000
    : 0;

  return asIfUtc + offsetMs - Date.now();
}

export type DateRejection = "bad_format" | "closed_day" | "too_soon" | "too_far";

/** Why a date cannot be booked, or null when it can. */
export function rejectDate(date: ServiceDate, settings: ReservationContent): DateRejection | null {
  if (!DATE_RE.test(date)) return "bad_format";

  const [y, m, d] = date.split("-").map(Number);
  const weekday = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  if (!settings.openDays.includes(weekday)) return "closed_day";

  const today = todayInParis();
  if (date < today) return "too_soon";

  const horizon = new Date();
  horizon.setDate(horizon.getDate() + settings.maxDaysAhead);
  if (date > horizon.toISOString().slice(0, 10)) return "too_far";

  return null;
}

/**
 * What is still free on a given day, slot by slot.
 *
 * Counts only pending and confirmed bookings: a declined or cancelled one
 * has released its table, and leaving it in the sum would slowly starve the
 * room of availability that actually exists.
 */
export async function getAvailability(
  siteId: string,
  settings: ReservationContent,
  date: ServiceDate,
  partySize: number
): Promise<SlotAvailability[]> {
  const rows = await db
    .select({
      slot: siteReservations.slot,
      seats: sql<number>`coalesce(sum(${siteReservations.partySize}), 0)::int`,
      tables: sql<number>`count(*)::int`,
    })
    .from(siteReservations)
    .where(
      and(
        eq(siteReservations.siteId, siteId),
        eq(siteReservations.serviceDate, date),
        inArray(siteReservations.status, ["pending", "confirmed"])
      )
    )
    .groupBy(siteReservations.slot);

  const booked = new Map(rows.map((r) => [r.slot, r]));

  return settings.slots.map((slot) => {
    const taken = booked.get(slot);
    const seatsLeft = Math.max(0, settings.seatCount - (taken?.seats ?? 0));
    const tablesLeft = Math.max(0, settings.tableCount - (taken?.tables ?? 0));
    const inTime = msUntil(date, slot) >= settings.noticeHours * 3_600_000;

    return {
      slot,
      seatsLeft,
      tablesLeft,
      available: inTime && tablesLeft >= 1 && seatsLeft >= partySize,
    };
  });
}
