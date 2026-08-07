"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { rateLimit } from "@/lib/rate-limit";

export type SignupState = { error?: string } | undefined;

export async function signup(_prevState: SignupState, formData: FormData): Promise<SignupState> {
  const ip = (await headers()).get("x-forwarded-for") ?? "unknown";
  const { allowed } = await rateLimit(`signup:${ip}`, 5, 10 * 60 * 1000);
  if (!allowed) {
    return { error: "Trop de tentatives. Réessayez dans quelques minutes." };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "").trim();

  if (!email || !password) {
    return { error: "Email et mot de passe requis." };
  }
  if (password.length < 8) {
    return { error: "Le mot de passe doit contenir au moins 8 caractères." };
  }

  const [existing] = await db.select().from(users).where(eq(users.email, email));
  if (existing) {
    return { error: "Un compte existe déjà avec cet email." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  try {
    await db.insert(users).values({ email, name: name || null, passwordHash });
  } catch {
    // Most likely a unique-constraint race with the check above (two
    // concurrent signups for the same email) — not a server crash.
    return { error: "Un compte existe déjà avec cet email." };
  }

  redirect("/login?signup=success");
}
