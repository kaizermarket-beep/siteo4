import type { GalleryContent } from "@/validation/blocks";
import InfiniteGallery from "@/components/ui/3d-gallery-photography";

function GalleryGrid({ content }: { content: GalleryContent }) {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        {content.title && (
          <h2 className="mb-12 text-center text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            {content.title}
          </h2>
        )}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {content.images.map((item, i) => (
            <figure
              key={i}
              className="overflow-hidden rounded-lg bg-neutral-100 transition-transform duration-300 hover:scale-[1.02] dark:bg-neutral-800 dark:ring-1 dark:ring-white/10"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image.url}
                alt={item.image.alt}
                className="aspect-square w-full object-cover"
              />
              {item.caption && (
                <figcaption className="px-2 py-1 text-xs text-neutral-500 dark:text-neutral-400">
                  {item.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Gallery3D({ content }: { content: GalleryContent }) {
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

export function GalleryBlock({ content }: { content: GalleryContent }) {
  if (content.variant === "gallery3d") {
    return <Gallery3D content={content} />;
  }
  return <GalleryGrid content={content} />;
}
