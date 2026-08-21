import "server-only";
import { and, asc, eq } from "drizzle-orm";
import { db } from "./db";
import { siteBlocks, sitePages, sites } from "./db/schema";
import { HOME_PAGE_SLUG } from "./site-nav";

export { HOME_PAGE_SLUG, pageHref, type NavPage } from "./site-nav";

/**
 * Everything the public renderer needs for one page of one published site.
 * Returns null when the site or the page doesn't exist (or isn't published),
 * so callers can `notFound()` on their own terms.
 */
export async function loadPublishedPage(siteSlug: string, pageSlug: string) {
  const [site] = await db
    .select()
    .from(sites)
    .where(and(eq(sites.slug, siteSlug), eq(sites.status, "published")));

  if (!site) return null;

  const pages = await db
    .select()
    .from(sitePages)
    .where(eq(sitePages.siteId, site.id))
    .orderBy(asc(sitePages.position));

  const page = pages.find((p) => p.slug === pageSlug);
  if (!page) return null;

  const blocks = await db
    .select()
    .from(siteBlocks)
    .where(and(eq(siteBlocks.pageId, page.id), eq(siteBlocks.isVisible, true)))
    .orderBy(asc(siteBlocks.position));

  // The footer is written once, on the home page, and repeated everywhere:
  // asking someone to retype their copyright line on four pages is how a
  // site ends up with three different years in the footer.
  const home = pages.find((p) => p.slug === HOME_PAGE_SLUG);
  let inheritedFooter: (typeof blocks)[number] | null = null;
  if (home && home.id !== page.id) {
    const [footer] = await db
      .select()
      .from(siteBlocks)
      .where(
        and(
          eq(siteBlocks.pageId, home.id),
          eq(siteBlocks.blockType, "footer"),
          eq(siteBlocks.isVisible, true)
        )
      )
      .orderBy(asc(siteBlocks.position));
    inheritedFooter = footer ?? null;
  }

  return {
    site,
    page,
    navPages: pages.filter((p) => p.showInNav).map((p) => ({ slug: p.slug, title: p.title })),
    blocks,
    inheritedFooter,
  };
}
