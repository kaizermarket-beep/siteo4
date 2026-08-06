import type { FooterContent } from "@/validation/blocks";

export function FooterBlock({ content }: { content: FooterContent }) {
  return (
    <footer className="flex flex-col items-center gap-3 border-t border-neutral-200 px-6 py-10 text-sm text-neutral-500">
      {content.links.length > 0 && (
        <nav className="flex flex-wrap justify-center gap-4">
          {content.links.map((link, i) => (
            <a key={i} href={link.href} className="hover:text-neutral-800">
              {link.label}
            </a>
          ))}
        </nav>
      )}
      {content.text && <p>{content.text}</p>}
    </footer>
  );
}
