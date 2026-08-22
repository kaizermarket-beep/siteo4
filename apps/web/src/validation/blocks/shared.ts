import { z } from "zod";

// Anything a site owner types into a link field is rendered straight into an
// `<a href>` on their published site, which their visitors then click. React
// escapes the *value* but not the *scheme*: `javascript:fetch(...)` in a
// footer link is stored XSS running in every visitor's browser, on a domain
// the owner controls. So the scheme is an allowlist, not a filter.
const SAFE_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);

export const UNSAFE_HREF_MESSAGE =
  "Lien invalide. Utilisez une adresse commençant par https://, mailto:, tel:, par / pour une page du site, ou par # pour une ancre.";

export function isSafeHref(value: string): boolean {
  // Empty means "not set" — the editor forms bind to {href:"",label:""}
  // rather than undefined, and blocks already treat "" as absent.
  if (value === "") return true;

  // Same-page anchor, e.g. "#contact".
  if (value.startsWith("#")) return true;

  // Protocol-relative ("//evil.com") is checked before the site-relative
  // rule below, which would otherwise wave it through on its leading slash.
  // It is legal HTML but almost never what someone means to type, and it
  // reads as an internal link while pointing somewhere else entirely.
  if (value.startsWith("//")) return false;

  // Site-relative, e.g. "/contact" — the form multi-page sites use.
  if (value.startsWith("/")) return true;

  try {
    // URL does the normalising that makes hand-rolled checks fail:
    // it lowercases the scheme, trims leading whitespace, and strips the
    // tabs and newlines that turn "java\nscript:" back into "javascript:".
    return SAFE_PROTOCOLS.has(new URL(value).protocol);
  } catch {
    // Not parseable as an absolute URL and not one of the relative forms
    // above — reject rather than guess.
    return false;
  }
}

export const safeHrefSchema = z
  .string()
  .max(2048)
  .default("")
  .refine(isSafeHref, { message: UNSAFE_HREF_MESSAGE });

// href/label/url are allowed empty: optional link/image fields are stored as
// {href:"",label:""} / {url:"",alt:""} by the editor forms (so react-hook-form
// always has a controlled object to bind to) rather than as `undefined`, and
// block components treat an empty string as "not set" when rendering.
export const linkSchema = z.object({
  href: safeHrefSchema,
  label: z.string().max(40).default(""),
});

// Image URLs end up in `<img src>` and in CSS `url()`, where neither
// `javascript:` nor `data:` can execute a script — so this is narrower than
// the href rule needs to be, and it exists mainly to keep a link field and
// an image field from behaving differently for no visible reason.
export const imageSchema = z.object({
  url: z
    .string()
    .max(2048)
    .default("")
    .refine(
      (value) =>
        value === "" ||
        (!value.startsWith("//") && value.startsWith("/")) ||
        /^https?:$/.test(safeProtocolOf(value)),
      { message: "Adresse d'image invalide. Utilisez https:// ou un fichier importé." }
    ),
  alt: z.string().max(160).default(""),
});

function safeProtocolOf(value: string): string {
  try {
    return new URL(value).protocol;
  } catch {
    return "";
  }
}
