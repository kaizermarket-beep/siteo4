// One-off: give every pre-existing site a home page and attach its blocks
// to it. Sites created before multi-page support have blocks with a null
// page_id, which no longer renders anywhere.
//
// Idempotent — a site that already has pages is skipped, and blocks that
// already carry a page_id are left alone. Safe to re-run.
//
//   pnpm --filter web db:backfill-pages

import { eq, isNull, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../src/lib/db/schema";

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
  const db = drizzle(process.env.DATABASE_URL, { schema });

  const allSites = await db.select().from(schema.sites);
  let created = 0;
  let attached = 0;

  for (const site of allSites) {
    const orphans = await db
      .select()
      .from(schema.siteBlocks)
      .where(and(eq(schema.siteBlocks.siteId, site.id), isNull(schema.siteBlocks.pageId)));

    if (orphans.length === 0) continue;

    const existingPages = await db
      .select()
      .from(schema.sitePages)
      .where(eq(schema.sitePages.siteId, site.id));

    let home = existingPages.find((p) => p.slug === "");
    if (!home) {
      [home] = await db
        .insert(schema.sitePages)
        .values({ siteId: site.id, slug: "", title: "Accueil", position: 10 })
        .returning();
      created++;
    }

    await db
      .update(schema.siteBlocks)
      .set({ pageId: home.id })
      .where(and(eq(schema.siteBlocks.siteId, site.id), isNull(schema.siteBlocks.pageId)));

    attached += orphans.length;
    console.log(`${site.slug}: ${orphans.length} bloc(s) rattaché(s) à la page d'accueil`);
  }

  console.log(`Terminé — ${created} page(s) créée(s), ${attached} bloc(s) rattaché(s).`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
