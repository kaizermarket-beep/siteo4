"use client";

import InfiniteGallery from "@/components/ui/3d-gallery-photography";

export function TemplatePickerHero({ images }: { images: { url: string; alt: string }[] }) {
  return (
    <div className="relative isolate flex h-56 w-full items-center justify-center overflow-hidden rounded-2xl bg-neutral-950 sm:h-64">
      <InfiniteGallery
        images={images.map((img) => ({ src: img.url, alt: img.alt }))}
        speed={0.8}
        visibleCount={10}
        className="absolute inset-0 -z-10 h-full w-full"
      />
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "radial-gradient(ellipse at center, transparent 15%, rgba(0,0,0,0.65) 100%)" }}
      />
      <div className="relative flex flex-col items-center gap-2 px-4 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Créer un site</h1>
        <p className="max-w-md text-sm text-white/80">
          Choisissez un modèle pensé pour votre métier, personnalisable à 100%.
        </p>
      </div>
    </div>
  );
}
