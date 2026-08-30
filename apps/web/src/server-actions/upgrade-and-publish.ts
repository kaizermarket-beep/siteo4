"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { sites, users } from "@/lib/db/schema";
import { rateLimit } from "@/lib/rate-limit";
import { signIn } from "@/lib/auth";
import { BCRYPT_COST, rejectPassword } from "@/lib/password";
import { resolveIdentity, clearGuestCookie } from "@/lib/identity";
import { slugify, validateSlug } from "@/lib/slug";
import { publishOwnedSite } from "./publish";
import { clientIp } from "@/lib/client-ip";

export type UpgradeAndPublishState = { error?: string } | undefined;

// The last step of the guest flow: name the site for real, pick a plan
// (informational only — Stripe isn't wired, everyone rides the 7-day trial
// either way, see entitlements.ts), create the account, and publish — all
// in one submit. Order matters: every DB write happens using the guest
// identity resolved at the top, *before* signIn() establishes a real
// session — auth() can't see a session created earlier in the same
// invocation, so anything after signIn() would have nothing to fall back
// on if it re-derived identity from scratch.
export async function upgradeAndPublish(
  _prevState: UpgradeAndPublishState,
  formData: FormData
): Promise<UpgradeAndPublishState> {
  const identity = await resolveIdentity();
  if (!identity?.isGuest) {
    return { error: "Session invitée introuvable. Rechargez la page." };
  }

  const siteId = String(formData.get("siteId") ?? "");
  const [site] = await db.select().from(sites).where(eq(sites.id, siteId));
  if (!site || site.userId !== identity.userId) {
    return { error: "Site introuvable." };
  }

  const ip = clientIp(await headers());
  const { allowed } = await rateLimit(`signup:${ip}`, 5, 10 * 60 * 1000);
  if (!allowed) {
    return { error: "Trop de tentatives. Réessayez dans quelques minutes." };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const siteName = String(formData.get("siteName") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim().toLowerCase();

  if (!email || !password) {
    return { error: "Email et mot de passe requis." };
  }
  const weak = rejectPassword(password, email);
  if (weak) {
    return { error: weak };
  }
  // Enforced here, not only by the checkbox's `required` attribute: this
  // action is reachable by posting the form directly.
  if (formData.get("acceptTerms") !== "on") {
    return {
      error: "Vous devez accepter les CGV et la politique de confidentialité pour publier.",
    };
  }
  if (!siteName) {
    return { error: "Le nom du site est requis." };
  }

  const [existingEmail] = await db.select().from(users).where(eq(users.email, email));
  if (existingEmail && existingEmail.id !== identity.userId) {
    return { error: "Un compte existe déjà avec cet email." };
  }

  const slug = slugify(rawSlug || siteName);
  const slugCheck = validateSlug(slug);
  if (!slugCheck.ok) {
    return { error: slugCheck.error };
  }
  if (slug !== site.slug) {
    const [slugTaken] = await db.select().from(sites).where(eq(sites.slug, slug));
    if (slugTaken) {
      return { error: "Cette adresse est déjà utilisée. Choisissez-en une autre." };
    }
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_COST);

  try {
    await db
      .update(users)
      .set({ email, name: name || null, passwordHash, isGuest: false, termsAcceptedAt: new Date() })
      .where(eq(users.id, identity.userId));
  } catch {
    // Unique-email race, same as signup().
    return { error: "Un compte existe déjà avec cet email." };
  }

  await db.update(sites).set({ name: siteName, slug, updatedAt: new Date() }).where(eq(sites.id, site.id));

  const publishResult = await publishOwnedSite({ ...site, name: siteName, slug });
  if (!publishResult.ok) {
    return { error: publishResult.error };
  }

  await signIn("credentials", { email, password, redirect: false });
  await clearGuestCookie();

  redirect(`/app/sites/${site.id}/edit`);
}
