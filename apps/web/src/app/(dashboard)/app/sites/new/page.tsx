import { db } from "@/lib/db";
import { templates } from "@/lib/db/schema";
import { NewSiteForm } from "./NewSiteForm";

export default async function NewSitePage() {
  const allTemplates = await db.select().from(templates);

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
      />
    </div>
  );
}
