import type { PricingContent } from "@/validation/blocks";

export function PricingBlock({ content }: { content: PricingContent }) {
  return (
    <section className="bg-neutral-50 px-6 py-20">
      <div className="mx-auto max-w-5xl">
        {content.title && (
          <h2 className="mb-12 text-center text-3xl font-semibold tracking-tight text-neutral-900">
            {content.title}
          </h2>
        )}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {content.plans.map((plan, i) => (
            <div
              key={i}
              className={`flex flex-col gap-4 rounded-xl border p-6 ${
                plan.highlighted
                  ? "border-neutral-900 bg-white shadow-sm"
                  : "border-neutral-200 bg-white"
              }`}
            >
              <h3 className="text-lg font-medium text-neutral-900">{plan.name}</h3>
              <p className="text-3xl font-semibold text-neutral-900">
                {plan.price}
                {plan.period && (
                  <span className="text-base font-normal text-neutral-500"> {plan.period}</span>
                )}
              </p>
              <ul className="flex flex-col gap-2 text-sm text-neutral-600">
                {plan.features.map((f, j) => (
                  <li key={j}>{f}</li>
                ))}
              </ul>
              <a
                href="#contact"
                className="mt-auto rounded-md px-4 py-2 text-center text-sm font-medium text-white"
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
