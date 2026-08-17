import { and, asc, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { sites, siteBlocks } from "@/lib/db/schema";
import { resolveIdentity } from "@/lib/identity";
import { Editor } from "@/components/editor/Editor";
import { PublishButton } from "@/components/editor/PublishButton";
import { GuestPublishFlow } from "@/components/editor/GuestPublishFlow";
import type { BlockType } from "@/validation/blocks";

export default async function EditSitePage({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const { siteId } = await params;
  const identity = await resolveIdentity();
  if (!identity) notFound();

  const [site] = await db
    .select()
    .from(sites)
    .where(and(eq(sites.id, siteId), eq(sites.userId, identity.userId)));

  if (!site) notFound();

  const blocks = await db
    .select()
    .from(siteBlocks)
    .where(eq(siteBlocks.siteId, siteId))
    .orderBy(asc(siteBlocks.position));

  const theme = site.theme as { primaryColor?: string; mode?: "light" | "dark" } | null;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-neutral-200 px-6 py-3">
        <div className="flex items-center gap-3">
          <Link
            href={identity.isGuest ? "/" : "/app"}
            className="text-sm text-neutral-500 hover:text-neutral-900"
          >
            ← {identity.isGuest ? "Siteo" : "Mes sites"}
          </Link>
          <span className="font-medium">{site.name}</span>
        </div>
        {identity.isGuest ? (
          <GuestPublishFlow siteId={site.id} initialSiteName={site.name} initialSlug={site.slug} />
        ) : (
          <div className="flex items-center gap-4">
            <Link href="/app/sites/new" className="text-sm text-neutral-500 hover:text-neutral-900">
              Voir d&apos;autres modèles
            </Link>
            <PublishButton siteId={site.id} slug={site.slug} initialStatus={site.status} />
          </div>
        )}
      </header>
      <div className="flex-1 p-6">
        <Editor
          siteId={site.id}
          primaryColor={theme?.primaryColor}
          mode={theme?.mode}
          initialBlocks={blocks.map((b) => ({
            id: b.id,
            blockType: b.blockType as BlockType,
            position: b.position,
            isVisible: b.isVisible,
            content: b.content as Record<string, unknown>,
          }))}
        />
      </div>
    </div>
  );
}
