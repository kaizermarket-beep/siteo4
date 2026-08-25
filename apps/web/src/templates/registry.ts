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
      accentColor: "#DB2777",
      defaultBlocks: [
        {
          type: "hero",
          position: 10,
          content: {
            headline: "Votre salon de coiffure, réinventé",
            subheadline: "Coupe, couleur, soins — une équipe passionnée à votre écoute.",
            ctaLabel: "Prendre rendez-vous",
            ctaLink: { href: "#rendez-vous", label: "Prendre rendez-vous" },
            heroVariant: "sunbeam",
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
              { image: { url: "https://images.unsplash.com/photo-1781450090585-1a511b7066d9?w=900&auto=format&fit=crop&q=60", alt: "Le salon" }, caption: "" },
              { image: { url: "https://images.unsplash.com/photo-1746723375184-5f537d2e6f31?w=900&auto=format&fit=crop&q=60", alt: "Coiffeuse au travail" }, caption: "" },
              { image: { url: "https://images.unsplash.com/photo-1623171678074-1b04ff0e694f?w=900&auto=format&fit=crop&q=60", alt: "Espace coiffure" }, caption: "" },
            ],
          },
        },
        {
          type: "beforeAfter",
          position: 35,
          content: {
            title: "Avant / Après",
            description: "Glissez le curseur pour voir la transformation.",
            items: [
              {
                beforeImage: { url: "https://placehold.co/600x750/FFFFFF/DB2777?text=Avant", alt: "Avant la coloration" },
                afterImage: { url: "https://placehold.co/600x750/DB2777/FFFFFF?text=Apr%C3%A8s", alt: "Après la coloration" },
                label: "Coloration",
              },
              {
                beforeImage: { url: "https://placehold.co/600x750/FFFFFF/DB2777?text=Avant", alt: "Avant la coupe" },
                afterImage: { url: "https://placehold.co/600x750/DB2777/FFFFFF?text=Apr%C3%A8s", alt: "Après la coupe" },
                label: "Coupe restructurée",
              },
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
          type: "appointment",
          position: 45,
          content: {
            title: "Prendre rendez-vous",
            description: "Choisissez votre prestation et votre jour : les créneaux encore libres s'affichent.",
            services: [{ name: "Coupe femme", durationMinutes: 45, price: "35€" }, { name: "Coupe homme", durationMinutes: 30, price: "25€" }, { name: "Brushing", durationMinutes: 30, price: "25€" }, { name: "Coloration", durationMinutes: 90, price: "65€" }],
            hours: [{ day: 2, ranges: [{ start: "09:30", end: "12:30" }, { start: "14:00", end: "19:00" }] }, { day: 3, ranges: [{ start: "09:30", end: "12:30" }, { start: "14:00", end: "19:00" }] }, { day: 4, ranges: [{ start: "09:30", end: "12:30" }, { start: "14:00", end: "19:00" }] }, { day: 5, ranges: [{ start: "09:30", end: "12:30" }, { start: "14:00", end: "19:00" }] }, { day: 6, ranges: [{ start: "09:00", end: "17:00" }] }],
            notePlaceholder: "Longueur, couleur souhaitée, coiffeur préféré…",
            closedDates: [],
            staffCount: 2,
            slotStep: 15,
            noticeHours: 2,
            maxDaysAhead: 60,
            phone: "01 23 45 67 89",
            notifyEmail: "",
          },
        },
        {
          type: "contact",
          position: 50,
          content: {
            title: "Prendre rendez-vous",
            description: "Réservez votre créneau en quelques clics.",
            email: "contact@exemple.fr",
            phone: "01 23 45 67 89",
            address: "12 rue de la Coiffe, 75011 Paris",
            hours: "Mar-Ven : 9h30-19h\nSam : 9h-17h\nDim-Lun : Fermé",
            socialLinks: [
              { platform: "Instagram", href: "https://instagram.com" },
              { platform: "Facebook", href: "https://facebook.com" },
            ],
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
    slug: "salon-prestige",
    name: "Salon Prestige",
    description: "Quatre pages éditoriales sur photo pleine page, typographie serif, pour un salon haut de gamme.",
    category: "coiffeur",
    isPremium: true,
    featured: true,
    schema: {
      blockTypes: blockTypeDefs,
      accentColor: "#D4AF37",
      mode: "dark",
      defaultBlocks: [
        {
          type: "hero",
          position: 10,
          content: {
            headline: "Coiffeur coloriste, avenue des Champs, depuis 2009",
            subheadline: "Un seul rendez-vous par créneau. Diagnostic, coupe et couleur avec la même personne, du début à la fin.",
            ctaLabel: "Prendre rendez-vous",
            ctaLink: { href: "/contact", label: "Prendre rendez-vous" },
            heroVariant: "editorial",
            backgroundImage: {
              url: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=1600&auto=format&fit=crop&q=70",
              alt: "La salle du salon",
            },
          },
        },
        {
          type: "features",
          position: 20,
          content: {
            title: "La maison",
            items: [
              { icon: "01", title: "Coupe & structure", description: "45 minutes, diagnostic compris. On regarde vos épis et votre implantation avant de toucher aux ciseaux." },
              { icon: "02", title: "Coloration sur-mesure", description: "Couleur préparée au gramme près, dans notre laboratoire. Retouche des racines offerte à trois semaines." },
              { icon: "03", title: "Rituels signature", description: "Diagnostic du cuir chevelu, massage de vingt minutes, soin choisi selon la porosité de votre fibre." },
            ],
          },
        },
        {
          type: "footer",
          position: 30,
          content: { text: "© 2026 — Fait avec Siteo", links: [] },
        },
      ],
      pages: [
        {
          slug: "prestations",
          title: "Prestations",
          position: 20,
          blocks: [
            {
              type: "hero",
              position: 10,
              content: {
                headline: "Prestations",
                subheadline: "Chaque prestation commence par un diagnostic. Le prix annoncé est celui que vous réglez en partant.",
                ctaLabel: "",
                ctaLink: { href: "", label: "" },
                heroVariant: "pageHeader",
              },
            },
            {
              type: "beforeAfter",
              position: 20,
              content: {
                title: "Avant / Après",
                description: "Glissez le curseur pour voir la transformation.",
                items: [
                  {
                    beforeImage: { url: "https://placehold.co/600x750/111111/D4AF37?text=Avant", alt: "Avant le balayage" },
                    afterImage: { url: "https://placehold.co/600x750/D4AF37/111111?text=Apr%C3%A8s", alt: "Après le balayage" },
                    label: "Balayage sur-mesure",
                  },
                  {
                    beforeImage: { url: "https://placehold.co/600x750/111111/D4AF37?text=Avant", alt: "Avant le rituel complet" },
                    afterImage: { url: "https://placehold.co/600x750/D4AF37/111111?text=Apr%C3%A8s", alt: "Après le rituel complet" },
                    label: "Rituel Complet",
                  },
                ],
              },
            },
            {
              type: "pricing",
              position: 30,
              content: {
                ctaHref: "/contact",
                title: "Nos formules signature",
                plans: [
                  { name: "Coupe Signature", price: "55€", period: "", features: ["Diagnostic capillaire offert", "Brushing inclus"], ctaLabel: "Réserver", highlighted: false },
                  { name: "Coloration Prestige", price: "120€", period: "", features: ["Produits premium", "Soin réparateur inclus"], ctaLabel: "Réserver", highlighted: true },
                  { name: "Rituel Complet", price: "180€", period: "", features: ["Coupe + couleur + soin", "2h30 d'exception"], ctaLabel: "Réserver", highlighted: false },
                ],
              },
            },
          ],
        },
        {
          slug: "galerie",
          title: "Galerie",
          position: 30,
          blocks: [
            {
              type: "hero",
              position: 10,
              content: {
                headline: "Le salon",
                subheadline: "Quatre postes, la lumière du jour et le calme qu'il faut pour réussir une couleur.",
                ctaLabel: "",
                ctaLink: { href: "", label: "" },
                heroVariant: "pageHeader",
              },
            },
            {
              type: "gallery",
              position: 20,
              content: {
                title: "L'expérience Prestige",
                variant: "gallery3d",
                images: [
                  { image: { url: "https://images.unsplash.com/photo-1781450090585-1a511b7066d9?w=900&auto=format&fit=crop&q=60", alt: "Le salon Prestige" }, caption: "" },
                  { image: { url: "https://images.unsplash.com/photo-1746723375184-5f537d2e6f31?w=900&auto=format&fit=crop&q=60", alt: "Un rituel signature" }, caption: "" },
                  { image: { url: "https://images.unsplash.com/photo-1623171678074-1b04ff0e694f?w=900&auto=format&fit=crop&q=60", alt: "L'espace coiffure" }, caption: "" },
                  { image: { url: "https://images.unsplash.com/photo-1760862652442-e8ff7ebdd2f8?w=900&auto=format&fit=crop&q=60", alt: "Nos produits premium" }, caption: "" },
                ],
              },
            },
          ],
        },
        {
          slug: "contact",
          title: "Contact",
          position: 40,
          blocks: [
            {
              type: "hero",
              position: 10,
              content: {
                headline: "Prendre rendez-vous",
                subheadline: "Un seul rendez-vous par créneau : écrivez-nous et nous vous rappelons dans la journée.",
                ctaLabel: "",
                ctaLink: { href: "", label: "" },
                heroVariant: "pageHeader",
              },
            },
            {
              type: "appointment",
              position: 15,
              content: {
                title: "Prendre rendez-vous",
                description: "Un seul rendez-vous par créneau. Choisissez votre prestation, les heures encore libres apparaissent.",
                services: [{ name: "Coupe & structure", durationMinutes: 45, price: "70€" }, { name: "Coloration sur-mesure", durationMinutes: 120, price: "150€" }, { name: "Rituel signature", durationMinutes: 60, price: "90€" }],
                hours: [{ day: 2, ranges: [{ start: "10:00", end: "19:00" }] }, { day: 3, ranges: [{ start: "10:00", end: "19:00" }] }, { day: 4, ranges: [{ start: "10:00", end: "19:00" }] }, { day: 5, ranges: [{ start: "10:00", end: "19:00" }] }, { day: 6, ranges: [{ start: "10:00", end: "19:00" }] }],
                notePlaceholder: "Longueur, couleur souhaitée, coiffeur préféré…",
                closedDates: [],
                staffCount: 1,
                slotStep: 30,
                noticeHours: 24,
                maxDaysAhead: 90,
                phone: "01 23 45 67 89",
                notifyEmail: "",
              },
            },
            {
              type: "contact",
              position: 20,
              content: {
                title: "Prendre rendez-vous",
                description: "Un conseiller vous accueille pour définir votre projet capillaire.",
                email: "contact@exemple.fr",
                phone: "01 23 45 67 89",
                address: "24 avenue des Champs, 75008 Paris",
                hours: "Mar-Sam : 10h-19h\nDim-Lun : Fermé",
                socialLinks: [
                  { platform: "Instagram", href: "https://instagram.com" },
                  { platform: "Facebook", href: "https://facebook.com" },
                ],
                showForm: true,
              },
            },
          ],
        },
      ],
    },
  },
  {
    slug: "coiffure-urbaine",
    name: "Coiffure Urbaine",
    description: "Un style moderne et affirmé, avec une entrée en scène animée, pour un salon tendance.",
    category: "coiffeur",
    isPremium: false,
    schema: {
      blockTypes: blockTypeDefs,
      accentColor: "#7C3AED",
      defaultBlocks: [
        {
          type: "hero",
          position: 10,
          content: {
            headline: "Le style qui vous ressemble",
            subheadline: "Coupes tendance, coloration créative, dans un cadre urbain et décontracté.",
            ctaLabel: "Prendre rendez-vous",
            ctaLink: { href: "#rendez-vous", label: "Prendre rendez-vous" },
            heroVariant: "aurora",
          },
        },
        {
          type: "features",
          position: 20,
          content: {
            title: "Ce qu'on propose",
            items: [
              { icon: "💇", title: "Coupes tendance", description: "Dégradés, coupes courtes, styles inspirés des dernières tendances." },
              { icon: "🌈", title: "Coloration créative", description: "Balayages, mèches colorées, effets contrastés." },
              { icon: "🧴", title: "Coiffage express", description: "Un brushing ou un coiffage soigné pour toutes vos sorties." },
            ],
          },
        },
        {
          type: "gallery",
          position: 30,
          content: {
            title: "Nos créations",
            images: [
              { image: { url: "https://images.unsplash.com/photo-1746723375184-5f537d2e6f31?w=900&auto=format&fit=crop&q=60", alt: "Coiffeuse au travail" }, caption: "" },
              { image: { url: "https://images.unsplash.com/photo-1623171678074-1b04ff0e694f?w=900&auto=format&fit=crop&q=60", alt: "L'ambiance du salon" }, caption: "" },
              { image: { url: "https://images.unsplash.com/photo-1605497788116-1f20ad55ea7f?w=900&auto=format&fit=crop&q=60", alt: "Un client stylé" }, caption: "" },
            ],
          },
        },
        {
          type: "beforeAfter",
          position: 35,
          content: {
            title: "Avant / Après",
            description: "Glissez le curseur pour voir la transformation.",
            items: [
              {
                beforeImage: { url: "https://placehold.co/600x750/111111/7C3AED?text=Avant", alt: "Avant la couleur créative" },
                afterImage: { url: "https://placehold.co/600x750/7C3AED/111111?text=Apr%C3%A8s", alt: "Après la couleur créative" },
                label: "Balayage créatif",
              },
              {
                beforeImage: { url: "https://placehold.co/600x750/111111/7C3AED?text=Avant", alt: "Avant le dégradé" },
                afterImage: { url: "https://placehold.co/600x750/7C3AED/111111?text=Apr%C3%A8s", alt: "Après le dégradé" },
                label: "Dégradé structuré",
              },
            ],
          },
        },
        {
          type: "pricing",
          position: 40,
          content: {
            title: "Nos tarifs",
            plans: [
              { name: "Coupe tendance", price: "30€", period: "", features: ["Shampoing inclus", "Coiffage rapide"], ctaLabel: "Réserver", highlighted: false },
              { name: "Couleur créative", price: "70€", period: "", features: ["Diagnostic offert", "Soin inclus"], ctaLabel: "Réserver", highlighted: true },
              { name: "Formule complète", price: "95€", period: "", features: ["Coupe + couleur + coiffage"], ctaLabel: "Réserver", highlighted: false },
            ],
          },
        },
        {
          type: "appointment",
          position: 45,
          content: {
            title: "Prendre rendez-vous",
            description: "Trois fauteuils, pas de file d'attente : prenez votre créneau en ligne.",
            services: [{ name: "Coupe signature", durationMinutes: 40, price: "42€" }, { name: "Dégradé", durationMinutes: 30, price: "28€" }, { name: "Couleur", durationMinutes: 90, price: "75€" }],
            hours: [{ day: 2, ranges: [{ start: "10:00", end: "19:30" }] }, { day: 3, ranges: [{ start: "10:00", end: "19:30" }] }, { day: 4, ranges: [{ start: "10:00", end: "19:30" }] }, { day: 5, ranges: [{ start: "10:00", end: "20:30" }] }, { day: 6, ranges: [{ start: "09:30", end: "19:00" }] }],
            notePlaceholder: "Longueur, couleur souhaitée, coiffeur préféré…",
            closedDates: [],
            staffCount: 3,
            slotStep: 15,
            noticeHours: 1,
            maxDaysAhead: 45,
            phone: "01 23 45 67 89",
            notifyEmail: "",
          },
        },
        {
          type: "contact",
          position: 50,
          content: {
            title: "Réserver mon créneau",
            description: "On vous répond vite, en ligne ou par téléphone.",
            email: "contact@exemple.fr",
            phone: "01 22 33 44 55",
            address: "16 rue du Faubourg, 69001 Lyon",
            hours: "Lun-Sam : 10h-19h30\nDim : Fermé",
            socialLinks: [
              { platform: "Instagram", href: "https://instagram.com" },
              { platform: "TikTok", href: "https://tiktok.com" },
            ],
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
    slug: "barber-club",
    name: "Barber Club",
    description: "Quatre pages sombres et masculines, avec un vrai barber pole en 3D, pour les barbershops.",
    category: "coiffeur",
    isPremium: true,
    schema: {
      blockTypes: blockTypeDefs,
      accentColor: "#B45309",
      mode: "dark",
      defaultBlocks: [
        {
          type: "hero",
          position: 10,
          content: {
            headline: "L'art de la barbe et du rasoir",
            subheadline: "Coupe, taille de barbe, rasage traditionnel — un rituel pour l'homme moderne.",
            ctaLabel: "Prendre rendez-vous",
            ctaLink: { href: "/contact", label: "Prendre rendez-vous" },
            heroVariant: "barberPole",
          },
        },
        {
          type: "features",
          position: 20,
          content: {
            title: "Nos services",
            items: [
              { icon: "💈", title: "Coupe homme", description: "Dégradés précis, coupes classiques ou modernes." },
              { icon: "🪒", title: "Rasage traditionnel", description: "Rasage à l'ancienne, serviette chaude et soin du visage." },
              { icon: "🧔", title: "Taille de barbe", description: "Une barbe sculptée selon la forme de votre visage." },
            ],
          },
        },
        {
          type: "footer",
          position: 30,
          content: { text: "© 2026 — Fait avec Siteo", links: [] },
        },
      ],
      pages: [
        {
          slug: "prestations",
          title: "Prestations",
          position: 20,
          blocks: [
            {
              type: "hero",
              position: 10,
              content: {
                headline: "Prestations",
                subheadline: "Coupe, barbe, rasage : trois gestes, une même exigence — et le temps qu'il faut pour les faire bien.",
                ctaLabel: "",
                ctaLink: { href: "", label: "" },
                heroVariant: "pageHeader",
              },
            },
            {
              type: "beforeAfter",
              position: 20,
              content: {
                title: "Avant / Après",
                description: "Glissez le curseur pour voir la transformation.",
                items: [
                  {
                    beforeImage: { url: "https://placehold.co/600x750/111111/B45309?text=Avant", alt: "Avant la coupe" },
                    afterImage: { url: "https://placehold.co/600x750/B45309/111111?text=Apr%C3%A8s", alt: "Après la coupe" },
                    label: "Rituel Barber",
                  },
                  {
                    beforeImage: { url: "https://placehold.co/600x750/111111/B45309?text=Avant", alt: "Avant la taille de barbe" },
                    afterImage: { url: "https://placehold.co/600x750/B45309/111111?text=Apr%C3%A8s", alt: "Après la taille de barbe" },
                    label: "Taille de barbe",
                  },
                ],
              },
            },
            {
              type: "pricing",
              position: 30,
              content: {
                ctaHref: "/contact",
                title: "Nos forfaits",
                plans: [
                  { name: "Coupe classique", price: "28€", period: "", features: ["Shampoing + coiffage"], ctaLabel: "Réserver", highlighted: false },
                  { name: "Rituel Barber", price: "55€", period: "", features: ["Coupe + barbe + rasage chaud"], ctaLabel: "Réserver", highlighted: true },
                  { name: "Taille de barbe", price: "20€", period: "", features: ["Tracé précis"], ctaLabel: "Réserver", highlighted: false },
                ],
              },
            },
          ],
        },
        {
          slug: "galerie",
          title: "Galerie",
          position: 30,
          blocks: [
            {
              type: "hero",
              position: 10,
              content: {
                headline: "Le Club",
                subheadline: "Cuir, laiton et lumière basse. L'endroit où l'on prend son temps.",
                ctaLabel: "",
                ctaLink: { href: "", label: "" },
                heroVariant: "pageHeader",
              },
            },
            {
              type: "gallery",
              position: 20,
              content: {
                title: "Le Club",
                images: [
                  { image: { url: "https://images.unsplash.com/photo-1759134248487-e8baaf31e33e?w=900&auto=format&fit=crop&q=60", alt: "L'intérieur du Club" }, caption: "" },
                  { image: { url: "https://images.unsplash.com/photo-1605497788116-1f20ad55ea7f?w=900&auto=format&fit=crop&q=60", alt: "Un client sur le fauteuil" }, caption: "" },
                  { image: { url: "https://images.unsplash.com/photo-1568292184286-466342737dc6?w=900&auto=format&fit=crop&q=60", alt: "Séance de coupe" }, caption: "" },
                  { image: { url: "https://images.unsplash.com/photo-1746723375184-5f537d2e6f31?w=900&auto=format&fit=crop&q=60", alt: "Précision du geste" }, caption: "" },
                ],
              },
            },
          ],
        },
        {
          slug: "contact",
          title: "Contact",
          position: 40,
          blocks: [
            {
              type: "hero",
              position: 10,
              content: {
                headline: "Réserver au Club",
                subheadline: "Sur rendez-vous, du lundi au samedi. Le dimanche, le Club dort.",
                ctaLabel: "",
                ctaLink: { href: "", label: "" },
                heroVariant: "pageHeader",
              },
            },
            {
              type: "appointment",
              position: 15,
              content: {
                title: "Prendre rendez-vous",
                description: "Barbe, coupe ou les deux : choisissez, le temps nécessaire est réservé pour vous.",
                services: [{ name: "Coupe", durationMinutes: 30, price: "26€" }, { name: "Taille de barbe", durationMinutes: 20, price: "18€" }, { name: "Coupe + barbe", durationMinutes: 45, price: "38€" }, { name: "Rasage traditionnel", durationMinutes: 40, price: "35€" }],
                hours: [{ day: 2, ranges: [{ start: "09:00", end: "19:00" }] }, { day: 3, ranges: [{ start: "09:00", end: "19:00" }] }, { day: 4, ranges: [{ start: "09:00", end: "19:00" }] }, { day: 5, ranges: [{ start: "09:00", end: "20:00" }] }, { day: 6, ranges: [{ start: "09:00", end: "18:00" }] }],
                notePlaceholder: "Longueur, couleur souhaitée, coiffeur préféré…",
                closedDates: [],
                staffCount: 2,
                slotStep: 15,
                noticeHours: 1,
                maxDaysAhead: 45,
                phone: "01 23 45 67 89",
                notifyEmail: "",
              },
            },
            {
              type: "contact",
              position: 20,
              content: {
                title: "Réserver au Club",
                description: "Sur rendez-vous, dans une ambiance feutrée.",
                email: "contact@exemple.fr",
                phone: "01 44 55 66 77",
                address: "9 rue du Faubourg Saint-Antoine, 75011 Paris",
                hours: "Lun-Sam : 9h-20h\nDim : Fermé",
                socialLinks: [{ platform: "Instagram", href: "https://instagram.com" }],
                showForm: true,
              },
            },
          ],
        },
      ],
    },
  },
  {
    slug: "salon-minimaliste",
    name: "Salon Minimaliste",
    description: "Une ambiance épurée et apaisante, pour une expérience calme et raffinée.",
    category: "coiffeur",
    isPremium: false,
    schema: {
      blockTypes: blockTypeDefs,
      accentColor: "#7C8B6F",
      defaultBlocks: [
        {
          type: "hero",
          position: 10,
          content: {
            headline: "Un moment pour vous, dans un cadre épuré",
            subheadline: "Coiffure et bien-être, dans une ambiance calme et minimaliste.",
            ctaLabel: "Prendre rendez-vous",
            ctaLink: { href: "#rendez-vous", label: "Prendre rendez-vous" },
            heroVariant: "linen",
          },
        },
        {
          type: "features",
          position: 20,
          content: {
            title: "L'expérience",
            items: [
              { icon: "🌿", title: "Coupe sur-mesure", description: "Une coupe pensée pour révéler votre naturel." },
              { icon: "🧖", title: "Soin apaisant", description: "Un massage du cuir chevelu inclus à chaque prestation." },
              { icon: "🕊️", title: "Cadre calme", description: "Un salon pensé comme une pause, loin de l'agitation." },
            ],
          },
        },
        {
          type: "gallery",
          position: 30,
          content: {
            title: "Notre salon",
            images: [
              { image: { url: "https://images.unsplash.com/photo-1760862652442-e8ff7ebdd2f8?w=900&auto=format&fit=crop&q=60", alt: "Nos produits" }, caption: "" },
              { image: { url: "https://images.unsplash.com/photo-1623171678074-1b04ff0e694f?w=900&auto=format&fit=crop&q=60", alt: "L'espace calme" }, caption: "" },
              { image: { url: "https://images.unsplash.com/photo-1781450090585-1a511b7066d9?w=900&auto=format&fit=crop&q=60", alt: "Le salon" }, caption: "" },
            ],
          },
        },
        {
          type: "beforeAfter",
          position: 35,
          content: {
            title: "Avant / Après",
            description: "Glissez le curseur pour voir la transformation.",
            items: [
              {
                beforeImage: { url: "https://placehold.co/600x750/FFFFFF/7C8B6F?text=Avant", alt: "Avant le soin" },
                afterImage: { url: "https://placehold.co/600x750/7C8B6F/FFFFFF?text=Apr%C3%A8s", alt: "Après le soin" },
                label: "Soin profond",
              },
              {
                beforeImage: { url: "https://placehold.co/600x750/FFFFFF/7C8B6F?text=Avant", alt: "Avant la coloration douce" },
                afterImage: { url: "https://placehold.co/600x750/7C8B6F/FFFFFF?text=Apr%C3%A8s", alt: "Après la coloration douce" },
                label: "Coloration végétale",
              },
            ],
          },
        },
        {
          type: "pricing",
          position: 40,
          content: {
            title: "Nos prestations",
            plans: [
              { name: "Coupe", price: "32€", period: "", features: ["Massage du cuir chevelu inclus"], ctaLabel: "Réserver", highlighted: false },
              { name: "Coupe & soin", price: "58€", period: "", features: ["Soin profond inclus", "45 min"], ctaLabel: "Réserver", highlighted: true },
              { name: "Coloration douce", price: "75€", period: "", features: ["Coloration végétale", "Sans ammoniaque"], ctaLabel: "Réserver", highlighted: false },
            ],
          },
        },
        {
          type: "appointment",
          position: 45,
          content: {
            title: "Prendre rendez-vous",
            description: "Un rendez-vous à la fois, sans précipitation. Les créneaux libres s'affichent en direct.",
            services: [{ name: "Coupe", durationMinutes: 45, price: "45€" }, { name: "Soin du cuir chevelu", durationMinutes: 30, price: "35€" }, { name: "Coloration végétale", durationMinutes: 120, price: "95€" }],
            hours: [{ day: 3, ranges: [{ start: "10:00", end: "18:00" }] }, { day: 4, ranges: [{ start: "10:00", end: "18:00" }] }, { day: 5, ranges: [{ start: "10:00", end: "18:00" }] }, { day: 6, ranges: [{ start: "10:00", end: "17:00" }] }],
            notePlaceholder: "Longueur, couleur souhaitée, coiffeur préféré…",
            closedDates: [],
            staffCount: 1,
            slotStep: 30,
            noticeHours: 12,
            maxDaysAhead: 60,
            phone: "01 23 45 67 89",
            notifyEmail: "",
          },
        },
        {
          type: "contact",
          position: 50,
          content: {
            title: "Prendre rendez-vous",
            description: "Réservez votre moment de calme.",
            email: "contact@exemple.fr",
            phone: "01 66 77 88 99",
            address: "5 square des Tilleuls, 44000 Nantes",
            hours: "Mar-Sam : 9h30-18h\nDim-Lun : Fermé",
            socialLinks: [{ platform: "Instagram", href: "https://instagram.com" }],
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
      accentColor: "#C2410C",
      defaultBlocks: [
        {
          type: "hero",
          position: 10,
          content: {
            headline: "Une cuisine généreuse, un accueil chaleureux",
            subheadline: "Des produits frais et locaux, cuisinés avec passion.",
            ctaLabel: "Réserver une table",
            ctaLink: { href: "#contact", label: "Réserver une table" },
            heroVariant: "aurora",
          },
        },
        {
          type: "features",
          position: 20,
          content: {
            title: "Notre maison",
            items: [
              { icon: "🍳", title: "Fait maison", description: "Tout est préparé sur place le matin même, sans surgelé." },
              { icon: "🌱", title: "Producteurs locaux", description: "Viandes, légumes et fromages sourcés à moins de 100 km." },
              { icon: "📅", title: "Carte de saison", description: "Une ardoise renouvelée chaque semaine selon le marché." },
              { icon: "🕯️", title: "Cadre convivial", description: "Une salle chaleureuse, pensée pour prendre son temps." },
            ],
          },
        },
        {
          type: "gallery",
          position: 30,
          content: {
            title: "À notre table",
            images: [
              { image: { url: "https://images.unsplash.com/photo-1750943082452-c714763f73b2?w=900&auto=format&fit=crop&q=60", alt: "Assiette dressée par le chef" }, caption: "Le dressage, chaque service" },
              { image: { url: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=900&auto=format&fit=crop&q=60", alt: "Le chef en cuisine" }, caption: "En cuisine, tout est fait sur place" },
              { image: { url: "https://images.unsplash.com/photo-1536236502598-7dd171f8e852?w=900&auto=format&fit=crop&q=60", alt: "Plats à partager" }, caption: "Des plats pensés pour partager" },
              { image: { url: "https://images.unsplash.com/photo-1646473315764-c6cd47fe74c3?w=900&auto=format&fit=crop&q=60", alt: "Table dressée en salle" }, caption: "La salle, avant le service" },
            ],
          },
        },
        {
          type: "menu",
          position: 40,
          content: {
            title: "Notre carte",
            description: "Une cuisine du marché, renouvelée selon les saisons. Menu du midi à 19€ (entrée + plat ou plat + dessert), du mardi au vendredi.",
            categories: [
              {
                name: "Entrées",
                items: [
                  { name: "Soupe du jour", description: "Selon l'arrivage du marché, croûtons maison.", price: "7€" },
                  { name: "Salade de chèvre chaud", description: "Chèvre fermier, miel de châtaignier, noix, mesclun.", price: "9€" },
                  { name: "Terrine maison", description: "Préparée par nos soins, pain grillé et cornichons.", price: "8€" },
                ],
              },
              {
                name: "Plats",
                items: [
                  { name: "Pavé de saumon", description: "Légumes de saison rôtis, beurre blanc citronné.", price: "18€" },
                  { name: "Entrecôte grillée", description: "Race à viande, frites maison, sauce au poivre.", price: "22€" },
                  { name: "Risotto aux champignons", description: "Riz carnaroli, parmesan 24 mois, huile de truffe.", price: "16€" },
                  { name: "Poulet fermier rôti", description: "Élevé en plein air, purée maison au beurre, jus corsé.", price: "17€" },
                ],
              },
              {
                name: "Desserts",
                items: [
                  { name: "Tarte tatin", description: "Pommes caramélisées, crème fraîche d'Isigny.", price: "7€" },
                  { name: "Mousse au chocolat", description: "Chocolat noir 70%, préparée le matin même.", price: "6€" },
                  { name: "Fromage affiné", description: "Trois fromages, sélection de notre affineur.", price: "6€" },
                ],
              },
            ],
            orderEnabled: true,
            orderPhone: "01 23 45 67 89",
          },
        },
        {
          type: "reservation",
          position: 45,
          content: {
            title: "Réserver une table",
            description: "Choisissez votre date et le nombre de convives : les créneaux encore libres s'affichent.",
            tableCount: 14,
            seatCount: 50,
            maxPartySize: 8,
            openDays: [2, 3, 4, 5, 6],
            slots: ["12:00", "12:30", "13:00", "19:00", "19:30", "20:00", "20:30"],
            noticeHours: 2,
            maxDaysAhead: 60,
            phone: "01 23 45 67 89",
            whatsappPhone: "",
          },
        },
        {
          type: "contact",
          position: 50,
          content: {
            title: "Réserver une table",
            description: "Nous vous répondons sous 24h.",
            email: "contact@exemple.fr",
            phone: "01 23 45 67 89",
            address: "8 place du Marché, 69002 Lyon",
            hours: "Mar-Sam : 12h-14h / 19h-22h30\nDim-Lun : Fermé",
            socialLinks: [
              { platform: "Instagram", href: "https://instagram.com" },
              { platform: "Facebook", href: "https://facebook.com" },
            ],
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
    slug: "bistrot-chic",
    name: "Bistrot Chic",
    description: "Quatre pages élégantes — accueil, carte, salle, réservation — pour un restaurant gastronomique.",
    category: "restauration",
    isPremium: true,
    featured: true,
    schema: {
      blockTypes: blockTypeDefs,
      accentColor: "#9A3412",
      mode: "dark",
      defaultBlocks: [
        {
          type: "hero",
          position: 10,
          content: {
            headline: "Une cuisine d'exception, un service irréprochable",
            subheadline: "Une expérience gastronomique raffinée, dans un cadre élégant et intimiste.",
            ctaLabel: "Réserver une table",
            ctaLink: { href: "/contact", label: "Réserver une table" },
            heroVariant: "embers",
          },
        },
        {
          type: "features",
          position: 20,
          content: {
            title: "L'expérience Bistrot Chic",
            items: [
              { icon: "🍷", title: "Carte des vins", description: "Une sélection pointue, choisie par notre sommelier." },
              { icon: "👨‍🍳", title: "Cuisine de saison", description: "Des produits nobles, sublimés avec créativité." },
              { icon: "🕯️", title: "Ambiance intimiste", description: "Une salle feutrée, pour un moment hors du temps." },
            ],
          },
        },
        {
          type: "footer",
          position: 30,
          content: { text: "© 2026 — Fait avec Siteo", links: [] },
        },
      ],
      pages: [
        {
          slug: "carte",
          title: "La carte",
          position: 20,
          blocks: [
            {
              type: "hero",
              position: 10,
              content: {
                headline: "Notre carte",
                subheadline: "Elle change avec les saisons et les arrivages. Voici celle de ce mois-ci.",
                ctaLabel: "",
                ctaLink: { href: "", label: "" },
                heroVariant: "pageHeader",
              },
            },
            {
              type: "menu",
              position: 20,
              content: {
                title: "Notre carte",
                description: "Une cuisine de saison, sublimée par notre chef.",
                categories: [
                  {
                    name: "Entrées",
                    items: [
                      { name: "Foie gras mi-cuit", description: "Chutney de figue, brioche toastée.", price: "16€" },
                      { name: "Velouté de saison", description: "Selon l'arrivage, crème montée.", price: "11€" },
                      { name: "Carpaccio de Saint-Jacques", description: "Agrumes, huile d'olive.", price: "18€" },
                    ],
                  },
                  {
                    name: "Plats",
                    items: [
                      { name: "Filet de bœuf Rossini", description: "Foie gras poêlé, jus corsé.", price: "34€" },
                      { name: "Bar en croûte de sel", description: "Beurre blanc, légumes de saison.", price: "29€" },
                      { name: "Risotto à la truffe", description: "Parmesan 24 mois.", price: "26€" },
                    ],
                  },
                  {
                    name: "Desserts",
                    items: [
                      { name: "Soufflé au Grand Marnier", description: "Préparation 20 min.", price: "12€" },
                      { name: "Assiette de fromages affinés", description: "Sélection de notre fromager.", price: "10€" },
                    ],
                  },
                ],
                orderEnabled: false,
                orderPhone: "",
              },
            },
          ],
        },
        {
          slug: "le-lieu",
          title: "Le lieu",
          position: 30,
          blocks: [
            {
              type: "hero",
              position: 10,
              content: {
                headline: "La salle",
                subheadline: "Vingt-six couverts, des nappes blanches et une lumière basse. On y parle à voix normale.",
                ctaLabel: "",
                ctaLink: { href: "", label: "" },
                heroVariant: "pageHeader",
              },
            },
            {
              type: "gallery",
              position: 20,
              content: {
                title: "Nos créations",
                images: [
                  { image: { url: "https://placehold.co/600x600/0a0a0a/9A3412?text=Bistrot+1", alt: "Création 1" }, caption: "" },
                  { image: { url: "https://placehold.co/600x600/0a0a0a/9A3412?text=Bistrot+2", alt: "Création 2" }, caption: "" },
                  { image: { url: "https://placehold.co/600x600/0a0a0a/9A3412?text=Bistrot+3", alt: "Création 3" }, caption: "" },
                  { image: { url: "https://placehold.co/600x600/0a0a0a/9A3412?text=Bistrot+4", alt: "Création 4" }, caption: "" },
                ],
              },
            },
          ],
        },
        {
          slug: "contact",
          title: "Contact",
          position: 40,
          blocks: [
            {
              type: "hero",
              position: 10,
              content: {
                headline: "Réserver votre table",
                subheadline: "Réservation conseillée, surtout le week-end. Nous confirmons chaque table par téléphone.",
                ctaLabel: "",
                ctaLink: { href: "", label: "" },
                heroVariant: "pageHeader",
              },
            },
            {
              type: "reservation",
              position: 15,
              content: {
                title: "Réserver une table",
                description: "Vingt-six couverts seulement : mieux vaut réserver. Les créneaux encore libres s'affichent en direct.",
                tableCount: 9,
                seatCount: 26,
                maxPartySize: 6,
                openDays: [2, 3, 4, 5, 6],
                slots: ["19:00", "19:30", "20:00", "20:30", "21:00"],
                noticeHours: 2,
                maxDaysAhead: 60,
                phone: "01 23 45 67 89",
                whatsappPhone: "",
              },
            },
            {
              type: "contact",
              position: 20,
              content: {
                title: "Réserver votre table",
                description: "Une équipe attentionnée vous accueille chaque soir.",
                email: "contact@exemple.fr",
                phone: "01 42 60 11 22",
                address: "3 place Vendôme, 75001 Paris",
                hours: "Mar-Sam : 19h-23h\nDim-Lun : Fermé",
                socialLinks: [{ platform: "Instagram", href: "https://instagram.com" }],
                showForm: true,
              },
            },
          ],
        },
      ],
    },
  },
  {
    slug: "trattoria-moderne",
    name: "Trattoria Moderne",
    description: "Une photo en fond de page pour une adresse chaleureuse, à l'italienne.",
    category: "restauration",
    isPremium: false,
    schema: {
      blockTypes: blockTypeDefs,
      accentColor: "#CA8A04",
      defaultBlocks: [
        {
          type: "hero",
          position: 10,
          content: {
            headline: "La trattoria comme en Italie",
            subheadline: "Pâtes fraîches, pizzas au feu de bois, produits importés directement d'Italie.",
            ctaLabel: "Réserver une table",
            ctaLink: { href: "#contact", label: "Réserver une table" },
            heroVariant: "photoGallery3d",
            heroImages: [
              { url: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=1200&auto=format&fit=crop&q=60", alt: "Chef en cuisine" },
              { url: "https://images.unsplash.com/photo-1646473315764-c6cd47fe74c3?w=1200&auto=format&fit=crop&q=60", alt: "Table dressée" },
              { url: "https://images.unsplash.com/photo-1771532447024-ee348a315f41?w=1200&auto=format&fit=crop&q=60", alt: "Ambiance feutrée" },
            ],
          },
        },
        {
          type: "features",
          position: 20,
          content: {
            title: "Ce qu'on aime cuisiner",
            items: [
              { icon: "🍝", title: "Pâtes maison", description: "Préparées chaque jour, comme à la maison." },
              { icon: "🍕", title: "Pizza au feu de bois", description: "Cuite à l'ancienne, pâte à la fermentation lente." },
              { icon: "🍷", title: "Vins italiens", description: "Une cave 100% transalpine." },
            ],
          },
        },
        {
          type: "gallery",
          position: 30,
          content: {
            title: "Nos spécialités",
            images: [
              { image: { url: "https://placehold.co/600x600?text=Trattoria+1", alt: "Plat 1" }, caption: "" },
              { image: { url: "https://placehold.co/600x600?text=Trattoria+2", alt: "Plat 2" }, caption: "" },
              { image: { url: "https://placehold.co/600x600?text=Trattoria+3", alt: "Plat 3" }, caption: "" },
            ],
          },
        },
        {
          type: "menu",
          position: 40,
          content: {
            title: "La Carta",
            description: "Recettes traditionnelles, produits importés d'Italie.",
            categories: [
              {
                name: "Antipasti",
                items: [
                  { name: "Bruschetta al pomodoro", description: "Tomates, basilic, ail.", price: "7€" },
                  { name: "Burrata", description: "Tomates confites, huile d'olive.", price: "10€" },
                  { name: "Arancini", description: "Boulettes de risotto, mozzarella.", price: "8€" },
                ],
              },
              {
                name: "Pizze",
                items: [
                  { name: "Margherita", description: "Tomate, mozzarella, basilic.", price: "12€" },
                  { name: "Diavola", description: "Tomate, mozzarella, salami piquant.", price: "14€" },
                  { name: "Quattro Formaggi", description: "Quatre fromages italiens.", price: "15€" },
                ],
              },
              {
                name: "Pasta",
                items: [
                  { name: "Carbonara", description: "Guanciale, œuf, pecorino.", price: "14€" },
                  { name: "Tagliatelle al tartufo", description: "Crème de truffe.", price: "18€" },
                  { name: "Lasagne della casa", description: "Recette de la maison.", price: "15€" },
                ],
              },
              {
                name: "Dolci",
                items: [
                  { name: "Tiramisù", description: "Recette traditionnelle.", price: "7€" },
                  { name: "Panna cotta", description: "Coulis de fruits rouges.", price: "6€" },
                ],
              },
            ],
            orderEnabled: true,
            orderPhone: "01 55 66 77 88",
          },
        },
        {
          type: "reservation",
          position: 45,
          content: {
            title: "Réserver une table",
            description: "Indiquez votre date et le nombre de personnes : la disponibilité s'affiche immédiatement.",
            tableCount: 16,
            seatCount: 60,
            maxPartySize: 10,
            openDays: [1, 2, 3, 4, 5, 6],
            slots: ["12:00", "12:30", "13:00", "19:00", "19:30", "20:00", "20:30", "21:00"],
            noticeHours: 2,
            maxDaysAhead: 60,
            phone: "01 23 45 67 89",
            whatsappPhone: "",
          },
        },
        {
          type: "contact",
          position: 50,
          content: {
            title: "Réserver une table",
            description: "Réponse rapide, du mardi au dimanche.",
            email: "contact@exemple.fr",
            phone: "01 55 66 77 88",
            address: "22 rue de Rome, 75008 Paris",
            hours: "Mar-Dim : 12h-14h30 / 19h-22h30\nLun : Fermé",
            socialLinks: [
              { platform: "Instagram", href: "https://instagram.com" },
              { platform: "Facebook", href: "https://facebook.com" },
            ],
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
    slug: "comptoir-nocturne",
    name: "Le Comptoir Nocturne",
    description: "Quatre pages nocturnes — accueil, carte de nuit, ambiance, réservation — pour un bar-restaurant.",
    category: "restauration",
    isPremium: true,
    schema: {
      blockTypes: blockTypeDefs,
      accentColor: "#991B1B",
      mode: "dark",
      defaultBlocks: [
        {
          type: "hero",
          position: 10,
          content: {
            headline: "Là où la nuit prend goût",
            subheadline: "Cuisine de bar, cocktails signature, ouvert tard pour les gourmands noctambules.",
            ctaLabel: "Réserver ma place",
            ctaLink: { href: "/contact", label: "Réserver ma place" },
            heroVariant: "beams",
          },
        },
        {
          type: "features",
          position: 20,
          content: {
            title: "L'esprit du Comptoir",
            items: [
              { icon: "🍸", title: "Cocktails signature", description: "Créations originales par notre bar." },
              { icon: "🌙", title: "Cuisine tardive", description: "Service continu jusqu'à minuit." },
              { icon: "🎶", title: "Ambiance live", description: "DJ ou musique live certains soirs." },
            ],
          },
        },
        {
          type: "footer",
          position: 30,
          content: { text: "© 2026 — Fait avec Siteo", links: [] },
        },
      ],
      pages: [
        {
          slug: "carte",
          title: "La carte",
          position: 20,
          blocks: [
            {
              type: "hero",
              position: 10,
              content: {
                headline: "La carte de nuit",
                subheadline: "Cuisine servie jusqu'à minuit, cocktails jusqu'à la fermeture.",
                ctaLabel: "",
                ctaLink: { href: "", label: "" },
                heroVariant: "pageHeader",
              },
            },
            {
              type: "menu",
              position: 20,
              content: {
                title: "Notre carte de nuit",
                description: "Cuisine de bar et cocktails signature, jusqu'au bout de la nuit.",
                categories: [
                  {
                    name: "À partager",
                    items: [
                      { name: "Planche charcuterie & fromages", description: "Pour 2 personnes.", price: "24€" },
                      { name: "Nachos maison", description: "Guacamole, cheddar fondu.", price: "14€" },
                      { name: "Tapas du moment", description: "Selon l'humeur du chef.", price: "16€" },
                    ],
                  },
                  {
                    name: "Plats du bar",
                    items: [
                      { name: "Burger signature", description: "Bœuf, cheddar, sauce maison.", price: "18€" },
                      { name: "Tartare de bœuf", description: "Coupé au couteau, frites.", price: "19€" },
                      { name: "Croque monsieur revisité", description: "Béchamel truffée.", price: "14€" },
                    ],
                  },
                  {
                    name: "Cocktails signature",
                    items: [
                      { name: "Old Fashioned maison", description: "Bourbon, angostura.", price: "12€" },
                      { name: "Spritz du Comptoir", description: "Recette maison.", price: "11€" },
                      { name: "Mocktail du moment", description: "Sans alcool.", price: "9€" },
                    ],
                  },
                ],
                orderEnabled: true,
                orderPhone: "01 47 58 69 70",
              },
            },
          ],
        },
        {
          slug: "ambiance",
          title: "Ambiance",
          position: 30,
          blocks: [
            {
              type: "hero",
              position: 10,
              content: {
                headline: "L'ambiance",
                subheadline: "Bois sombre, néons discrets et un DJ certains soirs. On vient pour rester.",
                ctaLabel: "",
                ctaLink: { href: "", label: "" },
                heroVariant: "pageHeader",
              },
            },
            {
              type: "gallery",
              position: 20,
              content: {
                title: "L'ambiance",
                images: [
                  { image: { url: "https://placehold.co/600x600/0a0a0a/991B1B?text=Comptoir+1", alt: "Ambiance 1" }, caption: "" },
                  { image: { url: "https://placehold.co/600x600/0a0a0a/991B1B?text=Comptoir+2", alt: "Ambiance 2" }, caption: "" },
                  { image: { url: "https://placehold.co/600x600/0a0a0a/991B1B?text=Comptoir+3", alt: "Ambiance 3" }, caption: "" },
                  { image: { url: "https://placehold.co/600x600/0a0a0a/991B1B?text=Comptoir+4", alt: "Ambiance 4" }, caption: "" },
                ],
              },
            },
          ],
        },
        {
          slug: "contact",
          title: "Contact",
          position: 40,
          blocks: [
            {
              type: "hero",
              position: 10,
              content: {
                headline: "Réserver ma place",
                subheadline: "Au comptoir ou en salle — dites-nous ce que vous préférez, on garde la place.",
                ctaLabel: "",
                ctaLink: { href: "", label: "" },
                heroVariant: "pageHeader",
              },
            },
            {
              type: "reservation",
              position: 15,
              content: {
                title: "Réserver une table",
                description: "Service jusqu'à minuit. Réservez votre table ou votre place au comptoir.",
                tableCount: 12,
                seatCount: 40,
                maxPartySize: 8,
                openDays: [3, 4, 5, 6],
                slots: ["19:00", "20:00", "21:00", "22:00", "23:00"],
                noticeHours: 2,
                maxDaysAhead: 60,
                phone: "01 23 45 67 89",
                whatsappPhone: "",
              },
            },
            {
              type: "contact",
              position: 20,
              content: {
                title: "Réserver ma place",
                description: "Ouvert jusqu'à 2h du matin, jeudi à samedi.",
                email: "contact@exemple.fr",
                phone: "01 47 58 69 70",
                address: "58 rue Oberkampf, 75011 Paris",
                hours: "Jeu-Sam : 19h-2h\nDim-Mer : Fermé",
                socialLinks: [{ platform: "Instagram", href: "https://instagram.com" }],
                showForm: true,
              },
            },
          ],
        },
      ],
    },
  },
  {
    slug: "snack-food-truck",
    name: "Snack & Food Truck",
    description: "Un hero 3D immersif avec vos meilleurs clichés, pour un snack ou food truck qui donne envie.",
    category: "restauration",
    isPremium: false,
    schema: {
      blockTypes: blockTypeDefs,
      accentColor: "#F97316",
      defaultBlocks: [
        {
          type: "hero",
          position: 10,
          content: {
            headline: "Le goût de la rue, sans les détours",
            subheadline: "Burgers, tacos, street food maison — préparés minute, à emporter ou sur place.",
            ctaLabel: "Voir la carte",
            ctaLink: { href: "#contact", label: "Voir la carte" },
            heroVariant: "photoGallery3d",
            heroImages: [
              { url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&auto=format&fit=crop&q=60", alt: "Burger maison" },
              { url: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200&auto=format&fit=crop&q=60", alt: "Street food" },
              { url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&auto=format&fit=crop&q=60", alt: "Tacos" },
              { url: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=1200&auto=format&fit=crop&q=60", alt: "Food truck" },
              { url: "https://images.unsplash.com/photo-1512152272829-e3139592d56f?w=1200&auto=format&fit=crop&q=60", alt: "Frites maison" },
              { url: "https://images.unsplash.com/photo-1613514785940-daed07799d9b?w=1200&auto=format&fit=crop&q=60", alt: "Burger gourmet" },
              { url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1200&auto=format&fit=crop&q=60", alt: "Wrap street food" },
              { url: "https://images.unsplash.com/photo-1554978991-33ef7f31d658?w=1200&auto=format&fit=crop&q=60", alt: "Plateau street food" },
            ],
          },
        },
        {
          type: "features",
          position: 20,
          content: {
            title: "Notre cuisine de rue",
            items: [
              { icon: "🌮", title: "Street food authentique", description: "Recettes inspirées des meilleurs food trucks, préparées sous vos yeux." },
              { icon: "⚡", title: "Prêt en 5 minutes", description: "Une cuisine rapide, sans jamais sacrifier la qualité." },
              { icon: "🌱", title: "Produits frais du jour", description: "Pain, viande et légumes livrés chaque matin." },
              { icon: "📍", title: "Sur place ou à emporter", description: "Notre coin terrasse ou votre commande à emporter, comme vous préférez." },
            ],
          },
        },
        {
          type: "menu",
          position: 30,
          content: {
            title: "La carte",
            description: "Tout est préparé minute, à la commande.",
            categories: [
              {
                name: "Burgers",
                items: [
                  { name: "Classic Cheese", description: "Steak haché, cheddar, sauce maison.", price: "9€" },
                  { name: "Bacon BBQ", description: "Double steak, bacon, sauce barbecue.", price: "11€" },
                  { name: "Veggie", description: "Galette de légumes, avocat.", price: "9€" },
                ],
              },
              {
                name: "Tacos & Wraps",
                items: [
                  { name: "Tacos poulet croustillant", description: "Poulet pané, crudités, sauce fromagère.", price: "8€" },
                  { name: "Wrap kebab", description: "Viande grillée, crudités, sauce blanche.", price: "7,50€" },
                  { name: "Tacos veggie", description: "Falafel, crudités, houmous.", price: "7€" },
                ],
              },
              {
                name: "Accompagnements",
                items: [
                  { name: "Frites maison", description: "Coupées et cuites minute.", price: "4€" },
                  { name: "Onion rings", description: "Panure croustillante.", price: "5€" },
                  { name: "Coleslaw", description: "Chou, carotte, sauce crémeuse.", price: "3€" },
                ],
              },
              {
                name: "Boissons",
                items: [
                  { name: "Soda", description: "Au choix.", price: "2,50€" },
                  { name: "Milkshake", description: "Vanille, chocolat ou fraise.", price: "5€" },
                  { name: "Eau", description: "", price: "1,50€" },
                ],
              },
            ],
            orderEnabled: true,
            orderPhone: "06 12 98 76 54",
          },
        },
        {
          type: "contact",
          position: 40,
          content: {
            title: "Nous trouver",
            description: "Suivez-nous pour connaître notre emplacement du jour.",
            email: "contact@exemple.fr",
            phone: "06 12 98 76 54",
            address: "Place du Marché — emplacement variable, voir Instagram",
            hours: "Lun-Ven : 11h30-14h30\nSam : 18h-22h",
            socialLinks: [{ platform: "Instagram", href: "https://instagram.com" }],
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
    slug: "automobile",
    name: "Garage automobile",
    description: "Pour les garages, mécaniciens et centres auto.",
    category: "automobile",
    isPremium: false,
    schema: {
      blockTypes: blockTypeDefs,
      accentColor: "#1D4ED8",
      defaultBlocks: [
        {
          type: "hero",
          position: 10,
          content: {
            headline: "L'entretien de votre véhicule en toute confiance",
            subheadline: "Un garage de proximité, des tarifs transparents.",
            ctaLabel: "Demander un devis",
            ctaLink: { href: "#contact", label: "Demander un devis" },
            heroVariant: "beams",
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
              { icon: "🛡️", title: "Garantie pièces & main d'œuvre", description: "Toutes nos interventions sont garanties 6 mois." },
              { icon: "✅", title: "Techniciens certifiés", description: "Une équipe formée et régulièrement certifiée." },
            ],
          },
        },
        {
          type: "gallery",
          position: 25,
          content: {
            title: "Notre atelier",
            images: [
              { image: { url: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?q=80&w=900&auto=format&fit=crop", alt: "Mécanicien au travail" }, caption: "" },
              { image: { url: "https://images.unsplash.com/photo-1625047509168-a7026f36de04?q=80&w=900&auto=format&fit=crop", alt: "Outillage d'atelier" }, caption: "" },
              { image: { url: "https://images.unsplash.com/photo-1533106418989-88406c7cc8ca?q=80&w=900&auto=format&fit=crop", alt: "Intervention sur véhicule" }, caption: "" },
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
            phone: "01 23 45 67 89",
            address: "45 avenue du Garage, 33000 Bordeaux",
            hours: "Lun-Ven : 8h-18h30\nSam : 8h30-12h30",
            socialLinks: [{ platform: "Facebook", href: "https://facebook.com" }],
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
    slug: "garage-premium-auto",
    name: "Garage Premium Auto",
    description: "Quatre pages premium — accueil, prestations, réalisations, rendez-vous — pour un garage haut de gamme.",
    category: "automobile",
    isPremium: true,
    featured: true,
    schema: {
      blockTypes: blockTypeDefs,
      accentColor: "#DC2626",
      mode: "dark",
      defaultBlocks: [
        {
          type: "hero",
          position: 10,
          content: {
            headline: "L'excellence automobile, à votre service",
            subheadline: "Entretien, préparation esthétique et personnalisation. Chaque intervention garantie deux ans, pièces comprises.",
            ctaLabel: "Prendre rendez-vous",
            ctaLink: { href: "/contact", label: "Prendre rendez-vous" },
            heroVariant: "editorial",
            backgroundImage: {
              url: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1400&auto=format&fit=crop&q=70",
              alt: "Voiture de sport grise devant l'atelier",
            },
          },
        },
        {
          type: "features",
          position: 20,
          content: {
            title: "Nos prestations premium",
            items: [
              { icon: "🏎️", title: "Préparation esthétique", description: "Detailing complet, céramique et protection carrosserie." },
              { icon: "🔧", title: "Mécanique de précision", description: "Des techniciens certifiés, équipement dernière génération." },
              { icon: "🛡️", title: "Garantie premium", description: "Toutes nos interventions sont garanties 2 ans." },
              { icon: "📜", title: "Assurance & agréments", description: "Atelier assuré, reconnu par les principales compagnies." },
            ],
          },
        },
        {
          type: "footer",
          position: 30,
          content: { text: "© 2026 — Fait avec Siteo", links: [] },
        },
      ],
      pages: [
        {
          slug: "prestations",
          title: "Prestations",
          position: 20,
          blocks: [
            {
              type: "hero",
              position: 10,
              content: {
                headline: "Prestations",
                subheadline: "Detailing, mécanique, protection : chaque intervention est garantie deux ans, pièces comprises.",
                ctaLabel: "",
                ctaLink: { href: "", label: "" },
                heroVariant: "pageHeader",
              },
            },
            {
              type: "beforeAfter",
              position: 20,
              content: {
                title: "L'effet du detailing",
                description: "Glissez le curseur pour voir la différence après notre protection céramique.",
                items: [
                  {
                    beforeImage: { url: "https://placehold.co/600x750/0a0a0a/DC2626?text=Avant", alt: "Carrosserie avant detailing" },
                    afterImage: { url: "https://placehold.co/600x750/DC2626/0a0a0a?text=Apr%C3%A8s", alt: "Carrosserie après detailing" },
                    label: "Detailing Complet",
                  },
                ],
              },
            },
            {
              type: "pricing",
              position: 30,
              content: {
                ctaHref: "/contact",
                title: "Nos forfaits premium",
                plans: [
                  { name: "Révision Premium", price: "199€", period: "", features: ["Contrôle 50 points", "Produits constructeur"], ctaLabel: "Réserver", highlighted: false },
                  { name: "Detailing Complet", price: "349€", period: "", features: ["Intérieur + extérieur", "Protection céramique"], ctaLabel: "Réserver", highlighted: true },
                  { name: "Diagnostic Expert", price: "59€", period: "", features: ["Lecture + rapport détaillé"], ctaLabel: "Réserver", highlighted: false },
                ],
              },
            },
          ],
        },
        {
          slug: "realisations",
          title: "Réalisations",
          position: 30,
          blocks: [
            {
              type: "hero",
              position: 10,
              content: {
                headline: "Réalisations",
                subheadline: "L'atelier, les véhicules qui y passent et le résultat, sans retouche.",
                ctaLabel: "",
                ctaLink: { href: "", label: "" },
                heroVariant: "pageHeader",
              },
            },
            {
              type: "gallery",
              position: 20,
              content: {
                title: "Notre atelier",
                images: [
                  { image: { url: "https://placehold.co/600x600/0a0a0a/DC2626?text=Premium+1", alt: "Atelier 1" }, caption: "" },
                  { image: { url: "https://placehold.co/600x600/0a0a0a/DC2626?text=Premium+2", alt: "Atelier 2" }, caption: "" },
                  { image: { url: "https://placehold.co/600x600/0a0a0a/DC2626?text=Premium+3", alt: "Atelier 3" }, caption: "" },
                  { image: { url: "https://placehold.co/600x600/0a0a0a/DC2626?text=Premium+4", alt: "Atelier 4" }, caption: "" },
                ],
              },
            },
          ],
        },
        {
          slug: "contact",
          title: "Contact",
          position: 40,
          blocks: [
            {
              type: "hero",
              position: 10,
              content: {
                headline: "Prendre rendez-vous",
                subheadline: "Décrivez-nous votre véhicule et ce dont il a besoin : nous vous rappelons sous 24 heures.",
                ctaLabel: "",
                ctaLink: { href: "", label: "" },
                heroVariant: "pageHeader",
              },
            },
            {
              type: "contact",
              position: 20,
              content: {
                title: "Prendre rendez-vous",
                description: "Un accueil personnalisé, sur rendez-vous uniquement.",
                email: "contact@exemple.fr",
                phone: "01 45 67 89 10",
                address: "78 avenue Foch, 75116 Paris",
                hours: "Lun-Ven : 8h-19h\nSam : 9h-17h",
                socialLinks: [{ platform: "Instagram", href: "https://instagram.com" }],
                showForm: true,
              },
            },
          ],
        },
      ],
    },
  },
  {
    slug: "speed-motors",
    name: "Speed Motors",
    description: "Un hero 3D immersif dédié aux véhicules de luxe et de sport.",
    category: "automobile",
    isPremium: false,
    schema: {
      blockTypes: blockTypeDefs,
      accentColor: "#2563EB",
      defaultBlocks: [
        {
          type: "hero",
          position: 10,
          content: {
            headline: "Votre voiture de prestige mérite le meilleur",
            subheadline: "Entretien, préparation et personnalisation pour véhicules de luxe et de sport.",
            ctaLabel: "Prendre rendez-vous",
            ctaLink: { href: "#contact", label: "Prendre rendez-vous" },
            heroVariant: "photoGallery3d",
            heroImages: [
              { url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&auto=format&fit=crop&q=60", alt: "Voiture de sport" },
              { url: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200&auto=format&fit=crop&q=60", alt: "Véhicule de luxe" },
              { url: "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=1200&auto=format&fit=crop&q=60", alt: "Intérieur de luxe" },
              { url: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1200&auto=format&fit=crop&q=60", alt: "Jante de sport" },
              { url: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&auto=format&fit=crop&q=60", alt: "Voiture de prestige" },
              { url: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&auto=format&fit=crop&q=60", alt: "Véhicule sportif" },
              { url: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&auto=format&fit=crop&q=60", alt: "Voiture de luxe de nuit" },
              { url: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=1200&auto=format&fit=crop&q=60", alt: "Détail carrosserie" },
            ],
          },
        },
        {
          type: "features",
          position: 20,
          content: {
            title: "Notre expertise",
            items: [
              { icon: "🏎️", title: "Véhicules de luxe & sport", description: "Une expertise dédiée aux marques premium : Porsche, Mercedes-AMG, BMW M…" },
              { icon: "🔧", title: "Techniciens spécialisés", description: "Formés aux spécificités des motorisations haute performance." },
              { icon: "💎", title: "Personnalisation sur-mesure", description: "Jantes, réglages, finitions — adaptez votre véhicule à votre image." },
              { icon: "🛡️", title: "Garantie constructeur préservée", description: "Toutes nos interventions respectent les préconisations d'origine." },
            ],
          },
        },
        {
          type: "gallery",
          position: 30,
          content: {
            title: "Notre atelier",
            images: [
              { image: { url: "https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=900&auto=format&fit=crop&q=60", alt: "Atelier spécialisé" }, caption: "" },
              { image: { url: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=900&auto=format&fit=crop&q=60", alt: "Intervention sur véhicule" }, caption: "" },
              { image: { url: "https://images.unsplash.com/photo-1494905998402-395d579af36f?w=900&auto=format&fit=crop&q=60", alt: "Véhicule en préparation" }, caption: "" },
            ],
          },
        },
        {
          type: "pricing",
          position: 40,
          content: {
            title: "Nos forfaits",
            plans: [
              { name: "Diagnostic expert", price: "89€", period: "", features: ["Lecture + rapport détaillé"], ctaLabel: "Réserver", highlighted: false },
              { name: "Entretien premium", price: "249€", period: "", features: ["Produits constructeur", "Contrôle 40 points"], ctaLabel: "Réserver", highlighted: true },
              { name: "Personnalisation", price: "Sur devis", period: "", features: ["Jantes, réglages, finitions"], ctaLabel: "Réserver", highlighted: false },
            ],
          },
        },
        {
          type: "contact",
          position: 50,
          content: {
            title: "Prendre rendez-vous",
            description: "Un accueil personnalisé pour votre véhicule d'exception.",
            email: "contact@exemple.fr",
            phone: "01 34 56 78 90",
            address: "12 route de Versailles, 78000 Versailles",
            hours: "Lun-Ven : 8h-18h30\nSam : 9h-13h",
            socialLinks: [{ platform: "Facebook", href: "https://facebook.com" }],
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
    slug: "atelier-classic-cars",
    name: "Atelier Classic Cars",
    description: "Quatre pages pour un atelier de collection : accueil, prestations, restaurations, contact.",
    category: "automobile",
    isPremium: true,
    schema: {
      blockTypes: blockTypeDefs,
      accentColor: "#14532D",
      mode: "dark",
      defaultBlocks: [
        {
          type: "hero",
          position: 10,
          content: {
            headline: "La passion des voitures d'exception",
            subheadline: "Restauration et entretien de véhicules de collection, dans les règles de l'art.",
            ctaLabel: "Nous confier votre véhicule",
            ctaLink: { href: "/contact", label: "Nous confier votre véhicule" },
            heroVariant: "spotlight",
          },
        },
        {
          type: "features",
          position: 20,
          content: {
            title: "Notre savoir-faire",
            items: [
              { icon: "🏛️", title: "Restauration complète", description: "De la mécanique à la sellerie, un savoir-faire artisanal." },
              { icon: "🔩", title: "Pièces d'origine", description: "Un réseau de fournisseurs spécialisés en pièces rares." },
              { icon: "📜", title: "Expertise & authentification", description: "Un accompagnement pour vos démarches de collection." },
              { icon: "🏆", title: "20 ans d'expérience", description: "Une équipe reconnue par les clubs de collectionneurs." },
            ],
          },
        },
        {
          type: "footer",
          position: 30,
          content: { text: "© 2026 — Fait avec Siteo", links: [] },
        },
      ],
      pages: [
        {
          slug: "prestations",
          title: "Prestations",
          position: 20,
          blocks: [
            {
              type: "hero",
              position: 10,
              content: {
                headline: "Prestations",
                subheadline: "De l'expertise avant achat à la restauration complète, châssis compris.",
                ctaLabel: "",
                ctaLink: { href: "", label: "" },
                heroVariant: "pageHeader",
              },
            },
            {
              type: "beforeAfter",
              position: 20,
              content: {
                title: "Le temps d'une restauration",
                description: "Glissez le curseur pour voir le véhicule avant et après son passage à l'atelier.",
                items: [
                  {
                    beforeImage: { url: "https://placehold.co/600x750/0a0a0a/14532D?text=Avant", alt: "Véhicule avant restauration" },
                    afterImage: { url: "https://placehold.co/600x750/14532D/0a0a0a?text=Apr%C3%A8s", alt: "Véhicule après restauration" },
                    label: "Restauration complète",
                  },
                ],
              },
            },
            {
              type: "pricing",
              position: 30,
              content: {
                ctaHref: "/contact",
                title: "Nos prestations",
                plans: [
                  { name: "Diagnostic complet", price: "120€", period: "", features: ["Rapport détaillé"], ctaLabel: "Nous contacter", highlighted: false },
                  { name: "Restauration sur-mesure", price: "Sur devis", period: "", features: ["Projet clé en main"], ctaLabel: "Nous contacter", highlighted: true },
                  { name: "Entretien annuel", price: "450€", period: "", features: ["Suivi personnalisé"], ctaLabel: "Nous contacter", highlighted: false },
                ],
              },
            },
          ],
        },
        {
          slug: "restaurations",
          title: "Restaurations",
          position: 30,
          blocks: [
            {
              type: "hero",
              position: 10,
              content: {
                headline: "Nos restaurations",
                subheadline: "Chaque voiture repart avec son dossier photo, étape par étape.",
                ctaLabel: "",
                ctaLink: { href: "", label: "" },
                heroVariant: "pageHeader",
              },
            },
            {
              type: "gallery",
              position: 20,
              content: {
                title: "Nos restaurations",
                images: [
                  { image: { url: "https://placehold.co/600x600/0a0a0a/14532D?text=Classic+1", alt: "Restauration 1" }, caption: "" },
                  { image: { url: "https://placehold.co/600x600/0a0a0a/14532D?text=Classic+2", alt: "Restauration 2" }, caption: "" },
                  { image: { url: "https://placehold.co/600x600/0a0a0a/14532D?text=Classic+3", alt: "Restauration 3" }, caption: "" },
                  { image: { url: "https://placehold.co/600x600/0a0a0a/14532D?text=Classic+4", alt: "Restauration 4" }, caption: "" },
                ],
              },
            },
          ],
        },
        {
          slug: "contact",
          title: "Contact",
          position: 40,
          blocks: [
            {
              type: "hero",
              position: 10,
              content: {
                headline: "Nous confier votre véhicule",
                subheadline: "Parlez-nous du modèle, de son état et de ce que vous voulez en faire.",
                ctaLabel: "",
                ctaLink: { href: "", label: "" },
                heroVariant: "pageHeader",
              },
            },
            {
              type: "contact",
              position: 20,
              content: {
                title: "Nous confier votre véhicule",
                description: "Chaque projet est unique, parlons-en.",
                email: "contact@exemple.fr",
                phone: "01 23 45 67 89",
                address: "5 chemin des Artisans, 69110 Sainte-Foy-lès-Lyon",
                hours: "Lun-Ven : 9h-18h, sur rendez-vous",
                socialLinks: [{ platform: "Instagram", href: "https://instagram.com" }],
                showForm: true,
              },
            },
          ],
        },
      ],
    },
  },
  {
    slug: "garage-de-quartier",
    name: "Garage de Quartier",
    description: "Une ambiance simple et rassurante, pour un garage familial de proximité.",
    category: "automobile",
    isPremium: false,
    schema: {
      blockTypes: blockTypeDefs,
      accentColor: "#475569",
      defaultBlocks: [
        {
          type: "hero",
          position: 10,
          content: {
            headline: "Votre garage de confiance, tout près de chez vous",
            subheadline: "Un entretien simple et honnête, pour toute la famille.",
            ctaLabel: "Prendre rendez-vous",
            ctaLink: { href: "#contact", label: "Prendre rendez-vous" },
            heroVariant: "blobs",
          },
        },
        {
          type: "features",
          position: 20,
          content: {
            title: "Nos services",
            items: [
              { icon: "🔧", title: "Entretien & révision", description: "Tous types de véhicules, toutes marques." },
              { icon: "🚙", title: "Dépannage", description: "Une intervention rapide en cas de panne." },
              { icon: "💬", title: "Conseils sans jargon", description: "On vous explique tout, simplement." },
              { icon: "🛡️", title: "Garage assuré & garanti", description: "Toutes nos réparations sont garanties, sans exception." },
            ],
          },
        },
        {
          type: "gallery",
          position: 30,
          content: {
            title: "Notre garage",
            images: [
              { image: { url: "https://placehold.co/600x600?text=Quartier+1", alt: "Le garage 1" }, caption: "" },
              { image: { url: "https://placehold.co/600x600?text=Quartier+2", alt: "Le garage 2" }, caption: "" },
              { image: { url: "https://placehold.co/600x600?text=Quartier+3", alt: "Le garage 3" }, caption: "" },
            ],
          },
        },
        {
          type: "pricing",
          position: 40,
          content: {
            title: "Nos tarifs",
            plans: [
              { name: "Contrôle gratuit", price: "Offert", period: "", features: ["15 min, sans engagement"], ctaLabel: "Réserver", highlighted: true },
              { name: "Révision", price: "99€", period: "", features: ["Vidange + contrôle"], ctaLabel: "Réserver", highlighted: false },
              { name: "Dépannage", price: "Sur devis", period: "", features: ["Intervention rapide"], ctaLabel: "Réserver", highlighted: false },
            ],
          },
        },
        {
          type: "contact",
          position: 50,
          content: {
            title: "Nous contacter",
            description: "Une équipe familiale à votre écoute depuis 20 ans.",
            email: "contact@exemple.fr",
            phone: "01 98 76 54 32",
            address: "34 rue des Artisans, 59000 Lille",
            hours: "Lun-Ven : 8h-18h\nSam : 8h30-12h",
            socialLinks: [{ platform: "Facebook", href: "https://facebook.com" }],
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
    slug: "artisan",
    name: "Artisan",
    description: "Pour les plombiers, électriciens, menuisiers et autres artisans.",
    category: "artisan",
    isPremium: false,
    schema: {
      blockTypes: blockTypeDefs,
      accentColor: "#EA580C",
      defaultBlocks: [
        {
          type: "hero",
          position: 10,
          content: {
            headline: "Un savoir-faire artisanal à votre service",
            subheadline: "Interventions rapides et soignées, près de chez vous.",
            ctaLabel: "Demander un devis gratuit",
            ctaLink: { href: "#contact", label: "Demander un devis gratuit" },
            heroVariant: "embers",
          },
        },
        {
          type: "features",
          position: 20,
          content: {
            title: "Nos interventions",
            items: [
              { icon: "🛠️", title: "Installation", description: "Pose et mise en service de vos équipements, aux normes en vigueur." },
              { icon: "🚨", title: "Dépannage", description: "Intervention en urgence, 7j/7, devis annoncé avant de commencer." },
              { icon: "🏠", title: "Rénovation", description: "Accompagnement de votre projet de A à Z, un seul interlocuteur." },
              { icon: "🛡️", title: "Assurance décennale", description: "Travaux couverts 10 ans, attestation fournie à chaque chantier." },
              { icon: "📋", title: "Devis détaillé", description: "Chaque poste chiffré ligne par ligne, gratuit et sans engagement." },
              { icon: "🤝", title: "Artisan de confiance", description: "Entreprise déclarée, SIRET et garanties communiqués sur demande." },
            ],
          },
        },
        {
          type: "gallery",
          position: 25,
          content: {
            title: "Nos chantiers",
            images: [
              { image: { url: "https://images.unsplash.com/photo-1601058268499-e52658b8bb88?w=900&auto=format&fit=crop&q=60", alt: "Artisan au travail" }, caption: "Le travail bien fait, sans raccourci" },
              { image: { url: "https://images.unsplash.com/photo-1779031242515-205111711b23?w=900&auto=format&fit=crop&q=60", alt: "Intervention en cours" }, caption: "Chantier préparé et protégé" },
              { image: { url: "https://images.unsplash.com/photo-1680798790180-540f147976d7?w=900&auto=format&fit=crop&q=60", alt: "Outillage professionnel" }, caption: "Un outillage professionnel" },
            ],
          },
        },
        {
          type: "beforeAfter",
          position: 28,
          content: {
            title: "Avant / Après",
            description: "Glissez le curseur pour voir la transformation.",
            items: [
              {
                beforeImage: { url: "https://placehold.co/600x750/E7E5E4/EA580C?text=Avant", alt: "Avant la rénovation" },
                afterImage: { url: "https://placehold.co/600x750/EA580C/FFFFFF?text=Apr%C3%A8s", alt: "Après la rénovation" },
                label: "Rénovation complète",
              },
              {
                beforeImage: { url: "https://placehold.co/600x750/E7E5E4/EA580C?text=Avant", alt: "Avant l'installation" },
                afterImage: { url: "https://placehold.co/600x750/EA580C/FFFFFF?text=Apr%C3%A8s", alt: "Après l'installation" },
                label: "Mise aux normes",
              },
            ],
          },
        },
        {
          type: "pricing",
          position: 30,
          content: {
            title: "Nos tarifs",
            plans: [
              { name: "Devis", price: "Gratuit", period: "", features: ["Déplacement offert", "Chiffrage détaillé", "Sans engagement"], ctaLabel: "Demander un devis", highlighted: true },
              { name: "Dépannage urgent", price: "Dès 80€", period: " / intervention", features: ["Intervention sous 24h", "Tarif annoncé avant travaux", "Pièces garanties"], ctaLabel: "Nous appeler", highlighted: false },
              { name: "Rénovation", price: "Sur devis", period: "", features: ["Projet clé en main", "Planning communiqué", "Garantie décennale"], ctaLabel: "Décrire mon projet", highlighted: false },
            ],
          },
        },
        {
          type: "contact",
          position: 40,
          content: {
            title: "Demander un devis",
            description: "Décrivez votre projet en quelques lignes — réponse sous 24h, déplacement et chiffrage gratuits.",
            email: "contact@exemple.fr",
            phone: "06 12 34 56 78",
            address: "Intervention dans un rayon de 30 km autour de Lille",
            hours: "Lun-Ven : 8h-19h\nSam : 9h-12h\nUrgences : 7j/7",
            socialLinks: [{ platform: "Facebook", href: "https://facebook.com" }],
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
    slug: "atelier-du-bois",
    name: "Atelier du Bois",
    description: "Une photo en fond de page pour un artisan menuisier passionné.",
    category: "artisan",
    isPremium: false,
    schema: {
      blockTypes: blockTypeDefs,
      accentColor: "#92400E",
      defaultBlocks: [
        {
          type: "hero",
          position: 10,
          content: {
            headline: "Le bois façonné avec passion",
            subheadline: "Menuiserie, ébénisterie et agencement sur-mesure, dans la tradition du travail bien fait.",
            ctaLabel: "Demander un devis",
            ctaLink: { href: "#contact", label: "Demander un devis" },
            heroVariant: "photoGallery3d",
            heroImages: [
              { url: "https://images.unsplash.com/photo-1601058268499-e52658b8bb88?w=1200&auto=format&fit=crop&q=60", alt: "Artisan menuisier au travail" },
              { url: "https://images.unsplash.com/photo-1779031242515-205111711b23?w=1200&auto=format&fit=crop&q=60", alt: "Travail du bois" },
              { url: "https://images.unsplash.com/photo-1680798790180-540f147976d7?w=1200&auto=format&fit=crop&q=60", alt: "L'établi de l'atelier" },
            ],
          },
        },
        {
          type: "features",
          position: 20,
          content: {
            title: "Notre savoir-faire",
            items: [
              { icon: "🪵", title: "Meubles sur-mesure", description: "Conçus et fabriqués dans notre atelier." },
              { icon: "🏠", title: "Agencement intérieur", description: "Cuisines, dressings, bibliothèques sur-mesure." },
              { icon: "🔨", title: "Restauration", description: "Redonnez vie à vos meubles anciens." },
            ],
          },
        },
        {
          type: "gallery",
          position: 30,
          content: {
            title: "Nos réalisations",
            images: [
              { image: { url: "https://images.unsplash.com/photo-1601058268499-e52658b8bb88?w=900&auto=format&fit=crop&q=60", alt: "Menuisier au travail" }, caption: "Chaque pièce façonnée à la main" },
              { image: { url: "https://images.unsplash.com/photo-1779031242515-205111711b23?w=900&auto=format&fit=crop&q=60", alt: "Travail du bois" }, caption: "Essences choisies une à une" },
              { image: { url: "https://images.unsplash.com/photo-1680798790180-540f147976d7?w=900&auto=format&fit=crop&q=60", alt: "L'établi de l'atelier" }, caption: "L'établi, où tout commence" },
            ],
          },
        },
        {
          type: "pricing",
          position: 40,
          content: {
            title: "Nos tarifs",
            plans: [
              { name: "Devis", price: "Gratuit", period: "", features: ["Sans engagement"], ctaLabel: "Demander un devis", highlighted: true },
              { name: "Meuble sur-mesure", price: "Sur devis", period: "", features: ["Étude + fabrication"], ctaLabel: "Demander un devis", highlighted: false },
              { name: "Restauration", price: "Dès 90€", period: "", features: ["Selon état du meuble"], ctaLabel: "Demander un devis", highlighted: false },
            ],
          },
        },
        {
          type: "contact",
          position: 50,
          content: {
            title: "Demander un devis",
            description: "Décrivez votre projet, on vous recontacte sous 48h.",
            email: "contact@exemple.fr",
            phone: "06 12 34 56 78",
            address: "Atelier à Angers — livraison régionale",
            hours: "Lun-Ven : 8h-18h, sur rendez-vous",
            socialLinks: [{ platform: "Instagram", href: "https://instagram.com" }],
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
    slug: "maitre-artisan",
    name: "Maître Artisan",
    description: "Quatre pages sobres — accueil, prestations, réalisations, contact — pour un artisan d'excellence.",
    category: "artisan",
    isPremium: true,
    featured: true,
    schema: {
      blockTypes: blockTypeDefs,
      accentColor: "#B8860B",
      mode: "dark",
      defaultBlocks: [
        {
          type: "hero",
          position: 10,
          content: {
            headline: "L'excellence artisanale, transmise depuis trois générations",
            subheadline: "Un savoir-faire d'exception au service de vos projets les plus exigeants.",
            ctaLabel: "Prendre contact",
            ctaLink: { href: "/contact", label: "Prendre contact" },
            heroVariant: "mesh",
          },
        },
        {
          type: "features",
          position: 20,
          content: {
            title: "Pourquoi nous choisir",
            items: [
              { icon: "🏆", title: "Savoir-faire reconnu", description: "Label Artisan d'Excellence, trois générations d'expérience." },
              { icon: "✨", title: "Finitions haut de gamme", description: "Chaque détail compte, chaque projet est unique." },
              { icon: "🤝", title: "Accompagnement sur-mesure", description: "De l'idée à la réalisation, un interlocuteur unique." },
            ],
          },
        },
        {
          type: "footer",
          position: 30,
          content: { text: "© 2026 — Fait avec Siteo", links: [] },
        },
      ],
      pages: [
        {
          slug: "prestations",
          title: "Prestations",
          position: 20,
          blocks: [
            {
              type: "hero",
              position: 10,
              content: {
                headline: "Prestations",
                subheadline: "L'étude de votre projet est offerte et sans engagement. Le devis suit sous huit jours.",
                ctaLabel: "",
                ctaLink: { href: "", label: "" },
                heroVariant: "pageHeader",
              },
            },
            {
              type: "pricing",
              position: 20,
              content: {
                ctaHref: "/contact",
                title: "Nos prestations",
                plans: [
                  { name: "Étude de projet", price: "Offerte", period: "", features: ["Sans engagement"], ctaLabel: "Prendre contact", highlighted: false },
                  { name: "Réalisation sur-mesure", price: "Sur devis", period: "", features: ["Accompagnement complet"], ctaLabel: "Prendre contact", highlighted: true },
                  { name: "Suivi & entretien", price: "Sur devis", period: "", features: ["Contrat annuel disponible"], ctaLabel: "Prendre contact", highlighted: false },
                ],
              },
            },
          ],
        },
        {
          slug: "realisations",
          title: "Réalisations",
          position: 30,
          blocks: [
            {
              type: "hero",
              position: 10,
              content: {
                headline: "Nos réalisations",
                subheadline: "Des chantiers récents, photographiés une fois terminés et les lieux remis en état.",
                ctaLabel: "",
                ctaLink: { href: "", label: "" },
                heroVariant: "pageHeader",
              },
            },
            {
              type: "gallery",
              position: 20,
              content: {
                title: "Nos réalisations d'exception",
                images: [
                  { image: { url: "https://placehold.co/600x600/0a0a0a/B8860B?text=Maitre+1", alt: "Réalisation 1" }, caption: "" },
                  { image: { url: "https://placehold.co/600x600/0a0a0a/B8860B?text=Maitre+2", alt: "Réalisation 2" }, caption: "" },
                  { image: { url: "https://placehold.co/600x600/0a0a0a/B8860B?text=Maitre+3", alt: "Réalisation 3" }, caption: "" },
                  { image: { url: "https://placehold.co/600x600/0a0a0a/B8860B?text=Maitre+4", alt: "Réalisation 4" }, caption: "" },
                ],
              },
            },
          ],
        },
        {
          slug: "contact",
          title: "Contact",
          position: 40,
          blocks: [
            {
              type: "hero",
              position: 10,
              content: {
                headline: "Prendre contact",
                subheadline: "Décrivez votre projet en quelques lignes : nous vous rappelons pour en parler.",
                ctaLabel: "",
                ctaLink: { href: "", label: "" },
                heroVariant: "pageHeader",
              },
            },
            {
              type: "contact",
              position: 20,
              content: {
                title: "Prendre contact",
                description: "Un rendez-vous à votre domicile ou en atelier.",
                email: "contact@exemple.fr",
                phone: "06 98 76 54 32",
                address: "Île-de-France et grand Paris",
                hours: "Lun-Sam : 8h-19h, sur rendez-vous",
                socialLinks: [
                  { platform: "Instagram", href: "https://instagram.com" },
                  { platform: "LinkedIn", href: "https://linkedin.com" },
                ],
                showForm: true,
              },
            },
          ],
        },
      ],
    },
  },
  {
    slug: "renovation-excellence",
    name: "Rénovation Excellence",
    description: "Quatre pages pour une entreprise de rénovation : accueil, prestations, chantiers, devis.",
    category: "artisan",
    isPremium: true,
    schema: {
      blockTypes: blockTypeDefs,
      accentColor: "#1E3A8A",
      mode: "dark",
      defaultBlocks: [
        {
          type: "hero",
          position: 10,
          content: {
            headline: "Vos projets de rénovation, entre expertes mains",
            subheadline: "Gros œuvre, second œuvre, rénovation complète — un seul interlocuteur, du début à la fin.",
            ctaLabel: "Demander une étude gratuite",
            ctaLink: { href: "/contact", label: "Demander une étude gratuite" },
            heroVariant: "beams",
          },
        },
        {
          type: "features",
          position: 20,
          content: {
            title: "Notre accompagnement",
            items: [
              { icon: "🏗️", title: "Rénovation complète", description: "Un chantier piloté de A à Z, sans mauvaise surprise." },
              { icon: "📐", title: "Étude & plans", description: "Une équipe d'architectes d'intérieur à votre écoute." },
              { icon: "✅", title: "Garantie décennale", description: "Tous nos travaux sont assurés et garantis." },
            ],
          },
        },
        {
          type: "footer",
          position: 30,
          content: { text: "© 2026 — Fait avec Siteo", links: [] },
        },
      ],
      pages: [
        {
          slug: "prestations",
          title: "Prestations",
          position: 20,
          blocks: [
            {
              type: "hero",
              position: 10,
              content: {
                headline: "Prestations",
                subheadline: "Un seul interlocuteur, du premier rendez-vous à la réception du chantier.",
                ctaLabel: "",
                ctaLink: { href: "", label: "" },
                heroVariant: "pageHeader",
              },
            },
            {
              type: "beforeAfter",
              position: 20,
              content: {
                title: "Avant / Après",
                description: "Glissez le curseur pour voir la transformation de nos chantiers.",
                items: [
                  {
                    beforeImage: { url: "https://placehold.co/600x750/0a0a0a/1E3A8A?text=Avant", alt: "Pièce avant rénovation" },
                    afterImage: { url: "https://placehold.co/600x750/1E3A8A/0a0a0a?text=Apr%C3%A8s", alt: "Pièce après rénovation" },
                    label: "Rénovation complète",
                  },
                  {
                    beforeImage: { url: "https://placehold.co/600x750/0a0a0a/1E3A8A?text=Avant", alt: "Cuisine avant rénovation" },
                    afterImage: { url: "https://placehold.co/600x750/1E3A8A/0a0a0a?text=Apr%C3%A8s", alt: "Cuisine après rénovation" },
                    label: "Rénovation cuisine",
                  },
                ],
              },
            },
            {
              type: "pricing",
              position: 30,
              content: {
                ctaHref: "/contact",
                title: "Nos accompagnements",
                plans: [
                  { name: "Étude gratuite", price: "Offerte", period: "", features: ["Visite + devis détaillé"], ctaLabel: "Réserver", highlighted: true },
                  { name: "Rénovation partielle", price: "Sur devis", period: "", features: ["Cuisine, salle de bain..."], ctaLabel: "Réserver", highlighted: false },
                  { name: "Rénovation complète", price: "Sur devis", period: "", features: ["Suivi de chantier inclus"], ctaLabel: "Réserver", highlighted: false },
                ],
              },
            },
          ],
        },
        {
          slug: "chantiers",
          title: "Chantiers",
          position: 30,
          blocks: [
            {
              type: "hero",
              position: 10,
              content: {
                headline: "Nos chantiers",
                subheadline: "Avant, pendant, après — les photos viennent de nos chantiers, pas d'une banque d'images.",
                ctaLabel: "",
                ctaLink: { href: "", label: "" },
                heroVariant: "pageHeader",
              },
            },
            {
              type: "gallery",
              position: 20,
              content: {
                title: "Chantiers réalisés",
                images: [
                  { image: { url: "https://placehold.co/600x600/0a0a0a/1E3A8A?text=Renovation+1", alt: "Chantier 1" }, caption: "" },
                  { image: { url: "https://placehold.co/600x600/0a0a0a/1E3A8A?text=Renovation+2", alt: "Chantier 2" }, caption: "" },
                  { image: { url: "https://placehold.co/600x600/0a0a0a/1E3A8A?text=Renovation+3", alt: "Chantier 3" }, caption: "" },
                  { image: { url: "https://placehold.co/600x600/0a0a0a/1E3A8A?text=Renovation+4", alt: "Chantier 4" }, caption: "" },
                ],
              },
            },
          ],
        },
        {
          slug: "contact",
          title: "Contact",
          position: 40,
          blocks: [
            {
              type: "hero",
              position: 10,
              content: {
                headline: "Demander un devis",
                subheadline: "Envoyez-nous vos plans ou quelques photos : le devis est gratuit et détaillé.",
                ctaLabel: "",
                ctaLink: { href: "", label: "" },
                heroVariant: "pageHeader",
              },
            },
            {
              type: "contact",
              position: 20,
              content: {
                title: "Demander une étude gratuite",
                description: "Un conseiller vous rappelle sous 24h.",
                email: "contact@exemple.fr",
                phone: "01 56 78 90 12",
                address: "Intervention en Île-de-France",
                hours: "Lun-Ven : 8h-19h",
                socialLinks: [{ platform: "LinkedIn", href: "https://linkedin.com" }],
                showForm: true,
              },
            },
          ],
        },
      ],
    },
  },
  {
    slug: "agence-nettoyage",
    name: "Agence de nettoyage",
    description: "Quatre pages pour une entreprise de propreté : prestations, avant/après, et prise de rendez-vous en ligne.",
    category: "artisan",
    isPremium: true,
    schema: {
      blockTypes: blockTypeDefs,
      accentColor: "#0891B2",
      defaultBlocks: [
        {
          type: "hero",
          position: 10,
          content: {
            headline: "Des locaux impeccables, sans que vous ayez à y penser",
            subheadline: "Bureaux, copropriétés, remises en état. Équipes formées, produits certifiés, planning tenu.",
            ctaLabel: "Planifier une intervention",
            ctaLink: { href: "/rendez-vous", label: "Planifier une intervention" },
            heroVariant: "linen",
          },
        },
        {
          type: "features",
          position: 20,
          content: {
            title: "Pourquoi nous confier vos locaux",
            items: [
              { icon: "🧽", title: "La même équipe", description: "Vos locaux sont toujours nettoyés par les mêmes personnes. Elles connaissent vos lieux, vos codes et vos horaires." },
              { icon: "📋", title: "Cahier des charges écrit", description: "Chaque poste est listé et coché à chaque passage. Vous savez exactement ce qui a été fait." },
              { icon: "🌿", title: "Produits écolabellisés", description: "Certifiés Ecolabel européen, sûrs pour vos équipes, vos sols et vos clients." },
            ],
          },
        },
        {
          type: "footer",
          position: 30,
          content: { text: "© 2026 — Fait avec Siteo", links: [] },
        },
      ],
      pages: [
        {
          slug: "prestations",
          title: "Prestations",
          position: 20,
          blocks: [
            {
              type: "hero",
              position: 10,
              content: {
                headline: "Prestations",
                subheadline: "Un contrat régulier ou une intervention ponctuelle : les deux se pilotent de la même façon.",
                ctaLabel: "",
                ctaLink: { href: "", label: "" },
                heroVariant: "pageHeader",
              },
            },
            {
              type: "pricing",
              position: 20,
              content: {
                ctaHref: "/rendez-vous",
                title: "Nos formules",
                plans: [
                  { name: "Bureaux", price: "Dès 22€", period: "/heure", features: ["Passage quotidien ou hebdomadaire", "Sanitaires, sols, points de contact", "Consommables fournis"], ctaLabel: "Planifier", highlighted: true },
                  { name: "Copropriétés", price: "Sur devis", period: "", features: ["Parties communes et local poubelles", "Sortie et rentrée des containers", "Registre de passage affiché"], ctaLabel: "Planifier", highlighted: false },
                  { name: "Remise en état", price: "Dès 35€", period: "/heure", features: ["Après travaux ou avant état des lieux", "Décapage, vitrerie, dépoussiérage fin", "Intervention en une seule fois"], ctaLabel: "Planifier", highlighted: false },
                ],
              },
            },
            {
              type: "features",
              position: 30,
              content: {
                title: "Ce qui est inclus, quelle que soit la formule",
                items: [
                  { icon: "🔑", title: "Gestion des accès", description: "Clés et badges conservés sous coffre, remise contre signature." },
                  { icon: "🛡️", title: "Personnel déclaré et assuré", description: "Contrats en règle, responsabilité civile professionnelle à jour." },
                  { icon: "🕗", title: "Hors de vos horaires", description: "Tôt le matin, tard le soir ou le week-end : vos équipes ne nous croisent pas." },
                  { icon: "📞", title: "Un seul interlocuteur", description: "Un responsable de secteur joignable, pas un standard." },
                ],
              },
            },
          ],
        },
        {
          slug: "resultats",
          title: "Résultats",
          position: 30,
          blocks: [
            {
              type: "hero",
              position: 10,
              content: {
                headline: "Avant / Après",
                subheadline: "Les photos viennent de nos chantiers. Glissez le curseur.",
                ctaLabel: "",
                ctaLink: { href: "", label: "" },
                heroVariant: "pageHeader",
              },
            },
            {
              type: "beforeAfter",
              position: 20,
              content: {
                title: "Nos interventions",
                description: "Glissez le curseur pour voir la différence.",
                items: [
                  {
                    beforeImage: { url: "https://placehold.co/600x750/E2E8F0/0891B2?text=Avant", alt: "Bureaux avant nettoyage" },
                    afterImage: { url: "https://placehold.co/600x750/0891B2/FFFFFF?text=Apr%C3%A8s", alt: "Bureaux après nettoyage" },
                    label: "Plateau de bureaux, 400 m²",
                  },
                  {
                    beforeImage: { url: "https://placehold.co/600x750/E2E8F0/0891B2?text=Avant", alt: "Hall d'immeuble avant nettoyage" },
                    afterImage: { url: "https://placehold.co/600x750/0891B2/FFFFFF?text=Apr%C3%A8s", alt: "Hall d'immeuble après nettoyage" },
                    label: "Hall de copropriété",
                  },
                  {
                    beforeImage: { url: "https://placehold.co/600x750/E2E8F0/0891B2?text=Avant", alt: "Appartement avant remise en état" },
                    afterImage: { url: "https://placehold.co/600x750/0891B2/FFFFFF?text=Apr%C3%A8s", alt: "Appartement après remise en état" },
                    label: "Remise en état après travaux",
                  },
                ],
              },
            },
            {
              type: "gallery",
              position: 30,
              content: {
                title: "Sur le terrain",
                images: [
                  { image: { url: "https://placehold.co/600x600/E2E8F0/0891B2?text=Vitrerie", alt: "Nettoyage de vitres" }, caption: "" },
                  { image: { url: "https://placehold.co/600x600/E2E8F0/0891B2?text=Sols", alt: "Entretien des sols" }, caption: "" },
                  { image: { url: "https://placehold.co/600x600/E2E8F0/0891B2?text=Sanitaires", alt: "Entretien des sanitaires" }, caption: "" },
                  { image: { url: "https://placehold.co/600x600/E2E8F0/0891B2?text=Equipe", alt: "L'équipe en intervention" }, caption: "" },
                ],
              },
            },
          ],
        },
        {
          slug: "rendez-vous",
          title: "Rendez-vous",
          position: 40,
          blocks: [
            {
              type: "hero",
              position: 10,
              content: {
                headline: "Planifier une intervention",
                subheadline: "La visite d'évaluation est gratuite et dure une demi-heure. Elle donne un devis chiffré, pas une fourchette.",
                ctaLabel: "",
                ctaLink: { href: "", label: "" },
                heroVariant: "pageHeader",
              },
            },
            {
              type: "appointment",
              position: 20,
              content: {
                title: "Choisir un créneau",
                description: "Sélectionnez la prestation et le jour : les créneaux encore libres s'affichent en direct.",
                notePlaceholder: "Surface, étage, code d'accès, contraintes horaires…",
                services: [
                  { name: "Visite d'évaluation", durationMinutes: 30, price: "Gratuite" },
                  { name: "Nettoyage de bureaux", durationMinutes: 120, price: "Dès 22€/h" },
                  { name: "Vitrerie", durationMinutes: 90, price: "Dès 28€/h" },
                  { name: "Remise en état après travaux", durationMinutes: 240, price: "Dès 35€/h" },
                ],
                hours: [
                  { day: 1, ranges: [{ start: "07:00", end: "12:00" }, { start: "13:00", end: "19:00" }] },
                  { day: 2, ranges: [{ start: "07:00", end: "12:00" }, { start: "13:00", end: "19:00" }] },
                  { day: 3, ranges: [{ start: "07:00", end: "12:00" }, { start: "13:00", end: "19:00" }] },
                  { day: 4, ranges: [{ start: "07:00", end: "12:00" }, { start: "13:00", end: "19:00" }] },
                  { day: 5, ranges: [{ start: "07:00", end: "12:00" }, { start: "13:00", end: "19:00" }] },
                  { day: 6, ranges: [{ start: "08:00", end: "13:00" }] },
                ],
                closedDates: [],
                staffCount: 3,
                slotStep: 30,
                noticeHours: 24,
                maxDaysAhead: 90,
                phone: "01 34 56 78 90",
                notifyEmail: "",
              },
            },
            {
              type: "contact",
              position: 30,
              content: {
                title: "Ou demandez un devis écrit",
                description: "Décrivez vos locaux et votre fréquence : le devis part sous 48h ouvrées.",
                email: "contact@exemple.fr",
                phone: "01 34 56 78 90",
                address: "Intervention en Île-de-France et Oise",
                hours: "Lun-Ven : 7h-19h\nSam : 8h-13h",
                socialLinks: [{ platform: "LinkedIn", href: "https://linkedin.com" }],
                showForm: true,
              },
            },
          ],
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
      accentColor: "#16A34A",
      defaultBlocks: [
        {
          type: "hero",
          position: 10,
          content: {
            headline: "Atteignez vos objectifs, accompagné·e par un coach",
            subheadline: "Un suivi personnalisé, en individuel ou en petit groupe. Première séance d'essai offerte.",
            ctaLabel: "Réserver une séance d'essai",
            ctaLink: { href: "#contact", label: "Réserver une séance d'essai" },
            heroVariant: "stream",
            heroImages: [
              { url: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=900&auto=format&fit=crop&q=60", alt: "Travail à la barre" },
              { url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&auto=format&fit=crop&q=60", alt: "Séance de coaching" },
              { url: "https://images.unsplash.com/photo-1758875568671-9fa1829fe1e3?w=900&auto=format&fit=crop&q=60", alt: "Parade sur charge lourde" },
              { url: "https://images.unsplash.com/photo-1520877745935-616158eb7fcc?w=900&auto=format&fit=crop&q=60", alt: "Étirement" },
              { url: "https://images.unsplash.com/photo-1639660299469-9e9279364c97?w=900&auto=format&fit=crop&q=60", alt: "Soulevé en salle" },
              { url: "https://images.unsplash.com/photo-1758599880788-e49f6ee77bc7?w=900&auto=format&fit=crop&q=60", alt: "Travail au sol" },
            ],
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
          type: "beforeAfter",
          position: 35,
          content: {
            title: "Des résultats concrets",
            description: "Glissez le curseur pour voir la progression de mes clients au fil du programme.",
            items: [
              {
                beforeImage: { url: "https://placehold.co/600x750/16A34A/ffffff?text=Avant", alt: "Avant le programme" },
                afterImage: { url: "https://placehold.co/600x750/14532D/ffffff?text=Apr%C3%A8s", alt: "Après le programme" },
                label: "Programme 8 semaines",
              },
              {
                beforeImage: { url: "https://placehold.co/600x750/16A34A/ffffff?text=Avant", alt: "Avant le suivi" },
                afterImage: { url: "https://placehold.co/600x750/14532D/ffffff?text=Apr%C3%A8s", alt: "Après le suivi" },
                label: "Suivi 3 mois",
              },
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
            phone: "06 98 76 54 32",
            address: "Séances en salle ou à domicile — Marseille et alentours",
            hours: "Lun-Sam : 7h-20h sur rendez-vous",
            socialLinks: [
              { platform: "Instagram", href: "https://instagram.com" },
              { platform: "TikTok", href: "https://tiktok.com" },
            ],
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
    slug: "coach-elite",
    name: "Coach Elite",
    description: "Quatre pages haute performance : accueil, programmes, résultats, contact.",
    category: "coach-sportif",
    isPremium: true,
    featured: true,
    schema: {
      blockTypes: blockTypeDefs,
      accentColor: "#06B6D4",
      mode: "dark",
      defaultBlocks: [
        {
          type: "hero",
          position: 10,
          content: {
            headline: "Dépassez vos limites, révélez votre potentiel",
            subheadline: "Un coaching haute performance, pour des résultats mesurables et durables.",
            ctaLabel: "Réserver un bilan gratuit",
            ctaLink: { href: "/contact", label: "Réserver un bilan gratuit" },
            heroVariant: "programRail",
            heroCards: [
              { image: { url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=700&h=950&fit=crop&auto=format&q=70", alt: "Séance de renforcement en salle" }, category: "Bilan", title: "Diagnostic complet" },
              { image: { url: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=700&h=950&fit=crop&auto=format&q=70", alt: "Travail de force à la barre" }, category: "Force", title: "Cycle force, 8 semaines" },
              { image: { url: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=700&h=950&fit=crop&auto=format&q=70", alt: "Course en extérieur" }, category: "Endurance", title: "Seuil et VMA" },
              { image: { url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=700&h=950&fit=crop&auto=format&q=70", alt: "Séance collective en petit groupe" }, category: "Tous niveaux", title: "Renforcement intégral" },
              { image: { url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=700&h=950&fit=crop&auto=format&q=70", alt: "Étirements et mobilité" }, category: "Récupération", title: "Mobilité et sommeil" },
            ],
          },
        },
        {
          type: "features",
          position: 20,
          content: {
            title: "Ma méthode",
            items: [
              { icon: "🎯", title: "Programme sur-mesure", description: "Basé sur vos objectifs et votre progression réelle." },
              { icon: "📊", title: "Suivi data", description: "Mesures, indicateurs de performance, ajustements continus." },
              { icon: "🔥", title: "Séances intensives", description: "Individuelles ou en petit groupe, format premium." },
            ],
          },
        },
        {
          type: "footer",
          position: 30,
          content: { text: "© 2026 — Fait avec Siteo", links: [] },
        },
      ],
      pages: [
        {
          slug: "programmes",
          title: "Programmes",
          position: 20,
          blocks: [
            {
              type: "hero",
              position: 10,
              content: {
                headline: "Programmes",
                subheadline: "Chaque programme démarre par un bilan d'une heure, offert et sans engagement.",
                ctaLabel: "",
                ctaLink: { href: "", label: "" },
                heroVariant: "pageHeader",
              },
            },
            {
              type: "pricing",
              position: 20,
              content: {
                ctaHref: "/contact",
                title: "Mes formules élite",
                plans: [
                  { name: "Bilan complet", price: "Offert", period: "", features: ["1h de diagnostic"], ctaLabel: "Réserver", highlighted: false },
                  { name: "Coaching Elite", price: "280€", period: "", features: ["8 séances + suivi nutrition"], ctaLabel: "Réserver", highlighted: true },
                  { name: "Suivi mensuel illimité", price: "450€", period: "/mois", features: ["Accès prioritaire"], ctaLabel: "Réserver", highlighted: false },
                ],
              },
            },
          ],
        },
        {
          slug: "resultats",
          title: "Résultats",
          position: 30,
          blocks: [
            {
              type: "hero",
              position: 10,
              content: {
                headline: "Résultats",
                subheadline: "Des transformations mesurées, sur des personnes qui n'avaient pas plus de temps que vous.",
                ctaLabel: "",
                ctaLink: { href: "", label: "" },
                heroVariant: "pageHeader",
              },
            },
            {
              type: "beforeAfter",
              position: 20,
              content: {
                title: "La performance, mesurée",
                description: "Glissez le curseur pour voir la transformation de nos athlètes.",
                items: [
                  {
                    beforeImage: { url: "https://placehold.co/600x750/0a0a0a/06B6D4?text=Avant", alt: "Avant le programme Elite" },
                    afterImage: { url: "https://placehold.co/600x750/06B6D4/0a0a0a?text=Apr%C3%A8s", alt: "Après le programme Elite" },
                    label: "Coaching Elite — 8 séances",
                  },
                  {
                    beforeImage: { url: "https://placehold.co/600x750/0a0a0a/06B6D4?text=Avant", alt: "Avant le suivi mensuel" },
                    afterImage: { url: "https://placehold.co/600x750/06B6D4/0a0a0a?text=Apr%C3%A8s", alt: "Après le suivi mensuel" },
                    label: "Suivi mensuel illimité",
                  },
                ],
              },
            },
            {
              type: "gallery",
              position: 30,
              content: {
                title: "En pleine action",
                images: [
                  { image: { url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&auto=format&fit=crop&q=60", alt: "Séance collective" }, caption: "" },
                  { image: { url: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&auto=format&fit=crop&q=60", alt: "Travail de force" }, caption: "" },
                  { image: { url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&auto=format&fit=crop&q=60", alt: "Entraînement en salle" }, caption: "" },
                  { image: { url: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=900&auto=format&fit=crop&q=60", alt: "Fin de séance" }, caption: "" },
                ],
              },
            },
          ],
        },
        {
          slug: "contact",
          title: "Contact",
          position: 40,
          blocks: [
            {
              type: "hero",
              position: 10,
              content: {
                headline: "On commence quand ?",
                subheadline: "Dites-moi votre objectif et vos disponibilités — je réponds sous 24 heures.",
                ctaLabel: "",
                ctaLink: { href: "", label: "" },
                heroVariant: "pageHeader",
              },
            },
            {
              type: "contact",
              position: 20,
              content: {
                title: "Réserver un bilan gratuit",
                description: "Premier échange offert, sans engagement.",
                email: "contact@exemple.fr",
                phone: "06 11 22 33 44",
                address: "Studio privé — Paris 8e",
                hours: "Lun-Sam : 6h-21h sur rendez-vous",
                socialLinks: [{ platform: "Instagram", href: "https://instagram.com" }],
                showForm: true,
              },
            },
          ],
        },
      ],
    },
  },
  {
    slug: "studio-zen-fitness",
    name: "Studio Zen Fitness",
    description: "Une photo en fond de page pour un coaching doux et apaisant.",
    category: "coach-sportif",
    isPremium: false,
    schema: {
      blockTypes: blockTypeDefs,
      accentColor: "#0D9488",
      defaultBlocks: [
        {
          type: "hero",
          position: 10,
          content: {
            headline: "Retrouvez l'équilibre entre corps et esprit",
            subheadline: "Coaching doux, yoga et respiration, pour progresser sans se brusquer.",
            ctaLabel: "Réserver une séance",
            ctaLink: { href: "#contact", label: "Réserver une séance" },
            backgroundImage: {
              url: "https://images.unsplash.com/photo-1761035190790-aa1a3472f7fc?w=1800&auto=format&fit=crop&q=70",
              alt: "La salle, avant le cours",
            },
          },
        },
        {
          type: "features",
          position: 20,
          content: {
            title: "Mes séances",
            items: [
              { icon: "🧘", title: "Yoga & étirements", description: "Des séances douces pour gagner en mobilité." },
              { icon: "🌬️", title: "Respiration & relaxation", description: "Des techniques pour gérer le stress au quotidien." },
              { icon: "💪", title: "Renforcement doux", description: "Un renforcement progressif, adapté à votre rythme." },
            ],
          },
        },
        {
          type: "gallery",
          position: 30,
          content: {
            title: "Nos séances",
            images: [
              { image: { url: "https://placehold.co/600x600?text=Zen+1", alt: "Séance 1" }, caption: "" },
              { image: { url: "https://placehold.co/600x600?text=Zen+2", alt: "Séance 2" }, caption: "" },
              { image: { url: "https://placehold.co/600x600?text=Zen+3", alt: "Séance 3" }, caption: "" },
            ],
          },
        },
        {
          type: "beforeAfter",
          position: 35,
          content: {
            title: "Une évolution en douceur",
            description: "Glissez le curseur pour voir le chemin parcouru, séance après séance.",
            items: [
              {
                beforeImage: { url: "https://placehold.co/600x750/0D9488/ffffff?text=Avant", alt: "Avant les premières séances" },
                afterImage: { url: "https://placehold.co/600x750/134e4a/ffffff?text=Apr%C3%A8s", alt: "Après quelques semaines" },
                label: "Mobilité & posture, 6 semaines",
              },
            ],
          },
        },
        {
          type: "pricing",
          position: 40,
          content: {
            title: "Mes formules",
            plans: [
              { name: "Séance découverte", price: "15€", period: "", features: ["45 min"], ctaLabel: "Réserver", highlighted: false },
              { name: "Pack 5 séances", price: "120€", period: "", features: ["Suivi personnalisé"], ctaLabel: "Réserver", highlighted: true },
              { name: "Abonnement mensuel", price: "89€", period: "/mois", features: ["2 séances par semaine"], ctaLabel: "Réserver", highlighted: false },
            ],
          },
        },
        {
          type: "contact",
          position: 50,
          content: {
            title: "Réserver une séance",
            description: "En studio ou en extérieur, selon la météo.",
            email: "contact@exemple.fr",
            phone: "06 22 33 44 55",
            address: "Studio au Jardin des Plantes, 75005 Paris",
            hours: "Lun-Ven : 7h-20h, Sam : 9h-13h",
            socialLinks: [{ platform: "Instagram", href: "https://instagram.com" }],
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
    slug: "performance-lab",
    name: "Performance Lab",
    description: "Quatre pages futuristes : accueil, programmes, résultats, contact.",
    category: "coach-sportif",
    isPremium: true,
    schema: {
      blockTypes: blockTypeDefs,
      accentColor: "#EA580C",
      mode: "dark",
      defaultBlocks: [
        {
          type: "hero",
          position: 10,
          content: {
            headline: "L'entraînement sans compromis",
            subheadline: "Un laboratoire de performance pour athlètes exigeants et sportifs déterminés.",
            ctaLabel: "Démarrer mon programme",
            ctaLink: { href: "/contact", label: "Démarrer mon programme" },
            heroVariant: "telemetry",
          },
        },
        {
          type: "features",
          position: 20,
          content: {
            title: "Le programme",
            items: [
              { icon: "🏋️", title: "Musculation & force", description: "Programmes de force basés sur la science du mouvement." },
              { icon: "⚡", title: "Préparation physique", description: "Explosivité, endurance, prévention des blessures." },
              { icon: "🥩", title: "Nutrition sportive", description: "Un plan alimentaire adapté à vos objectifs de performance." },
            ],
          },
        },
        {
          type: "footer",
          position: 30,
          content: { text: "© 2026 — Fait avec Siteo", links: [] },
        },
      ],
      pages: [
        {
          slug: "programmes",
          title: "Programmes",
          position: 20,
          blocks: [
            {
              type: "hero",
              position: 10,
              content: {
                headline: "Programmes",
                subheadline: "Force, préparation physique, nutrition : trois axes, un seul plan.",
                ctaLabel: "",
                ctaLink: { href: "", label: "" },
                heroVariant: "pageHeader",
              },
            },
            {
              type: "pricing",
              position: 20,
              content: {
                ctaHref: "/contact",
                title: "Mes programmes",
                plans: [
                  { name: "Évaluation physique", price: "39€", period: "", features: ["Tests + rapport"], ctaLabel: "Réserver", highlighted: false },
                  { name: "Programme Performance", price: "320€", period: "", features: ["12 séances + suivi nutrition"], ctaLabel: "Réserver", highlighted: true },
                  { name: "Prépa compétition", price: "Sur devis", period: "", features: ["Accompagnement complet"], ctaLabel: "Réserver", highlighted: false },
                ],
              },
            },
          ],
        },
        {
          slug: "resultats",
          title: "Résultats",
          position: 30,
          blocks: [
            {
              type: "hero",
              position: 10,
              content: {
                headline: "Les résultats du Lab",
                subheadline: "Chiffres avant, chiffres après. Rien d'autre.",
                ctaLabel: "",
                ctaLink: { href: "", label: "" },
                heroVariant: "pageHeader",
              },
            },
            {
              type: "beforeAfter",
              position: 20,
              content: {
                title: "Les résultats du Lab",
                description: "Glissez le curseur pour voir la progression après un cycle complet.",
                items: [
                  {
                    beforeImage: { url: "https://placehold.co/600x750/0a0a0a/EA580C?text=Avant", alt: "Avant le programme Performance" },
                    afterImage: { url: "https://placehold.co/600x750/EA580C/0a0a0a?text=Apr%C3%A8s", alt: "Après le programme Performance" },
                    label: "Programme Performance — 12 séances",
                  },
                  {
                    beforeImage: { url: "https://placehold.co/600x750/0a0a0a/EA580C?text=Avant", alt: "Avant la préparation compétition" },
                    afterImage: { url: "https://placehold.co/600x750/EA580C/0a0a0a?text=Apr%C3%A8s", alt: "Après la préparation compétition" },
                    label: "Prépa compétition",
                  },
                ],
              },
            },
            {
              type: "gallery",
              position: 30,
              content: {
                title: "Le Lab",
                images: [
                  { image: { url: "https://placehold.co/600x600/0a0a0a/EA580C?text=Lab+1", alt: "Séance 1" }, caption: "" },
                  { image: { url: "https://placehold.co/600x600/0a0a0a/EA580C?text=Lab+2", alt: "Séance 2" }, caption: "" },
                  { image: { url: "https://placehold.co/600x600/0a0a0a/EA580C?text=Lab+3", alt: "Séance 3" }, caption: "" },
                  { image: { url: "https://placehold.co/600x600/0a0a0a/EA580C?text=Lab+4", alt: "Séance 4" }, caption: "" },
                ],
              },
            },
          ],
        },
        {
          slug: "contact",
          title: "Contact",
          position: 40,
          blocks: [
            {
              type: "hero",
              position: 10,
              content: {
                headline: "Rejoindre le Lab",
                subheadline: "Une évaluation physique d'abord, un programme ensuite.",
                ctaLabel: "",
                ctaLink: { href: "", label: "" },
                heroVariant: "pageHeader",
              },
            },
            {
              type: "contact",
              position: 20,
              content: {
                title: "Démarrer mon programme",
                description: "Réservé aux sportifs motivés — premier contact obligatoire.",
                email: "contact@exemple.fr",
                phone: "06 33 44 55 66",
                address: "Salle privée — Lyon 3e",
                hours: "Lun-Sam : 6h-22h sur rendez-vous",
                socialLinks: [{ platform: "Instagram", href: "https://instagram.com" }],
                showForm: true,
              },
            },
          ],
        },
      ],
    },
  },
  {
    slug: "coaching-nature",
    name: "Coaching Nature",
    description: "Une ambiance vivante et naturelle, pour un coaching sportif en extérieur.",
    category: "coach-sportif",
    isPremium: false,
    schema: {
      blockTypes: blockTypeDefs,
      accentColor: "#4D7C0F",
      defaultBlocks: [
        {
          type: "hero",
          position: 10,
          content: {
            headline: "Le sport comme il devrait être : en pleine nature",
            subheadline: "Séances en extérieur, au contact du vivant, pour se reconnecter à l'essentiel.",
            ctaLabel: "Réserver une séance",
            ctaLink: { href: "#contact", label: "Réserver une séance" },
            heroVariant: "ridges",
          },
        },
        {
          type: "features",
          position: 20,
          content: {
            title: "Mes séances",
            items: [
              { icon: "🌳", title: "Séances en extérieur", description: "Parcs, forêts, bord de mer — la nature comme terrain de jeu." },
              { icon: "🏃", title: "Cardio & renforcement", description: "Un entraînement complet, sans matériel superflu." },
              { icon: "👥", title: "Petits groupes", description: "Une dynamique conviviale, en groupe de 4 à 8 personnes." },
            ],
          },
        },
        {
          type: "gallery",
          position: 30,
          content: {
            title: "En pleine nature",
            images: [
              { image: { url: "https://placehold.co/600x600?text=Nature+1", alt: "Séance 1" }, caption: "" },
              { image: { url: "https://placehold.co/600x600?text=Nature+2", alt: "Séance 2" }, caption: "" },
              { image: { url: "https://placehold.co/600x600?text=Nature+3", alt: "Séance 3" }, caption: "" },
            ],
          },
        },
        {
          type: "beforeAfter",
          position: 35,
          content: {
            title: "Le groupe progresse ensemble",
            description: "Glissez le curseur pour voir l'évolution du groupe au fil des séances.",
            items: [
              {
                beforeImage: { url: "https://placehold.co/600x750/4D7C0F/ffffff?text=Avant", alt: "Avant les premières séances" },
                afterImage: { url: "https://placehold.co/600x750/365314/ffffff?text=Apr%C3%A8s", alt: "Après un cycle de séances" },
                label: "Pack 10 séances",
              },
            ],
          },
        },
        {
          type: "pricing",
          position: 40,
          content: {
            title: "Mes formules",
            plans: [
              { name: "Séance à l'unité", price: "18€", period: "", features: ["1h en groupe"], ctaLabel: "Réserver", highlighted: false },
              { name: "Pack 10 séances", price: "150€", period: "", features: ["Valable 3 mois"], ctaLabel: "Réserver", highlighted: true },
              { name: "Abonnement illimité", price: "79€", period: "/mois", features: ["Accès à toutes les séances"], ctaLabel: "Réserver", highlighted: false },
            ],
          },
        },
        {
          type: "contact",
          position: 50,
          content: {
            title: "Réserver une séance",
            description: "Séances tous les jours, selon la météo.",
            email: "contact@exemple.fr",
            phone: "06 44 55 66 77",
            address: "Rendez-vous au Parc de la Tête d'Or, Lyon",
            hours: "Tous les jours : 7h-19h",
            socialLinks: [
              { platform: "Instagram", href: "https://instagram.com" },
              { platform: "Facebook", href: "https://facebook.com" },
            ],
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
      accentColor: "#7C3AED",
      defaultBlocks: [
        {
          type: "hero",
          position: 10,
          content: {
            headline: "Des souvenirs qui vous ressemblent",
            subheadline: "Photographe indépendant — mariage, portrait, corporate.",
            ctaLabel: "Découvrir mon travail",
            ctaLink: { href: "#contact", label: "Découvrir mon travail" },
            heroVariant: "sparkles",
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
            phone: "06 45 67 89 01",
            address: "Studio à Nantes — déplacements possibles",
            hours: "Sur rendez-vous, 7j/7",
            socialLinks: [
              { platform: "Instagram", href: "https://instagram.com" },
              { platform: "LinkedIn", href: "https://linkedin.com" },
            ],
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
    slug: "photographe-studio",
    name: "Photographe — Studio noir",
    description: "Quatre pages sombres et immersives : accueil, prestations, portfolio, contact.",
    category: "photographe",
    isPremium: true,
    featured: true,
    schema: {
      blockTypes: blockTypeDefs,
      accentColor: "#D4A24C",
      mode: "dark",
      defaultBlocks: [
        {
          type: "hero",
          position: 10,
          content: {
            headline: "L'émotion, capturée avec précision",
            subheadline: "Photographe indépendant — mariage, portrait, corporate. Un regard singulier sur chaque histoire.",
            ctaLabel: "Voir le portfolio",
            ctaLink: { href: "/portfolio", label: "Voir le portfolio" },
            heroVariant: "spotlight",
          },
        },
        {
          type: "features",
          position: 20,
          content: {
            title: "Trois façons de travailler ensemble",
            items: [
              { icon: "💍", title: "Mariage", description: "Un reportage discret et complet, de la préparation à la dernière danse." },
              { icon: "📸", title: "Portrait", description: "En studio ou en lumière naturelle, une séance à votre rythme." },
              { icon: "🏢", title: "Corporate", description: "Une image professionnelle et cohérente pour toute votre équipe." },
            ],
          },
        },
        {
          type: "gallery",
          position: 30,
          content: {
            title: "Un aperçu",
            variant: "grid",
            images: [
              { image: { url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&auto=format&fit=crop&q=60", alt: "Mariage" }, caption: "" },
              { image: { url: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=900&auto=format&fit=crop&q=60", alt: "Portrait en lumière naturelle" }, caption: "" },
              { image: { url: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=900&auto=format&fit=crop&q=60", alt: "Portrait noir et blanc" }, caption: "" },
              { image: { url: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=900&auto=format&fit=crop&q=60", alt: "Portrait corporate" }, caption: "" },
            ],
          },
        },
        {
          type: "footer",
          position: 40,
          content: { text: "© 2026 — Fait avec Siteo", links: [] },
        },
      ],
      pages: [
        {
          slug: "prestations",
          title: "Prestations",
          position: 20,
          blocks: [
            {
              type: "hero",
              position: 10,
              content: {
                headline: "Prestations",
                subheadline: "Chaque projet commence par un échange : je vous propose ensuite la formule qui correspond vraiment à votre besoin.",
                ctaLabel: "",
                ctaLink: { href: "", label: "" },
                heroVariant: "pageHeader",
              },
            },
            {
              type: "features",
              position: 20,
              content: {
                title: "Ce que je photographie",
                items: [
                  { icon: "💍", title: "Mariage", description: "Reportage complet ou demi-journée, avec repérage du lieu la veille si besoin." },
                  { icon: "📸", title: "Portrait", description: "Portrait individuel, famille ou book professionnel, en studio ou en extérieur." },
                  { icon: "🏢", title: "Corporate", description: "Portraits d'équipe, reportage d'entreprise et images pour votre communication." },
                ],
              },
            },
            {
              type: "pricing",
              position: 30,
              content: {
                ctaHref: "/contact",
                title: "Mes formules",
                plans: [
                  { name: "Séance portrait", price: "180€", period: "", features: ["1h30 de séance", "25 photos retouchées", "Galerie privée en ligne"], ctaLabel: "Réserver", highlighted: false },
                  { name: "Reportage mariage", price: "1500€", period: "", features: ["Journée complète", "Repérage du lieu offert", "Galerie privée en ligne", "300 photos minimum"], ctaLabel: "Réserver", highlighted: true },
                  { name: "Shooting corporate", price: "350€", period: "", features: ["Équipe jusqu'à 10 personnes", "Retouches incluses", "Livraison sous 5 jours"], ctaLabel: "Réserver", highlighted: false },
                ],
              },
            },
          ],
        },
        {
          slug: "portfolio",
          title: "Portfolio",
          position: 30,
          blocks: [
            {
              type: "hero",
              position: 10,
              content: {
                headline: "Portfolio",
                subheadline: "Une sélection de séances récentes.",
                ctaLabel: "",
                ctaLink: { href: "", label: "" },
                heroVariant: "pageHeader",
                backgroundImage: { url: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1600&auto=format&fit=crop&q=60", alt: "" },
              },
            },
            {
              type: "gallery",
              position: 20,
              content: {
                title: "",
                variant: "gallery3d",
                images: [
                  { image: { url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=900&auto=format&fit=crop&q=60", alt: "Portrait studio" }, caption: "" },
                  { image: { url: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=900&auto=format&fit=crop&q=60", alt: "Portrait lumière naturelle" }, caption: "" },
                  { image: { url: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=900&auto=format&fit=crop&q=60", alt: "Portrait noir et blanc" }, caption: "" },
                  { image: { url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=900&auto=format&fit=crop&q=60", alt: "Portrait extérieur" }, caption: "" },
                  { image: { url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=900&auto=format&fit=crop&q=60", alt: "Mariage" }, caption: "" },
                  { image: { url: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=900&auto=format&fit=crop&q=60", alt: "Mariage détail" }, caption: "" },
                  { image: { url: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=900&auto=format&fit=crop&q=60", alt: "Portrait corporate" }, caption: "" },
                  { image: { url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=900&auto=format&fit=crop&q=60", alt: "Portrait studio 2" }, caption: "" },
                ],
              },
            },
          ],
        },
        {
          slug: "contact",
          title: "Contact",
          position: 40,
          blocks: [
            {
              type: "hero",
              position: 10,
              content: {
                headline: "Parlons de votre projet",
                subheadline: "Dites-moi la date, le lieu et ce que vous avez en tête — je réponds sous 48h.",
                ctaLabel: "",
                ctaLink: { href: "", label: "" },
                heroVariant: "pageHeader",
              },
            },
            {
              type: "contact",
              position: 20,
              content: {
                title: "Me contacter",
                description: "Parlez-moi de votre projet, je réponds sous 48h.",
                email: "contact@exemple.fr",
                phone: "06 45 67 89 01",
                address: "Studio à Nantes — déplacements possibles",
                hours: "Sur rendez-vous, 7j/7",
                socialLinks: [
                  { platform: "Instagram", href: "https://instagram.com" },
                  { platform: "LinkedIn", href: "https://linkedin.com" },
                ],
                showForm: true,
              },
            },
          ],
        },
      ],
    },
  },
  {
    slug: "studio-lumiere",
    name: "Studio Lumière",
    description: "Une photo en fond de page pour un photographe accessible et polyvalent.",
    category: "photographe",
    isPremium: false,
    schema: {
      blockTypes: blockTypeDefs,
      accentColor: "#D97706",
      defaultBlocks: [
        {
          type: "hero",
          position: 10,
          content: {
            headline: "Chaque lumière raconte une histoire",
            subheadline: "Photographe professionnel — portraits, événements, création artistique.",
            ctaLabel: "Voir mon travail",
            ctaLink: { href: "#contact", label: "Voir mon travail" },
            heroVariant: "photoGallery3d",
            heroImages: [
              { url: "https://images.unsplash.com/photo-1500051638674-ff996a0ec29e?w=1200&auto=format&fit=crop&q=60", alt: "Photographe en plein travail" },
              { url: "https://images.unsplash.com/photo-1767130298927-2df12c33e5d6?w=1200&auto=format&fit=crop&q=60", alt: "Le studio et son éclairage" },
              { url: "https://images.unsplash.com/photo-1736580602821-a829279aac5d?w=1200&auto=format&fit=crop&q=60", alt: "Lumière douce en studio" },
            ],
          },
        },
        {
          type: "features",
          position: 20,
          content: {
            title: "Mes prestations",
            items: [
              { icon: "📷", title: "Portrait & studio", description: "Des séances pensées pour révéler votre personnalité." },
              { icon: "🎉", title: "Événements", description: "Mariages, anniversaires, moments de vie à immortaliser." },
              { icon: "🖼️", title: "Tirages d'art", description: "Impressions haut de gamme, encadrement sur demande." },
            ],
          },
        },
        {
          type: "gallery",
          position: 30,
          content: {
            title: "Portfolio",
            images: [
              { image: { url: "https://placehold.co/600x600?text=Lumiere+1", alt: "Photo 1" }, caption: "" },
              { image: { url: "https://placehold.co/600x600?text=Lumiere+2", alt: "Photo 2" }, caption: "" },
              { image: { url: "https://placehold.co/600x600?text=Lumiere+3", alt: "Photo 3" }, caption: "" },
              { image: { url: "https://placehold.co/600x600?text=Lumiere+4", alt: "Photo 4" }, caption: "" },
            ],
          },
        },
        {
          type: "pricing",
          position: 40,
          content: {
            title: "Mes formules",
            plans: [
              { name: "Séance portrait", price: "120€", period: "", features: ["45 min", "15 photos retouchées"], ctaLabel: "Réserver", highlighted: false },
              { name: "Reportage événement", price: "450€", period: "", features: ["Demi-journée", "Galerie en ligne"], ctaLabel: "Réserver", highlighted: true },
              { name: "Tirage d'art", price: "Dès 35€", period: "", features: ["Formats variés"], ctaLabel: "Réserver", highlighted: false },
            ],
          },
        },
        {
          type: "contact",
          position: 50,
          content: {
            title: "Voir mon travail",
            description: "Réponse sous 24h, devis personnalisé.",
            email: "contact@exemple.fr",
            phone: "06 55 66 77 88",
            address: "Studio à Toulouse — déplacements possibles",
            hours: "Sur rendez-vous, 7j/7",
            socialLinks: [{ platform: "Instagram", href: "https://instagram.com" }],
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
    slug: "portrait-signature",
    name: "Portrait Signature",
    description: "Quatre pages signature : accueil, prestations, portfolio, contact.",
    category: "photographe",
    isPremium: true,
    schema: {
      blockTypes: blockTypeDefs,
      accentColor: "#A21CAF",
      mode: "dark",
      defaultBlocks: [
        {
          type: "hero",
          position: 10,
          content: {
            headline: "Un regard qui sublime chaque instant",
            subheadline: "Photographe d'exception — portraits d'art, éditorial, mariages haut de gamme.",
            ctaLabel: "Découvrir mon univers",
            ctaLink: { href: "/contact", label: "Découvrir mon univers" },
            heroVariant: "bokeh",
          },
        },
        {
          type: "features",
          position: 20,
          content: {
            title: "Mon univers",
            items: [
              { icon: "✨", title: "Portrait signature", description: "Une direction artistique unique, pensée pour chaque client." },
              { icon: "💎", title: "Mariages haut de gamme", description: "Un reportage complet, discret et élégant." },
              { icon: "🖤", title: "Édition limitée", description: "Tirages d'art en édition limitée et signée." },
            ],
          },
        },
        {
          type: "footer",
          position: 30,
          content: { text: "© 2026 — Fait avec Siteo", links: [] },
        },
      ],
      pages: [
        {
          slug: "prestations",
          title: "Prestations",
          position: 20,
          blocks: [
            {
              type: "hero",
              position: 10,
              content: {
                headline: "Prestations",
                subheadline: "Séance signature, mariage, tirage d'art — la direction artistique est comprise dans chaque formule.",
                ctaLabel: "",
                ctaLink: { href: "", label: "" },
                heroVariant: "pageHeader",
              },
            },
            {
              type: "pricing",
              position: 20,
              content: {
                ctaHref: "/contact",
                title: "Mes formules signature",
                plans: [
                  { name: "Séance Signature", price: "280€", period: "", features: ["2h", "30 photos retouchées haute couture"], ctaLabel: "Réserver", highlighted: false },
                  { name: "Mariage Prestige", price: "2200€", period: "", features: ["Journée complète", "Album photo inclus"], ctaLabel: "Réserver", highlighted: true },
                  { name: "Édition limitée", price: "Sur devis", period: "", features: ["Tirage encadré, pièce unique"], ctaLabel: "Réserver", highlighted: false },
                ],
              },
            },
          ],
        },
        {
          slug: "portfolio",
          title: "Portfolio",
          position: 30,
          blocks: [
            {
              type: "hero",
              position: 10,
              content: {
                headline: "Portfolio",
                subheadline: "Une sélection de séances récentes, tirées en édition limitée.",
                ctaLabel: "",
                ctaLink: { href: "", label: "" },
                heroVariant: "pageHeader",
              },
            },
            {
              type: "gallery",
              position: 20,
              content: {
                title: "Galerie signature",
                images: [
                  { image: { url: "https://placehold.co/600x600/0a0a0a/A21CAF?text=Signature+1", alt: "Photo 1" }, caption: "" },
                  { image: { url: "https://placehold.co/600x600/0a0a0a/A21CAF?text=Signature+2", alt: "Photo 2" }, caption: "" },
                  { image: { url: "https://placehold.co/600x600/0a0a0a/A21CAF?text=Signature+3", alt: "Photo 3" }, caption: "" },
                  { image: { url: "https://placehold.co/600x600/0a0a0a/A21CAF?text=Signature+4", alt: "Photo 4" }, caption: "" },
                ],
              },
            },
          ],
        },
        {
          slug: "contact",
          title: "Contact",
          position: 40,
          blocks: [
            {
              type: "hero",
              position: 10,
              content: {
                headline: "Écrivons votre histoire",
                subheadline: "Parlez-moi de votre projet : la date, le lieu, l'ambiance que vous cherchez.",
                ctaLabel: "",
                ctaLink: { href: "", label: "" },
                heroVariant: "pageHeader",
              },
            },
            {
              type: "contact",
              position: 20,
              content: {
                title: "Découvrir mon univers",
                description: "Un premier échange pour comprendre votre projet.",
                email: "contact@exemple.fr",
                phone: "06 66 77 88 99",
                address: "Studio à Paris — déplacements sur toute la France",
                hours: "Sur rendez-vous uniquement",
                socialLinks: [
                  { platform: "Instagram", href: "https://instagram.com" },
                  { platform: "LinkedIn", href: "https://linkedin.com" },
                ],
                showForm: true,
              },
            },
          ],
        },
      ],
    },
  },
  {
    slug: "regard-authentique",
    name: "Regard Authentique",
    description: "Une ambiance douce et naturelle, pour un photographe indépendant sincère.",
    category: "photographe",
    isPremium: false,
    schema: {
      blockTypes: blockTypeDefs,
      accentColor: "#57534E",
      defaultBlocks: [
        {
          type: "hero",
          position: 10,
          content: {
            headline: "Des photos qui vous ressemblent, sans artifice",
            subheadline: "Photographe indépendant, portraits naturels et reportages sincères.",
            ctaLabel: "Réserver une séance",
            ctaLink: { href: "#contact", label: "Réserver une séance" },
            heroVariant: "blobs",
          },
        },
        {
          type: "features",
          position: 20,
          content: {
            title: "Mon approche",
            items: [
              { icon: "🙂", title: "Portraits naturels", description: "Une approche simple, loin des poses artificielles." },
              { icon: "👨‍👩‍👧", title: "Séances famille", description: "Des souvenirs authentiques, en toute simplicité." },
              { icon: "📖", title: "Reportage de vie", description: "Racontez votre histoire à travers des images sincères." },
            ],
          },
        },
        {
          type: "gallery",
          position: 30,
          content: {
            title: "Quelques instants",
            images: [
              { image: { url: "https://placehold.co/600x600?text=Authentique+1", alt: "Photo 1" }, caption: "" },
              { image: { url: "https://placehold.co/600x600?text=Authentique+2", alt: "Photo 2" }, caption: "" },
              { image: { url: "https://placehold.co/600x600?text=Authentique+3", alt: "Photo 3" }, caption: "" },
            ],
          },
        },
        {
          type: "pricing",
          position: 40,
          content: {
            title: "Mes tarifs",
            plans: [
              { name: "Séance portrait", price: "90€", period: "", features: ["30 min", "10 photos retouchées"], ctaLabel: "Réserver", highlighted: false },
              { name: "Séance famille", price: "140€", period: "", features: ["1h", "20 photos retouchées"], ctaLabel: "Réserver", highlighted: true },
              { name: "Reportage", price: "Sur devis", period: "", features: ["Journée ou demi-journée"], ctaLabel: "Réserver", highlighted: false },
            ],
          },
        },
        {
          type: "contact",
          position: 50,
          content: {
            title: "Réserver une séance",
            description: "Je réponds sous 48h, avec plaisir.",
            email: "contact@exemple.fr",
            phone: "06 77 88 99 00",
            address: "Basé à Rennes — déplacements en Bretagne",
            hours: "Sur rendez-vous, week-ends inclus",
            socialLinks: [
              { platform: "Instagram", href: "https://instagram.com" },
              { platform: "Facebook", href: "https://facebook.com" },
            ],
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
  // Stable sort: featured templates lead, everything else keeps its
  // existing relative order (Array.prototype.sort is stable in JS).
  return templates
    .filter((t) => t.category === category)
    .sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
}
