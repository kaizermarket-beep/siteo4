"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { siteBlocks, sites } from "@/lib/db/schema";
import { blockContentSchemas, type BlockType } from "@/validation/blocks";

async function assertBlockOwnership(blockId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Non authentifié.");

  const [row] = await db
    .select({ block: siteBlocks, site: sites })
    .from(siteBlocks)
    .innerJoin(sites, eq(siteBlocks.siteId, sites.id))
    .where(eq(siteBlocks.id, blockId));

  if (!row || row.site.userId !== session.user.id) {
    throw new Error("Bloc introuvable.");
  }
  return row;
}

export async function updateBlockContent(blockId: string, content: unknown) {
  const { block, site } = await assertBlockOwnership(blockId);

  const schema = blockContentSchemas[block.blockType as BlockType];
  if (!schema) throw new Error("Type de bloc inconnu.");

  const parsed = schema.parse(content);

  await db
    .update(siteBlocks)
    .set({ content: parsed, updatedAt: new Date() })
    .where(eq(siteBlocks.id, blockId));

  if (site.status === "published") {
    revalidatePath(`/s/${site.slug}`);
  }

  return { ok: true as const };
}

export async function toggleBlockVisibility(blockId: string, isVisible: boolean) {
  const { site } = await assertBlockOwnership(blockId);

  await db
    .update(siteBlocks)
    .set({ isVisible, updatedAt: new Date() })
    .where(eq(siteBlocks.id, blockId));

  if (site.status === "published") {
    revalidatePath(`/s/${site.slug}`);
  }
}

export async function reorderBlocks(siteId: string, orderedBlockIds: string[]) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Non authentifié.");

  const [site] = await db
    .select()
    .from(sites)
    .where(and(eq(sites.id, siteId), eq(sites.userId, session.user.id)));
  if (!site) throw new Error("Site introuvable.");

  for (let i = 0; i < orderedBlockIds.length; i++) {
    await db
      .update(siteBlocks)
      .set({ position: (i + 1) * 10, updatedAt: new Date() })
      .where(and(eq(siteBlocks.id, orderedBlockIds[i]), eq(siteBlocks.siteId, siteId)));
  }

  if (site.status === "published") {
    revalidatePath(`/s/${site.slug}`);
  }
}
