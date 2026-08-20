import Link from "next/link";

// The 3D subject is the product itself: miniature sites drifting on a
// perspective plane, the way Framer/Wix/Squarespace present a builder.
// Real template names and accent colors from src/templates/registry.ts —
// what floats past is what you actually get.
//
// Built with CSS 3D transforms rather than another WebGL canvas: the page
// already loads three/@react-three/fiber for the métier heroes further
// down, and this is the first paint on the most-visited route. A real
// perspective plane costs nothing here and keeps the landing page light.
type SiteCard = {
  name: string;
  metier: string;
  accent: string;
  dark?: boolean;
};

const cards: SiteCard[] = [
  { name: "Salon Prestige", metier: "Coiffeur", accent: "#D4AF37", dark: true },
  { name: "Bistrot Chic", metier: "Restaurant", accent: "#C2410C", dark: true },
  { name: "Garage Premium", metier: "Automobile", accent: "#1D4ED8" },
  { name: "Maître Artisan", metier: "Artisan", accent: "#EA580C" },
  { name: "Coach Elite", metier: "Coach sportif", accent: "#16A34A", dark: true },
  { name: "Studio Noir", metier: "Photographe", accent: "#7C3AED" },
];

// A miniature of a published site: browser chrome, hero band in the
// template's accent, then the content rhythm every Siteo site has
// (headline, body lines, a row of cards).
function SiteThumb({ card }: { card: SiteCard }) {
  const surface = card.dark ? "#141414" : "#ffffff";
  const bar = card.dark ? "#232323" : "#f1f0ee";
  const line = card.dark ? "#2f2f2f" : "#e7e5e1";
  const lineSoft = card.dark ? "#252525" : "#efedea";

  return (
    <div
      className="w-[248px] shrink-0 overflow-hidden rounded-xl border shadow-[0_18px_40px_-22px_rgba(28,25,23,0.55)]"
      style={{ background: surface, borderColor: card.dark ? "#2a2a2a" : "#e2e0dc" }}
    >
      {/* browser chrome */}
      <div className="flex items-center gap-1.5 px-3 py-2" style={{ background: bar }}>
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#e06c5b" }} />
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#e0b25b" }} />
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#7fb069" }} />
        <span
          className="ml-2 h-2.5 flex-1 rounded-full"
          style={{ background: card.dark ? "#1b1b1b" : "#ffffff" }}
        />
      </div>

      {/* hero band in the template's own accent */}
      <div
        className="flex h-[62px] flex-col justify-center gap-1.5 px-3"
        style={{ background: `linear-gradient(135deg, ${card.accent}, color-mix(in srgb, ${card.accent} 45%, #000))` }}
      >
        <span className="h-2 w-[68%] rounded-full bg-white/85" />
        <span className="h-1.5 w-[46%] rounded-full bg-white/50" />
        <span className="mt-0.5 h-3 w-[34%] rounded-full bg-white/90" />
      </div>

      {/* content rhythm */}
      <div className="flex flex-col gap-2 p-3">
        <span className="h-1.5 w-[52%] rounded-full" style={{ background: line }} />
        <span className="h-1.5 w-[84%] rounded-full" style={{ background: lineSoft }} />
        <div className="mt-1 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-8 flex-1 rounded-md" style={{ background: lineSoft }} />
          ))}
        </div>
      </div>

      {/* footer label — the only real text, so the métier reads at a glance */}
      <div
        className="flex items-center justify-between px-3 py-2 text-[10px]"
        style={{ borderTop: `1px solid ${line}` }}
      >
        <span className="font-medium" style={{ color: card.dark ? "#e8e6e3" : "#1c1917" }}>
          {card.name}
        </span>
        <span style={{ color: card.accent }}>{card.metier}</span>
      </div>
    </div>
  );
}

function DriftRow({
  items,
  reverse = false,
  duration,
}: {
  items: SiteCard[];
  reverse?: boolean;
  duration: string;
}) {
  const looped = [...items, ...items];
  return (
    <div
      className={`flex w-max gap-6 ${reverse ? "animate-drift-reverse" : "animate-drift"}`}
      style={{ animationDuration: duration }}
    >
      {looped.map((card, i) => (
        <SiteThumb key={`${card.name}-${i}`} card={card} />
      ))}
    </div>
  );
}

export function BuilderHero({
  ctaLabel = "Créer mon site",
  ctaHref = "#metiers",
}: {
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <div className="relative isolate flex min-h-[88vh] w-full flex-col items-center justify-center overflow-hidden bg-stone-100 px-6 py-24">
      {/* blueprint grid — the builder's canvas, not a starfield */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 opacity-[0.55]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #d8d4cd 1px, transparent 1px), linear-gradient(to bottom, #d8d4cd 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 75% 60% at 50% 45%, #000 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 75% 60% at 50% 45%, #000 30%, transparent 100%)",
        }}
      />

      {/* the 3D plane: two rows of real sites receding into depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 flex flex-col justify-center gap-6"
        style={{ perspective: "1400px", perspectiveOrigin: "50% 50%" }}
      >
        <div
          className="flex flex-col gap-6 opacity-70"
          style={{
            transform: "rotateX(28deg) rotateZ(-8deg) scale(1.25)",
            transformStyle: "preserve-3d",
            maskImage: "radial-gradient(ellipse 70% 64% at 50% 50%, transparent 30%, #000 88%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 64% at 50% 50%, transparent 30%, #000 88%)",
          }}
        >
          <DriftRow items={cards} duration="58s" />
          <DriftRow items={[...cards].reverse()} reverse duration="72s" />
          <DriftRow items={cards} duration="64s" />
        </div>
      </div>

      {/* readability floor for the headline */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 52% 46% at 50% 48%, rgba(245,244,241,0.98) 46%, rgba(245,244,241,0) 100%)",
        }}
      />

      <div className="relative z-10 flex max-w-3xl flex-col items-center gap-6 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white/80 px-3.5 py-1.5 text-xs font-medium text-stone-600 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Essai gratuit 7 jours — sans carte bancaire
        </span>

        <h1 className="text-4xl font-semibold tracking-tight text-stone-900 text-balance sm:text-6xl">
          Le site qui fait travailler votre métier
        </h1>

        <p className="max-w-xl text-lg text-stone-600">
          Choisissez un modèle pensé pour votre activité, personnalisez-le, publiez.
          Aucune ligne de code, aucun prestataire à rappeler.
        </p>

        <div className="mt-1 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-stone-800"
          >
            {ctaLabel}
            <span aria-hidden>→</span>
          </Link>
          {/* Secondary CTA needs its own destination: the primary already
              goes to #metiers, and there is no public "all templates" page —
              browsing starts by trade. */}
          <Link
            href="#comment-ca-marche"
            className="inline-flex items-center rounded-full border border-stone-300 bg-white/70 px-7 py-3.5 text-base font-medium text-stone-700 backdrop-blur-sm transition-colors hover:bg-white"
          >
            Comment ça marche
          </Link>
        </div>

        <p className="text-sm text-stone-500">
          Déjà un compte ?{" "}
          <Link href="/login" className="underline underline-offset-2 hover:text-stone-800">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
