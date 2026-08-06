import { z } from "zod";
import { imageSchema } from "./shared";

export const galleryItemSchema = z.object({
  image: imageSchema,
  caption: z.string().max(80).default(""),
});

export const galleryContentSchema = z.object({
  title: z.string().max(60).default(""),
  images: z.array(galleryItemSchema).min(1).max(12),
});

export type GalleryContent = z.infer<typeof galleryContentSchema>;
