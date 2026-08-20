import { z } from "zod";
import { imageSchema, linkSchema } from "./shared";

// "blobs" = current soft drifting blobs (light or dark, subtle). The other
// three force a dark, immersive backdrop regardless of the template's own
// light/dark mode — matching the marketing landing page's own dark hero —
// so any template can borrow a premium/animated opener above lighter
// sections below, without going fully dark-mode itself.
export const heroVariants = [
  "blobs",
  "sparkles",
  "aurora",
  "spotlight",
  "grid3d",
  "beams",
  "mesh",
  "bokeh",
  "embers",
  // A real WebGL photo scroller as the hero backdrop (the same engine as
  // GalleryBlock's "gallery3d") — needs `heroImages` below, several real
  // photos rather than a solid color, for a "walk through the work" opener.
  "photoGallery3d",
  // A GPU silk-weave shader tinted with the template accent — the
  // "quiet luxury" opener, for salons and other premium services.
  "silk",
] as const;

export const heroContentSchema = z.object({
  headline: z.string().min(1).max(80),
  subheadline: z.string().max(200).default(""),
  ctaLabel: z.string().max(30).default(""),
  ctaLink: linkSchema.optional(),
  backgroundImage: imageSchema.optional(),
  heroVariant: z.enum(heroVariants).default("blobs"),
  heroImages: z.array(imageSchema).max(10).optional(),
});

export type HeroContent = z.infer<typeof heroContentSchema>;
