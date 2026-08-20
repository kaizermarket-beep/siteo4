import { eq } from "drizzle-orm";
import type Stripe from "stripe";
import { db } from "@/lib/db";
import { plans, subscriptions, users, type SubscriptionStatus } from "@/lib/db/schema";
import { getStripe } from "@/lib/stripe";

// The Stripe SDK needs Node crypto for signature verification.
export const runtime = "nodejs";

// Subscription state changes happen asynchronously and after checkout —
// renewals, failed payments and cancellations never touch the browser. This
// handler is the only thing that keeps `subscription` rows truthful, which
// is what getUserEntitlements() reads to decide who may publish.
const RELEVANT = new Set<string>([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.paid",
  "invoice.payment_failed",
]);

// Stripe has more states than we store; map the extras onto the closest
// value the column allows rather than writing something the type forbids.
function mapStatus(s: Stripe.Subscription.Status): SubscriptionStatus {
  switch (s) {
    case "active":
      return "active";
    case "trialing":
      return "trialing";
    case "past_due":
      return "past_due";
    case "canceled":
    case "unpaid":
    case "paused":
      return "canceled";
    default:
      return "incomplete";
  }
}

function periodEnd(sub: Stripe.Subscription): Date | null {
  // Billing period lives on the subscription item in current API versions.
  const ts = sub.items?.data?.[0]?.current_period_end;
  return typeof ts === "number" ? new Date(ts * 1000) : null;
}

async function upsertSubscription(sub: Stripe.Subscription) {
  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;

  // Prefer the user id we stamped at checkout; fall back to the customer id
  // so a subscription created straight from the Dashboard still lands.
  const userId = sub.metadata?.siteo_user_id;
  const [user] = userId
    ? await db.select().from(users).where(eq(users.id, userId))
    : await db.select().from(users).where(eq(users.stripeCustomerId, customerId));

  if (!user) {
    console.error(`[stripe] aucun utilisateur pour la souscription ${sub.id}`);
    return;
  }

  const priceId = sub.items.data[0]?.price?.id;
  const [plan] = priceId
    ? await db.select().from(plans).where(eq(plans.stripePriceId, priceId))
    : [];

  if (!plan) {
    console.error(`[stripe] aucun plan pour le prix ${priceId} (souscription ${sub.id})`);
    return;
  }

  const values = {
    userId: user.id,
    planId: plan.id,
    stripeSubscriptionId: sub.id,
    stripeCustomerId: customerId,
    status: mapStatus(sub.status),
    currentPeriodEnd: periodEnd(sub),
    cancelAtPeriodEnd: sub.cancel_at_period_end,
    updatedAt: new Date(),
  };

  // Events can arrive out of order and more than once, so key on the Stripe
  // subscription id and overwrite rather than inserting blindly.
  const [existing] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.stripeSubscriptionId, sub.id));

  if (existing) {
    await db.update(subscriptions).set(values).where(eq(subscriptions.id, existing.id));
  } else {
    await db.insert(subscriptions).values(values);
  }

  if (user.stripeCustomerId !== customerId) {
    await db.update(users).set({ stripeCustomerId: customerId }).where(eq(users.id, user.id));
  }
}

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !secret) {
    return new Response("Webhook non configuré.", { status: 400 });
  }

  const stripe = getStripe();
  const payload = await request.text(); // raw body — parsing it first breaks the signature

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch {
    // Never trust an unverified payload: without this check anyone could POST
    // here and grant themselves a subscription.
    return new Response("Signature invalide.", { status: 400 });
  }

  if (!RELEVANT.has(event.type)) {
    return Response.json({ received: true, ignored: event.type });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        if (session.mode === "subscription" && session.subscription) {
          const id =
            typeof session.subscription === "string"
              ? session.subscription
              : session.subscription.id;
          await upsertSubscription(await stripe.subscriptions.retrieve(id));
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        await upsertSubscription(event.data.object);
        break;
      }

      case "invoice.paid":
      case "invoice.payment_failed": {
        // Re-read the subscription rather than trusting the invoice: the
        // subscription is the source of truth for status and period end.
        const invoice = event.data.object as Stripe.Invoice & {
          subscription?: string | Stripe.Subscription | null;
        };
        const ref = invoice.subscription;
        if (ref) {
          const id = typeof ref === "string" ? ref : ref.id;
          await upsertSubscription(await stripe.subscriptions.retrieve(id));
        }
        break;
      }
    }
  } catch (err) {
    // 500 makes Stripe retry with backoff, which is what we want for a
    // transient DB failure — a 200 here would silently lose the event.
    console.error(`[stripe] échec du traitement de ${event.type}:`, err);
    return new Response("Erreur de traitement.", { status: 500 });
  }

  return Response.json({ received: true });
}
