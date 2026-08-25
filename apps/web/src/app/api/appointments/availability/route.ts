import { NextResponse } from "next/server";
import {
  findService,
  getAppointmentAvailability,
  loadAppointmentSettings,
  rejectDate,
} from "@/lib/appointments";

// Never cached, by construction and by header. Published pages are cached
// for an hour (see lib/site-pages.ts), so availability cannot be rendered
// into them — an hour-old "11:30 libre" is worse than none. The form asks
// this route instead, live, every time the visitor changes day or service.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const siteSlug = url.searchParams.get("site") ?? "";
  const date = url.searchParams.get("date") ?? "";
  const serviceName = url.searchParams.get("service") ?? "";

  if (!siteSlug || !date || !serviceName) {
    return NextResponse.json({ error: "Paramètres invalides." }, { status: 400 });
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

  const rejection = rejectDate(date, settings);
  if (rejection) {
    return NextResponse.json({ rejection, slots: [] }, { headers: { "Cache-Control": "no-store" } });
  }

  const slots = await getAppointmentAvailability(siteId, settings, date, service);
  return NextResponse.json({ slots }, { headers: { "Cache-Control": "no-store" } });
}
