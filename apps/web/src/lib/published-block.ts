import "server-only";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "./db";
import { siteBlocks, sitePages, sites } from "./db/schema";

/**
 * The content of a published site's visible block of a given type.
 *
 * Booking settings live in the block the visitor can see rather than in a
 * settings table: capacity and opening hours are content the owner edits,
 * so keeping them in the block means they travel with the page, get
 * validated by the same Zod schema, and need no second editing surface.
 *
 * Returning null is also the authorisation check for the public booking
 * endpoints. A site that is unpublished, or that does not show a booking
 * form, must not take bookings.
 */
export async function loadPublishedBlock(
  siteSlug: string,
  blockType: string
): Promise<{ siteId: string; content: unknown } | null> {
  const [site] = await db
    .select({ id: sites.id })
    .from(sites)
    .where(and(eq(sites.slug, siteSlug), eq(sites.status, "published")));
  if (!site) return null;

  const pageIds = await db
    .select({ id: sitePages.id })
    .from(sitePages)
    .where(eq(sitePages.siteId, site.id));
  if (pageIds.length === 0) return null;

  const [block] = await db
    .select({ content: siteBlocks.content })
    .from(siteBlocks)
    .where(
      and(
        eq(siteBlocks.siteId, site.id),
        eq(siteBlocks.blockType, blockType),
        eq(siteBlocks.isVisible, true),
        inArray(
          siteBlocks.pageId,
          pageIds.map((p) => p.id)
        )
      )
    );
  if (!block) return null;

  return { siteId: site.id, content: block.content };
}
