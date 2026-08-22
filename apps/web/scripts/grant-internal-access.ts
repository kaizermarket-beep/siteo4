// Grants an account permanent Premium entitlements without a payment.
//
//   pnpm --filter web grant-access <email>          # accorder
//   pnpm --filter web grant-access <email> --revoke # retirer
//
// Why this exists: the operator of Siteo needs to publish sites on their own
// service, and getUserEntitlements gives every account — theirs included —
// seven trial days and then `allowsPublish: false`. There is no owner
// concept in the code.
//
// Subscribing to your own product would be worse than useless: the money
// leaves your account and comes back minus Stripe's fee. What actually costs
// something is the infrastructure, and that is billed whether or not a
// subscription row exists.
//
// The marker for an internal grant is `stripeSubscriptionId: null` — a real
// Stripe subscription always has one. The billing page reads that to show
// "internal access" instead of a portal button that would fail, and the
// Stripe webhook upserts on that same column, so it can never overwrite a
// row where it is null.
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../src/lib/db/schema";

const INTERNAL_CUSTOMER_ID = "internal_no_stripe";

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  const revoke = process.argv.includes("--revoke");

  if (!email) {
    console.error("Usage: grant-internal-access <email> [--revoke]");
    process.exit(1);
  }

  const db = drizzle(process.env.DATABASE_URL!, { schema });

  const [user] = await db.select().from(schema.users).where(eq(schema.users.email, email));
  if (!user) {
    console.error(`Aucun compte avec l'email ${email}.`);
    process.exit(1);
  }
  if (user.isGuest) {
    console.error("Ce compte est un compte invité, pas un compte réel.");
    process.exit(1);
  }

  const existing = await db
    .select()
    .from(schema.subscriptions)
    .where(eq(schema.subscriptions.userId, user.id));

  if (revoke) {
    const internal = existing.filter((s) => s.stripeSubscriptionId === null);
    if (internal.length === 0) {
      console.log("Aucun accès interne à retirer.");
      process.exit(0);
    }
    for (const row of internal) {
      await db.delete(schema.subscriptions).where(eq(schema.subscriptions.id, row.id));
    }
    console.log(`Accès interne retiré pour ${email} (${internal.length} ligne(s)).`);
    process.exit(0);
  }

  // Refuse to touch a real Stripe subscription: overwriting one would
  // desynchronise the database from Stripe's own state.
  const real = existing.find((s) => s.stripeSubscriptionId !== null && s.status === "active");
  if (real) {
    console.error(
      `${email} a déjà un abonnement Stripe actif (${real.stripeSubscriptionId}). Rien à faire.`
    );
    process.exit(1);
  }

  const [premium] = await db
    .select()
    .from(schema.plans)
    .where(eq(schema.plans.key, "premium"));
  if (!premium) {
    console.error("Plan 'premium' introuvable — lancez d'abord `pnpm --filter web db:seed`.");
    process.exit(1);
  }

  // Reuse the row rather than adding a second one: the billing page reads
  // the *first* subscription it finds for a user, unordered, so two rows
  // would make the page show whichever Postgres returned first.
  const reusable = existing.find((s) => s.stripeSubscriptionId === null);

  if (reusable) {
    await db
      .update(schema.subscriptions)
      .set({
        planId: premium.id,
        status: "active",
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
        updatedAt: new Date(),
      })
      .where(eq(schema.subscriptions.id, reusable.id));
    console.log(`Accès interne mis à jour pour ${email}.`);
  } else {
    // A stale canceled Stripe row would still be picked up by the billing
    // page before the new one; clear those first.
    await db
      .delete(schema.subscriptions)
      .where(
        and(eq(schema.subscriptions.userId, user.id), eq(schema.subscriptions.status, "canceled"))
      );

    await db.insert(schema.subscriptions).values({
      userId: user.id,
      planId: premium.id,
      stripeSubscriptionId: null,
      stripeCustomerId: INTERNAL_CUSTOMER_ID,
      status: "active",
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
    });
    console.log(`Accès interne accordé à ${email}.`);
  }

  console.log(
    `→ Premium : ${premium.maxSites} sites, modèles premium, publication autorisée. Aucun paiement.`
  );
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
