import { z } from "zod";

export const socialLinkSchema = z.object({
  platform: z.string().max(30).default(""),
  href: z.string().max(2048).default(""),
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
