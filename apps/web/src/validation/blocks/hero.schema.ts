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
  // Dark: one warm pool of light breathing over near-black, plus grain.
  "velvet",
  // Light: pale ground, faint weave, two slow washes — velvet's daylight twin.
  "linen",
  // WebGL light shafts. Light: daylight through a salon window.
  "sunbeam",
  // Same engine, dark: one warm shaft cutting a barbershop's shadow.
  "halo",
  // Not a backdrop but a whole layout: full-bleed photo, asymmetric
  // lower-left type, hairline rule, display serif. Uses backgroundImage.
  "editorial",
  // A real object rather than an abstraction: the turning pole, for
  // barbershops. Reads --site-accent for its lighting.
  "barberPole",
  // Photographs rushing out of the vanishing point. Needs heroImages,
  // like photoGallery3d, but comes at the viewer instead of scrolling past.
  "stream",
  // Light: ridgelines drifting in parallax over a dawn sky, for outdoor work.
  "ridges",
  // Dark: a trace drawing itself across a measurement grid, for performance.
  "telemetry",
  // Not an opener but a page title: a short band for the interior pages of a
  // multi-page site, which must not compete with the home page's hero. Takes
  // backgroundImage when one is set.
  "pageHeader",
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
