import { z } from "zod";

export const contactContentSchema = z.object({
  title: z.string().max(60).default("Contact"),
  description: z.string().max(200).default(""),
  email: z.string().email(),
  showForm: z.boolean().default(true),
});

export type ContactContent = z.infer<typeof contactContentSchema>;
