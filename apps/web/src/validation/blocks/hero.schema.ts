import { z } from "zod";
import { imageSchema, linkSchema } from "./shared";

export const heroContentSchema = z.object({
  headline: z.string().min(1).max(80),
  subheadline: z.string().max(200).default(""),
  ctaLabel: z.string().max(30).default(""),
  ctaLink: linkSchema.optional(),
  backgroundImage: imageSchema.optional(),
});

export type HeroContent = z.infer<typeof heroContentSchema>;
