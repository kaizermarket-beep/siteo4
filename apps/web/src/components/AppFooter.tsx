import Link from "next/link";

// Siteo's own footer — not to be confused with FooterBlock, which is a block
// inside a *customer's* published site. Rendered by both route groups so the
// legal pages are reachable from anywhere, which is itself a legal
// requirement (LCEN art. 6-III: the mentions must be directly accessible).
const legalLinks = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/cgv", label: "CGV" },
  { href: "/cgu", label: "CGU" },
  { href: "/confidentialite", label: "Confidentialité" },
  { href: "/cookies", label: "Cookies" },
];

export function AppFooter() {
  return (
    <footer className="border-t border-neutral-200 px-6 py-8">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-neutral-500">
          © {new Date().getFullYear()} Siteo. Tous droits réservés.
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {legalLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-neutral-500 hover:text-neutral-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
