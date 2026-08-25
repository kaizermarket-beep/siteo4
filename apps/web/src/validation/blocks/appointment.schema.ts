import { z } from "zod";

/** "HH:MM", 24-hour. */
const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Heure attendue au format 09:30");

/** "YYYY-MM-DD", a single closed day. */
const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date attendue au format 2026-08-31");

/**
 * One continuous stretch of opening, e.g. 09:00 → 12:00.
 *
 * A day is a list of these rather than a single pair because the lunch break
 * is the whole point: a salon open 9h-12h and 14h-18h must not offer 12h30.
 */
export const openRangeSchema = z.object({
  start: timeSchema.default("09:00"),
  end: timeSchema.default("18:00"),
});

export const dayHoursSchema = z.object({
  /** 0 = Sunday through 6 = Saturday, matching Date#getDay. */
  day: z.number().int().min(0).max(6),
  ranges: z.array(openRangeSchema).max(4).default([]),
});

/**
 * A bookable prestation.
 *
 * The duration is what drives availability — a colouring at 90 minutes eats
 * three half-hour slots — so it is required, while the price is display-only
 * and free-form ("35€", "à partir de 60€").
 */
export const appointmentServiceSchema = z.object({
  name: z.string().max(60).default("Coupe"),
  durationMinutes: z.number().int().min(5).max(480).default(30),
  price: z.string().max(20).default(""),
});

export const appointmentContentSchema = z.object({
  title: z.string().max(60).default("Prendre rendez-vous"),
  description: z.string().max(200).default(""),

  services: z
    .array(appointmentServiceSchema)
    .min(1)
    .max(12)
    .default([
      { name: "Coupe femme", durationMinutes: 45, price: "35€" },
      { name: "Coupe homme", durationMinutes: 30, price: "25€" },
      { name: "Coloration", durationMinutes: 90, price: "65€" },
    ]),

  /**
   * Opening hours, one entry per open weekday. A weekday absent from this
   * list is closed — which is why there is no separate "openDays".
   */
  hours: z
    .array(dayHoursSchema)
    .max(7)
    .default([
      { day: 2, ranges: [{ start: "09:30", end: "12:30" }, { start: "14:00", end: "19:00" }] },
      { day: 3, ranges: [{ start: "09:30", end: "12:30" }, { start: "14:00", end: "19:00" }] },
      { day: 4, ranges: [{ start: "09:30", end: "12:30" }, { start: "14:00", end: "19:00" }] },
      { day: 5, ranges: [{ start: "09:30", end: "12:30" }, { start: "14:00", end: "19:00" }] },
      { day: 6, ranges: [{ start: "09:00", end: "17:00" }] },
    ]),

  /** Exceptional closures — holidays, jours fériés — that override `hours`. */
  closedDates: z.array(dateSchema).max(60).default([]),

  /** How many appointments can run at once: chairs, or rather people. */
  staffCount: z.number().int().min(1).max(20).default(1),
  /** Granularity of the proposed start times, in minutes. */
  slotStep: z.number().int().min(5).max(120).default(15),
  /** Hours of notice required; blocks "un rendez-vous dans dix minutes". */
  noticeHours: z.number().int().min(0).max(168).default(2),
  /** How far ahead the calendar opens. */
  maxDaysAhead: z.number().int().min(1).max(365).default(60),

  /**
   * Hint shown under the free-text box. Trade-specific: a salon asks about
   * length and colour, a cleaning firm about floor and access codes.
   */
  notePlaceholder: z.string().max(100).default(""),

  phone: z.string().max(30).default(""),
  /**
   * Where new requests are notified. Empty falls back to the account email
   * of the site owner — a guest draft has no real address, so nothing is
   * sent until the owner signs up or fills this in.
   */
  notifyEmail: z.string().max(200).default(""),
});

export type AppointmentContent = z.infer<typeof appointmentContentSchema>;
export type AppointmentService = z.infer<typeof appointmentServiceSchema>;
