import { NextResponse } from "next/server";
import {
  getAvailability,
  loadReservationSettings,
  rejectDate,
} from "@/lib/reservations";

// Never cached, by construction and by header. The published pages *are*
// cached for an hour (see lib/site-pages.ts), so availability cannot be
// rendered into them — an hour-old "3 tables left" is worse than none. The
// form asks this route instead, live, every time the visitor changes a date.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const siteSlug = url.searchParams.get("site") ?? "";
  const date = url.searchParams.get("date") ?? "";
  const partySize = Number(url.searchParams.get("party") ?? "2");

  if (!siteSlug || !date || !Number.isInteger(partySize) || partySize < 1) {
    return NextResponse.json({ error: "Paramètres invalides." }, { status: 400 });
  }

  const found = await loadReservationSettings(siteSlug);
  if (!found) {
    return NextResponse.json({ error: "Réservation indisponible." }, { status: 404 });
  }
  const { siteId, settings } = found;

  if (partySize > settings.maxPartySize) {
    return NextResponse.json(
      { tooLarge: true, maxPartySize: settings.maxPartySize, phone: settings.phone, slots: [] },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  const rejection = rejectDate(date, settings);
  if (rejection) {
    return NextResponse.json(
      { rejection, slots: [] },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  const slots = await getAvailability(siteId, settings, date, partySize);
  return NextResponse.json({ slots }, { headers: { "Cache-Control": "no-store" } });
}
