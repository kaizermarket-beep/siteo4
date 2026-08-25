import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { siteReservations, sites } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { rateLimit } from "@/lib/rate-limit";
import {
  findService,
  getAppointmentAvailability,
  loadAppointmentSettings,
  rejectDate,
} from "@/lib/appointments";
import { notifyBookingRequest } from "@/lib/booking-emails";

export const dynamic = "force-dynamic";

const MAX_TEXT = 500;

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const { allowed } = await rateLimit(`appointment:${ip}`, 10, 60 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Trop de demandes. Réessayez plus tard ou appelez le salon." },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  // Hidden field no human fills in. Cheaper and less hostile than a captcha.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const siteSlug = String(body.site ?? "");
  const date = String(body.date ?? "");
  const slot = String(body.slot ?? "");
  const serviceName = String(body.service ?? "");
  const name = String(body.name ?? "").trim().slice(0, MAX_TEXT);
  const phone = String(body.phone ?? "").trim().slice(0, 30);
  const email = String(body.email ?? "").trim().slice(0, MAX_TEXT);
  const note = String(body.note ?? "").trim().slice(0, MAX_TEXT);

  // Email is required here, unlike a restaurant table: the whole point of an
  // appointment is the confirmation that comes back.
  if (!name || !phone || !email.includes("@")) {
    return NextResponse.json({ error: "Nom, téléphone et email requis." }, { status: 400 });
  }

  const found = await loadAppointmentSettings(siteSlug);
  if (!found) {
    return NextResponse.json({ error: "Prise de rendez-vous indisponible." }, { status: 404 });
  }
  const { siteId, settings } = found;

  const service = findService(settings, serviceName);
  if (!service) {
    return NextResponse.json({ error: "Prestation inconnue." }, { status: 400 });
  }
  if (rejectDate(date, settings)) {
    return NextResponse.json({ error: "Le salon est fermé ce jour-là." }, { status: 400 });
  }

  // Re-checked server-side rather than trusted from the form. The browser was
  // told what was free when the page was filled in; between then and now
  // someone else may have taken the slot.
  const slots = await getAppointmentAvailability(siteId, settings, date, service);
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
    partySize: 1,
    serviceName: service.name,
    durationMinutes: service.durationMinutes,
    guestName: name,
    guestPhone: phone,
    guestEmail: email,
    note: note || null,
  });

  const [site] = await db.select({ name: sites.name }).from(sites).where(eq(sites.id, siteId));

  await notifyBookingRequest({
    siteId,
    notifyEmail: settings.notifyEmail,
    summary: {
      siteName: site?.name ?? siteSlug,
      what: `${service.name} (${service.durationMinutes} min)`,
      date,
      slot,
      clientName: name,
      clientPhone: phone,
      clientEmail: email,
      note: note || null,
      businessPhone: settings.phone,
    },
  });

  // "pending", never "confirmed": the salon confirms, not the website.
  return NextResponse.json({ ok: true, status: "pending" });
}
