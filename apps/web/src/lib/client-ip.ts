/**
 * The caller's IP address, as a stable rate-limiting key.
 *
 * `x-forwarded-for` is a comma-separated chain ("client, proxy1, proxy2").
 * Using the raw header as a key is wrong twice over: two requests from the
 * same person through different proxies land in different buckets, and a
 * client that sends its own header gets a fresh bucket for free.
 *
 * On Vercel the platform overwrites the header with the real client address
 * before the function sees it, so the first entry is trustworthy there. In
 * front of any other proxy this needs to be re-checked — a rate limiter
 * keyed on a value the attacker controls is not a rate limiter.
 */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip")?.trim() || "unknown";
}
