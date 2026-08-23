// Grants an account permanent Premium entitlements without a payment.
//
//   pnpm --filter web grant-access <email>              # accorder
//   pnpm --filter web grant-access <email> --sites 50   # + relever le plafond
//   pnpm --filter web grant-access <email> --revoke     # tout retirer
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
//
// `--sites N` raises the ceiling through users.extraSiteCredits rather than
// through plans.maxSites. The distinction matters: plans.maxSites is the
// product sold to every Premium customer, and raising it would silently
// promise them fifty sites for the price of five. extraSiteCredits is
// per-account, and entitlements.ts already adds it on top of the plan.
//
// Beware what the ceiling actually counts. createSiteForUser counts *every*
// row in `sites` belonging to the account, with no filter on status — an
// abandoned draft occupies a slot exactly like a live client site.
import { and, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../src/lib/db/schema";

const INTERNAL_CUSTOMER_ID = "internal_no_stripe";

function parseSites(argv: string[]): number | null {
  const i = argv.indexOf("--sites");
  if (i === -1) return null;
  const n = Number(argv[i + 1]);
  if (!Number.isInteger(n) || n < 1) {
    console.error("--sites attend un entier positif, ex. --sites 50");
    process.exit(1);
  }
  return n;
}

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  const revoke = process.argv.includes("--revoke");
  const targetSites = parseSites(process.argv);

  if (!email) {
    console.error("Usage: grant-internal-access <email> [--sites N] [--revoke]");
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
    // Credits have to go with the subscription. Left behind, they would
    // still be added to whatever plan the account lands on next — an Eco
    // subscription would come with fifty sites instead of one. Nothing
    // sells credits today, so any balance here was granted by this script.
    if (user.extraSiteCredits > 0) {
      await db
        .update(schema.users)
        .set({ extraSiteCredits: 0 })
        .where(eq(schema.users.id, user.id));
    }
    console.log(
      `Accès interne retiré pour ${email} (${internal.length} ligne(s), ${user.extraSiteCredits} crédit(s) remis à zéro).`
    );
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
    .where(eq(schema.plans.key, "agence"));
  if (!premium) {
    console.error("Plan 'agence' introuvable — lancez d'abord `pnpm --filter web db:seed`.");
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

  if (targetSites !== null) {
    // The flag reads as a total, because that is what the operator thinks
    // in ("I want fifty sites"), not as a delta on top of the plan.
    const credits = Math.max(0, targetSites - premium.maxSites);
    if (targetSites < premium.maxSites) {
      console.warn(
        `--sites ${targetSites} est en dessous du plan Premium (${premium.maxSites}) : plafond laissé à ${premium.maxSites}.`
      );
    }
    await db
      .update(schema.users)
      .set({ extraSiteCredits: credits })
      .where(eq(schema.users.id, user.id));
  }

  // Report the entitlements as the application itself computes them, rather
  // than as this script believes it wrote them — the two have to agree.
  const { getUserEntitlements } = await import("../src/lib/entitlements");
  const entitlements = await getUserEntitlements(user.id);
  const [{ count: siteCount }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(schema.sites)
    .where(eq(schema.sites.userId, user.id));

  console.log(
    `→ plan « ${entitlements.planKey} » · ${siteCount}/${entitlements.maxSites} sites utilisés · ` +
      `modèles premium : ${entitlements.allowsPremiumTemplates ? "oui" : "non"} · ` +
      `publication : ${entitlements.allowsPublish ? "oui" : "non"} · aucun paiement.`
  );
  if (siteCount >= entitlements.maxSites) {
    console.warn("⚠ Plafond déjà atteint. Rappel : les brouillons comptent autant que les sites publiés.");
  }
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
