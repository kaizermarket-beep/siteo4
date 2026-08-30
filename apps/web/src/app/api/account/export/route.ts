import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { collectPersonalData } from "@/lib/personal-data";
import { rateLimit } from "@/lib/rate-limit";

// Article 15 and 20 of the RGPD: a copy of one's data, in a structured,
// machine-readable format. A route handler rather than a Server Action
// because the browser has to receive a file, and only a real response can
// carry Content-Disposition.
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  // Assembling an export reads most of the person's data at once, so it is
  // capped — generously, since a legitimate person exports once or twice.
  const { allowed } = await rateLimit(`export:${userId}`, 5, 60 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Trop d'exports demandés. Réessayez dans une heure." },
      { status: 429 }
    );
  }

  const data = await collectPersonalData(userId);
  const filename = `siteo-donnees-${new Date().toISOString().slice(0, 10)}.json`;

  return new NextResponse(JSON.stringify(data, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      // Never store a file full of personal data in a shared cache.
      "Cache-Control": "no-store, private",
    },
  });
}
