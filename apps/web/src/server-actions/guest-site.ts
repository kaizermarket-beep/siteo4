"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { sites, templates } from "@/lib/db/schema";
import { resolveIdentity, createGuestIdentity } from "@/lib/identity";
import { insertSiteFromTemplate, generateUniqueSlug } from "@/lib/site-creation";

// Entry point for an anonymous "Choisir ce modèle" click — no name/slug
// form, no signup wall. Creates (or reuses) a guest identity, creates the
// site straight from the template, and drops the visitor directly into the
// editor. Publishing later is what asks them to become a real account (see
// upgrade-and-publish.ts) — this action never checks entitlements or the
// premium-template gate on purpose, a brand-new guest always has full trial
// access anyway (see entitlements.ts), and premium is enforced at publish.
export async function startGuestSite(formData: FormData) {
  const templateSlug = String(formData.get("templateSlug") ?? "");

  let identity = await resolveIdentity();

  if (identity?.isGuest) {
    const [existingSite] = await db.select().from(sites).where(eq(sites.userId, identity.userId));
    if (existingSite) {
      redirect(`/app/sites/${existingSite.id}/edit`);
    }
  }

  if (!identity) {
    identity = await createGuestIdentity();
  }

  const [template] = await db.select().from(templates).where(eq(templates.slug, templateSlug));
  if (!template) {
    throw new Error("Modèle introuvable.");
  }

  const slug = await generateUniqueSlug(template.name);
  const site = await insertSiteFromTemplate({
    userId: identity.userId,
    template,
    name: template.name,
    slug,
  });

  redirect(`/app/sites/${site.id}/edit`);
}
