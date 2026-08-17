"use client";

import type { CSSProperties, MouseEvent } from "react";
import type { PricingContent } from "@/validation/blocks";

// Mouse-tracked 3D tilt + a glossy highlight that follows the cursor —
// imperative DOM writes (no re-render) for a snappy, tactile feel on the
// plan the site owner wants visitors to pick. Reserved for `highlighted`
// plans so the effect reads as "the one to choose", not decoration everywhere.
function handleTilt(e: MouseEvent<HTMLDivElement>) {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const px = (e.clientX - rect.left) / rect.width;
  const py = (e.clientY - rect.top) / rect.height;
  const rx = (0.5 - py) * 10;
  const ry = (px - 0.5) * 10;
  card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px) scale(1.015)`;
  card.style.setProperty("--sheen-x", `${px * 100}%`);
  card.style.setProperty("--sheen-y", `${py * 100}%`);
  card.style.setProperty("--sheen-opacity", "1");
}

function resetTilt(e: MouseEvent<HTMLDivElement>) {
  const card = e.currentTarget;
  card.style.transform = "";
  card.style.setProperty("--sheen-opacity", "0");
}

export function PricingBlock({ content }: { content: PricingContent }) {
  return (
    <section className="bg-neutral-50 px-6 py-20 dark:bg-neutral-900">
      <div className="mx-auto max-w-5xl">
        {content.title && (
          <h2 className="mb-12 text-center text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            {content.title}
          </h2>
        )}
        <div className="grid grid-cols-1 gap-6 [perspective:1200px] sm:grid-cols-2 lg:grid-cols-3">
          {content.plans.map((plan, i) => (
            <div
              key={i}
              onMouseMove={plan.highlighted ? handleTilt : undefined}
              onMouseLeave={plan.highlighted ? resetTilt : undefined}
              className={`relative flex flex-col gap-4 overflow-hidden rounded-xl border p-6 transition-transform duration-200 ease-out will-change-transform ${
                plan.highlighted
                  ? "border-neutral-900 bg-white shadow-sm dark:border-transparent dark:bg-neutral-800"
                  : "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"
              }`}
              style={
                plan.highlighted
                  ? ({
                      boxShadow:
                        "0 0 0 1px color-mix(in srgb, var(--site-accent, #171717) 60%, transparent), 0 8px 30px -8px color-mix(in srgb, var(--site-accent, #171717) 45%, transparent)",
                      "--sheen-opacity": 0,
                    } as CSSProperties)
                  : undefined
              }
            >
              {plan.highlighted && (
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-[var(--sheen-opacity,0)] transition-opacity duration-200"
                  style={{
                    background:
                      "radial-gradient(240px circle at var(--sheen-x,50%) var(--sheen-y,50%), color-mix(in srgb, var(--site-accent, #171717) 18%, transparent), transparent 70%)",
                  }}
                />
              )}
              <h3 className="relative text-lg font-medium text-neutral-900 dark:text-white">{plan.name}</h3>
              <p className="relative text-3xl font-semibold text-neutral-900 dark:text-white">
                {plan.price}
                {plan.period && (
                  <span className="text-base font-normal text-neutral-500 dark:text-neutral-400"> {plan.period}</span>
                )}
              </p>
              <ul className="relative flex flex-col gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                {plan.features.map((f, j) => (
                  <li key={j}>{f}</li>
                ))}
              </ul>
              <a
                href="#contact"
                className="relative mt-auto rounded-md px-4 py-2 text-center text-sm font-medium text-white"
                style={{ backgroundColor: "var(--site-accent, #171717)" }}
              >
                {plan.ctaLabel}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
