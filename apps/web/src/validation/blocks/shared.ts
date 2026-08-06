import { z } from "zod";

export const linkSchema = z.object({
  href: z.string().min(1),
  label: z.string().min(1).max(40),
});

export const imageSchema = z.object({
  url: z.string().min(1),
  alt: z.string().max(160).default(""),
});
