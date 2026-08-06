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

export type TemplateDefinition = {
  slug: string;
  name: string;
  description: string;
  isPremium: boolean;
  thumbnailUrl?: string;
  schema: TemplateSchema;
};
