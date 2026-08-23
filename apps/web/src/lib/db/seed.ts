import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import { templates as templateDefs } from "../../templates/registry";
import { BCRYPT_COST } from "../password";
import { templatePages } from "../../templates/types";

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
          category: def.category,
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
          category: def.category,
          isPremium: def.isPremium,
          schema: def.schema,
        })
        .returning();
      templateIds.set(def.slug, created.id);
      console.log(`Created template: ${def.slug}`);
    }
  }

  // 2. Plans — 7-day free trial (no card), then Starter, Pro or Agence.
  //
  // Renamed from the earlier eco/premium pair. Subscriptions point at the
  // plan's id, not its key, so renaming in place keeps every existing
  // subscriber attached to the plan they bought.
  const RENAMES: [string, string][] = [
    ["eco", "starter"],
    ["premium", "pro"],
  ];
  for (const [from, to] of RENAMES) {
    const [old] = await db.select().from(schema.plans).where(eq(schema.plans.key, from));
    const [already] = await db.select().from(schema.plans).where(eq(schema.plans.key, to));
    if (old && !already) {
      await db.update(schema.plans).set({ key: to }).where(eq(schema.plans.id, old.id));
      console.log(`Renamed plan: ${from} -> ${to}`);
    }
  }

  const planDefs = [
    {
      key: "starter",
      priceEuros: 12,
      maxSites: 1,
      allowsPremiumTemplates: false,
      allowsPublish: true,
    },
    {
      // Same single site as Starter; what you buy is access to the premium
      // templates, not more of them.
      key: "pro",
      priceEuros: 28,
      maxSites: 1,
      allowsPremiumTemplates: true,
      allowsPublish: true,
    },
    {
      key: "agence",
      priceEuros: 40,
      maxSites: 5,
      allowsPremiumTemplates: true,
      allowsPublish: true,
    },
  ];
  for (const def of planDefs) {
    const [existing] = await db.select().from(schema.plans).where(eq(schema.plans.key, def.key));
    if (existing) {
      // stripePriceId is deliberately not in `def`: it is written by
      // scripts/stripe-setup.ts, and re-seeding used to wipe it, which
      // silently disabled checkout until someone re-ran the setup script.
      await db.update(schema.plans).set(def).where(eq(schema.plans.id, existing.id));
      console.log(`Updated plan: ${def.key}`);
    } else {
      await db.insert(schema.plans).values({ ...def, stripePriceId: null });
      console.log(`Created plan: ${def.key}`);
    }
  }

  // 3. Fixture demo user
  const demoEmail = "demo@siteo.dev";
  let [demoUser] = await db.select().from(schema.users).where(eq(schema.users.email, demoEmail));
  if (!demoUser) {
    const passwordHash = await bcrypt.hash("demo12345", BCRYPT_COST);
    [demoUser] = await db
      .insert(schema.users)
      .values({ email: demoEmail, name: "Demo", passwordHash })
      .returning();
    console.log(`Created demo user: ${demoEmail} / demo12345`);
  }

  // 4. Fixture published site using the "photographe" template
  const demoSlug = "demo";
  const [existingSite] = await db.select().from(schema.sites).where(eq(schema.sites.slug, demoSlug));
  if (!existingSite) {
    const demoTemplate = templateDefs.find((t) => t.slug === "photographe")!;
    const demoTemplateId = templateIds.get("photographe")!;

    const [site] = await db
      .insert(schema.sites)
      .values({
        userId: demoUser.id,
        templateId: demoTemplateId,
        slug: demoSlug,
        name: "Site de démonstration",
        status: "published",
        publishedAt: new Date(),
        theme: { primaryColor: demoTemplate.schema.accentColor ?? "#171717" },
      })
      .returning();

    for (const page of templatePages(demoTemplate.schema)) {
      const [pageRow] = await db
        .insert(schema.sitePages)
        .values({
          siteId: site.id,
          slug: page.slug,
          title: page.title,
          position: page.position,
        })
        .returning();

      for (const block of page.blocks) {
        await db.insert(schema.siteBlocks).values({
          siteId: site.id,
          pageId: pageRow.id,
          blockType: block.type,
          position: block.position,
          content: block.content,
        });
      }
    }
    console.log(`Created fixture site: ${demoSlug} (${demoTemplate.name})`);
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
