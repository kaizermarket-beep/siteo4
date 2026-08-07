import Link from "next/link";
import { templateCategories } from "@/templates/types";

const testimonials = [
  {
    name: "Camille R.",
    role: "Coiffeuse indépendante",
    quote:
      "Mon site était en ligne le soir même. Mes clientes peuvent enfin voir mes tarifs et prendre rendez-vous directement.",
  },
  {
    name: "Karim B.",
    role: "Garage automobile",
    quote:
      "Je ne connaissais rien en informatique. En moins d'une heure, mon garage avait un site plus pro que celui de mes concurrents.",
  },
  {
    name: "Élodie M.",
    role: "Coach sportive",
    quote:
      "Simple, rapide, et le résultat est vraiment sérieux. Mes clients me font plus confiance depuis que j'ai un vrai site.",
  },
];

export default function LandingPage() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center gap-6 px-6 py-24 text-center">
        <span className="text-sm font-medium tracking-wide text-neutral-500">SITEO</span>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Créez votre site professionnel en 3 clics
        </h1>
        <p className="max-w-xl text-lg text-neutral-600">
          Des modèles pensés pour votre métier, un résultat qui donne confiance. Essai gratuit
          de 7 jours, sans carte bancaire.
        </p>
        <div className="flex gap-4">
          <Link
            href="#metiers"
            className="rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Créer mon site
          </Link>
          <Link
            href="/login"
            className="rounded-md border border-neutral-300 px-5 py-2.5 text-sm font-medium hover:bg-neutral-50"
          >
            Se connecter
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-y border-neutral-200 bg-neutral-50 px-6 py-16">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="flex flex-col gap-3">
              <blockquote className="text-sm text-neutral-700">&laquo; {t.quote} &raquo;</blockquote>
              <figcaption className="text-sm">
                <span className="font-medium text-neutral-900">{t.name}</span>
                <span className="text-neutral-500"> — {t.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Métiers */}
      <section id="metiers" className="px-6 py-20">
        <div className="mx-auto flex max-w-5xl flex-col gap-10">
          <div className="text-center">
            <h2 className="text-3xl font-semibold tracking-tight">Faites vos premiers pas</h2>
            <p className="mt-2 text-neutral-600">
              Choisissez votre métier pour découvrir des modèles adaptés.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {templateCategories.map((c) => (
              <Link
                key={c.key}
                href={`/metiers/${c.key}`}
                className="flex flex-col items-center gap-2 rounded-xl border border-neutral-200 px-6 py-8 text-center transition hover:border-neutral-900"
              >
                <span className="text-3xl">{c.icon}</span>
                <span className="font-medium text-neutral-900">{c.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-neutral-50 px-6 py-20">
        <div className="mx-auto flex max-w-4xl flex-col gap-10">
          <div className="text-center">
            <h2 className="text-3xl font-semibold tracking-tight">Tarifs</h2>
            <p className="mt-2 text-neutral-600">
              7 jours d&apos;essai gratuit, sans carte bancaire. Ensuite, choisissez votre formule.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-8">
              <h3 className="text-lg font-medium text-neutral-900">Eco</h3>
              <p className="text-4xl font-semibold text-neutral-900">
                5€<span className="text-base font-normal text-neutral-500"> /mois</span>
              </p>
              <ul className="flex flex-col gap-2 text-sm text-neutral-600">
                <li>1 site</li>
                <li>Tous les modèles de base</li>
                <li>Sous-domaine gratuit</li>
              </ul>
              <Link
                href="/signup"
                className="mt-auto rounded-md border border-neutral-300 px-4 py-2 text-center text-sm font-medium hover:bg-neutral-50"
              >
                Commencer l&apos;essai gratuit
              </Link>
            </div>
            <div className="flex flex-col gap-4 rounded-xl border border-neutral-900 bg-white p-8 shadow-sm">
              <h3 className="text-lg font-medium text-neutral-900">Premium</h3>
              <p className="text-4xl font-semibold text-neutral-900">
                18€<span className="text-base font-normal text-neutral-500"> /mois</span>
              </p>
              <ul className="flex flex-col gap-2 text-sm text-neutral-600">
                <li>Jusqu&apos;à 5 sites</li>
                <li>Modèles premium</li>
                <li>Sites supplémentaires à la carte</li>
              </ul>
              <Link
                href="/signup"
                className="mt-auto rounded-md bg-neutral-900 px-4 py-2 text-center text-sm font-medium text-white hover:bg-neutral-800"
              >
                Commencer l&apos;essai gratuit
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
