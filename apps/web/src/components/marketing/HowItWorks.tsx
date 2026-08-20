"use client";

import { useEffect, useRef, useState } from "react";

type Step = { icon: string; title: string; description: string };

const steps: Step[] = [
  {
    icon: "🧭",
    title: "Choisissez votre métier",
    description: "Coiffeur, restaurant, garage, artisan… sélectionnez le modèle pensé pour votre activité.",
  },
  {
    icon: "🎨",
    title: "Personnalisez votre site",
    description: "Textes, photos, couleurs — tout se modifie en quelques clics, sans écrire une ligne de code.",
  },
  {
    icon: "🚀",
    title: "Publiez en ligne",
    description: "Votre site est en ligne immédiatement, sur votre propre adresse.",
  },
  {
    icon: "📩",
    title: "Recevez vos premiers clients",
    description: "Formulaire de contact, prise de rendez-vous, appel — tout est déjà prêt à l'emploi.",
  },
];

const GLOW = "#4ADE80";

function StepCard({ step, index, align }: { step: Step; index: number; align: "left" | "right" }) {
  return (
    <div
      className={`w-full max-w-sm rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 backdrop-blur-sm ${
        align === "right" ? "text-center md:text-right" : "text-center md:text-left"
      }`}
    >
      <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: GLOW }}>
        Étape {String(index + 1).padStart(2, "0")}
      </span>
      <h3 className="mt-1 text-lg font-semibold text-white">{step.title}</h3>
      <p className="mt-1 text-sm text-neutral-400">{step.description}</p>
    </div>
  );
}

function GhostNumber({ index }: { index: number }) {
  return (
    <span
      aria-hidden
      className="hidden font-bold tracking-tight text-neutral-800/70 tabular-nums select-none md:block md:text-7xl"
    >
      {String(index + 1).padStart(2, "0")}
    </span>
  );
}

function StepNode({ icon, onActivate }: { icon: string; onActivate: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          onActivate();
        }
      },
      { threshold: 0.6 }
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={ref}
      className={`z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 bg-neutral-950 text-xl transition-all duration-700 ${
        active ? "scale-110" : "scale-100 border-neutral-700"
      }`}
      style={active ? { borderColor: GLOW, boxShadow: `0 0 26px 6px ${GLOW}66` } : undefined}
    >
      {icon}
    </div>
  );
}

export function HowItWorks() {
  const [activeCount, setActiveCount] = useState(0);

  return (
    <section id="comment-ca-marche" className="relative overflow-hidden bg-neutral-950 px-6 py-24">
      <div className="mx-auto mb-16 max-w-xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Comment ça marche</h2>
        <p className="mt-3 text-neutral-400">De l&apos;idée au site en ligne, en quatre étapes simples.</p>
      </div>

      <div className="relative mx-auto max-w-3xl">
        <div className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 bg-neutral-800" aria-hidden />
        <div
          className="absolute top-0 left-1/2 w-px origin-top -translate-x-1/2 transition-transform duration-700 ease-out"
          style={{
            height: "100%",
            transform: `translateX(-50%) scaleY(${activeCount / steps.length})`,
            background: GLOW,
            boxShadow: `0 0 12px 2px ${GLOW}99`,
          }}
          aria-hidden
        />

        <div className="relative flex flex-col">
          {steps.map((step, i) => {
            const isRight = i % 2 === 1;
            return (
              <div
                key={step.title}
                className="flex flex-col items-center gap-4 py-8 md:flex-row md:items-center md:gap-8"
              >
                <div className="order-2 flex w-full justify-center md:order-1 md:flex-1 md:justify-end">
                  {!isRight ? (
                    <StepCard step={step} index={i} align="right" />
                  ) : (
                    <GhostNumber index={i} />
                  )}
                </div>
                <div className="order-1 md:order-2">
                  <StepNode icon={step.icon} onActivate={() => setActiveCount((c) => Math.max(c, i + 1))} />
                </div>
                <div className="order-2 flex w-full justify-center md:order-3 md:flex-1 md:justify-start">
                  {isRight ? (
                    <StepCard step={step} index={i} align="left" />
                  ) : (
                    <GhostNumber index={i} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
