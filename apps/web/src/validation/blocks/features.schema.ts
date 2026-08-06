import { z } from "zod";

export const featureItemSchema = z.object({
  icon: z.string().max(8).default("✦"),
  title: z.string().min(1).max(40),
  description: z.string().max(160).default(""),
});

export const featuresContentSchema = z.object({
  title: z.string().max(60).default(""),
  items: z.array(featureItemSchema).min(1).max(6),
});

export type FeaturesContent = z.infer<typeof featuresContentSchema>;
