import { z } from "zod";
import { heroContentSchema } from "./hero.schema";
import { featuresContentSchema } from "./features.schema";
import { pricingContentSchema } from "./pricing.schema";
import { galleryContentSchema } from "./gallery.schema";
import { beforeAfterContentSchema } from "./before-after.schema";
import { menuContentSchema } from "./menu.schema";
import { contactContentSchema } from "./contact.schema";
import { footerContentSchema } from "./footer.schema";

export const blockContentSchemas = {
  hero: heroContentSchema,
  features: featuresContentSchema,
  pricing: pricingContentSchema,
  gallery: galleryContentSchema,
  beforeAfter: beforeAfterContentSchema,
  menu: menuContentSchema,
  contact: contactContentSchema,
  footer: footerContentSchema,
} as const;

export type BlockType = keyof typeof blockContentSchemas;
export const blockTypes = Object.keys(blockContentSchemas) as BlockType[];

export type BlockContentFor<T extends BlockType> = z.infer<(typeof blockContentSchemas)[T]>;

export function parseBlockContent<T extends BlockType>(type: T, content: unknown) {
  return blockContentSchemas[type].parse(content) as BlockContentFor<T>;
}

export {
  heroContentSchema,
  featuresContentSchema,
  pricingContentSchema,
  galleryContentSchema,
  beforeAfterContentSchema,
  menuContentSchema,
  contactContentSchema,
  footerContentSchema,
};
export type { HeroContent } from "./hero.schema";
export type { FeaturesContent } from "./features.schema";
export type { PricingContent } from "./pricing.schema";
export type { GalleryContent } from "./gallery.schema";
export type { BeforeAfterContent } from "./before-after.schema";
export type { MenuContent } from "./menu.schema";
export type { ContactContent } from "./contact.schema";
export type { FooterContent } from "./footer.schema";
