"use client";

import dynamic from "next/dynamic";
export { lazyBackdropVariants } from "./hero-backdrops/lazy-variants";

// Loads the backdrops that carry a client-side library, one chunk each.
//
// This has to be a Client Component. Next's docs are explicit: "When a
// Server Component dynamically imports a Client Component, automatic code
// splitting is currently not supported." HeroBlock is a Server Component,
// so calling dynamic() there would have produced the same single bundle.
//
// The gain is not theoretical. Before the split, every published site
// shipped the union of every variant's dependencies — a Salon Prestige
// site, whose hero is a photograph and some text, downloaded 910 kB of
// three.js and 171 kB of tsparticles it has no use for.
const SparklesGlow = dynamic(() => import("./hero-backdrops/SparklesGlow"));
const PhotoGallery3DGlow = dynamic(() => import("./hero-backdrops/PhotoGallery3DGlow"));
const StreamGlow = dynamic(() => import("./hero-backdrops/StreamGlow"));
const BarberPoleGlow = dynamic(() => import("./hero-backdrops/BarberPoleGlow"));
const SunbeamGlow = dynamic(() => import("./hero-backdrops/SunbeamGlow"));
const HaloGlow = dynamic(() => import("./hero-backdrops/HaloGlow"));
const SilkGlow = dynamic(() => import("./hero-backdrops/SilkGlow"));


type HeroImage = { url: string; alt: string };

export function HeroBackdrop({
  variant,
  images,
}: {
  variant: string;
  images?: HeroImage[];
}) {
  switch (variant) {
    case "sparkles":
      return <SparklesGlow />;
    case "photoGallery3d":
      return images?.length ? <PhotoGallery3DGlow images={images} /> : null;
    case "stream":
      return images?.length ? <StreamGlow images={images} /> : null;
    case "barberPole":
      return <BarberPoleGlow />;
    case "sunbeam":
      return <SunbeamGlow />;
    case "halo":
      return <HaloGlow />;
    case "silk":
      return <SilkGlow />;
    default:
      return null;
  }
}
