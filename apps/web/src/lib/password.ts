// bcrypt work factor. Each +1 doubles the time to hash *and* the time to
// brute-force an offline copy of the password table; 12 is the current
// common floor and costs a few hundred milliseconds per signup, which
// nobody notices on a form submit.
//
// Raising it does not invalidate anything: the cost is stored inside each
// hash, so passwords hashed at 10 keep verifying at 10 until their owner
// sets a new one.
//
// Lives in its own module with no imports so the seed script can use it
// without pulling NextAuth (and the whole auth graph) into a CLI process.
export const BCRYPT_COST = 12;

/**
 * Minimum length.
 *
 * The CNIL's délibération n° 2022-100 accepts eight characters *provided*
 * the account is protected by an additional measure — here, the per-account
 * and per-IP rate limiting in lib/auth.ts. Without that measure the floor
 * would be twelve. Raising this number is safe; lowering it is not, and
 * would need the deliberation re-read first.
 */
export const MIN_PASSWORD_LENGTH = 8;

// The handful that appear at the top of every leaked-password list, plus the
// French ones such a list usually misses. Not a substitute for a breach
// database — a cheap floor that costs one comparison and stops the worst.
const BANNED = new Set([
  "12345678",
  "123456789",
  "1234567890",
  "azertyui",
  "azerty123",
  "qwertyui",
  "password",
  "password1",
  "motdepasse",
  "bonjour123",
  "soleil123",
  "iloveyou",
  "chocolat",
  "doudou123",
  "abcd1234",
  "00000000",
  "11111111",
]);

/**
 * Why a password cannot be used, or null when it can.
 *
 * Checked server-side on signup: the `minLength` attribute on the input is
 * a courtesy to the person typing, not a control — a form can be posted
 * without ever rendering it.
 */
export function rejectPassword(password: string, email: string): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères.`;
  }
  if (password.length > 200) {
    // bcrypt only reads the first 72 bytes anyway; the cap is there to stop
    // someone posting a megabyte and paying for it in hashing time.
    return "Le mot de passe est trop long.";
  }
  if (BANNED.has(password.toLowerCase())) {
    return "Ce mot de passe est parmi les plus courants. Choisissez-en un autre.";
  }
  const localPart = email.split("@")[0]?.toLowerCase() ?? "";
  if (localPart.length >= 3 && password.toLowerCase().includes(localPart)) {
    return "Le mot de passe ne doit pas contenir votre adresse email.";
  }
  return null;
}
