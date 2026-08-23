import { ImageStreamHero } from "@/components/ui/image-stream-hero";

export default function StreamGlow({ images }: { images: { url: string; alt: string }[] }) {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-neutral-950">
      <ImageStreamHero
        images={images.map((i) => ({ src: i.url, alt: i.alt }))}
        speed={22}
        cards={9}
        className="h-full w-full"
      />
      {/* the corridor is busiest at the edges, so clear the middle for type */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 48% 46% at 50% 48%, rgba(10,10,10,0.9) 35%, rgba(10,10,10,0.35) 100%)",
        }}
      />
    </div>
  );
}
