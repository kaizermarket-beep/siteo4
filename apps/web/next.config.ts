import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

/**
 * Content-Security-Policy.
 *
 * Two directives are deliberately looser than a textbook policy, and both
 * are worth understanding before anyone tightens them:
 *
 * `script-src 'unsafe-inline'` — Next injects inline <script> for the
 * hydration bootstrap and the RSC flight payload on every page. The correct
 * fix is a per-request nonce, which has to come from middleware and makes
 * every response dynamic. The published customer sites are deliberately
 * static (see `revalidate` in the (public-render) routes); a nonce would
 * turn each of them into a server render per visit. That trade is not worth
 * it while there are no third-party scripts on the page at all — the value
 * of blocking inline script is the ability to survive an injected <script>,
 * and today the only script on a published site is Next's own.
 *
 * `img-src https:` — site owners paste image URLs from anywhere (Unsplash,
 * their own host, a photographer's CDN). An allowlist would break the
 * editor the first time someone used a host we had not thought of. Images
 * cannot execute script, so the exposure here is hotlinking and referrer
 * leakage, not code execution.
 *
 * Everything else is closed: no plugins, no framing, no base-tag rewrite,
 * and forms may only post to us or to Stripe's hosted pages.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  // Same intent as X-Frame-Options below, for browsers that honour CSP first.
  "frame-ancestors 'none'",
  // Checkout and the billing portal are reached by a redirect out of a
  // Server Action POST; browsers apply form-action to the redirect target,
  // so Stripe's hosted domains have to be listed or the redirect is blocked.
  "form-action 'self' https://checkout.stripe.com https://billing.stripe.com",
  isDev
    ? // Turbopack's HMR client evaluates code at runtime.
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:"
    : "script-src 'self' 'unsafe-inline'",
  // Tailwind ships a stylesheet, but React inline styles (every template's
  // accent colour, every hero backdrop) are style attributes.
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  // next/font/google downloads and self-hosts at build time, so no request
  // ever goes to fonts.gstatic.com and no font host needs allowing.
  "font-src 'self' data:",
  isDev ? "connect-src 'self' ws: wss:" : "connect-src 'self'",
  "media-src 'self' data: https:",
  "worker-src 'self' blob:",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  // Stops a browser from second-guessing a declared Content-Type — the
  // matching half of the upload route's magic-byte check.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // DENY rather than SAMEORIGIN: nothing in the app is framed. The editor
  // preview and the template previews render blocks inline, not in iframes.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Deny by default; a template that one day needs geolocation (a map block)
  // opts in here rather than the whole app carrying the permission.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  // Production only: sending HSTS from http://localhost pins the browser to
  // HTTPS for localhost, which breaks every other local project on the machine.
  // `preload` is left off on purpose — submitting to the preload list is
  // effectively irreversible, and should be a deliberate decision once the
  // real domain and all its subdomains are known to be HTTPS-only.
  ...(isDev
    ? []
    : [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains",
        },
      ]),
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
