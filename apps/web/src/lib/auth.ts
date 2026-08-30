import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "./db";
import { users } from "./db/schema";
import { rateLimit } from "./rate-limit";
import { clientIp } from "./client-ip";

// A valid bcrypt hash of a value nobody can guess. Compared against when the
// email is unknown so a failed login costs the same time whether or not the
// account exists — otherwise the response time alone tells an attacker which
// addresses are registered, which is exactly the enumeration the CNIL asks
// to avoid in its recommendation on authentication.
const DUMMY_HASH = "$2b$12$Isit3CAkZQZzivGyAI0xRujhBLBndG/E1RVt.6SsdY4Rczrmg1d8y";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  // Credentials provider requires JWT sessions (the adapter can't persist
  // a DB session for a provider it doesn't manage the password for).
  //
  // maxAge is stated rather than inherited: the cookie table in the Cookies
  // page has to name a duration, and a default that moves with a library
  // upgrade would quietly make that page wrong.
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 30 },
  providers: [
    Google,
    Credentials({
      credentials: {
        email: { label: "Email" },
        password: { label: "Mot de passe", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        // Two limits, because they stop two different attacks. Per account:
        // brute-forcing one person's password. Per address: credential
        // stuffing, where a leaked list is replayed one attempt per account
        // — which never trips a per-account counter.
        const ip = clientIp(await headers());
        const [perAccount, perIp] = await Promise.all([
          rateLimit(`login:${email.toLowerCase()}`, 10, 10 * 60 * 1000),
          rateLimit(`login-ip:${ip}`, 30, 10 * 60 * 1000),
        ]);
        if (!perAccount.allowed || !perIp.allowed) return null;

        const [user] = await db.select().from(users).where(eq(users.email, email));

        // The comparison runs even when there is no account, and even for a
        // guest row (which has no password): same work, same delay, no hint.
        const valid = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
        if (!valid || !user?.passwordHash) return null;

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.sub = user.id;
      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub) session.user.id = token.sub;
      return session;
    },
  },
});
