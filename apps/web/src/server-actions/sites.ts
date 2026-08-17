"use server";

import { eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { sites, templates } from "@/lib/db/schema";
import { getUserEntitlements } from "@/lib/entitlements";
import { insertSiteFromTemplate, generateUniqueSlug } from "@/lib/site-creation";

// One click, straight into the editor — no name/address form up front (that
// used to sit between picking a template and personalizing it, see
// NewSiteForm.tsx). Auto-named from the template like the guest flow
// already does. Shared by the per-card submit below (createSite) and
// NewSitePage's direct ?template= redirect — same checks, two entry points.
// Entitlement gating here doubles as a race-condition safety net; the
// common case is caught earlier by the page itself, which hides the picker
// (or skips straight to creation) once it already knows the answer.
export async function createSiteForUser(userId: string, templateSlug: string) {
  const [template] = await db.select().from(templates).where(eq(templates.slug, templateSlug));
  if (!template) {
    throw new Error("Modèle introuvable.");
  }

  const entitlements = await getUserEntitlements(userId);

  if (!entitlements.allowsPublish && entitlements.planKey === "expired") {
    throw new Error("Votre essai gratuit est terminé. Passez à un abonnement pour créer un nouveau site.");
  }

  if (template.isPremium && !entitlements.allowsPremiumTemplates) {
    throw new Error("Ce modèle est réservé au plan Premium.");
  }

  const [{ count: currentSiteCount }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(sites)
    .where(eq(sites.userId, userId));

  if (currentSiteCount >= entitlements.maxSites) {
    throw new Error(`Limite de ${entitlements.maxSites} site(s) atteinte pour votre plan (${entitlements.planKey}).`);
  }

  const slug = await generateUniqueSlug(template.name);
  return insertSiteFromTemplate({ userId, template, name: template.name, slug });
}

export async function createSite(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Vous devez être connecté.");
  }

  const templateSlug = String(formData.get("templateSlug") ?? "");
  const site = await createSiteForUser(session.user.id, templateSlug);

  redirect(`/app/sites/${site.id}/edit`);
}
