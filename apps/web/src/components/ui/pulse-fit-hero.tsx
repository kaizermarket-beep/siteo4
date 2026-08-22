import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

// Adapted from the "PulseFit Hero" component: a centred statement, one call
// to action, and a full-bleed rail of tall programme cards running under it.
// The rail is what makes the layout work — it shows what is on offer before
// the visitor has scrolled a single pixel.
//
// Three deliberate departures from the published version:
//
// 1. Dark, not the pale blue gradient. This opens a coaching site that sells
//    on selectivity; near-black with one cold accent is the palette for that.
// 2. No header and no navigation. The site already has its own bar, derived
//    from its pages (src/components/site/SiteNav.tsx) — a second one inside
//    the hero would be a duplicate that can fall out of sync.
// 3. CSS animations rather than Framer Motion's initial/animate. Those mount
//    transitions are unreliable in this Next 16 + Turbopack + React 19 setup
//    (elements stay stuck at their `initial` state), which is why every hero
//    here uses .animate-fade-up instead — see the note in globals.css. The
//    rail reuses the marquee keyframes, so it needs no JavaScript at all and
//    this whole hero stays a server component.
//
// The social-proof avatar row was dropped rather than translated: it is
// invented endorsement from stock portraits, on a site that has no users yet.

export type ProgramCard = {
  image: { url: string; alt: string };
  category?: string;
  title?: string;
};

export type PulseFitHeroProps = {
  title: string;
  subtitle?: string;
  primaryAction?: { label: string; href: string };
  programs?: ProgramCard[];
  /** Dimmed behind the whole section when set. */
  backgroundImage?: { url: string; alt: string };
  className?: string;
};

const GROUND = "#07080a";

export function PulseFitHero({
  title,
  subtitle,
  primaryAction,
  programs = [],
  backgroundImage,
  className,
}: PulseFitHeroProps) {
  const hasPhoto = !!backgroundImage?.url;
  const hasRail = programs.length > 0;

  return (
    <section
      className={cn(
        "relative isolate flex w-full flex-col overflow-hidden",
        hasRail ? "min-h-[88vh]" : "min-h-[70vh]",
        className
      )}
      style={{ backgroundColor: GROUND }}
      aria-label="Présentation"
    >
      <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
        {hasPhoto && (
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage: `url(${backgroundImage!.url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        )}
        {/* One cold pool of light, high and centred. Restraint is the point:
            this template sells selectivity, not spectacle. */}
        <div
          className="absolute top-[-25%] left-1/2 h-[70vw] w-[70vw] max-h-[760px] max-w-[760px] -translate-x-1/2 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--site-accent, #06B6D4) 22%, transparent) 0%, transparent 70%)",
          }}
        />
        {/* Measurement grid, barely there — the "lab" register without the
            science-fiction. */}
        <div
          className="absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.14) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.14) 1px, transparent 1px)",
            backgroundSize: "72px 72px",
            maskImage: "radial-gradient(ellipse at 50% 20%, black 10%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(ellipse at 50% 20%, black 10%, transparent 70%)",
          }}
        />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-7 px-6 pt-24 pb-12 text-center">
        <h1 className="animate-fade-up max-w-4xl text-4xl font-semibold tracking-[-0.02em] text-balance text-white sm:text-6xl lg:text-7xl">
          {title}
        </h1>

        {subtitle && (
          <p
            className="animate-fade-up max-w-xl text-base leading-relaxed text-white/60 sm:text-lg"
            style={{ animationDelay: "0.1s" }}
          >
            {subtitle}
          </p>
        )}

        {primaryAction?.label && (
          <a
            href={primaryAction.href || "#contact"}
            className="animate-fade-up group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-neutral-950 transition-transform hover:scale-105 sm:text-base"
            style={{ animationDelay: "0.2s" }}
          >
            {primaryAction.label}
            <svg
              width="18"
              height="18"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden
              className="transition-transform group-hover:translate-x-0.5"
            >
              <path
                d="M7 10H13M13 10L10 7M13 10L10 13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        )}
      </div>

      {hasRail && (
        <div className="relative w-full pb-16">
          {/* The rail runs off both edges into the ground colour, so it reads
              as continuous rather than as a row that happens to end. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 sm:w-40"
            style={{ background: `linear-gradient(90deg, ${GROUND} 0%, transparent 100%)` }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 sm:w-40"
            style={{ background: `linear-gradient(270deg, ${GROUND} 0%, transparent 100%)` }}
          />

          <div className="pause-on-hover overflow-hidden">
            {/* Duration inline, not as an [animation-duration:…] utility: the
                class below uses the `animation` shorthand, which resets the
                duration to 0s and freezes the rail. */}
            <div
              className="animate-marquee-horizontal flex w-max gap-4 px-2 sm:gap-6 sm:px-3"
              style={{ animationDuration: `${Math.max(programs.length, 3) * 8}s` } as CSSProperties}
            >
              {[...programs, ...programs].map((program, i) => (
                <article
                  key={i}
                  aria-hidden={i >= programs.length}
                  className="group relative h-[300px] w-[210px] shrink-0 overflow-hidden rounded-3xl sm:h-[430px] sm:w-[310px]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={program.image.url}
                    alt={program.image.alt}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-5 text-left">
                    {program.category && (
                      <span
                        className="text-[11px] font-medium tracking-[0.18em] uppercase"
                        style={{ color: "var(--site-accent, #06B6D4)" }}
                      >
                        {program.category}
                      </span>
                    )}
                    {program.title && (
                      <h3 className="text-lg leading-snug font-semibold text-white sm:text-xl">
                        {program.title}
                      </h3>
                    )}
                  </div>
                  <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/10 ring-inset" />
                </article>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default PulseFitHero;
