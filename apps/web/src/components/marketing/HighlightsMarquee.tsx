import { templateCategories } from "@/templates/types";

const highlights = [
  "Essai gratuit 7 jours",
  "Sans engagement",
  "Publié en quelques minutes",
  "Modèles premium inclus à l'essai",
];

// A ticker of métiers + real product terms — no client logos, no quotes:
// Siteo has no production users yet, so nothing here claims a customer said
// or used anything (unlike TestimonialsMarquee just above it, which does —
// worth a look).
export function HighlightsMarquee() {
  const items = [
    ...templateCategories.map((c) => ({ icon: c.icon, label: c.label })),
    ...highlights.map((label) => ({ icon: "✓", label })),
  ];
  const looped = [...items, ...items];

  return (
    <div className="pause-on-hover overflow-hidden border-y border-stone-300 bg-stone-900 py-3">
      <div className="animate-marquee-horizontal flex w-max items-center gap-10 [animation-duration:34s]">
        {looped.map((item, i) => (
          <span key={i} className="flex items-center gap-2 whitespace-nowrap text-sm font-medium text-stone-100">
            <span aria-hidden>{item.icon}</span>
            {item.label}
            <span className="ml-8 text-stone-600" aria-hidden>
              •
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
