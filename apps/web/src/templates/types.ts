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
};

export const templateCategories: { key: TemplateCategory; label: string; icon: string }[] = [
  { key: "coiffeur", label: "Coiffeur", icon: "💇" },
  { key: "restauration", label: "Restauration", icon: "🍽️" },
  { key: "automobile", label: "Automobile", icon: "🚗" },
  { key: "artisan", label: "Artisans", icon: "🔨" },
  { key: "coach-sportif", label: "Coach sportif", icon: "🏋️" },
  { key: "photographe", label: "Photographe", icon: "📷" },
];
