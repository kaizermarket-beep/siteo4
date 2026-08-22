import Link from "next/link";

// The visible half of the consent gate. The server refuses a signup without
// it (server-actions/auth.ts and upgrade-and-publish.ts) — `required` here
// only saves the user a round trip.
//
// Deliberately not pre-checked: a pre-ticked box is not valid consent, and
// French consumer law treats a pre-ticked acceptance as unwritten.
export function TermsCheckbox({ id = "acceptTerms" }: { id?: string }) {
  return (
    <label htmlFor={id} className="flex items-start gap-2.5 text-sm text-neutral-600">
      <input
        id={id}
        name="acceptTerms"
        type="checkbox"
        required
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-neutral-300 accent-neutral-900"
      />
      <span>
        J&apos;accepte les{" "}
        <Link href="/cgv" target="_blank" className="underline hover:text-neutral-900">
          CGV
        </Link>{" "}
        et la{" "}
        <Link href="/confidentialite" target="_blank" className="underline hover:text-neutral-900">
          politique de confidentialité
        </Link>
        .
      </span>
    </label>
  );
}
