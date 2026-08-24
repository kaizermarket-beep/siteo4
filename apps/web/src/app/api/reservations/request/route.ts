import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { siteReservations } from "@/lib/db/schema";
import { rateLimit } from "@/lib/rate-limit";
import { getAvailability, loadReservationSettings, rejectDate } from "@/lib/reservations";

export const dynamic = "force-dynamic";

const MAX_TEXT = 500;

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const { allowed } = await rateLimit(`reservation:${ip}`, 10, 60 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Trop de demandes. Réessayez plus tard ou appelez le restaurant." },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  // Hidden field no human fills in. Cheaper and less hostile than a captcha,
  // and it stops the bulk of form spam on a page like this.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const siteSlug = String(body.site ?? "");
  const date = String(body.date ?? "");
  const slot = String(body.slot ?? "");
  const partySize = Number(body.partySize);
  const name = String(body.name ?? "").trim().slice(0, MAX_TEXT);
  const phone = String(body.phone ?? "").trim().slice(0, 30);
  const email = String(body.email ?? "").trim().slice(0, MAX_TEXT);
  const note = String(body.note ?? "").trim().slice(0, MAX_TEXT);

  if (!name || !phone) {
    return NextResponse.json({ error: "Nom et téléphone requis." }, { status: 400 });
  }
  if (!Number.isInteger(partySize) || partySize < 1) {
    return NextResponse.json({ error: "Nombre de personnes invalide." }, { status: 400 });
  }

  const found = await loadReservationSettings(siteSlug);
  if (!found) {
    return NextResponse.json({ error: "Réservation indisponible." }, { status: 404 });
  }
  const { siteId, settings } = found;

  if (partySize > settings.maxPartySize) {
    return NextResponse.json(
      { error: `Au-delà de ${settings.maxPartySize} personnes, contactez directement le restaurant.` },
      { status: 400 }
    );
  }
  if (rejectDate(date, settings)) {
    return NextResponse.json({ error: "Cette date n'est pas ouverte à la réservation." }, { status: 400 });
  }

  // Re-checked server-side rather than trusted from the form. The browser was
  // told what was free when the page was filled in; between then and now
  // someone else may have taken the last table.
  const slots = await getAvailability(siteId, settings, date, partySize);
  const target = slots.find((s) => s.slot === slot);
  if (!target || !target.available) {
    return NextResponse.json(
      { error: "Ce créneau vient d'être pris. Choisissez-en un autre." },
      { status: 409 }
    );
  }

  await db.insert(siteReservations).values({
    siteId,
    serviceDate: date,
    slot,
    partySize,
    guestName: name,
    guestPhone: phone,
    guestEmail: email || null,
    note: note || null,
  });

  // "pending", never "confirmed": the restaurant confirms, not the website.
  return NextResponse.json({ ok: true, status: "pending" });
}
