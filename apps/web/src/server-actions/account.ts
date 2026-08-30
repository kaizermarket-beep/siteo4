"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { auth, signOut } from "@/lib/auth";
import { eraseAccount } from "@/lib/personal-data";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp } from "@/lib/client-ip";

export type DeleteAccountState = { error?: string } | undefined;

/** Typed by hand before the account goes. Deliberately not translatable. */
const CONFIRMATION = "SUPPRIMER";

/**
 * Erases the signed-in account (RGPD art. 17).
 *
 * Two locks, because this is irreversible and cascades to every site the
 * person published: the word above has to be typed, and identity has to be
 * proved again — the password for a credentials account, the email address
 * for one that only ever signed in through Google and has no password to
 * re-enter.
 */
export async function deleteAccount(
  _prev: DeleteAccountState,
  formData: FormData
): Promise<DeleteAccountState> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { error: "Non authentifié." };

  const ip = clientIp(await headers());
  const { allowed } = await rateLimit(`delete-account:${ip}`, 5, 60 * 60 * 1000);
  if (!allowed) {
    return { error: "Trop de tentatives. Réessayez plus tard." };
  }

  if (String(formData.get("confirmation") ?? "").trim() !== CONFIRMATION) {
    return { error: `Tapez ${CONFIRMATION} en majuscules pour confirmer.` };
  }

  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user) return { error: "Compte introuvable." };

  if (user.passwordHash) {
    const password = String(formData.get("password") ?? "");
    if (!password) return { error: "Saisissez votre mot de passe." };
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return { error: "Mot de passe incorrect." };
  } else {
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    if (email !== user.email.toLowerCase()) {
      return { error: "L'adresse email ne correspond pas à ce compte." };
    }
  }

  await eraseAccount(userId);

  // Throws a redirect, so nothing below it runs — and the session cookie is
  // cleared on the way out. Without this the browser would keep a token
  // signed for a user row that no longer exists.
  await signOut({ redirectTo: "/?compte=supprime" });
}
