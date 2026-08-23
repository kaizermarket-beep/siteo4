"use client";

import { useActionState, useState } from "react";
import { upgradeAndPublish } from "@/server-actions/upgrade-and-publish";
import { slugify } from "@/lib/slug";
import { TermsCheckbox } from "@/components/TermsCheckbox";

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN;

const plans = [
  {
    key: "starter",
    name: "Starter",
    icon: "🌱",
    tagline: "Pour démarrer",
    price: "12€",
    period: "/mois",
    features: ["1 site", "Modèles de base"],
    highlighted: false,
  },
  {
    key: "pro",
    name: "Pro",
    icon: "🚀",
    tagline: "Pour se démarquer",
    price: "28€",
    period: "/mois",
    features: ["1 site", "Modèles premium"],
    highlighted: true,
  },
  {
    key: "agence",
    name: "Agence",
    icon: "🏢",
    tagline: "Pour plusieurs sites",
    price: "40€",
    period: "/mois",
    features: ["Jusqu'à 5 sites", "Modèles premium"],
    highlighted: false,
  },
] as const;

const steps = [
  { key: 1, label: "Votre site" },
  { key: 2, label: "Formule" },
  { key: 3, label: "Compte" },
] as const;

export function GuestPublishFlow({
  siteId,
  initialSiteName,
  initialSlug,
}: {
  siteId: string;
  initialSiteName: string;
  initialSlug: string;
}) {
  const [state, formAction, pending] = useActionState(upgradeAndPublish, undefined);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [stepError, setStepError] = useState<string | null>(null);
  const [plan, setPlan] = useState<"starter" | "pro" | "agence">("pro");
  const [siteName, setSiteName] = useState(initialSiteName);
  const [slugEdited, setSlugEdited] = useState(false);
  const [slug, setSlug] = useState(initialSlug);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md bg-neutral-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-neutral-800"
      >
        Publier mon site
      </button>
    );
  }

  function goNext() {
    if (step === 1) {
      if (!siteName.trim() || !slug.trim()) {
        setStepError("Donnez un nom à votre site pour continuer.");
        return;
      }
    }
    setStepError(null);
    setStep((s) => (s === 1 ? 2 : 3));
  }

  function goBack() {
    setStepError(null);
    setStep((s) => (s === 3 ? 2 : 1));
  }

  function close() {
    setOpen(false);
    setStep(1);
    setStepError(null);
  }

  return (
    <div className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-black/40 px-4 py-10">
      <form
        action={formAction}
        className="flex w-full max-w-lg flex-col gap-6 rounded-xl bg-white p-6 shadow-xl"
      >
        <input type="hidden" name="siteId" value={siteId} />
        <input type="hidden" name="siteName" value={siteName} />
        <input type="hidden" name="slug" value={slug} />
        <input type="hidden" name="plan" value={plan} />

        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Presque prêt !</h2>
            <p className="text-sm text-neutral-500">Encore quelques secondes avant de publier.</p>
          </div>
          <button
            type="button"
            onClick={close}
            className="text-neutral-400 hover:text-neutral-700"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        <div className="flex items-center">
          {steps.map((s, i) => (
            <div key={s.key} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                    step === s.key
                      ? "bg-neutral-900 text-white"
                      : step > s.key
                        ? "bg-neutral-900/10 text-neutral-900"
                        : "bg-neutral-100 text-neutral-400"
                  }`}
                >
                  {step > s.key ? "✓" : s.key}
                </div>
                <span
                  className={`whitespace-nowrap text-[11px] font-medium ${
                    step === s.key ? "text-neutral-900" : "text-neutral-400"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`mx-2 mb-4 h-px flex-1 ${step > s.key ? "bg-neutral-900/20" : "bg-neutral-200"}`}
                />
              )}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-center gap-2 rounded-lg bg-neutral-50 py-6 text-center">
              <span className="text-4xl">🎉</span>
              <p className="text-sm text-neutral-600">
                Votre site est personnalisé et prêt à être publié !
              </p>
            </div>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-neutral-700">Nom du site</span>
              <input
                value={siteName}
                onChange={(e) => {
                  setSiteName(e.target.value);
                  if (!slugEdited) setSlug(slugify(e.target.value));
                }}
                autoFocus
                className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-neutral-700">Adresse</span>
              <div className="flex items-center overflow-hidden rounded-md border border-neutral-300 text-sm">
                <span className="border-r border-neutral-200 bg-neutral-50 px-2.5 py-2 text-neutral-400">
                  🌐
                </span>
                <input
                  value={slug}
                  onChange={(e) => {
                    setSlugEdited(true);
                    setSlug(e.target.value);
                  }}
                  className="min-w-0 flex-1 px-3 py-2 outline-none"
                />
                <span className="whitespace-nowrap px-3 py-2 text-neutral-500">.{ROOT_DOMAIN}</span>
              </div>
            </label>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-3">
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                ✨ 7 jours d&apos;essai gratuit, sans carte bancaire
              </span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {plans.map((p) => (
                <label
                  key={p.key}
                  className={`cursor-pointer rounded-xl border p-4 text-sm transition-colors ${
                    plan === p.key
                      ? "border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900"
                      : "border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <input
                    type="radio"
                    value={p.key}
                    checked={plan === p.key}
                    onChange={() => setPlan(p.key)}
                    className="sr-only"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{p.icon}</span>
                    {p.highlighted && (
                      <span className="rounded-full bg-neutral-900 px-2 py-0.5 text-[10px] font-medium text-white">
                        Populaire
                      </span>
                    )}
                  </div>
                  <p className="mt-2 font-semibold text-neutral-900">{p.name}</p>
                  <p className="text-xs text-neutral-500">{p.tagline}</p>
                  <p className="mt-1 text-neutral-900">
                    {p.price}
                    <span className="text-xs font-normal text-neutral-500">{p.period}</span>
                  </p>
                  <ul className="mt-1 flex flex-col gap-0.5 text-xs text-neutral-500">
                    {p.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </label>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 rounded-lg bg-neutral-50 px-4 py-3 text-sm text-neutral-600">
              <span className="text-xl">🔒</span>
              <span>Juste de quoi retrouver et gérer votre site plus tard.</span>
            </div>
            <input
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              autoFocus
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
            <input
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe (8 caractères min.)"
              required
              minLength={8}
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
            <TermsCheckbox id="acceptTermsGuest" />
          </div>
        )}

        {(stepError ?? state?.error) && (
          <p className="text-sm text-red-600">{stepError ?? state?.error}</p>
        )}

        <div className="flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={goBack}
              className="rounded-md px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100"
            >
              ← Retour
            </button>
          ) : (
            <span />
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={goNext}
              className="rounded-md bg-neutral-900 px-5 py-2 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Continuer →
            </button>
          ) : (
            <button
              type="submit"
              disabled={pending}
              className="rounded-md bg-neutral-900 px-5 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
            >
              {pending ? "Publication…" : "Publier mon site"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
