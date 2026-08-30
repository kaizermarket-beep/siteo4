import { NextResponse } from "next/server";
import { purgeExpiredData } from "@/lib/retention";

// Scheduled deletion of everything past its retention window. Called by
// Vercel Cron (see vercel.json), which sends `Authorization: Bearer
// $CRON_SECRET` on every invocation.
//
// Never cached, and never reachable without the secret: the response says
// how much personal data was just deleted, which is not public information,
// and an open endpoint would let anyone force the job to run in a loop.
export const dynamic = "force-dynamic";

function authorised(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  // No secret configured means the endpoint stays shut rather than open —
  // a purge job that anyone can trigger is worse than one that never runs.
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!authorised(request)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const report = await purgeExpiredData();
  console.info("[retention] purge", report);

  return NextResponse.json(
    { ok: true, purged: report, at: new Date().toISOString() },
    { headers: { "Cache-Control": "no-store" } }
  );
}
