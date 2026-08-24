import type { BlockTypeDef } from "./types";

// Shared field contract for all 6 MVP block types — read by the editor (M4) to
// know which inputs to render, and mirrored by the Zod schemas in
// src/validation/blocks for actual validation.
export const blockTypeDefs: BlockTypeDef[] = [
  {
    type: "hero",
    label: "En-tête",
    fields: [
      { key: "headline", kind: "text", label: "Titre", maxLength: 80 },
      { key: "subheadline", kind: "richtext", label: "Sous-titre", maxLength: 200 },
      { key: "ctaLabel", kind: "text", label: "Texte du bouton", maxLength: 30 },
      { key: "ctaLink", kind: "link", label: "Lien du bouton" },
      { key: "backgroundImage", kind: "image", label: "Image de fond" },
    ],
  },
  {
    type: "features",
    label: "Fonctionnalités",
    fields: [
      { key: "title", kind: "text", label: "Titre", maxLength: 60 },
      {
        key: "items",
        kind: "repeatable",
        label: "Éléments",
        minItems: 1,
        maxItems: 6,
        itemFields: [
          { key: "icon", kind: "text", label: "Icône" },
          { key: "title", kind: "text", label: "Titre", maxLength: 40 },
          { key: "description", kind: "richtext", label: "Description", maxLength: 160 },
        ],
      },
    ],
  },
  {
    type: "pricing",
    label: "Tarifs",
    fields: [
      { key: "title", kind: "text", label: "Titre", maxLength: 60 },
      {
        key: "plans",
        kind: "repeatable",
        label: "Offres",
        minItems: 1,
        maxItems: 4,
        itemFields: [
          { key: "name", kind: "text", label: "Nom", maxLength: 40 },
          { key: "price", kind: "text", label: "Prix", maxLength: 20 },
          { key: "period", kind: "text", label: "Période", maxLength: 20 },
          { key: "features", kind: "repeatable", label: "Caractéristiques", maxItems: 8 },
          { key: "ctaLabel", kind: "text", label: "Texte du bouton", maxLength: 30 },
          { key: "highlighted", kind: "boolean", label: "Mise en avant" },
        ],
      },
    ],
  },
  {
    type: "gallery",
    label: "Galerie",
    fields: [
      { key: "title", kind: "text", label: "Titre", maxLength: 60 },
      {
        key: "images",
        kind: "repeatable",
        label: "Images",
        minItems: 1,
        maxItems: 12,
        itemFields: [
          { key: "image", kind: "image", label: "Image" },
          { key: "caption", kind: "text", label: "Légende", maxLength: 80 },
        ],
      },
    ],
  },
  {
    type: "beforeAfter",
    label: "Avant / Après",
    fields: [
      { key: "title", kind: "text", label: "Titre", maxLength: 60 },
      { key: "description", kind: "richtext", label: "Description", maxLength: 200 },
      {
        key: "items",
        kind: "repeatable",
        label: "Transformations",
        minItems: 1,
        maxItems: 6,
        itemFields: [
          { key: "beforeImage", kind: "image", label: "Photo avant" },
          { key: "afterImage", kind: "image", label: "Photo après" },
          { key: "label", kind: "text", label: "Légende", maxLength: 60 },
        ],
      },
    ],
  },
  {
    type: "menu",
    label: "Carte / Menu",
    fields: [
      { key: "title", kind: "text", label: "Titre", maxLength: 60 },
      { key: "description", kind: "richtext", label: "Description", maxLength: 200 },
      {
        key: "categories",
        kind: "repeatable",
        label: "Catégories",
        minItems: 1,
        maxItems: 6,
        itemFields: [
          { key: "name", kind: "text", label: "Nom de la catégorie", maxLength: 40 },
          {
            key: "items",
            kind: "repeatable",
            label: "Plats",
            minItems: 1,
            maxItems: 12,
            itemFields: [
              { key: "name", kind: "text", label: "Nom du plat", maxLength: 60 },
              { key: "description", kind: "richtext", label: "Description", maxLength: 160 },
              { key: "price", kind: "text", label: "Prix", maxLength: 20 },
            ],
          },
        ],
      },
      { key: "orderEnabled", kind: "boolean", label: "Activer la commande WhatsApp" },
      { key: "orderPhone", kind: "text", label: "Numéro WhatsApp pour les commandes" },
    ],
  },
  {
    type: "contact",
    label: "Contact",
    fields: [
      { key: "title", kind: "text", label: "Titre", maxLength: 60 },
      { key: "description", kind: "richtext", label: "Description", maxLength: 200 },
      { key: "email", kind: "text", label: "Email" },
      { key: "phone", kind: "text", label: "Téléphone" },
      { key: "address", kind: "text", label: "Adresse" },
      { key: "hours", kind: "richtext", label: "Horaires", maxLength: 300 },
      {
        key: "socialLinks",
        kind: "repeatable",
        label: "Réseaux sociaux",
        maxItems: 5,
        itemFields: [
          { key: "platform", kind: "text", label: "Réseau", maxLength: 30 },
          { key: "href", kind: "link", label: "Lien" },
        ],
      },
      { key: "showForm", kind: "boolean", label: "Afficher le formulaire" },
    ],
  },
  {
    type: "reservation",
    label: "Réservation",
    fields: [
      { key: "title", kind: "text", label: "Titre", maxLength: 60 },
      { key: "description", kind: "richtext", label: "Description", maxLength: 200 },
      { key: "tableCount", kind: "text", label: "Nombre de tables" },
      { key: "seatCount", kind: "text", label: "Nombre de couverts" },
      { key: "maxPartySize", kind: "text", label: "Personnes max par réservation" },
      { key: "openDays", kind: "repeatable", label: "Jours de service", maxItems: 7 },
      { key: "slots", kind: "repeatable", label: "Créneaux", minItems: 1, maxItems: 24 },
      { key: "noticeHours", kind: "text", label: "Délai de prévenance (heures)" },
      { key: "maxDaysAhead", kind: "text", label: "Réservable jusqu'à (jours)" },
      { key: "phone", kind: "text", label: "Téléphone du restaurant" },
    ],
  },
  {
    type: "footer",
    label: "Pied de page",
    fields: [
      { key: "text", kind: "text", label: "Texte", maxLength: 120 },
      {
        key: "links",
        kind: "repeatable",
        label: "Liens",
        maxItems: 6,
        itemFields: [
          { key: "label", kind: "text", label: "Libellé", maxLength: 40 },
          { key: "href", kind: "link", label: "Lien" },
        ],
      },
    ],
  },
];
