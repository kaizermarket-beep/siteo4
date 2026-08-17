import type { ContactContent } from "@/validation/blocks";

export function ContactBlock({ content }: { content: ContactContent }) {
  return (
    <section id="contact" className="px-6 py-20">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">
          {content.title}
        </h2>
        {content.description && (
          <p className="text-neutral-600 dark:text-neutral-400">{content.description}</p>
        )}

        {(content.phone || content.address || content.hours) && (
          <div className="mt-2 flex flex-col items-center gap-1 text-sm text-neutral-600 dark:text-neutral-400">
            {content.address && <p>{content.address}</p>}
            {content.phone && (
              <a
                href={`tel:${content.phone.replace(/\s+/g, "")}`}
                className="hover:text-neutral-900 dark:hover:text-white"
              >
                {content.phone}
              </a>
            )}
            {content.hours && <p className="whitespace-pre-line">{content.hours}</p>}
          </div>
        )}

        {content.socialLinks.length > 0 && (
          <div className="mt-2 flex flex-wrap justify-center gap-4">
            {content.socialLinks
              .filter((s) => s.href)
              .map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                >
                  {s.platform || s.href}
                </a>
              ))}
          </div>
        )}

        {content.showForm ? (
          <form className="mt-4 flex w-full flex-col gap-3 text-left">
            <input
              type="text"
              placeholder="Nom"
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500"
              disabled
            />
            <input
              type="email"
              placeholder="Email"
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500"
              disabled
            />
            <textarea
              placeholder="Message"
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500"
              rows={4}
              disabled
            />
            <button
              type="button"
              className="rounded-md px-4 py-2 text-sm font-medium text-white"
              style={{ backgroundColor: "var(--site-accent, #171717)" }}
            >
              Envoyer
            </button>
          </form>
        ) : (
          <a
            href={`mailto:${content.email}`}
            className="rounded-md px-6 py-3 text-sm font-medium text-white"
            style={{ backgroundColor: "var(--site-accent, #171717)" }}
          >
            {content.email}
          </a>
        )}
      </div>
    </section>
  );
}
