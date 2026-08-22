"use server";

import { and, asc, eq, sql } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { siteBlocks, sites, templates } from "@/lib/db/schema";
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
// High enough that browsing the whole catalogue rarely reaches it — there are
// six métiers, and comparing four or five templates is normal behaviour.
const MAX_GUEST_DRAFTS = 10;

// Frees one slot by dropping the draft the visitor has touched least
// recently — last block edit, or creation if they never edited it.
//
// Reaching the cap used to send the visitor to their most recent draft
// instead of creating the one they asked for, which meant clicking a
// restaurant template opened whatever they had opened last. From the
// outside that is indistinguishable from a broken link. Whatever else
// happens, "Choisir ce modèle" has to open *that* model.
async function recycleOldestDraft(userId: string) {
  const lastTouched = sql`greatest(${sites.createdAt}, coalesce(max(${siteBlocks.updatedAt}), ${sites.createdAt}))`;

  const [oldest] = await db
    .select({ id: sites.id })
    .from(sites)
    .leftJoin(siteBlocks, eq(siteBlocks.siteId, sites.id))
    // Published sites are never recycled. A guest cannot publish today
    // (publishing is what turns them into a real account), but that is a
    // property of another file, not something to rely on here.
    .where(and(eq(sites.userId, userId), eq(sites.status, "draft")))
    .groupBy(sites.id)
    .orderBy(asc(lastTouched))
    .limit(1);

  if (oldest) {
    // Pages and blocks cascade with the site (see schema.ts).
    await db.delete(sites).where(eq(sites.id, oldest.id));
  }
}

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

    const [{ count: draftCount }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(sites)
      .where(eq(sites.userId, identity.userId));

    if (draftCount >= MAX_GUEST_DRAFTS) {
      await recycleOldestDraft(identity.userId);
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
