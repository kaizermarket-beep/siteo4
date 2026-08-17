import { z } from "zod";

export const menuItemSchema = z.object({
  name: z.string().max(60),
  description: z.string().max(160).default(""),
  price: z.string().max(20).default(""),
});

export const menuCategorySchema = z.object({
  name: z.string().max(40),
  items: z.array(menuItemSchema).min(1).max(12),
});

export const menuContentSchema = z.object({
  title: z.string().max(60).default(""),
  description: z.string().max(200).default(""),
  categories: z.array(menuCategorySchema).min(1).max(6),
  // When enabled, visitors can build a WhatsApp order message straight from
  // the menu — no cart/checkout backend, just a pre-filled chat to the
  // number below that the owner confirms manually.
  orderEnabled: z.boolean().default(false),
  orderPhone: z.string().max(30).default(""),
});

export type MenuContent = z.infer<typeof menuContentSchema>;
