// Retention durations, as plain constants.
//
// Kept apart from retention.ts — which imports the database — so that the
// legal pages and the account screen can quote the policy without pulling
// the Postgres driver into their bundle. The policy is what the pages
// promise; retention.ts is what enforces it, and it reads its numbers here
// so the two can never drift.

/** Security log of rate-limit attempts. Useless once the window has passed. */
export const RATE_LIMIT_HIT_DAYS = 7;

/**
 * An unclaimed draft. Matches the 30-day lifetime of the `siteo_guest`
 * cookie: once the cookie is gone the visitor can never reach the draft
 * again, so keeping the row keeps personal data nobody can use.
 */
export const GUEST_ACCOUNT_DAYS = 30;

/**
 * Bookings, counted from the date of service. Two years covers a dispute
 * about a no-show or an unpaid table, which is the only reason to keep a
 * name and a phone number after the meal. Siteo is a processor here: the
 * professional remains free to delete sooner from their dashboard.
 */
export const RESERVATION_MONTHS = 24;

export const retentionSummary = [
  { what: "Journal anti-abus (limitation de débit)", duration: `${RATE_LIMIT_HIT_DAYS} jours` },
  { what: "Brouillon de site créé sans compte", duration: `${GUEST_ACCOUNT_DAYS} jours sans activité` },
  { what: "Réservations et rendez-vous", duration: `${RESERVATION_MONTHS} mois après la date du service` },
  { what: "Sessions et jetons expirés", duration: "supprimés dès expiration" },
] as const;
