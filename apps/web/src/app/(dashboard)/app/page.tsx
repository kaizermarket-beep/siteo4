import { eq } from "drizzle-orm";
import { requireUserId } from "@/lib/require-user";
import Link from "next/link";
import { db } from "@/lib/db";
import { sites } from "@/lib/db/schema";

export default async function SitesPage() {
  const userId = await requireUserId();
  const userSites = await db.select().from(sites).where(eq(sites.userId, userId));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Mes sites</h1>
        <Link
          href="/app/sites/new"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          Créer un site
        </Link>
      </div>

      {userSites.length === 0 ? (
        <p className="text-sm text-neutral-600">
          Vous n&apos;avez pas encore de site. Créez-en un pour commencer.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {userSites.map((site) => (
            <li key={site.id}>
              <Link
                href={`/app/sites/${site.id}/edit`}
                className="flex items-center justify-between rounded-md border border-neutral-200 px-4 py-3 text-sm hover:border-neutral-400"
              >
                <div>
                  <span className="font-medium text-neutral-900">{site.name}</span>{" "}
                  <span className="text-neutral-500">
                    — {site.slug}.{process.env.NEXT_PUBLIC_ROOT_DOMAIN}
                  </span>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    site.status === "published"
                      ? "bg-green-100 text-green-700"
                      : "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  {site.status === "published" ? "Publié" : "Brouillon"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
