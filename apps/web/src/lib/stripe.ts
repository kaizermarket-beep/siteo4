import Stripe from "stripe";

// One client for the whole app. The SDK is instantiated lazily so importing
// this module (e.g. from a page that only needs the price table) doesn't
// throw when Stripe isn't configured yet — only actually calling Stripe does.
let client: Stripe | null = null;

export function getStripe(): Stripe {
  if (client) return client;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY manquante. Renseignez-la dans apps/web/.env.local."
    );
  }

  client = new Stripe(key, { apiVersion: "2026-07-29.dahlia" });
  return client;
}

// Lets the UI show "paiement bientôt disponible" instead of crashing when
// the keys aren't set, which is the state every fresh clone starts in.
export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

// Tags Checkout Sessions so flows can be compared in the Dashboard.
export const CHECKOUT_INTEGRATION_ID = "siteo_sub_kwmtplzx";
