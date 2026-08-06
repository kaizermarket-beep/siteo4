import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { sites } from "@/lib/db/schema";

export default async function SitesPage() {
  const session = await auth();
  const userSites = await db.select().from(sites).where(eq(sites.userId, session!.user!.id!));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Mes sites</h1>
        <button
          type="button"
          disabled
          title="Bientôt disponible"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white opacity-50"
        >
          Créer un site
        </button>
      </div>

      {userSites.length === 0 ? (
        <p className="text-sm text-neutral-600">
          Vous n&apos;avez pas encore de site. Créez-en un pour commencer.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {userSites.map((site) => (
            <li key={site.id} className="rounded-md border border-neutral-200 px-4 py-3 text-sm">
              {site.name} — {site.slug}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
