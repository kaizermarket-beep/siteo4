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
    type: "contact",
    label: "Contact",
    fields: [
      { key: "title", kind: "text", label: "Titre", maxLength: 60 },
      { key: "description", kind: "richtext", label: "Description", maxLength: 200 },
      { key: "email", kind: "text", label: "Email" },
      { key: "showForm", kind: "boolean", label: "Afficher le formulaire" },
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
