"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { rateLimit } from "@/lib/rate-limit";
import { signIn } from "@/lib/auth";
import { BCRYPT_COST, rejectPassword } from "@/lib/password";
import { clientIp } from "@/lib/client-ip";

export type SignupState = { error?: string } | undefined;

// The client-side `required` attribute is a convenience, not a control: a
// form can be posted without it. This is where acceptance is actually
// enforced.
function hasAcceptedTerms(formData: FormData): boolean {
  return formData.get("acceptTerms") === "on";
}

export async function signup(_prevState: SignupState, formData: FormData): Promise<SignupState> {
  const ip = clientIp(await headers());
  const { allowed } = await rateLimit(`signup:${ip}`, 5, 10 * 60 * 1000);
  if (!allowed) {
    return { error: "Trop de tentatives. Réessayez dans quelques minutes." };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const template = String(formData.get("template") ?? "").trim();

  if (!email || !password) {
    return { error: "Email et mot de passe requis." };
  }
  const weak = rejectPassword(password, email);
  if (weak) {
    return { error: weak };
  }
  if (!hasAcceptedTerms(formData)) {
    return {
      error: "Vous devez accepter les CGV et la politique de confidentialité pour créer un compte.",
    };
  }

  const [existing] = await db.select().from(users).where(eq(users.email, email));
  if (existing) {
    return { error: "Un compte existe déjà avec cet email." };
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_COST);
  try {
    await db
      .insert(users)
      .values({ email, name: name || null, passwordHash, termsAcceptedAt: new Date() });
  } catch {
    // Most likely a unique-constraint race with the check above (two
    // concurrent signups for the same email) — not a server crash.
    return { error: "Un compte existe déjà avec cet email." };
  }

  // Sign the user in immediately — no separate login step right after
  // creating an account. Send them straight into creating their first site,
  // pre-selecting the template they came from (métier browse page) if any.
  const redirectTo = template ? `/app/sites/new?template=${template}` : "/app";
  await signIn("credentials", { email, password, redirectTo });
}
