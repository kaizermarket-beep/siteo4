"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import { db } from "@/lib/db";
import { siteBlocks, sitePages, sites } from "@/lib/db/schema";
import { resolveIdentity } from "@/lib/identity";
import { getUserEntitlements } from "@/lib/entitlements";
import { siteCacheTag } from "@/lib/site-pages";
import { slugify } from "@/lib/slug";

// A page a user adds by hand starts with the three sections that make a page
// worth visiting on its own. The editor has no "add a block" control — what a
// page ships with is what it has — so an empty page would be a dead end.
const STARTER_BLOCKS = [
  {
    type: "hero",
    position: 10,
    content: {
      headline: "Titre de la page",
      subheadline: "Décrivez en une phrase ce que le visiteur trouvera ici.",
      ctaLabel: "Nous contacter",
      ctaLink: { href: "#contact", label: "Nous contacter" },
      heroVariant: "blobs",
    },
  },
  {
    type: "features",
    position: 20,
    content: {
      title: "Ce que nous proposons",
      items: [
        { icon: "✦", title: "Premier point", description: "Décrivez ici votre premier service." },
        { icon: "✦", title: "Deuxième point", description: "Décrivez ici votre deuxième service." },
        { icon: "✦", title: "Troisième point", description: "Décrivez ici votre troisième service." },
      ],
    },
  },
  {
    type: "contact",
    position: 30,
    content: {
      title: "Nous contacter",
      description: "",
      email: "contact@exemple.fr",
      phone: "",
      address: "",
      hours: "",
      socialLinks: [],
      showForm: true,
    },
  },
] as const;

// Guard rail rather than a plan limit: a nav with a dozen entries is a worse
// site than one with four, and nothing here is priced per page.
const MAX_PAGES = 8;

async function assertSiteOwnership(siteId: string) {
  const identity = await resolveIdentity();
  if (!identity) throw new Error("Non authentifié.");

  const [site] = await db
    .select()
    .from(sites)
    .where(and(eq(sites.id, siteId), eq(sites.userId, identity.userId)));
  if (!site) throw new Error("Site introuvable.");

  return { site, identity };
}

function revalidateSite(slug: string, status: string) {
  if (status !== "published") return;
  // "layout" so every page under the site is revalidated, not just its root.
  revalidatePath(`/s/${slug}`, "layout");
  // And the tag, because revalidatePath does not reach the unstable_cache
  // entry holding this site's data (see lib/site-pages.ts). updateTag rather
  // than revalidateTag: the latter now serves stale content while it
  // refreshes, so someone who just published would reload and still see the
  // old page. updateTag expires immediately — read your own writes.
  updateTag(siteCacheTag(slug));
}

export async function createPage(siteId: string, title: string) {
  const { site, identity } = await assertSiteOwnership(siteId);

  // Multi-page is what Premium sells. Guests are on a full-access trial, so
  // they can build one and see the value before being asked to pay.
  const entitlements = await getUserEntitlements(identity.userId);
  if (!entitlements.allowsPremiumTemplates) {
    throw new Error("Les pages supplémentaires sont réservées au plan Premium.");
  }

  const clean = title.trim();
  if (!clean) throw new Error("Donnez un nom à la page.");
  if (clean.length > 40) throw new Error("Le nom de la page est trop long.");

  const slug = slugify(clean);
  if (!slug) throw new Error("Ce nom ne peut pas servir d'adresse. Essayez-en un autre.");

  const existing = await db.select().from(sitePages).where(eq(sitePages.siteId, siteId));
  if (existing.length >= MAX_PAGES) {
    throw new Error(`Un site ne peut pas dépasser ${MAX_PAGES} pages.`);
  }
  if (existing.some((p) => p.slug === slug)) {
    throw new Error("Une page porte déjà ce nom.");
  }

  const nextPosition = Math.max(0, ...existing.map((p) => p.position)) + 10;

  const [page] = await db
    .insert(sitePages)
    .values({ siteId, slug, title: clean, position: nextPosition })
    .returning();

  const blocks = await db
    .insert(siteBlocks)
    .values(
      STARTER_BLOCKS.map((b) => ({
        siteId,
        pageId: page.id,
        blockType: b.type,
        position: b.position,
        content: b.content,
      }))
    )
    .returning();

  revalidateSite(site.slug, site.status);
  return { page, blocks };
}

export async function renamePage(pageId: string, title: string) {
  const clean = title.trim();
  if (!clean) throw new Error("Donnez un nom à la page.");
  if (clean.length > 40) throw new Error("Le nom de la page est trop long.");

  const [row] = await db
    .select({ page: sitePages, site: sites })
    .from(sitePages)
    .innerJoin(sites, eq(sitePages.siteId, sites.id))
    .where(eq(sitePages.id, pageId));
  if (!row) throw new Error("Page introuvable.");

  const identity = await resolveIdentity();
  if (!identity || row.site.userId !== identity.userId) throw new Error("Page introuvable.");

  // The title is the nav label; the slug — the page's public address — stays
  // as created. Renaming it would break every link already shared.
  await db
    .update(sitePages)
    .set({ title: clean, updatedAt: new Date() })
    .where(eq(sitePages.id, pageId));

  revalidateSite(row.site.slug, row.site.status);
  return { ok: true as const };
}

export async function deletePage(pageId: string) {
  const [row] = await db
    .select({ page: sitePages, site: sites })
    .from(sitePages)
    .innerJoin(sites, eq(sitePages.siteId, sites.id))
    .where(eq(sitePages.id, pageId));
  if (!row) throw new Error("Page introuvable.");

  const identity = await resolveIdentity();
  if (!identity || row.site.userId !== identity.userId) throw new Error("Page introuvable.");

  if (row.page.slug === "") throw new Error("La page d'accueil ne peut pas être supprimée.");

  // Blocks cascade with the page (see schema.ts).
  await db.delete(sitePages).where(eq(sitePages.id, pageId));

  revalidateSite(row.site.slug, row.site.status);
  return { ok: true as const };
}
