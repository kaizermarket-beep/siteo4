import { z } from "zod";
import { safeHrefSchema } from "./shared";

export const socialLinkSchema = z.object({
  platform: z.string().max(30).default(""),
  // Rendered as <a href> in ContactBlock, so it needs the same scheme
  // allowlist as linkSchema — it just never went through linkSchema.
  href: safeHrefSchema,
});

export const contactContentSchema = z.object({
  title: z.string().max(60).default("Contact"),
  description: z.string().max(200).default(""),
  email: z.string().email(),
  phone: z.string().max(30).default(""),
  address: z.string().max(200).default(""),
  hours: z.string().max(300).default(""),
  socialLinks: z.array(socialLinkSchema).max(5).default([]),
  showForm: z.boolean().default(true),
});

export type ContactContent = z.infer<typeof contactContentSchema>;
export type SocialLink = z.infer<typeof socialLinkSchema>;
