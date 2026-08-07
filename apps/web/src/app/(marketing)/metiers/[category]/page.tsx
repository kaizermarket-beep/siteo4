import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getTemplatesByCategory } from "@/templates/registry";
import { templateCategories } from "@/templates/types";
import { BlockRenderer } from "@/components/blocks";

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
          const createHref = session?.user
            ? `/app/sites/new?template=${template.slug}`
            : `/signup?template=${template.slug}`;

          return (
            <div key={template.slug} className="overflow-hidden rounded-xl border border-neutral-200">
              <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
                <div>
                  <h2 className="text-lg font-medium text-neutral-900">{template.name}</h2>
                  <p className="text-sm text-neutral-600">{template.description}</p>
                </div>
                <Link
                  href={createHref}
                  className="whitespace-nowrap rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
                >
                  Choisir ce modèle
                </Link>
              </div>
              <div className="max-h-[70vh] overflow-y-auto bg-white">
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
