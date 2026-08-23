import InfiniteGallery from "@/components/ui/3d-gallery-photography";

export default function PhotoGallery3DGlow({ images }: { images: { url: string; alt: string }[] }) {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-neutral-950">
      <InfiniteGallery
        images={images.map((img) => ({ src: img.url, alt: img.alt }))}
        speed={1}
        visibleCount={Math.min(Math.max(images.length * 2, 6), 12)}
        className="h-full w-full"
      />
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.6) 100%)" }}
      />
    </div>
  );
}
