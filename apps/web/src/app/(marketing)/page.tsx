import { templateCategories } from "@/templates/types";
import { BuilderHero } from "@/components/marketing/BuilderHero";
import { Pricing, type PricingPlan } from "@/components/ui/pricing";
import { TestimonialsMarquee } from "@/components/marketing/TestimonialsMarquee";
import { HighlightsMarquee } from "@/components/marketing/HighlightsMarquee";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { MetierCard } from "@/components/marketing/MetierCard";

// Annual figures are ten months, not twelve — two months offered. Kept as
// explicit numbers rather than a computed discount so the page can never
// advertise a reduction the checkout does not apply.
const pricingPlans: PricingPlan[] = [
  {
    name: "Starter",
    price: 12,
    yearlyPrice: 120,
    period: "mois",
    features: [
      "1 site publié",
      "Tous les modèles de base",
      "Sous-domaine et hébergement inclus",
      "Modifications illimitées",
    ],
    description: "Pour un artisan ou un commerce qui veut simplement exister en ligne.",
    buttonText: "Commencer l'essai gratuit",
    href: "/signup",
    isPopular: false,
  },
  {
    name: "Pro",
    price: 28,
    yearlyPrice: 280,
    period: "mois",
    features: [
      "1 site publié",
      "Modèles premium multi-pages",
      "Pages Prestations, Galerie, Contact",
      "Sous-domaine et hébergement inclus",
      "Modifications illimitées",
    ],
    description: "Le même site qu'en Starter, mais avec les modèles haut de gamme.",
    buttonText: "Commencer l'essai gratuit",
    href: "/signup",
    isPopular: true,
  },
  {
    name: "Agence",
    price: 40,
    yearlyPrice: 400,
    period: "mois",
    features: [
      "Jusqu'à 5 sites publiés",
      "Tout ce que contient Pro",
      "Un seul compte pour tous vos sites",
      "Sous-domaine et hébergement inclus",
      "Modifications illimitées",
    ],
    description: "Pour qui gère plusieurs établissements, ou crée des sites pour ses clients.",
    buttonText: "Commencer l'essai gratuit",
    href: "/signup",
    isPopular: false,
  },
];

export default function LandingPage() {
  return (
    <main className="flex flex-1 flex-col bg-stone-200">
      {/* Hero */}
      <BuilderHero ctaLabel="Créer mon site" ctaHref="#metiers" />

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
        <Pricing
          plans={pricingPlans}
          title="Des tarifs clairs"
          description={`7 jours d'essai gratuit, sans carte bancaire.
Ensuite, choisissez la formule qui correspond à votre activité.`}
          annualNote="Le paiement annuel n'est pas encore disponible : la souscription est mensuelle, résiliable à tout moment."
        />
      </section>
    </main>
  );
}
