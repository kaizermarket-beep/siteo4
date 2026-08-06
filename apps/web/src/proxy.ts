import { NextResponse, type NextRequest } from "next/server";
import { RESERVED_SLUGS } from "@/lib/slug";

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000";

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";

  if (host === ROOT_DOMAIN || host === `www.${ROOT_DOMAIN}`) {
    return NextResponse.next();
  }

  if (!host.endsWith(`.${ROOT_DOMAIN}`)) {
    return NextResponse.next();
  }

  const subdomain = host.slice(0, -(`.${ROOT_DOMAIN}`.length));

  // Multi-level subdomains and reserved words aren't site slugs — let them
  // fall through to the normal app (they'll 404 there, which is correct:
  // no user may ever claim a reserved word as their slug, see src/lib/slug.ts).
  if (subdomain.includes(".") || RESERVED_SLUGS.includes(subdomain)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  const suffix = url.pathname === "/" ? "" : url.pathname;
  url.pathname = `/s/${subdomain}${suffix}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
