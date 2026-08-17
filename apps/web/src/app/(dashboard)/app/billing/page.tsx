import { auth } from "@/lib/auth";
import { getUserEntitlements } from "@/lib/entitlements";

function formatDaysLeft(trialEndsAt: Date) {
  const days = Math.max(0, Math.ceil((trialEndsAt.getTime() - Date.now()) / (24 * 60 * 60 * 1000)));
  return days;
}

export default async function BillingPage() {
  const session = await auth();
  const entitlements = await getUserEntitlements(session!.user!.id!);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold">Facturation</h1>

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

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:max-w-2xl">
        <div className="flex flex-col gap-3 rounded-xl border border-neutral-200 p-6">
          <h2 className="font-medium text-neutral-900">Eco — 10€/mois</h2>
          <p className="text-sm text-neutral-600">1 site, tous les modèles de base.</p>
          <button
            type="button"
            disabled
            title="Paiement bientôt disponible"
            className="mt-auto rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium opacity-50"
          >
            Choisir Eco
          </button>
        </div>
        <div className="flex flex-col gap-3 rounded-xl border border-neutral-900 p-6">
          <h2 className="font-medium text-neutral-900">Premium — 25€/mois</h2>
          <p className="text-sm text-neutral-600">Jusqu&apos;à 5 sites, modèles premium.</p>
          <button
            type="button"
            disabled
            title="Paiement bientôt disponible"
            className="mt-auto rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white opacity-50"
          >
            Choisir Premium
          </button>
        </div>
      </div>

      <p className="text-xs text-neutral-400">
        Le paiement en ligne arrive bientôt — pour l&apos;instant, tous les comptes profitent de
        l&apos;essai gratuit de 7 jours.
      </p>
    </div>
  );
}
