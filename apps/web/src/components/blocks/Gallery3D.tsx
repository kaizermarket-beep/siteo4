import type { GalleryContent } from "@/validation/blocks";
import InfiniteGallery from "@/components/ui/3d-gallery-photography";

// The WebGL portfolio scroller, in its own module so GalleryBlock can
// load it on demand. Imported statically it put three.js — roughly
// 900 kB — into the bundle of every published site, including the many
// whose gallery is a plain grid.

export default function Gallery3D({ content }: { content: GalleryContent }) {
  const images = content.images.map((item) => ({
    src: item.image.url,
    alt: item.image.alt,
  }));

  return (
    <section className="relative isolate">
      <InfiniteGallery
        images={images}
        speed={1}
        visibleCount={Math.min(Math.max(images.length * 2, 6), 12)}
        className="h-[70vh] w-full bg-neutral-950"
      />
      {content.title && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-4 text-center mix-blend-exclusion">
          <h2 className="text-4xl font-semibold tracking-tight text-white md:text-6xl">
            {content.title}
          </h2>
        </div>
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-6 text-center font-mono text-[11px] uppercase tracking-wide text-white/70">
        <p>Molette, flèches ou tactile pour naviguer</p>
        <p className="opacity-60">La lecture automatique reprend après 3 secondes</p>
      </div>
    </section>
  );
}
