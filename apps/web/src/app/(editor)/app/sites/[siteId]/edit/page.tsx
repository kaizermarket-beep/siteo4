import { and, asc, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { sites, siteBlocks } from "@/lib/db/schema";
import { Editor } from "@/components/editor/Editor";
import type { BlockType } from "@/validation/blocks";

export default async function EditSitePage({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const { siteId } = await params;
  const session = await auth();
  if (!session?.user?.id) notFound();

  const [site] = await db
    .select()
    .from(sites)
    .where(and(eq(sites.id, siteId), eq(sites.userId, session.user.id)));

  if (!site) notFound();

  const blocks = await db
    .select()
    .from(siteBlocks)
    .where(eq(siteBlocks.siteId, siteId))
    .orderBy(asc(siteBlocks.position));

  const theme = site.theme as { primaryColor?: string } | null;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-neutral-200 px-6 py-3">
        <div className="flex items-center gap-3">
          <Link href="/app" className="text-sm text-neutral-500 hover:text-neutral-900">
            ← Mes sites
          </Link>
          <span className="font-medium">{site.name}</span>
        </div>
        {site.status === "published" ? (
          <a
            href={`/s/${site.slug}`}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-neutral-600 underline"
          >
            Voir le site publié ↗
          </a>
        ) : (
          <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
            Brouillon — publication disponible bientôt
          </span>
        )}
      </header>
      <div className="flex-1 p-6">
        <Editor
          siteId={site.id}
          primaryColor={theme?.primaryColor}
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
