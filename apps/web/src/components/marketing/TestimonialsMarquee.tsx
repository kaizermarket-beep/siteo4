type Testimonial = {
  name: string;
  role: string;
  quote: string;
  color: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Camille R.",
    role: "Coiffeuse indépendante",
    quote:
      "Mon site était en ligne le soir même. Mes clientes peuvent enfin voir mes tarifs et prendre rendez-vous directement.",
    color: "#DB2777",
  },
  {
    name: "Karim B.",
    role: "Garage automobile",
    quote:
      "Je ne connaissais rien en informatique. En moins d'une heure, mon garage avait un site plus pro que celui de mes concurrents.",
    color: "#1D4ED8",
  },
  {
    name: "Élodie M.",
    role: "Coach sportive",
    quote:
      "Simple, rapide, et le résultat est vraiment sérieux. Mes clients me font plus confiance depuis que j'ai un vrai site.",
    color: "#16A34A",
  },
  {
    name: "Julien P.",
    role: "Artisan plombier",
    quote:
      "Fini les cartes de visite perdues. Mes clients me trouvent en ligne et me contactent directement depuis le site.",
    color: "#EA580C",
  },
  {
    name: "Nadia T.",
    role: "Restauratrice",
    quote:
      "Notre menu et nos horaires sont toujours à jour. On a même vu passer des clients qui nous ont trouvés via le site.",
    color: "#C2410C",
  },
  {
    name: "Sofia L.",
    role: "Photographe indépendante",
    quote:
      "Un portfolio qui ressemble enfin à mon travail. Le design sombre fait clairement plus pro que mes anciennes pages Instagram.",
    color: "#7C3AED",
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <figure className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <blockquote className="text-sm text-neutral-700">&laquo; {t.quote} &raquo;</blockquote>
      <figcaption className="flex items-center gap-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
          style={{ backgroundColor: t.color }}
          aria-hidden
        >
          {initials(t.name)}
        </span>
        <span className="flex flex-col text-sm">
          <span className="font-medium text-neutral-900">{t.name}</span>
          <span className="text-neutral-500">{t.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

function MarqueeColumn({
  items,
  duration,
  delay = "0s",
}: {
  items: Testimonial[];
  duration: string;
  delay?: string;
}) {
  const looped = [...items, ...items];
  return (
    <div className="pause-on-hover h-[560px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]">
      <div
        className="animate-marquee-vertical flex flex-col gap-5"
        style={{ animationDuration: duration, animationDelay: delay }}
      >
        {looped.map((t, i) => (
          <TestimonialCard key={`${t.name}-${i}`} t={t} />
        ))}
      </div>
    </div>
  );
}

export function TestimonialsMarquee() {
  const col1 = [testimonials[0], testimonials[3]];
  const col2 = [testimonials[1], testimonials[4]];
  const col3 = [testimonials[2], testimonials[5]];

  return (
    <section className="border-y border-stone-300 bg-stone-300/50 px-6 py-20">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 text-center">
        <span className="rounded-full border border-neutral-300 bg-white px-3 py-1 text-xs font-medium text-neutral-600">
          Témoignages
        </span>
        <h2 className="text-3xl font-semibold tracking-tight">Ce qu&apos;en pensent nos utilisateurs</h2>
        <p className="text-neutral-600">Des indépendants et artisans qui ont créé leur site en quelques minutes.</p>
      </div>

      <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-3">
        <MarqueeColumn items={col1} duration="26s" />
        <MarqueeColumn items={col2} duration="32s" delay="-8s" />
        <MarqueeColumn items={col3} duration="22s" delay="-4s" />
      </div>
    </section>
  );
}
