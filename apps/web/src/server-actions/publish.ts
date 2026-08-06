"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { sites } from "@/lib/db/schema";

async function getOwnedSite(siteId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Non authentifié.");

  const [site] = await db
    .select()
    .from(sites)
    .where(and(eq(sites.id, siteId), eq(sites.userId, session.user.id)));

  if (!site) throw new Error("Site introuvable.");
  return site;
}

export async function publishSite(siteId: string) {
  const site = await getOwnedSite(siteId);

  await db
    .update(sites)
    .set({ status: "published", publishedAt: new Date(), updatedAt: new Date() })
    .where(eq(sites.id, site.id));

  revalidatePath(`/s/${site.slug}`);
  return { ok: true as const, slug: site.slug };
}

export async function unpublishSite(siteId: string) {
  const site = await getOwnedSite(siteId);

  await db
    .update(sites)
    .set({ status: "draft", updatedAt: new Date() })
    .where(eq(sites.id, site.id));

  revalidatePath(`/s/${site.slug}`);
  return { ok: true as const };
}
