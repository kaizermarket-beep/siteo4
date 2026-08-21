import Link from "next/link";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getTemplatesByCategory } from "@/templates/registry";
import { templateCategories, templatePages } from "@/templates/types";
import { BlockRenderer } from "@/components/blocks";
import { SiteNav } from "@/components/site/SiteNav";
import { startGuestSite } from "@/server-actions/guest-site";

const ctaClassName =
  "whitespace-nowrap rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const categoryDef = templateCategories.find((c) => c.key === category);
  if (!categoryDef) notFound();

  const categoryTemplates = getTemplatesByCategory(category);
  if (categoryTemplates.length === 0) notFound();

  const session = await auth();

  return (
    <main className="flex flex-1 flex-col gap-12 px-6 py-16">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
        <span className="text-4xl">{categoryDef.icon}</span>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Modèles pour {categoryDef.label.toLowerCase()}
        </h1>
        <p className="text-neutral-600">
          Choisissez un modèle pensé pour votre métier, personnalisez-le, publiez-le.
        </p>
        <Link href="/" className="text-sm text-neutral-500 underline">
          ← Voir tous les métiers
        </Link>
      </div>

      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10">
        {categoryTemplates.map((template) => {
          const pages = templatePages(template.schema);
          return (
            <div key={template.slug} className="overflow-hidden rounded-xl border border-neutral-200">
              <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-medium text-neutral-900">{template.name}</h2>
                    {pages.length > 1 && (
                      <span className="rounded-full border border-neutral-300 px-2 py-0.5 text-[11px] font-medium text-neutral-600">
                        {pages.length} pages
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-600">{template.description}</p>
                </div>
                {session?.user ? (
                  <Link href={`/app/sites/new?template=${template.slug}`} className={ctaClassName}>
                    Choisir ce modèle
                  </Link>
                ) : (
                  <form action={startGuestSite}>
                    <input type="hidden" name="templateSlug" value={template.slug} />
                    <button type="submit" className={ctaClassName}>
                      Choisir ce modèle
                    </button>
                  </form>
                )}
              </div>
              <div
                className={`max-h-[70vh] overflow-y-auto ${
                  template.schema.mode === "dark" ? "dark bg-neutral-950" : "bg-white"
                }`}
                style={
                  template.schema.accentColor
                    ? ({ "--site-accent": template.schema.accentColor } as CSSProperties)
                    : undefined
                }
              >
                <SiteNav
                  siteName={template.name}
                  pages={pages.map((p) => ({ slug: p.slug, title: p.title }))}
                  activeSlug=""
                  preview
                />
                {template.schema.defaultBlocks.map((block, i) => (
                  <BlockRenderer key={i} blockType={block.type} content={block.content} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
