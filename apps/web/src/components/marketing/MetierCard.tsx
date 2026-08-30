"use client";

import Link from "next/link";

// Tailwind wraps every `hover:` utility in `@media (hover: hover)`, so on a
// phone — where most artisans browse — none of the reveal below ever fires
// and the six cards sit there grey and inert, looking broken. The
// `[@media(hover:none)]:` counterparts give those devices the revealed state
// as their *resting* state, and `active:` gives them the press feedback that
// hover would otherwise provide. The desktop design is untouched.
export function MetierCard({
  href,
  icon,
  label,
  image,
}: {
  href: string;
  icon: string;
  label: string;
  image: string;
}) {
  return (
    <Link
      href={href}
      className="group relative flex aspect-[4/3] flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 text-center shadow-sm transition-all duration-300 ease-out hover:z-10 hover:scale-110 hover:border-neutral-900 hover:shadow-xl focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 active:scale-95"
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60 grayscale transition-all duration-300 ease-out group-hover:scale-110 group-hover:opacity-100 group-hover:grayscale-0 [@media(hover:none)]:opacity-100 [@media(hover:none)]:grayscale-0"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/40 transition-opacity duration-300 ease-out group-hover:from-black/85 group-hover:via-black/30 group-hover:to-black/0" />

      <span className="relative z-10 text-3xl drop-shadow-sm transition-transform duration-300 ease-out group-hover:scale-125">
        {icon}
      </span>
      <span className="relative z-10 font-medium text-white transition-colors duration-300 ease-out">
        {label}
      </span>
    </Link>
  );
}
