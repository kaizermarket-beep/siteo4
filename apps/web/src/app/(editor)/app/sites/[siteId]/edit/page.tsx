import { and, asc, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { sites, siteBlocks, sitePages } from "@/lib/db/schema";
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

  const [pages, blocks] = await Promise.all([
    db
      .select()
      .from(sitePages)
      .where(eq(sitePages.siteId, siteId))
      .orderBy(asc(sitePages.position)),
    db
      .select()
      .from(siteBlocks)
      .where(eq(siteBlocks.siteId, siteId))
      .orderBy(asc(siteBlocks.position)),
  ]);

  const theme = site.theme as { primaryColor?: string; mode?: "light" | "dark" } | null;
  // Restaurants take tables, salons take appointments; both land in the same
  // list, so the link appears for either and is labelled for the one in use.
  const bookingBlock = blocks.find(
    (b) => b.blockType === "reservation" || b.blockType === "appointment"
  );
  const bookingLabel = bookingBlock?.blockType === "appointment" ? "Rendez-vous" : "Réservations";

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
          <div className="flex items-center gap-4">
            {bookingBlock && (
              <Link
                href={`/app/sites/${site.id}/reservations`}
                className="text-sm text-neutral-500 hover:text-neutral-900"
              >
                {bookingLabel}
              </Link>
            )}
            <GuestPublishFlow siteId={site.id} initialSiteName={site.name} initialSlug={site.slug} />
          </div>
        ) : (
          <div className="flex items-center gap-4">
            {bookingBlock && (
              <Link
                href={`/app/sites/${site.id}/reservations`}
                className="text-sm text-neutral-500 hover:text-neutral-900"
              >
                {bookingLabel}
              </Link>
            )}
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
          siteName={site.name}
          primaryColor={theme?.primaryColor}
          mode={theme?.mode}
          initialPages={pages.map((p) => ({
            id: p.id,
            slug: p.slug,
            title: p.title,
            position: p.position,
          }))}
          initialBlocks={blocks
            // A block with no page predates multi-page support and renders
            // nowhere; scripts/backfill-site-pages.ts adopts it into the
            // home page. Skipping it here keeps the editor honest about
            // what the published site actually shows.
            .filter((b) => b.pageId !== null)
            .map((b) => ({
              id: b.id,
              pageId: b.pageId!,
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
