import { and, asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { sites, siteBlocks } from "@/lib/db/schema";
import { BlockRenderer } from "@/components/blocks";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [site] = await db
    .select()
    .from(sites)
    .where(and(eq(sites.slug, slug), eq(sites.status, "published")));

  if (!site) return {};
  return { title: site.seoTitle || site.name };
}

export default async function PublicSitePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [site] = await db
    .select()
    .from(sites)
    .where(and(eq(sites.slug, slug), eq(sites.status, "published")));

  if (!site) notFound();

  const blocks = await db
    .select()
    .from(siteBlocks)
    .where(and(eq(siteBlocks.siteId, site.id), eq(siteBlocks.isVisible, true)))
    .orderBy(asc(siteBlocks.position));

  const theme = site.theme as { primaryColor?: string; mode?: "light" | "dark" } | null;

  return (
    <div
      className={theme?.mode === "dark" ? "dark bg-neutral-950" : "bg-white"}
      style={theme?.primaryColor ? ({ "--site-accent": theme.primaryColor } as React.CSSProperties) : undefined}
    >
      {blocks.map((block) => (
        <BlockRenderer key={block.id} blockType={block.blockType} content={block.content} />
      ))}
    </div>
  );
}
