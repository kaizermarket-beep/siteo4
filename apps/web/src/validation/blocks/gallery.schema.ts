import { z } from "zod";
import { imageSchema } from "./shared";

export const galleryItemSchema = z.object({
  image: imageSchema,
  caption: z.string().max(80).default(""),
});

export const galleryContentSchema = z.object({
  title: z.string().max(60).default(""),
  images: z.array(galleryItemSchema).min(1).max(12),
  // "gallery3d" renders an interactive WebGL portfolio scroller instead of
  // the static grid — opt-in per template (see GalleryBlock.tsx), heavy on
  // purpose, reserved for templates built to show off visual work.
  variant: z.enum(["grid", "gallery3d"]).default("grid"),
});

export type GalleryContent = z.infer<typeof galleryContentSchema>;
