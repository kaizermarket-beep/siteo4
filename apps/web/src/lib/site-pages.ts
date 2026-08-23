import "server-only";
import { and, asc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { db } from "./db";
import { siteBlocks, sitePages, sites } from "./db/schema";
import { HOME_PAGE_SLUG } from "./site-nav";

export { HOME_PAGE_SLUG, pageHref, type NavPage } from "./site-nav";

/**
 * Cache tag for everything published under one site slug.
 *
 * Server actions that change a site's content call `revalidateTag` with
 * this. `revalidatePath` alone is not enough: it drops the rendered route,
 * but an `unstable_cache` entry only expires on its tag or its timer, so a
 * published edit would keep serving the old data for an hour.
 */
export function siteCacheTag(siteSlug: string) {
  return `site:${siteSlug}`;
}

/** What the public renderer needs — and nothing else. See below for why. */
export type PublishedPageData = {
  site: { name: string; seoTitle: string | null; theme: unknown };
  page: { slug: string; title: string; seoTitle: string | null };
  navPages: { slug: string; title: string }[];
  blocks: { id: string; blockType: string; content: unknown }[];
  inheritedFooter: { id: string; blockType: string; content: unknown } | null;
};

async function readPublishedPage(
  siteSlug: string,
  pageSlug: string
): Promise<PublishedPageData | null> {
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
  let inheritedFooter: PublishedPageData["inheritedFooter"] = null;
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
    inheritedFooter = footer
      ? { id: footer.id, blockType: footer.blockType, content: footer.content }
      : null;
  }

  // Narrowed to the fields the renderer reads, rather than handing whole
  // rows to the cache. Two reasons: the entry stays small, and no Date ever
  // crosses the cache boundary — the data cache round-trips through JSON,
  // which would hand back timestamps as strings.
  return {
    site: { name: site.name, seoTitle: site.seoTitle, theme: site.theme },
    page: { slug: page.slug, title: page.title, seoTitle: page.seoTitle },
    navPages: pages.filter((p) => p.showInNav).map((p) => ({ slug: p.slug, title: p.title })),
    blocks: blocks.map((b) => ({ id: b.id, blockType: b.blockType, content: b.content })),
    inheritedFooter,
  };
}

/**
 * Everything the public renderer needs for one page of one published site.
 * Returns null when the site or the page doesn't exist (or isn't published),
 * so callers can `notFound()` on their own terms.
 *
 * Cached, and it has to be done here rather than with the route's
 * `revalidate` export. That export only caches data fetched through
 * `fetch`; these are direct Drizzle queries, so the route stayed fully
 * dynamic and every single visit to a published site re-ran three or four
 * SQL statements. On a serverless database billed by awake time, a handful
 * of client sites was enough to keep the instance from ever sleeping.
 *
 * The wrapper is built per site slug so the tag can be per site: publishing
 * one customer's edit must not drop every other customer's cached pages.
 * `unstable_cache` keys on the key parts plus the arguments, so building it
 * per request costs nothing.
 */
export function loadPublishedPage(siteSlug: string, pageSlug: string) {
  return unstable_cache(
    (slug: string) => readPublishedPage(siteSlug, slug),
    ["published-page", siteSlug],
    { tags: [siteCacheTag(siteSlug)], revalidate: 3600 }
  )(pageSlug);
}
