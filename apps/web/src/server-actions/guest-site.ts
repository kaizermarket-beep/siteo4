"use server";

import { and, eq } from "drizzle-orm";
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
// A guest can try several templates, but not spawn drafts without limit.
const MAX_GUEST_DRAFTS = 5;

export async function startGuestSite(formData: FormData) {
  const templateSlug = String(formData.get("templateSlug") ?? "");

  const [template] = await db.select().from(templates).where(eq(templates.slug, templateSlug));
  if (!template) {
    throw new Error("Modèle introuvable.");
  }

  let identity = await resolveIdentity();

  if (identity?.isGuest) {
    // Reopen only a draft built from *this* template, so clicking the same
    // card twice keeps the edits already made. Matching on the user alone
    // sent every later click back to whichever template they picked first,
    // which made the other cards look broken.
    const [sameTemplate] = await db
      .select()
      .from(sites)
      .where(and(eq(sites.userId, identity.userId), eq(sites.templateId, template.id)));

    if (sameTemplate) {
      redirect(`/app/sites/${sameTemplate.id}/edit`);
    }

    const drafts = await db.select().from(sites).where(eq(sites.userId, identity.userId));
    if (drafts.length >= MAX_GUEST_DRAFTS) {
      // Send them back to the most recent draft rather than failing: the
      // point of the guest flow is to keep momentum toward publishing.
      const latest = drafts.reduce((a, b) => (a.createdAt > b.createdAt ? a : b));
      redirect(`/app/sites/${latest.id}/edit`);
    }
  }

  if (!identity) {
    identity = await createGuestIdentity();
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
