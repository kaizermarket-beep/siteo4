// Pure navigation helpers, shared by the server renderer and by SiteNav,
// which is a client component. Deliberately free of any database import:
// pulling site-pages.ts (and with it the Postgres driver) into the client
// bundle breaks the build.

/** The home page is the one with an empty slug — it answers at the site root. */
export const HOME_PAGE_SLUG = "";

export type NavPage = { slug: string; title: string };

/**
 * Where a page lives, as the *browser* sees it.
 *
 * Published sites are served from `{slug}.{ROOT_DOMAIN}` — that's the address
 * PublishButton hands the customer, and src/proxy.ts rewrites it onto the
 * internal `/s/{slug}/...` route. So a link between pages of the same site is
 * root-relative and carries no site slug at all. Reaching a site through the
 * internal path instead (`/s/demo`) is a development detail; use
 * `demo.localhost:3000` there too and the links behave the same.
 */
export function pageHref(pageSlug: string) {
  return pageSlug === HOME_PAGE_SLUG ? "/" : `/${pageSlug}`;
}
