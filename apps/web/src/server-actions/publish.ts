"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import { db } from "@/lib/db";
import { sites, templates } from "@/lib/db/schema";
import { getUserEntitlements } from "@/lib/entitlements";
import { resolveIdentity } from "@/lib/identity";
import { siteCacheTag } from "@/lib/site-pages";

async function getOwnedSite(siteId: string) {
  const identity = await resolveIdentity();
  if (!identity) throw new Error("Non authentifié.");

  const [site] = await db
    .select()
    .from(sites)
    .where(and(eq(sites.id, siteId), eq(sites.userId, identity.userId)));

  if (!site) throw new Error("Site introuvable.");
  return site;
}

// Shared by publishSite (already-signed-in owner) and the guest
// claim-and-publish action (upgrade-and-publish.ts) — both resolve
// ownership differently but publish the same way once they have the site
// row. Guests skip the premium-template gate at creation time (see
// guest-site.ts), so it's enforced here instead, for every caller.
export async function publishOwnedSite(site: typeof sites.$inferSelect) {
  const entitlements = await getUserEntitlements(site.userId);
  if (!entitlements.allowsPublish) {
    return {
      ok: false as const,
      error:
        entitlements.planKey === "expired"
          ? "Votre essai gratuit est terminé. Passez à un abonnement pour republier votre site."
          : "Votre offre actuelle ne permet pas de publier.",
    };
  }

  const [template] = await db.select().from(templates).where(eq(templates.id, site.templateId));
  if (template?.isPremium && !entitlements.allowsPremiumTemplates) {
    return {
      ok: false as const,
      error: "Ce modèle est réservé au plan Premium. Passez à un abonnement pour le publier.",
    };
  }

  await db
    .update(sites)
    .set({ status: "published", publishedAt: new Date(), updatedAt: new Date() })
    .where(eq(sites.id, site.id));

  revalidatePath(`/s/${site.slug}`, "layout");
  updateTag(siteCacheTag(site.slug));
  return { ok: true as const, slug: site.slug };
}

export async function publishSite(siteId: string) {
  const site = await getOwnedSite(siteId);
  return publishOwnedSite(site);
}

export async function unpublishSite(siteId: string) {
  const site = await getOwnedSite(siteId);

  await db
    .update(sites)
    .set({ status: "draft", updatedAt: new Date() })
    .where(eq(sites.id, site.id));

  revalidatePath(`/s/${site.slug}`, "layout");
  updateTag(siteCacheTag(site.slug));
  return { ok: true as const };
}
