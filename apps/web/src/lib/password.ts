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
