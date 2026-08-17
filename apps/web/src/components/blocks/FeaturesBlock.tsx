import type { FeaturesContent } from "@/validation/blocks";

export function FeaturesBlock({ content }: { content: FeaturesContent }) {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        {content.title && (
          <h2 className="mb-12 text-center text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            {content.title}
          </h2>
        )}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {content.items.map((item, i) => (
            <div key={i} className="flex flex-col gap-3">
              <span className="text-2xl" aria-hidden>
                {item.icon}
              </span>
              <h3 className="text-lg font-medium text-neutral-900 dark:text-white">{item.title}</h3>
              {item.description && (
                <p className="text-sm text-neutral-600 dark:text-neutral-400">{item.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
