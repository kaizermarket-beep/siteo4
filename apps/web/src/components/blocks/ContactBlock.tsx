import type { ContactContent } from "@/validation/blocks";

export function ContactBlock({ content }: { content: ContactContent }) {
  return (
    <section id="contact" className="px-6 py-20">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-neutral-900">
          {content.title}
        </h2>
        {content.description && <p className="text-neutral-600">{content.description}</p>}

        {content.showForm ? (
          <form className="mt-4 flex w-full flex-col gap-3 text-left">
            <input
              type="text"
              placeholder="Nom"
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
              disabled
            />
            <input
              type="email"
              placeholder="Email"
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
              disabled
            />
            <textarea
              placeholder="Message"
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
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
