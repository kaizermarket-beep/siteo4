import Link from "next/link";
import { templateCategories } from "@/templates/types";
import { SparklesHero } from "@/components/ui/sparkles-hero";
import { PricingSection } from "@/components/ui/pricing";
import { TestimonialsMarquee } from "@/components/marketing/TestimonialsMarquee";
import { HighlightsMarquee } from "@/components/marketing/HighlightsMarquee";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { MetierCard } from "@/components/marketing/MetierCard";

const pricingPlans = [
  {
    name: "Eco",
    info: "Pour démarrer en solo",
    price: { monthly: 10, yearly: 100 },
    features: [
      { text: "1 site" },
      { text: "Tous les modèles de base" },
      {
        text: "Sous-domaine gratuit",
        tooltip: "Votre site est en ligne sur monsite.siteo.app, inclus sans surcoût.",
      },
    ],
    btn: { text: "Commencer l'essai gratuit", href: "/signup" },
  },
  {
    name: "Premium",
    info: "Pour les indépendants qui grandissent",
    price: { monthly: 25, yearly: 250 },
    features: [
      { text: "Jusqu'à 5 sites" },
      { text: "Modèles premium" },
      {
        text: "Sites supplémentaires à la carte",
        tooltip: "Ajoutez des sites au-delà de 5 à tarif préférentiel.",
      },
    ],
    btn: { text: "Commencer l'essai gratuit", href: "/signup" },
    highlighted: true,
  },
];

export default function LandingPage() {
  return (
    <main className="flex flex-1 flex-col bg-stone-200">
      {/* Hero */}
      <section className="relative">
        <SparklesHero
          title="Créez votre site"
          subtitle="En 3 clics, avec des modèles pensés pour votre métier. Essai gratuit de 7 jours, sans carte bancaire."
          ctaLabel="Créer mon site"
          ctaHref="#metiers"
          minHeight="min-h-[85vh]"
        />
        <p className="absolute bottom-8 left-0 right-0 text-center text-sm text-neutral-400">
          Déjà un compte ?{" "}
          <Link href="/login" className="underline">
            Se connecter
          </Link>
        </p>
      </section>

      <HighlightsMarquee />

      <HowItWorks />

      <TestimonialsMarquee />

      {/* Métiers */}
      <section id="metiers" className="px-6 py-20">
        <div className="mx-auto flex max-w-5xl flex-col gap-10">
          <div className="text-center">
            <h2 className="text-3xl font-semibold tracking-tight">Faites vos premiers pas</h2>
            <p className="mt-2 text-neutral-600">
              Choisissez votre métier pour découvrir des modèles adaptés.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 p-1 sm:grid-cols-3">
            {templateCategories.map((c) => (
              <MetierCard
                key={c.key}
                href={`/metiers/${c.key}`}
                icon={c.icon}
                label={c.label}
                image={c.image}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-stone-300/50 px-6 py-20">
        <PricingSection
          plans={pricingPlans}
          heading="Tarifs"
          description="7 jours d'essai gratuit, sans carte bancaire. Ensuite, choisissez votre formule."
        />
      </section>
    </main>
  );
}
