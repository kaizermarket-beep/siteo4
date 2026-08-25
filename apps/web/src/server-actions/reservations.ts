"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { siteReservations, sites } from "@/lib/db/schema";
import { resolveIdentity } from "@/lib/identity";
import { loadPublishedBlock } from "@/lib/published-block";
import { clientDecisionMail, type BookingSummary } from "@/lib/booking-emails";
import { sendMailQuietly } from "@/lib/email";
import type { ReservationStatus } from "@/lib/db/schema";

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * The booking, once the caller has been proved to own the site it belongs to.
 * Every action in this file starts here — the public routes that create
 * bookings are deliberately unauthenticated, so this is the only gate that
 * matters.
 */
async function ownedReservation(reservationId: string) {
  const identity = await resolveIdentity();
  if (!identity) throw new Error("Non authentifié.");

  const [row] = await db
    .select({ reservation: siteReservations, site: sites })
    .from(siteReservations)
    .innerJoin(sites, eq(siteReservations.siteId, sites.id))
    .where(eq(siteReservations.id, reservationId));

  if (!row || row.site.userId !== identity.userId) {
    throw new Error("Réservation introuvable.");
  }
  return row;
}

/** The phone number the site publishes, for the email the client receives. */
async function businessPhone(siteSlug: string): Promise<string> {
  for (const type of ["appointment", "reservation"]) {
    const found = await loadPublishedBlock(siteSlug, type);
    const phone = (found?.content as { phone?: unknown } | undefined)?.phone;
    if (typeof phone === "string" && phone !== "") return phone;
  }
  return "";
}

export async function setReservationStatus(reservationId: string, status: ReservationStatus) {
  const row = await ownedReservation(reservationId);

  await db
    .update(siteReservations)
    .set({ status, updatedAt: new Date() })
    .where(and(eq(siteReservations.id, reservationId), eq(siteReservations.siteId, row.site.id)));

  // The client hears back only on a decision. Cancelling on their behalf, or
  // moving a booking back to pending, is bookkeeping — sending mail for it
  // would be noise.
  if ((status === "confirmed" || status === "declined") && row.reservation.guestEmail) {
    const summary: BookingSummary = {
      siteName: row.site.name,
      what: row.reservation.serviceName ?? "Table",
      date: row.reservation.serviceDate,
      slot: row.reservation.slot,
      clientName: row.reservation.guestName,
      clientPhone: row.reservation.guestPhone,
      clientEmail: row.reservation.guestEmail,
      note: row.reservation.note,
      businessPhone: await businessPhone(row.site.slug),
    };
    await sendMailQuietly({
      to: row.reservation.guestEmail,
      ...clientDecisionMail(summary, status === "confirmed"),
    });
  }

  // Declining frees the slot, so the public availability changes. That
  // endpoint is uncached, but the dashboard list needs refreshing.
  revalidatePath(`/app/sites/${row.site.id}/reservations`);
  return { ok: true as const };
}

/**
 * Move a booking to another day or time.
 *
 * Deliberately *not* gated on the public availability rules. The owner is the
 * authority on their own book: they know they can squeeze a colour in at
 * 12h15, or that the client agreed to move on the phone. Once moved, the
 * booking counts against availability at its new time like any other.
 */
export async function rescheduleReservation(
  reservationId: string,
  serviceDate: string,
  slot: string
) {
  if (!DATE_RE.test(serviceDate)) throw new Error("Date invalide.");
  if (!TIME_RE.test(slot)) throw new Error("Heure invalide.");

  const row = await ownedReservation(reservationId);

  await db
    .update(siteReservations)
    .set({ serviceDate, slot, updatedAt: new Date() })
    .where(and(eq(siteReservations.id, reservationId), eq(siteReservations.siteId, row.site.id)));

  revalidatePath(`/app/sites/${row.site.id}/reservations`);
  return { ok: true as const };
}
