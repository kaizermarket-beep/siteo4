import "server-only";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "./db";
import { siteReservations } from "./db/schema";
import { loadPublishedBlock } from "./published-block";
import { msUntil, todayInParis, type ServiceDate } from "./reservations";
import {
  appointmentContentSchema,
  type AppointmentContent,
  type AppointmentService,
} from "@/validation/blocks/appointment.schema";

// Appointment booking — hair salons, barbers, anything where one person
// occupies one chair for a known length of time.
//
// The difference with restaurant tables is that an appointment has a
// *duration*. A 90-minute colouring starting at 10:00 makes 10:15, 10:30 and
// so on unbookable for the same stylist, even though nothing was booked at
// those times. So availability is an overlap test over intervals, not a
// count per named slot — which is why the duration is written on the booking
// row and re-read here.

export type AppointmentSlot = {
  /** Start time, "HH:MM". */
  slot: string;
  available: boolean;
};

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Fallback length for a booking row with no duration (a restaurant table). */
const UNKNOWN_DURATION_MINUTES = 30;

export async function loadAppointmentSettings(
  siteSlug: string
): Promise<{ siteId: string; settings: AppointmentContent } | null> {
  const found = await loadPublishedBlock(siteSlug, "appointment");
  if (!found) return null;

  const parsed = appointmentContentSchema.safeParse(found.content);
  if (!parsed.success) return null;

  return { siteId: found.siteId, settings: parsed.data };
}

/** "HH:MM" → minutes since midnight. */
export function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/** Minutes since midnight → "HH:MM". */
export function toTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** The service the visitor asked for, matched by name. */
export function findService(
  settings: AppointmentContent,
  name: string
): AppointmentService | undefined {
  return settings.services.find((s) => s.name === name);
}

export type DateRejection = "bad_format" | "closed_day" | "too_soon" | "too_far";

export function rejectDate(date: ServiceDate, settings: AppointmentContent): DateRejection | null {
  if (!DATE_RE.test(date)) return "bad_format";

  const today = todayInParis();
  if (date < today) return "too_soon";

  const horizon = new Date();
  horizon.setDate(horizon.getDate() + settings.maxDaysAhead);
  if (date > horizon.toISOString().slice(0, 10)) return "too_far";

  // Checked after the calendar bounds so a holiday in the past still reads
  // as "passée" rather than as an exceptional closure.
  if (settings.closedDates.includes(date)) return "closed_day";

  const [y, m, d] = date.split("-").map(Number);
  const weekday = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  const day = settings.hours.find((h) => h.day === weekday);
  if (!day || day.ranges.length === 0) return "closed_day";

  return null;
}

/**
 * Every start time the salon could propose that day for this service.
 *
 * Walks each opening range in `slotStep` increments and keeps the starts
 * where the whole service still fits before the range closes: a 45-minute
 * coupe cannot start at 11:45 in a morning that ends at 12:30.
 */
export function candidateStarts(settings: AppointmentContent, durationMinutes: number, weekday: number): number[] {
  const day = settings.hours.find((h) => h.day === weekday);
  if (!day) return [];

  const starts: number[] = [];
  for (const range of day.ranges) {
    const open = toMinutes(range.start);
    const close = toMinutes(range.end);
    for (let t = open; t + durationMinutes <= close; t += settings.slotStep) {
      starts.push(t);
    }
  }
  return [...new Set(starts)].sort((a, b) => a - b);
}

/**
 * What is still free on a given day for a given service.
 *
 * Counts only pending and confirmed bookings: a declined or cancelled one
 * has released the chair, and leaving it in would slowly starve the salon of
 * availability it actually has.
 */
export async function getAppointmentAvailability(
  siteId: string,
  settings: AppointmentContent,
  date: ServiceDate,
  service: AppointmentService
): Promise<AppointmentSlot[]> {
  const rows = await db
    .select({
      slot: siteReservations.slot,
      durationMinutes: siteReservations.durationMinutes,
    })
    .from(siteReservations)
    .where(
      and(
        eq(siteReservations.siteId, siteId),
        eq(siteReservations.serviceDate, date),
        inArray(siteReservations.status, ["pending", "confirmed"])
      )
    );

  const booked = rows.map((r) => {
    const start = toMinutes(r.slot);
    return { start, end: start + (r.durationMinutes ?? UNKNOWN_DURATION_MINUTES) };
  });

  const [y, m, d] = date.split("-").map(Number);
  const weekday = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  const noticeMs = settings.noticeHours * 3_600_000;

  return candidateStarts(settings, service.durationMinutes, weekday).map((start) => {
    const end = start + service.durationMinutes;
    // Two intervals overlap unless one ends before the other begins. Back to
    // back is fine: a 10:00-10:30 and a 10:30-11:00 share nothing.
    const busy = booked.filter((b) => b.start < end && start < b.end).length;
    const slot = toTime(start);

    return {
      slot,
      available: busy < settings.staffCount && msUntil(date, slot) >= noticeMs,
    };
  });
}
