import { blockTypeDefs } from "./block-type-defs";
import type { TemplateDefinition } from "./types";

export const templates: TemplateDefinition[] = [
  {
    slug: "coiffeur",
    name: "Salon de coiffure",
    description: "Pour les salons de coiffure et instituts de beauté.",
    category: "coiffeur",
    isPremium: false,
    schema: {
      blockTypes: blockTypeDefs,
      defaultBlocks: [
        {
          type: "hero",
          position: 10,
          content: {
            headline: "Votre salon de coiffure, réinventé",
            subheadline: "Coupe, couleur, soins — une équipe passionnée à votre écoute.",
            ctaLabel: "Prendre rendez-vous",
            ctaLink: { href: "#contact", label: "Prendre rendez-vous" },
          },
        },
        {
          type: "features",
          position: 20,
          content: {
            title: "Nos prestations",
            items: [
              { icon: "✂️", title: "Coupe & brushing", description: "Pour tous les styles et toutes les longueurs." },
              { icon: "🎨", title: "Coloration", description: "Balayage, mèches, coloration végétale." },
              { icon: "💆", title: "Soins capillaires", description: "Des soins adaptés à chaque type de cheveux." },
            ],
          },
        },
        {
          type: "gallery",
          position: 30,
          content: {
            title: "Nos réalisations",
            images: [
              { image: { url: "https://placehold.co/600x600?text=Coiffure+1", alt: "Réalisation 1" }, caption: "" },
              { image: { url: "https://placehold.co/600x600?text=Coiffure+2", alt: "Réalisation 2" }, caption: "" },
              { image: { url: "https://placehold.co/600x600?text=Coiffure+3", alt: "Réalisation 3" }, caption: "" },
            ],
          },
        },
        {
          type: "pricing",
          position: 40,
          content: {
            title: "Nos tarifs",
            plans: [
              { name: "Coupe femme", price: "35€", period: "", features: ["Shampoing inclus", "Brushing"], ctaLabel: "Réserver", highlighted: false },
              { name: "Coupe homme", price: "25€", period: "", features: ["Shampoing inclus"], ctaLabel: "Réserver", highlighted: false },
              { name: "Coloration", price: "65€", period: "", features: ["Diagnostic offert", "Soin inclus"], ctaLabel: "Réserver", highlighted: true },
            ],
          },
        },
        {
          type: "contact",
          position: 50,
          content: {
            title: "Prendre rendez-vous",
            description: "Réservez votre créneau en quelques clics.",
            email: "contact@exemple.fr",
            showForm: true,
          },
        },
        {
          type: "footer",
          position: 60,
          content: { text: "© 2026 — Fait avec Siteo", links: [] },
        },
      ],
    },
  },
  {
    slug: "restauration",
    name: "Restaurant",
    description: "Pour les restaurants, bistrots et traiteurs.",
    category: "restauration",
    isPremium: false,
    schema: {
      blockTypes: blockTypeDefs,
      defaultBlocks: [
        {
          type: "hero",
          position: 10,
          content: {
            headline: "Une cuisine généreuse, un accueil chaleureux",
            subheadline: "Des produits frais et locaux, cuisinés avec passion.",
            ctaLabel: "Réserver une table",
            ctaLink: { href: "#contact", label: "Réserver une table" },
          },
        },
        {
          type: "features",
          position: 20,
          content: {
            title: "Notre restaurant",
            items: [
              { icon: "🍳", title: "Cuisine maison", description: "Tout est préparé sur place, chaque jour." },
              { icon: "🌱", title: "Produits locaux", description: "Une sélection de producteurs de la région." },
              { icon: "🕯️", title: "Cadre convivial", description: "Une salle chaleureuse pour vos repas entre proches." },
            ],
          },
        },
        {
          type: "gallery",
          position: 30,
          content: {
            title: "Nos plats",
            images: [
              { image: { url: "https://placehold.co/600x600?text=Plat+1", alt: "Plat 1" }, caption: "" },
              { image: { url: "https://placehold.co/600x600?text=Plat+2", alt: "Plat 2" }, caption: "" },
              { image: { url: "https://placehold.co/600x600?text=Plat+3", alt: "Plat 3" }, caption: "" },
            ],
          },
        },
        {
          type: "pricing",
          position: 40,
          content: {
            title: "Nos formules",
            plans: [
              { name: "Menu midi", price: "18€", period: "", features: ["Entrée + plat ou plat + dessert"], ctaLabel: "Réserver", highlighted: false },
              { name: "Menu soir", price: "32€", period: "", features: ["Entrée, plat et dessert"], ctaLabel: "Réserver", highlighted: true },
              { name: "Menu dégustation", price: "55€", period: "", features: ["5 services", "Accord mets & vins en option"], ctaLabel: "Réserver", highlighted: false },
            ],
          },
        },
        {
          type: "contact",
          position: 50,
          content: {
            title: "Réserver une table",
            description: "Nous vous répondons sous 24h.",
            email: "contact@exemple.fr",
            showForm: true,
          },
        },
        {
          type: "footer",
          position: 60,
          content: { text: "© 2026 — Fait avec Siteo", links: [] },
        },
      ],
    },
  },
  {
    slug: "automobile",
    name: "Garage automobile",
    description: "Pour les garages, mécaniciens et centres auto.",
    category: "automobile",
    isPremium: false,
    schema: {
      blockTypes: blockTypeDefs,
      defaultBlocks: [
        {
          type: "hero",
          position: 10,
          content: {
            headline: "L'entretien de votre véhicule en toute confiance",
            subheadline: "Un garage de proximité, des tarifs transparents.",
            ctaLabel: "Demander un devis",
            ctaLink: { href: "#contact", label: "Demander un devis" },
          },
        },
        {
          type: "features",
          position: 20,
          content: {
            title: "Nos services",
            items: [
              { icon: "🔧", title: "Entretien & révision", description: "Vidange, freins, pneus, courroies." },
              { icon: "💻", title: "Diagnostic électronique", description: "Un diagnostic précis avant chaque intervention." },
              { icon: "🚘", title: "Réparation carrosserie", description: "Remise en état après un choc ou une rayure." },
            ],
          },
        },
        {
          type: "pricing",
          position: 30,
          content: {
            title: "Nos forfaits",
            plans: [
              { name: "Révision simple", price: "89€", period: "", features: ["Vidange + contrôle 20 points"], ctaLabel: "Prendre rendez-vous", highlighted: false },
              { name: "Révision complète", price: "149€", period: "", features: ["Vidange, filtres, freins"], ctaLabel: "Prendre rendez-vous", highlighted: true },
              { name: "Diagnostic", price: "39€", period: "", features: ["Lecture des codes défauts"], ctaLabel: "Prendre rendez-vous", highlighted: false },
            ],
          },
        },
        {
          type: "contact",
          position: 40,
          content: {
            title: "Nous contacter",
            description: "Décrivez-nous votre besoin, on vous répond vite.",
            email: "contact@exemple.fr",
            showForm: true,
          },
        },
        {
          type: "footer",
          position: 50,
          content: { text: "© 2026 — Fait avec Siteo", links: [] },
        },
      ],
    },
  },
  {
    slug: "artisan",
    name: "Artisan",
    description: "Pour les plombiers, électriciens, menuisiers et autres artisans.",
    category: "artisan",
    isPremium: false,
    schema: {
      blockTypes: blockTypeDefs,
      defaultBlocks: [
        {
          type: "hero",
          position: 10,
          content: {
            headline: "Un savoir-faire artisanal à votre service",
            subheadline: "Interventions rapides et soignées, près de chez vous.",
            ctaLabel: "Demander un devis gratuit",
            ctaLink: { href: "#contact", label: "Demander un devis gratuit" },
          },
        },
        {
          type: "features",
          position: 20,
          content: {
            title: "Nos interventions",
            items: [
              { icon: "🛠️", title: "Installation", description: "Pose et mise en service de vos équipements." },
              { icon: "🚨", title: "Dépannage", description: "Une intervention rapide en cas d'urgence." },
              { icon: "🏠", title: "Rénovation", description: "Accompagnement de vos projets de A à Z." },
            ],
          },
        },
        {
          type: "pricing",
          position: 30,
          content: {
            title: "Nos tarifs",
            plans: [
              { name: "Devis", price: "Gratuit", period: "", features: ["Sans engagement"], ctaLabel: "Demander un devis", highlighted: true },
              { name: "Dépannage urgent", price: "Sur devis", period: "", features: ["Intervention sous 24h"], ctaLabel: "Nous contacter", highlighted: false },
              { name: "Rénovation", price: "Sur devis", period: "", features: ["Projet clé en main"], ctaLabel: "Nous contacter", highlighted: false },
            ],
          },
        },
        {
          type: "contact",
          position: 40,
          content: {
            title: "Demander un devis",
            description: "Décrivez votre projet, on vous recontacte rapidement.",
            email: "contact@exemple.fr",
            showForm: true,
          },
        },
        {
          type: "footer",
          position: 50,
          content: { text: "© 2026 — Fait avec Siteo", links: [] },
        },
      ],
    },
  },
  {
    slug: "coach-sportif",
    name: "Coach sportif",
    description: "Pour les coachs sportifs et professeurs de fitness indépendants.",
    category: "coach-sportif",
    isPremium: false,
    schema: {
      blockTypes: blockTypeDefs,
      defaultBlocks: [
        {
          type: "hero",
          position: 10,
          content: {
            headline: "Atteignez vos objectifs, accompagné·e par un coach",
            subheadline: "Un suivi personnalisé, en individuel ou en petit groupe.",
            ctaLabel: "Réserver une séance d'essai",
            ctaLink: { href: "#contact", label: "Réserver une séance d'essai" },
          },
        },
        {
          type: "features",
          position: 20,
          content: {
            title: "Mes programmes",
            items: [
              { icon: "💪", title: "Coaching individuel", description: "Un programme sur mesure selon vos objectifs." },
              { icon: "🤸", title: "Cours collectifs", description: "Des séances dynamiques en petit groupe." },
              { icon: "🥗", title: "Suivi nutritionnel", description: "Des conseils adaptés à votre rythme de vie." },
            ],
          },
        },
        {
          type: "gallery",
          position: 30,
          content: {
            title: "En action",
            images: [
              { image: { url: "https://placehold.co/600x600?text=Coaching+1", alt: "Séance 1" }, caption: "" },
              { image: { url: "https://placehold.co/600x600?text=Coaching+2", alt: "Séance 2" }, caption: "" },
              { image: { url: "https://placehold.co/600x600?text=Coaching+3", alt: "Séance 3" }, caption: "" },
            ],
          },
        },
        {
          type: "pricing",
          position: 40,
          content: {
            title: "Mes formules",
            plans: [
              { name: "Séance découverte", price: "1€", period: "", features: ["Bilan initial offert"], ctaLabel: "Réserver", highlighted: false },
              { name: "Pack 10 séances", price: "350€", period: "", features: ["Suivi personnalisé inclus"], ctaLabel: "Réserver", highlighted: true },
              { name: "Coaching mensuel", price: "180€", period: "/mois", features: ["4 séances par mois"], ctaLabel: "Réserver", highlighted: false },
            ],
          },
        },
        {
          type: "contact",
          position: 50,
          content: {
            title: "Réserver ma séance",
            description: "Premier échange offert pour définir vos objectifs.",
            email: "contact@exemple.fr",
            showForm: true,
          },
        },
        {
          type: "footer",
          position: 60,
          content: { text: "© 2026 — Fait avec Siteo", links: [] },
        },
      ],
    },
  },
  {
    slug: "photographe",
    name: "Photographe",
    description: "Pour les photographes indépendants (mariage, portrait, corporate).",
    category: "photographe",
    isPremium: false,
    schema: {
      blockTypes: blockTypeDefs,
      defaultBlocks: [
        {
          type: "hero",
          position: 10,
          content: {
            headline: "Des souvenirs qui vous ressemblent",
            subheadline: "Photographe indépendant — mariage, portrait, corporate.",
            ctaLabel: "Découvrir mon travail",
            ctaLink: { href: "#contact", label: "Découvrir mon travail" },
          },
        },
        {
          type: "features",
          position: 20,
          content: {
            title: "Mes prestations",
            items: [
              { icon: "💍", title: "Mariage", description: "Immortalisez chaque instant de votre journée." },
              { icon: "📸", title: "Portrait", description: "Séances individuelles, en famille ou entre amis." },
              { icon: "🏢", title: "Corporate", description: "Photos professionnelles pour votre entreprise." },
            ],
          },
        },
        {
          type: "gallery",
          position: 30,
          content: {
            title: "Portfolio",
            images: [
              { image: { url: "https://placehold.co/600x600?text=Photo+1", alt: "Photo 1" }, caption: "" },
              { image: { url: "https://placehold.co/600x600?text=Photo+2", alt: "Photo 2" }, caption: "" },
              { image: { url: "https://placehold.co/600x600?text=Photo+3", alt: "Photo 3" }, caption: "" },
              { image: { url: "https://placehold.co/600x600?text=Photo+4", alt: "Photo 4" }, caption: "" },
            ],
          },
        },
        {
          type: "pricing",
          position: 40,
          content: {
            title: "Mes formules",
            plans: [
              { name: "Séance portrait", price: "150€", period: "", features: ["1h de séance", "20 photos retouchées"], ctaLabel: "Réserver", highlighted: false },
              { name: "Reportage mariage", price: "1200€", period: "", features: ["Journée complète", "Galerie en ligne"], ctaLabel: "Réserver", highlighted: true },
              { name: "Shooting corporate", price: "300€", period: "", features: ["Équipe jusqu'à 10 personnes"], ctaLabel: "Réserver", highlighted: false },
            ],
          },
        },
        {
          type: "contact",
          position: 50,
          content: {
            title: "Me contacter",
            description: "Parlez-moi de votre projet.",
            email: "contact@exemple.fr",
            showForm: true,
          },
        },
        {
          type: "footer",
          position: 60,
          content: { text: "© 2026 — Fait avec Siteo", links: [] },
        },
      ],
    },
  },
];

export function getTemplateBySlug(slug: string) {
  return templates.find((t) => t.slug === slug);
}

export function getTemplatesByCategory(category: string) {
  return templates.filter((t) => t.category === category);
}
