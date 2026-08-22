import { eq } from "drizzle-orm";
import { requireUserId } from "@/lib/require-user";
import { db } from "@/lib/db";
import { plans, subscriptions } from "@/lib/db/schema";
import { getUserEntitlements } from "@/lib/entitlements";
import { isStripeConfigured } from "@/lib/stripe";
import { startCheckout, openBillingPortal } from "@/server-actions/billing";

function formatDaysLeft(trialEndsAt: Date) {
  return Math.max(0, Math.ceil((trialEndsAt.getTime() - Date.now()) / (24 * 60 * 60 * 1000)));
}

const PLAN_COPY: Record<string, { label: string; blurb: string; highlighted?: boolean }> = {
  eco: { label: "Eco", blurb: "1 site, tous les modèles de base." },
  premium: { label: "Premium", blurb: "Jusqu'à 5 sites, modèles premium.", highlighted: true },
};

const STATUS_COPY: Record<string, string> = {
  active: "Abonnement actif",
  trialing: "Période d'essai Stripe en cours",
  past_due: "Paiement en retard — mettez votre carte à jour",
  canceled: "Abonnement résilié",
  incomplete: "Paiement incomplet",
};

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  const { checkout } = await searchParams;
  const userId = await requireUserId();

  const [entitlements, allPlans, [current]] = await Promise.all([
    getUserEntitlements(userId),
    db.select().from(plans),
    db.select().from(subscriptions).where(eq(subscriptions.userId, userId)),
  ]);

  const configured = isStripeConfigured();
  const hasLiveSub = current && current.status !== "canceled";
  // Granted by scripts/grant-internal-access.ts rather than bought: there is
  // no Stripe subscription behind it, so there is no portal to open either.
  const isInternal = hasLiveSub && current.stripeSubscriptionId === null;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold">Facturation</h1>

      {checkout === "success" && (
        <p className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Paiement confirmé. Votre abonnement s&apos;active dès réception de la confirmation
          Stripe — rechargez la page dans quelques secondes si le statut n&apos;a pas changé.
        </p>
      )}
      {checkout === "cancelled" && (
        <p className="rounded-md border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-600">
          Paiement annulé — vous n&apos;avez pas été débité.
        </p>
      )}

      {hasLiveSub ? (
        <div className="flex flex-col gap-3 rounded-xl border border-neutral-200 p-6 sm:max-w-2xl">
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                current.status === "active" || current.status === "trialing"
                  ? "bg-green-500"
                  : "bg-amber-500"
              }`}
            />
            <h2 className="font-medium text-neutral-900">
              {STATUS_COPY[current.status] ?? current.status}
            </h2>
          </div>
          {isInternal && (
            <p className="text-sm text-neutral-600">
              Accès interne — accordé sans paiement, sans échéance.
            </p>
          )}
          {current.currentPeriodEnd && (
            <p className="text-sm text-neutral-600">
              {current.cancelAtPeriodEnd ? "Se termine le " : "Prochain prélèvement le "}
              {current.currentPeriodEnd.toLocaleDateString("fr-FR")}.
            </p>
          )}
          {!isInternal && (
            <>
              <form action={openBillingPortal}>
                <button
                  type="submit"
                  className="mt-2 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
                >
                  Gérer mon abonnement
                </button>
              </form>
              <p className="text-xs text-neutral-400">
                Changer de formule, mettre à jour la carte ou résilier.
              </p>
            </>
          )}
        </div>
      ) : (
        <>
          {entitlements.planKey === "trial" && entitlements.trialEndsAt && (
            <p className="text-sm text-neutral-600">
              Essai gratuit en cours — il vous reste {formatDaysLeft(entitlements.trialEndsAt)} jour
              {formatDaysLeft(entitlements.trialEndsAt) > 1 ? "s" : ""}.
            </p>
          )}
          {entitlements.planKey === "expired" && (
            <p className="text-sm text-red-600">
              Votre essai gratuit est terminé. Choisissez une formule pour continuer à publier vos
              sites.
            </p>
          )}

          <div className="grid grid-cols-1 gap-6 sm:max-w-2xl sm:grid-cols-2">
            {allPlans
              .filter((p) => PLAN_COPY[p.key])
              .sort((a, b) => a.priceEuros - b.priceEuros)
              .map((plan) => {
                const copy = PLAN_COPY[plan.key];
                const ready = configured && Boolean(plan.stripePriceId);
                return (
                  <div
                    key={plan.id}
                    className={`flex flex-col gap-3 rounded-xl border p-6 ${
                      copy.highlighted ? "border-neutral-900" : "border-neutral-200"
                    }`}
                  >
                    <h2 className="font-medium text-neutral-900">
                      {copy.label} — {plan.priceEuros}€/mois
                    </h2>
                    <p className="text-sm text-neutral-600">{copy.blurb}</p>
                    <form action={startCheckout} className="mt-auto">
                      <input type="hidden" name="planKey" value={plan.key} />
                      <button
                        type="submit"
                        disabled={!ready}
                        title={ready ? undefined : "Paiement pas encore configuré"}
                        className={`w-full rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50 ${
                          copy.highlighted
                            ? "bg-neutral-900 text-white hover:bg-neutral-800"
                            : "border border-neutral-300 hover:bg-neutral-50"
                        }`}
                      >
                        Choisir {copy.label}
                      </button>
                    </form>
                  </div>
                );
              })}
          </div>

          {!configured && (
            <p className="text-xs text-neutral-400">
              Le paiement en ligne n&apos;est pas encore configuré sur cette installation.
            </p>
          )}
        </>
      )}
    </div>
  );
}
