import { and, asc, eq, gte } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { siteReservations, sites } from "@/lib/db/schema";
import { resolveIdentity } from "@/lib/identity";
import { todayInParis } from "@/lib/reservations";
import { ReservationRow } from "./ReservationRow";

// Lives in (editor) rather than (dashboard): both views are scoped to a
// single site and both resolve the owner with resolveIdentity, which accepts
// a guest. The dashboard layout requires a NextAuth session and would send
// someone to /login from their own site's bookings.
//
// Always fresh: a booking list that is even a minute stale is a table given
// away twice.
export const dynamic = "force-dynamic";

const DATE_FMT = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

export default async function ReservationsPage({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const { siteId } = await params;
  const identity = await resolveIdentity();
  if (!identity) notFound();

  const [site] = await db
    .select()
    .from(sites)
    .where(and(eq(sites.id, siteId), eq(sites.userId, identity.userId)));
  if (!site) notFound();

  const today = todayInParis();
  const upcoming = await db
    .select()
    .from(siteReservations)
    .where(and(eq(siteReservations.siteId, siteId), gte(siteReservations.serviceDate, today)))
    .orderBy(asc(siteReservations.serviceDate), asc(siteReservations.slot));

  const pending = upcoming.filter((r) => r.status === "pending");
  const byDate = new Map<string, typeof upcoming>();
  for (const r of upcoming) {
    if (r.status === "declined" || r.status === "cancelled") continue;
    byDate.set(r.serviceDate, [...(byDate.get(r.serviceDate) ?? []), r]);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Réservations</h1>
          <p className="text-sm text-neutral-500">{site.name}</p>
        </div>
        <Link
          href={`/app/sites/${siteId}/edit`}
          className="text-sm text-neutral-500 hover:text-neutral-900"
        >
          ← Retour à l&apos;éditeur
        </Link>
      </div>

      {pending.length > 0 && (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <strong>
            {pending.length} demande{pending.length > 1 ? "s" : ""} en attente
          </strong>{" "}
          — le client attend votre confirmation. Rien ne lui a été promis pour l&apos;instant.
        </p>
      )}

      {upcoming.length === 0 ? (
        <div className="rounded-xl border border-neutral-200 px-6 py-12 text-center">
          <p className="text-sm text-neutral-600">Aucune réservation à venir.</p>
          <p className="mt-2 text-xs text-neutral-400">
            Les demandes déposées depuis votre site apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {[...byDate.entries()].map(([date, rows]) => {
            const [y, m, d] = date.split("-").map(Number);
            const covers = rows
              .filter((r) => r.status !== "declined")
              .reduce((sum, r) => sum + r.partySize, 0);

            return (
              <section key={date} className="flex flex-col gap-3">
                <div className="flex items-baseline justify-between border-b border-neutral-200 pb-2">
                  <h2 className="font-medium text-neutral-900 first-letter:uppercase">
                    {DATE_FMT.format(new Date(Date.UTC(y, m - 1, d)))}
                  </h2>
                  <span className="text-sm text-neutral-500">
                    {rows.length} table{rows.length > 1 ? "s" : ""} · {covers} couvert
                    {covers > 1 ? "s" : ""}
                  </span>
                </div>
                <ul className="flex flex-col gap-2">
                  {rows.map((r) => (
                    <ReservationRow
                      key={r.id}
                      id={r.id}
                      slot={r.slot}
                      partySize={r.partySize}
                      guestName={r.guestName}
                      guestPhone={r.guestPhone}
                      guestEmail={r.guestEmail}
                      note={r.note}
                      status={r.status}
                    />
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
