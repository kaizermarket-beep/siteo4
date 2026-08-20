/**
 * Creates (or reuses) one Stripe Product per plan and a recurring monthly
 * Price for it, then stores the price id on the matching `plan` row.
 *
 * One Product per tier on purpose: Checkout and invoices show the Product
 * name on each line item, so sharing one Product across tiers would print
 * the same label for Eco and Premium.
 *
 * Idempotent — looks the Product up by its `siteo_plan_key` metadata before
 * creating anything, so re-running after a price change is safe.
 *
 *   pnpm --filter web stripe:setup
 */
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import Stripe from "stripe";
import * as schema from "../src/lib/db/schema";

const PLAN_LABELS: Record<string, { name: string; description: string }> = {
  eco: {
    name: "Siteo Eco",
    description: "1 site, tous les modèles de base, hébergement inclus.",
  },
  premium: {
    name: "Siteo Premium",
    description: "Jusqu'à 5 sites, modèles premium, hébergement inclus.",
  },
};

async function main() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY manquante (apps/web/.env.local)");
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL manquante");

  if (key.includes("_live_")) {
    throw new Error("Clé LIVE détectée. Ce script est réservé au mode test.");
  }

  const stripe = new Stripe(key, { apiVersion: "2026-07-29.dahlia" });
  const db = drizzle(process.env.DATABASE_URL, { schema });

  const rows = await db.select().from(schema.plans);
  if (rows.length === 0) throw new Error("Aucun plan en base — lancez d'abord `pnpm db:seed`.");

  for (const plan of rows) {
    const label = PLAN_LABELS[plan.key];
    if (!label) {
      console.log(`- ${plan.key}: pas de libellé connu, ignoré`);
      continue;
    }

    // Reuse the Product tagged with this plan key rather than making a new one.
    const existing = await stripe.products.search({
      query: `metadata['siteo_plan_key']:'${plan.key}'`,
    });

    const product =
      existing.data[0] ??
      (await stripe.products.create({
        name: label.name,
        description: label.description,
        metadata: { siteo_plan_key: plan.key },
      }));

    const amount = plan.priceEuros * 100;

    // A Price is immutable, so a changed amount means a new Price; the old
    // one is deactivated so it stops showing up in the Dashboard picker.
    const prices = await stripe.prices.list({ product: product.id, active: true, limit: 100 });
    let price = prices.data.find(
      (p) => p.unit_amount === amount && p.currency === "eur" && p.recurring?.interval === "month"
    );

    if (!price) {
      for (const stale of prices.data) {
        await stripe.prices.update(stale.id, { active: false });
        console.log(`  ancien prix désactivé: ${stale.id}`);
      }
      price = await stripe.prices.create({
        product: product.id,
        currency: "eur",
        unit_amount: amount,
        recurring: { interval: "month" },
        metadata: { siteo_plan_key: plan.key },
      });
    }

    await db
      .update(schema.plans)
      .set({ stripePriceId: price.id })
      .where(eq(schema.plans.id, plan.id));

    console.log(`✓ ${plan.key.padEnd(8)} ${plan.priceEuros}€/mois  ${product.id}  ${price.id}`);
  }

  console.log("\nTerminé. Les plans pointent maintenant vers leurs prix Stripe.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
