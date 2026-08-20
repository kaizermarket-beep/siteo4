"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { plans, subscriptions, users } from "@/lib/db/schema";
import { getStripe, CHECKOUT_INTEGRATION_ID } from "@/lib/stripe";

async function baseUrl(): Promise<string> {
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = host.startsWith("localhost") ? "http" : "https";
  return `${proto}://${host}`;
}

// Reuses the Customer we already created for this user, so a second
// subscription doesn't fork their billing history across two customers.
async function customerIdFor(userId: string, email: string, name: string | null) {
  const stripe = getStripe();
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (user?.stripeCustomerId) return user.stripeCustomerId;

  const customer = await stripe.customers.create({
    email,
    name: name ?? undefined,
    metadata: { siteo_user_id: userId },
  });
  await db.update(users).set({ stripeCustomerId: customer.id }).where(eq(users.id, userId));
  return customer.id;
}

export async function startCheckout(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    throw new Error("Vous devez être connecté.");
  }

  const planKey = String(formData.get("planKey") ?? "");
  const [plan] = await db.select().from(plans).where(eq(plans.key, planKey));
  if (!plan) throw new Error("Formule introuvable.");
  if (!plan.stripePriceId) {
    throw new Error(
      "Cette formule n'a pas encore de tarif Stripe. Lancez `pnpm --filter web stripe:setup`."
    );
  }

  const stripe = getStripe();
  const customerId = await customerIdFor(
    session.user.id,
    session.user.email,
    session.user.name ?? null
  );
  const url = await baseUrl();

  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    // No payment_method_types: letting Stripe pick from the Dashboard
    // config surfaces the methods most likely to convert per customer.
    line_items: [{ price: plan.stripePriceId, quantity: 1 }],
    // Stamped so the webhook can find the user even if the Customer
    // lookup ever misses.
    subscription_data: {
      metadata: { siteo_user_id: session.user.id, siteo_plan_key: plan.key },
    },
    client_reference_id: session.user.id,
    integration_identifier: CHECKOUT_INTEGRATION_ID,
    success_url: `${url}/app/billing?checkout=success`,
    cancel_url: `${url}/app/billing?checkout=cancelled`,
  });

  if (!checkout.url) throw new Error("Stripe n'a pas renvoyé d'URL de paiement.");
  redirect(checkout.url);
}

// Self-service management (change card, switch plan, cancel) — cheaper and
// safer than rebuilding those flows, and it stays in sync via the webhook.
export async function openBillingPortal() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Vous devez être connecté.");

  const [row] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, session.user.id));

  const [user] = await db.select().from(users).where(eq(users.id, session.user.id));
  const customerId = row?.stripeCustomerId ?? user?.stripeCustomerId;
  if (!customerId) throw new Error("Aucun compte de facturation à gérer.");

  const stripe = getStripe();
  const url = await baseUrl();
  const portal = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${url}/app/billing`,
  });

  redirect(portal.url);
}
