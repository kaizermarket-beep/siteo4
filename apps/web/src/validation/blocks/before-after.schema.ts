import { z } from "zod";
import { imageSchema } from "./shared";

export const beforeAfterItemSchema = z.object({
  beforeImage: imageSchema,
  afterImage: imageSchema,
  label: z.string().max(60).default(""),
});

export const beforeAfterContentSchema = z.object({
  title: z.string().max(60).default(""),
  description: z.string().max(200).default(""),
  items: z.array(beforeAfterItemSchema).min(1).max(6),
});

export type BeforeAfterContent = z.infer<typeof beforeAfterContentSchema>;
