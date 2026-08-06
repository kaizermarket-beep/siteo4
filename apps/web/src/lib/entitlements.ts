import { and, eq } from "drizzle-orm";
import { db } from "./db";
import { plans, subscriptions } from "./db/schema";

export type Entitlements = {
  planKey: string;
  maxSites: number;
  allowsPremiumTemplates: boolean;
  allowsPublish: boolean;
};

// Centralizes plan-based gating so site creation, template selection, and
// publish all read the same source of truth instead of duplicating plan
// checks. Falls back to the "free" plan when the user has no active
// subscription — Stripe checkout/webhooks aren't wired yet (need real API
// keys), so today every user effectively sits on the free plan.
export async function getUserEntitlements(userId: string): Promise<Entitlements> {
  const [active] = await db
    .select({ plan: plans })
    .from(subscriptions)
    .innerJoin(plans, eq(subscriptions.planId, plans.id))
    .where(and(eq(subscriptions.userId, userId), eq(subscriptions.status, "active")));

  const plan = active?.plan ?? (await db.select().from(plans).where(eq(plans.key, "free")))[0];

  if (!plan) {
    throw new Error("Le plan 'free' n'est pas initialisé — lancez le script de seed.");
  }

  return {
    planKey: plan.key,
    maxSites: plan.maxSites,
    allowsPremiumTemplates: plan.allowsPremiumTemplates,
    allowsPublish: plan.allowsPublish,
  };
}
