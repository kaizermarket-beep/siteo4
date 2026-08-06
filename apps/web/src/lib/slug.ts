// Subdomains no user may claim, regardless of availability — kept in sync
// with the reserved-word check in middleware.ts once that's built (M5).
export const RESERVED_SLUGS = [
  "www",
  "app",
  "api",
  "admin",
  "mail",
  "cdn",
  "ftp",
  "siteo",
  "support",
  "help",
  "blog",
  "status",
  "docs",
  "assets",
  "static",
];

const SLUG_REGEX = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/;
const COMBINING_DIACRITICS_REGEX = new RegExp("[\\u0300-\\u036f]", "g");

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(COMBINING_DIACRITICS_REGEX, "") // strip accents (after NFD normalization)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 63);
}

export function validateSlug(slug: string): { ok: true } | { ok: false; error: string } {
  if (!slug || slug.length < 2) {
    return { ok: false, error: "L'adresse doit contenir au moins 2 caractères." };
  }
  if (!SLUG_REGEX.test(slug)) {
    return {
      ok: false,
      error: "Utilisez uniquement des lettres minuscules, chiffres et tirets.",
    };
  }
  if (RESERVED_SLUGS.includes(slug)) {
    return { ok: false, error: "Cette adresse est réservée." };
  }
  return { ok: true };
}
