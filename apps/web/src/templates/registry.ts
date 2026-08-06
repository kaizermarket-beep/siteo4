import { blockTypeDefs } from "./block-type-defs";
import type { TemplateDefinition } from "./types";

export const templates: TemplateDefinition[] = [
  {
    slug: "essentiel",
    name: "Essentiel",
    description: "Un site simple et clair pour démarrer — idéal pour un indépendant.",
    isPremium: false,
    schema: {
      blockTypes: blockTypeDefs,
      defaultBlocks: [
        {
          type: "hero",
          position: 10,
          content: {
            headline: "Votre activité, présentée simplement",
            subheadline: "Un site professionnel pour donner confiance à vos clients.",
            ctaLabel: "Me contacter",
            ctaLink: { href: "#contact", label: "Me contacter" },
          },
        },
        {
          type: "features",
          position: 20,
          content: {
            title: "Ce que je propose",
            items: [
              { icon: "✦", title: "Service 1", description: "Décrivez ici votre premier service." },
              { icon: "✦", title: "Service 2", description: "Décrivez ici votre second service." },
              { icon: "✦", title: "Service 3", description: "Décrivez ici votre troisième service." },
            ],
          },
        },
        {
          type: "pricing",
          position: 30,
          content: {
            title: "Tarifs",
            plans: [
              {
                name: "Standard",
                price: "Sur devis",
                period: "",
                features: ["Adapté à votre besoin", "Réponse sous 48h"],
                ctaLabel: "Demander un devis",
                highlighted: true,
              },
            ],
          },
        },
        {
          type: "contact",
          position: 40,
          content: {
            title: "Contact",
            description: "Une question ? Écrivez-moi.",
            email: "contact@exemple.fr",
            showForm: true,
          },
        },
        {
          type: "footer",
          position: 50,
          content: {
            text: "© 2026 — Fait avec Siteo",
            links: [],
          },
        },
      ],
    },
  },
  {
    slug: "agence",
    name: "Agence",
    description: "Un site étoffé avec portfolio, pensé pour les agences et studios créatifs.",
    isPremium: true,
    schema: {
      blockTypes: blockTypeDefs,
      defaultBlocks: [
        {
          type: "hero",
          position: 10,
          content: {
            headline: "Nous créons des expériences qui marquent",
            subheadline: "Studio créatif spécialisé en design de marque et produit digital.",
            ctaLabel: "Démarrer un projet",
            ctaLink: { href: "#contact", label: "Démarrer un projet" },
          },
        },
        {
          type: "features",
          position: 20,
          content: {
            title: "Notre expertise",
            items: [
              { icon: "◆", title: "Branding", description: "Identité visuelle et stratégie de marque." },
              { icon: "◆", title: "Web design", description: "Sites et produits digitaux sur mesure." },
              { icon: "◆", title: "Motion", description: "Animation et contenus vidéo." },
            ],
          },
        },
        {
          type: "gallery",
          position: 30,
          content: {
            title: "Nos réalisations",
            images: [
              { image: { url: "https://placehold.co/600x600?text=Projet+1", alt: "Projet 1" }, caption: "Projet 1" },
              { image: { url: "https://placehold.co/600x600?text=Projet+2", alt: "Projet 2" }, caption: "Projet 2" },
              { image: { url: "https://placehold.co/600x600?text=Projet+3", alt: "Projet 3" }, caption: "Projet 3" },
            ],
          },
        },
        {
          type: "pricing",
          position: 40,
          content: {
            title: "Formules",
            plans: [
              {
                name: "Essentiel",
                price: "1 500€",
                period: "",
                features: ["Site vitrine", "1 révision"],
                ctaLabel: "Choisir",
                highlighted: false,
              },
              {
                name: "Studio",
                price: "3 900€",
                period: "",
                features: ["Branding + site", "3 révisions", "Support 30 jours"],
                ctaLabel: "Choisir",
                highlighted: true,
              },
            ],
          },
        },
        {
          type: "contact",
          position: 50,
          content: {
            title: "Un projet en tête ?",
            description: "Parlons-en.",
            email: "studio@exemple.fr",
            showForm: true,
          },
        },
        {
          type: "footer",
          position: 60,
          content: {
            text: "© 2026 — Fait avec Siteo",
            links: [{ href: "#", label: "Mentions légales" }],
          },
        },
      ],
    },
  },
  {
    slug: "cabinet",
    name: "Cabinet",
    description: "Un site sobre et rassurant pour les professions libérales et cabinets de conseil.",
    isPremium: true,
    schema: {
      blockTypes: blockTypeDefs,
      defaultBlocks: [
        {
          type: "hero",
          position: 10,
          content: {
            headline: "Un accompagnement de confiance",
            subheadline: "Cabinet de conseil indépendant à votre écoute.",
            ctaLabel: "Prendre rendez-vous",
            ctaLink: { href: "#contact", label: "Prendre rendez-vous" },
          },
        },
        {
          type: "features",
          position: 20,
          content: {
            title: "Nos domaines d'intervention",
            items: [
              { icon: "▪", title: "Conseil stratégique", description: "Analyse et recommandations sur mesure." },
              { icon: "▪", title: "Accompagnement", description: "Suivi personnalisé dans la durée." },
              { icon: "▪", title: "Formation", description: "Ateliers et transferts de compétences." },
            ],
          },
        },
        {
          type: "pricing",
          position: 30,
          content: {
            title: "Nos prestations",
            plans: [
              {
                name: "Consultation",
                price: "150€",
                period: "/heure",
                features: ["Premier échange offert"],
                ctaLabel: "Réserver",
                highlighted: true,
              },
            ],
          },
        },
        {
          type: "contact",
          position: 40,
          content: {
            title: "Prenons contact",
            description: "Premier échange sans engagement.",
            email: "cabinet@exemple.fr",
            showForm: true,
          },
        },
        {
          type: "footer",
          position: 50,
          content: {
            text: "© 2026 — Fait avec Siteo",
            links: [{ href: "#", label: "Mentions légales" }],
          },
        },
      ],
    },
  },
];

export function getTemplateBySlug(slug: string) {
  return templates.find((t) => t.slug === slug);
}
