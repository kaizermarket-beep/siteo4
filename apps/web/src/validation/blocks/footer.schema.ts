import { z } from "zod";
import { linkSchema } from "./shared";

export const footerContentSchema = z.object({
  text: z.string().max(120).default(""),
  links: z.array(linkSchema).max(6).default([]),
});

export type FooterContent = z.infer<typeof footerContentSchema>;
