/** The site slug, read from the address the visitor is actually on. */
export function currentSiteSlug(): string {
  const host = window.location.hostname;
  // Published sites live on {slug}.{domain}; the internal /s/{slug} path is
  // a development detail but has to work there too.
  const path = window.location.pathname.match(/^\/s\/([^/]+)/);
  if (path) return path[1];
  return host.split(".")[0];
}
