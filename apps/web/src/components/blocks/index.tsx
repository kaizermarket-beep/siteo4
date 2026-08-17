import { blockContentSchemas, type BlockType } from "@/validation/blocks";
import { HeroBlock } from "./HeroBlock";
import { FeaturesBlock } from "./FeaturesBlock";
import { PricingBlock } from "./PricingBlock";
import { GalleryBlock } from "./GalleryBlock";
import { BeforeAfterBlock } from "./BeforeAfterBlock";
import { MenuBlock } from "./MenuBlock";
import { ContactBlock } from "./ContactBlock";
import { FooterBlock } from "./FooterBlock";

const blockComponents = {
  hero: HeroBlock,
  features: FeaturesBlock,
  pricing: PricingBlock,
  gallery: GalleryBlock,
  beforeAfter: BeforeAfterBlock,
  menu: MenuBlock,
  contact: ContactBlock,
  footer: FooterBlock,
} as const;

export function BlockRenderer({ blockType, content }: { blockType: string; content: unknown }) {
  if (!(blockType in blockComponents)) return null;

  const type = blockType as BlockType;
  const parsed = blockContentSchemas[type].safeParse(content);
  if (!parsed.success) return null;

  const Component = blockComponents[type] as React.ComponentType<{ content: typeof parsed.data }>;
  return <Component content={parsed.data} />;
}
