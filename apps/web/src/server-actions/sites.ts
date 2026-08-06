"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { sites, siteBlocks, templates } from "@/lib/db/schema";
import { slugify, validateSlug } from "@/lib/slug";

export type CreateSiteState = { error?: string } | undefined;

export async function createSite(
  _prevState: CreateSiteState,
  formData: FormData
): Promise<CreateSiteState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Vous devez être connecté." };
  }

  const templateSlug = String(formData.get("templateSlug") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim().toLowerCase();

  if (!name) {
    return { error: "Le nom du site est requis." };
  }

  const [template] = await db.select().from(templates).where(eq(templates.slug, templateSlug));
  if (!template) {
    return { error: "Modèle introuvable." };
  }

  const slug = slugify(rawSlug || name);
  const validation = validateSlug(slug);
  if (!validation.ok) {
    return { error: validation.error };
  }

  const [existing] = await db.select().from(sites).where(eq(sites.slug, slug));
  if (existing) {
    return { error: "Cette adresse est déjà utilisée. Choisissez-en une autre." };
  }

  const defaultBlocks = (
    template.schema as { defaultBlocks: { type: string; position: number; content: unknown }[] }
  ).defaultBlocks;

  const [site] = await db
    .insert(sites)
    .values({
      userId: session.user.id,
      templateId: template.id,
      slug,
      name,
      status: "draft",
    })
    .returning();

  for (const block of defaultBlocks) {
    await db.insert(siteBlocks).values({
      siteId: site.id,
      blockType: block.type,
      position: block.position,
      content: block.content,
    });
  }

  redirect("/app");
}
