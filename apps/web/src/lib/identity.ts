import { cookies } from "next/headers";
import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import { eq } from "drizzle-orm";
import { auth } from "./auth";
import { db } from "./db";
import { users } from "./db/schema";

// Lets an anonymous visitor own a site (create it, edit its blocks, publish
// it) before they have a real account — see plan at
// C:\Users\kevin\.claude\plans\flickering-toasting-lagoon.md. A guest is a
// real `users` row (isGuest: true, no password) identified by a signed
// cookie instead of a NextAuth session. At real signup, that same row is
// upgraded in place (email/passwordHash set, isGuest cleared) rather than
// replaced, so the site/blocks the guest already built never move.
const GUEST_COOKIE = "siteo_guest";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export type Identity = { userId: string; isGuest: boolean };

function sign(userId: string): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not set.");
  const mac = createHmac("sha256", secret).update(userId).digest("hex");
  return `${userId}.${mac}`;
}

function verify(token: string): string | null {
  const secret = process.env.AUTH_SECRET;
  if (!secret) return null;

  const separator = token.lastIndexOf(".");
  if (separator === -1) return null;
  const userId = token.slice(0, separator);
  const mac = token.slice(separator + 1);

  const expected = createHmac("sha256", secret).update(userId).digest("hex");
  const macBuf = Buffer.from(mac);
  const expectedBuf = Buffer.from(expected);
  if (macBuf.length !== expectedBuf.length) return null;

  return timingSafeEqual(macBuf, expectedBuf) ? userId : null;
}

// Real session first, guest cookie second. Ownership checks throughout the
// app (createSite, block mutations, publish) can compare `=== identity.userId`
// exactly as they compared `=== session.user.id` before — a guest's userId
// is a real row in `users`.
export async function resolveIdentity(): Promise<Identity | null> {
  const session = await auth();
  if (session?.user?.id) {
    return { userId: session.user.id, isGuest: false };
  }

  const cookieStore = await cookies();
  const raw = cookieStore.get(GUEST_COOKIE)?.value;
  if (!raw) return null;

  const userId = verify(raw);
  if (!userId) return null;

  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user?.isGuest) return null;

  return { userId: user.id, isGuest: true };
}

// Must run inside a Server Action / Route Handler (cookie writes aren't
// allowed during Server Component rendering).
export async function createGuestIdentity(): Promise<Identity> {
  const placeholderEmail = `guest+${randomBytes(12).toString("hex")}@guest.invalid`;

  const [user] = await db
    .insert(users)
    .values({ email: placeholderEmail, isGuest: true })
    .returning();

  const cookieStore = await cookies();
  cookieStore.set(GUEST_COOKIE, sign(user.id), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });

  return { userId: user.id, isGuest: true };
}

export async function clearGuestCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(GUEST_COOKIE);
}
