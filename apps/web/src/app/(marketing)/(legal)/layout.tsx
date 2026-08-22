import Link from "next/link";

const pages = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/cgv", label: "CGV" },
  { href: "/cgu", label: "CGU" },
  { href: "/confidentialite", label: "Confidentialité" },
  { href: "/cookies", label: "Cookies" },
];

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-14">
      <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <Link href="/" className="text-neutral-500 hover:text-neutral-900">
          ← Siteo
        </Link>
        <span className="text-neutral-300">|</span>
        {pages.map((p) => (
          <Link key={p.href} href={p.href} className="text-neutral-500 hover:text-neutral-900">
            {p.label}
          </Link>
        ))}
      </nav>
      <article className="flex flex-col gap-10">{children}</article>
    </main>
  );
}
