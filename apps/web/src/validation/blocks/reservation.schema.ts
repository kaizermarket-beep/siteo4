import { z } from "zod";

/** "HH:MM", 24-hour. */
const slotSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Créneau attendu au format 19:30");

export const reservationContentSchema = z.object({
  title: z.string().max(60).default("Réserver une table"),
  description: z.string().max(200).default(""),

  // --- Capacity, as the restaurant counts it -----------------------------
  // Two numbers rather than a list of tables with sizes. Seating a party is
  // a packing problem, and a site that told someone "complet" because it
  // could not fit a four-top into two deuces would be arguing with a
  // restaurateur who knows perfectly well they can push tables together.
  // Both limits are checked: a forty-cover room with ten tables cannot take
  // twenty parties of two.
  /** Tables available per service. Each booking occupies one. */
  tableCount: z.number().int().min(1).max(300).default(10),
  /** Covers available per service. */
  seatCount: z.number().int().min(1).max(2000).default(40),
  /** Above this, the form sends the visitor to the phone instead. */
  maxPartySize: z.number().int().min(1).max(50).default(8),

  // --- Service --------------------------------------------------------
  /** Open days, 0 = Sunday through 6 = Saturday. */
  openDays: z.array(z.number().int().min(0).max(6)).max(7).default([2, 3, 4, 5, 6]),
  slots: z.array(slotSchema).min(1).max(24).default(["12:00", "12:30", "19:00", "19:30", "20:00", "20:30"]),
  /** Hours of notice required; blocks "a table in ten minutes". */
  noticeHours: z.number().int().min(0).max(168).default(2),
  /** How far ahead the calendar opens. */
  maxDaysAhead: z.number().int().min(1).max(365).default(60),

  // --- Contact --------------------------------------------------------
  /** Shown for parties over maxPartySize, and used for the WhatsApp handoff. */
  phone: z.string().max(30).default(""),
  /** Notified on WhatsApp when a request comes in. Digits only once cleaned. */
  whatsappPhone: z.string().max(30).default(""),
});

export type ReservationContent = z.infer<typeof reservationContentSchema>;
