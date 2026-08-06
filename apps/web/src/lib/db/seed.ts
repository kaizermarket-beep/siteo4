import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import { templates as templateDefs } from "../../templates/registry";

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
  const db = drizzle(process.env.DATABASE_URL, { schema });

  // 1. Upsert templates from the registry (source of truth: src/templates/registry.ts)
  const templateIds = new Map<string, string>();
  for (const def of templateDefs) {
    const [existing] = await db
      .select()
      .from(schema.templates)
      .where(eq(schema.templates.slug, def.slug));

    if (existing) {
      await db
        .update(schema.templates)
        .set({
          name: def.name,
          description: def.description,
          isPremium: def.isPremium,
          schema: def.schema,
        })
        .where(eq(schema.templates.id, existing.id));
      templateIds.set(def.slug, existing.id);
      console.log(`Updated template: ${def.slug}`);
    } else {
      const [created] = await db
        .insert(schema.templates)
        .values({
          slug: def.slug,
          name: def.name,
          description: def.description,
          isPremium: def.isPremium,
          schema: def.schema,
        })
        .returning();
      templateIds.set(def.slug, created.id);
      console.log(`Created template: ${def.slug}`);
    }
  }

  // 2. Plans (Stripe price IDs stay null until Stripe checkout is wired — M6)
  const planDefs = [
    { key: "free", stripePriceId: null, maxSites: 1, allowsPremiumTemplates: false, allowsPublish: true },
    { key: "pro", stripePriceId: null, maxSites: 5, allowsPremiumTemplates: true, allowsPublish: true },
  ];
  for (const def of planDefs) {
    const [existing] = await db.select().from(schema.plans).where(eq(schema.plans.key, def.key));
    if (existing) {
      await db.update(schema.plans).set(def).where(eq(schema.plans.id, existing.id));
      console.log(`Updated plan: ${def.key}`);
    } else {
      await db.insert(schema.plans).values(def);
      console.log(`Created plan: ${def.key}`);
    }
  }

  // 3. Fixture demo user
  const demoEmail = "demo@siteo.dev";
  let [demoUser] = await db.select().from(schema.users).where(eq(schema.users.email, demoEmail));
  if (!demoUser) {
    const passwordHash = await bcrypt.hash("demo12345", 10);
    [demoUser] = await db
      .insert(schema.users)
      .values({ email: demoEmail, name: "Demo", passwordHash })
      .returning();
    console.log(`Created demo user: ${demoEmail} / demo12345`);
  }

  // 4. Fixture published site using the "agence" template
  const demoSlug = "demo";
  const [existingSite] = await db.select().from(schema.sites).where(eq(schema.sites.slug, demoSlug));
  if (!existingSite) {
    const agenceTemplate = templateDefs.find((t) => t.slug === "agence")!;
    const agenceTemplateId = templateIds.get("agence")!;

    const [site] = await db
      .insert(schema.sites)
      .values({
        userId: demoUser.id,
        templateId: agenceTemplateId,
        slug: demoSlug,
        name: "Site de démonstration",
        status: "published",
        publishedAt: new Date(),
        theme: { primaryColor: "#171717" },
      })
      .returning();

    for (const block of agenceTemplate.schema.defaultBlocks) {
      await db.insert(schema.siteBlocks).values({
        siteId: site.id,
        blockType: block.type,
        position: block.position,
        content: block.content,
      });
    }
    console.log(`Created fixture site: ${demoSlug} (${agenceTemplate.name})`);
  } else {
    console.log(`Fixture site already exists: ${demoSlug}`);
  }

  console.log("Seed complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
