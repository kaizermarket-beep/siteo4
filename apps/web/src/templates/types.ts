export type FieldKind = "text" | "richtext" | "image" | "color" | "link" | "repeatable" | "boolean";

export type FieldDef = {
  key: string;
  kind: FieldKind;
  label?: string;
  maxLength?: number;
  minItems?: number;
  maxItems?: number;
  itemFields?: FieldDef[];
};

export type BlockTypeDef = {
  type: string;
  label: string;
  fields: FieldDef[];
};

export type DefaultBlock = {
  type: string;
  position: number;
  content: Record<string, unknown>;
};

export type TemplateSchema = {
  blockTypes: BlockTypeDef[];
  defaultBlocks: DefaultBlock[];
  accentColor?: string;
  mode?: "light" | "dark";
};

export type TemplateCategory =
  | "coiffeur"
  | "restauration"
  | "automobile"
  | "artisan"
  | "coach-sportif"
  | "photographe";

export type TemplateDefinition = {
  slug: string;
  name: string;
  description: string;
  category: TemplateCategory;
  isPremium: boolean;
  thumbnailUrl?: string;
  schema: TemplateSchema;
  // Shown first on /metiers/[category] — the template most likely to make a
  // strong first impression on a visitor browsing that métier.
  featured?: boolean;
};

export const templateCategories: {
  key: TemplateCategory;
  label: string;
  icon: string;
  image: string;
}[] = [
  {
    key: "coiffeur",
    label: "Coiffeur",
    icon: "💇",
    image:
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800&auto=format&fit=crop",
  },
  {
    key: "restauration",
    label: "Restauration",
    icon: "🍽️",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800&auto=format&fit=crop",
  },
  {
    key: "automobile",
    label: "Automobile",
    icon: "🚗",
    image:
      "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?q=80&w=800&auto=format&fit=crop",
  },
  {
    key: "artisan",
    label: "Artisans",
    icon: "🔨",
    image:
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=800&auto=format&fit=crop",
  },
  {
    key: "coach-sportif",
    label: "Coach sportif",
    icon: "🏋️",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop",
  },
  {
    key: "photographe",
    label: "Photographe",
    icon: "📷",
    image:
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=800&auto=format&fit=crop",
  },
];
