import type { GalleryContent } from "@/validation/blocks";
import { Gallery3DLoader } from "./Gallery3DLoader";

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


export function GalleryBlock({ content }: { content: GalleryContent }) {
  if (content.variant === "gallery3d") {
    return <Gallery3DLoader content={content} />;
  }
  return <GalleryGrid content={content} />;
}
