import { eq, sql } from "drizzle-orm";
import { requireUserId } from "@/lib/require-user";
import Link from "next/link";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { sites, templates } from "@/lib/db/schema";
import { getUserEntitlements } from "@/lib/entitlements";
import { createSiteForUser } from "@/server-actions/sites";
import { templateCategories, templatePages, type TemplateSchema } from "@/templates/types";
import { NewSiteForm } from "./NewSiteForm";
import { TemplatePickerHero } from "./TemplatePickerHero";

export default async function NewSitePage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
  const { template } = await searchParams;
  const userId = await requireUserId();
  const [allTemplates, entitlements, [{ count: currentSiteCount }]] = await Promise.all([
    db.select().from(templates),
    getUserEntitlements(userId),
    db.select({ count: sql<number>`count(*)::int` }).from(sites).where(eq(sites.userId, userId)),
  ]);

  if (!entitlements.allowsPublish && entitlements.planKey === "expired") {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-16 text-center">
        <h1 className="text-xl font-semibold text-neutral-900">Votre essai gratuit est terminé</h1>
        <p className="text-sm text-neutral-600">
          Passez à un abonnement pour créer un nouveau site.
        </p>
        <Link href="/app/billing" className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white">
          Voir les formules
        </Link>
      </div>
    );
  }

  if (currentSiteCount >= entitlements.maxSites) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-16 text-center">
        <h1 className="text-xl font-semibold text-neutral-900">Limite de sites atteinte</h1>
        <p className="text-sm text-neutral-600">
          Votre plan ({entitlements.planKey}) permet {entitlements.maxSites} site(s). Passez à un abonnement
          supérieur pour en créer un de plus.
        </p>
        <Link href="/app/billing" className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white">
          Voir les formules
        </Link>
      </div>
    );
  }

  // Arriving with a specific template already chosen (e.g. "Choisir ce
  // modèle" from the marketing pages) skips the picker entirely — same
  // one-click-to-editor promise the link made. Falls through to the picker
  // below if the template doesn't exist or is locked for this plan, so
  // there's still somewhere useful to land.
  if (template) {
    const templateRow = allTemplates.find((t) => t.slug === template);
    const isLocked = templateRow?.isPremium && !entitlements.allowsPremiumTemplates;
    if (templateRow && !isLocked) {
      const site = await createSiteForUser(userId, template);
      redirect(`/app/sites/${site.id}/edit`);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <TemplatePickerHero images={templateCategories.map((c) => ({ url: c.image, alt: c.label }))} />
      <NewSiteForm
        templates={allTemplates.map((t) => {
          const schema = t.schema as TemplateSchema;
          return {
            slug: t.slug,
            name: t.name,
            description: t.description ?? "",
            isPremium: t.isPremium,
            pageCount: templatePages(schema).length,
            accentColor: schema.accentColor,
            mode: schema.mode,
            icon: templateCategories.find((c) => c.key === t.category)?.icon ?? "✦",
            category: t.category ?? "",
          };
        })}
        categories={templateCategories.map((c) => ({ key: c.key, label: c.label, icon: c.icon }))}
        allowsPremiumTemplates={entitlements.allowsPremiumTemplates}
        preselectedTemplate={template}
      />
    </div>
  );
}
