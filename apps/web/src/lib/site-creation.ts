import { randomBytes } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { sites, siteBlocks, type templates } from "./db/schema";
import { slugify } from "./slug";

type TemplateRow = typeof templates.$inferSelect;

// Auto-names a new site from a base string (typically the template name)
// with a short random suffix, retrying on collision — used wherever site
// creation skips asking the user for an address up front (guest flow,
// one-click template picker) and defers renaming to later. Lives here
// rather than in slug.ts because it needs `db`, and slug.ts is imported by
// a client component (GuestPublishFlow, for live slugify-as-you-type) —
// pulling the Postgres driver into that bundle breaks the client build.
export async function generateUniqueSlug(base: string): Promise<string> {
  const root = slugify(base) || "site";
  for (let attempt = 0; attempt < 6; attempt++) {
    const candidate = `${root}-${randomBytes(3).toString("hex")}`;
    const [existing] = await db.select({ id: sites.id }).from(sites).where(eq(sites.slug, candidate));
    if (!existing) return candidate;
  }
  throw new Error("Impossible de générer une adresse unique. Réessayez.");
}

// Shared by createSite (signed-in flow) and the guest flow — inserts the
// site row plus its default blocks from the template's schema. Caller is
// responsible for entitlement checks and for producing a unique slug.
export async function insertSiteFromTemplate({
  userId,
  template,
  name,
  slug,
}: {
  userId: string;
  template: TemplateRow;
  name: string;
  slug: string;
}) {
  const templateSchema = template.schema as {
    defaultBlocks: { type: string; position: number; content: unknown }[];
    accentColor?: string;
    mode?: "light" | "dark";
  };
  const defaultBlocks = templateSchema.defaultBlocks;

  const [site] = await db
    .insert(sites)
    .values({
      userId,
      templateId: template.id,
      slug,
      name,
      status: "draft",
      theme:
        templateSchema.accentColor || templateSchema.mode
          ? { primaryColor: templateSchema.accentColor, mode: templateSchema.mode }
          : undefined,
    })
    .returning();

  for (const block of defaultBlocks) {
    await db.insert(siteBlocks).values({
      siteId: site.id,
      blockType: block.type,
      position: block.position,
      content: block.content,
    });
  }

  return site;
}
