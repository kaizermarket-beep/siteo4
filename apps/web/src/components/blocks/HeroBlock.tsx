import type { HeroContent } from "@/validation/blocks";

export function HeroBlock({ content }: { content: HeroContent }) {
  return (
    <section
      className="relative flex flex-col items-center justify-center gap-6 px-6 py-24 text-center"
      style={
        content.backgroundImage?.url
          ? {
              backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${content.backgroundImage.url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      <h1
        className={`max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl ${
          content.backgroundImage?.url ? "text-white" : "text-neutral-900"
        }`}
      >
        {content.headline}
      </h1>
      {content.subheadline && (
        <p
          className={`max-w-xl text-lg ${
            content.backgroundImage?.url ? "text-white/90" : "text-neutral-600"
          }`}
        >
          {content.subheadline}
        </p>
      )}
      {content.ctaLabel && (
        <a
          href={content.ctaLink?.href ?? "#contact"}
          className="rounded-md px-6 py-3 text-sm font-medium text-white"
          style={{ backgroundColor: "var(--site-accent, #171717)" }}
        >
          {content.ctaLabel}
        </a>
      )}
    </section>
  );
}
