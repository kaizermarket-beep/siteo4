"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { siteReservations, sites } from "@/lib/db/schema";
import { resolveIdentity } from "@/lib/identity";
import type { ReservationStatus } from "@/lib/db/schema";

// Only the owner of the site may act on its bookings. The public routes that
// create them are deliberately unauthenticated — anyone can ask for a table —
// so this is the only gate that matters.
export async function setReservationStatus(reservationId: string, status: ReservationStatus) {
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

  await db
    .update(siteReservations)
    .set({ status, updatedAt: new Date() })
    .where(and(eq(siteReservations.id, reservationId), eq(siteReservations.siteId, row.site.id)));

  // Declining frees the table, so the public availability changes. That
  // endpoint is uncached, but the dashboard list needs refreshing.
  revalidatePath(`/app/sites/${row.site.id}/reservations`);
  return { ok: true as const };
}
