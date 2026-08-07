import { db } from "@/lib/db";
import { templates } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { getUserEntitlements } from "@/lib/entitlements";
import { NewSiteForm } from "./NewSiteForm";

export default async function NewSitePage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
  const { template } = await searchParams;
  const session = await auth();
  const [allTemplates, entitlements] = await Promise.all([
    db.select().from(templates),
    getUserEntitlements(session!.user!.id!),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold">Créer un site</h1>
      <NewSiteForm
        templates={allTemplates.map((t) => ({
          slug: t.slug,
          name: t.name,
          description: t.description ?? "",
          isPremium: t.isPremium,
        }))}
        allowsPremiumTemplates={entitlements.allowsPremiumTemplates}
        preselectedTemplate={template}
      />
    </div>
  );
}
