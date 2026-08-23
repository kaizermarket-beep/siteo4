import { and, eq } from "drizzle-orm";
import { db } from "./db";
import { plans, subscriptions, users } from "./db/schema";

const TRIAL_DAYS = 7;

export type PlanKey = "starter" | "pro" | "agence";

export type Entitlements = {
  planKey: PlanKey | "trial" | "expired";
  maxSites: number;
  allowsPremiumTemplates: boolean;
  allowsPublish: boolean;
  trialEndsAt?: Date;
};

// Centralizes plan-based gating so site creation, template selection, and
// publish all read the same source of truth. No permanent free tier: every
// new account gets a 7-day, no-card trial with full access, then needs an
// active subscription (Eco or Premium) — see src/templates/registry.ts for
// the marketing framing. Stripe isn't wired yet, so nobody can actually
// subscribe today; everyone rides the trial (or sits "expired" after it).
export async function getUserEntitlements(userId: string): Promise<Entitlements> {
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user) {
    throw new Error("Utilisateur introuvable.");
  }

  const [active] = await db
    .select({ plan: plans })
    .from(subscriptions)
    .innerJoin(plans, eq(subscriptions.planId, plans.id))
    .where(and(eq(subscriptions.userId, userId), eq(subscriptions.status, "active")));

  if (active) {
    return {
      planKey: active.plan.key as PlanKey,
      maxSites: active.plan.maxSites + user.extraSiteCredits,
      allowsPremiumTemplates: active.plan.allowsPremiumTemplates,
      allowsPublish: active.plan.allowsPublish,
    };
  }

  const trialEndsAt = new Date(user.createdAt.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000);
  if (new Date() < trialEndsAt) {
    // Full (premium-equivalent) access during the trial so people can
    // actually evaluate the product before paying anything.
    return {
      planKey: "trial",
      maxSites: 5 + user.extraSiteCredits,
      allowsPremiumTemplates: true,
      allowsPublish: true,
      trialEndsAt,
    };
  }

  return {
    planKey: "expired",
    maxSites: user.extraSiteCredits,
    allowsPremiumTemplates: false,
    allowsPublish: false,
  };
}
