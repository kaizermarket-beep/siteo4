// A reassurance ticker between the hero and "Comment ça marche".
//
// Deliberately does NOT list the métiers: they appear immediately below in
// the "Faites vos premiers pas" grid with real photography, and repeating
// them here made the strip read as filler. Every claim below is true of the
// product as built — no customer counts, no social proof we haven't earned.
const promises = [
  "Essai gratuit 7 jours",
  "Sans carte bancaire",
  "30 modèles prêts à l'emploi",
  "Aucune ligne de code",
  "En ligne en quelques minutes",
  "Modifiable à tout moment",
  "Hébergement inclus",
  "Sans engagement",
];

export function HighlightsMarquee() {
  const looped = [...promises, ...promises];

  return (
    <div className="pause-on-hover overflow-hidden border-y border-stone-800 bg-stone-900 py-3.5">
      {/* Duration goes inline, not as an `[animation-duration:…]` utility:
          .animate-marquee-horizontal uses the `animation` shorthand, which
          resets duration to 0s and freezes the strip. */}
      <div
        className="animate-marquee-horizontal flex w-max items-center"
        style={{ animationDuration: "42s" }}
      >
        {looped.map((label, i) => (
          <span key={i} className="flex items-center whitespace-nowrap">
            <span className="text-sm font-medium tracking-tight text-stone-100">{label}</span>
            <span className="mx-9 text-emerald-400/70" aria-hidden>
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
