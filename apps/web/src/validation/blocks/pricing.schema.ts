import { z } from "zod";

export const pricingPlanSchema = z.object({
  name: z.string().min(1).max(40),
  price: z.string().max(20), // free-form: "29€", "Sur devis"...
  period: z.string().max(20).default(""), // "/mois"
  features: z.array(z.string().max(80)).max(8).default([]),
  ctaLabel: z.string().max(30).default("Choisir"),
  highlighted: z.boolean().default(false),
});

export const pricingContentSchema = z.object({
  title: z.string().max(60).default(""),
  plans: z.array(pricingPlanSchema).min(1).max(4),
  // Where every plan button points. Defaults to the "#contact" anchor,
  // which is right for a single-page site; a multi-page template sets it
  // to the address of its contact page, where that anchor does not exist.
  ctaHref: z.string().max(2048).default(""),
});

export type PricingContent = z.infer<typeof pricingContentSchema>;
