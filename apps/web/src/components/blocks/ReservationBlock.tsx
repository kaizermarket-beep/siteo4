"use client";

import { useCallback, useId, useState } from "react";
import type { ReservationContent } from "@/validation/blocks/reservation.schema";
import { currentSiteSlug } from "./current-site-slug";

// The booking form on a published restaurant site.
//
// Availability is fetched live from /api/reservations/availability rather
// than rendered into the page: published pages are cached for an hour, and
// an hour-old "2 tables left" is worse than showing nothing at all.
//
// It never says a table is booked. The restaurant confirms — the request is
// stored as "pending" and the confirmation screen says so. Telling a diner
// their table is held when nobody has looked at it is a promise the site
// cannot keep.

type Slot = { slot: string; seatsLeft: number; tablesLeft: number; available: boolean };

type Availability =
  | { kind: "idle" }
  | { kind: "closed"; reason: string }
  | { kind: "tooLarge"; maxPartySize: number; phone: string }
  | { kind: "slots"; slots: Slot[] }
  | { kind: "error"; message: string };

const REJECTION_COPY: Record<string, string> = {
  closed_day: "Le restaurant est fermé ce jour-là.",
  too_soon: "Cette date est déjà passée.",
  too_far: "Cette date est trop lointaine pour réserver en ligne.",
  bad_format: "Date invalide.",
};

const WEEKDAYS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

export function ReservationBlock({ content }: { content: ReservationContent }) {
  const formId = useId();
  const [date, setDate] = useState("");
  const [partySize, setPartySize] = useState(2);
  const [slot, setSlot] = useState("");
  // The answer is stored with the question it answers. That makes "loading"
  // a derived value rather than a state set inside an effect, and it means a
  // slow reply for an old date can never overwrite a newer one — its key no
  // longer matches, so it is simply ignored.
  const [result, setResult] = useState<{ key: string; value: Availability } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ slot: string; date: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const openDaysLabel = content.openDays
    .slice()
    .sort()
    .map((d) => WEEKDAYS[d])
    .join(", ");

  const requestKey = date ? `${date}|${partySize}` : "";
  const loading = requestKey !== "" && result?.key !== requestKey;
  const availability: Availability =
    result?.key === requestKey ? result.value : { kind: "idle" };

  // Called from the change handlers, not from an effect. On mount there is
  // no date yet, so there is nothing to synchronise — looking up availability
  // is a response to the visitor picking a day, which is what event handlers
  // are for. The new values are passed in because setState has not landed yet
  // when the handler runs.
  const loadAvailability = useCallback(async (nextDate: string, nextParty: number) => {
    if (!nextDate) return;
    const key = `${nextDate}|${nextParty}`;
    let value: Availability;
    try {
      const params = new URLSearchParams({
        site: currentSiteSlug(),
        date: nextDate,
        party: String(nextParty),
      });
      const res = await fetch(`/api/reservations/availability?${params}`);
      const data = await res.json();

      if (!res.ok) {
        value = { kind: "error", message: data.error ?? "Indisponible." };
      } else if (data.tooLarge) {
        value = { kind: "tooLarge", maxPartySize: data.maxPartySize, phone: data.phone };
      } else if (data.rejection) {
        value = {
          kind: "closed",
          reason: REJECTION_COPY[data.rejection] ?? "Réservation impossible ce jour-là.",
        };
      } else {
        value = { kind: "slots", slots: data.slots };
      }
    } catch {
      value = { kind: "error", message: "Impossible de vérifier les disponibilités." };
    }
    setResult({ key, value });
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(event.currentTarget);
    try {
      const res = await fetch("/api/reservations/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site: currentSiteSlug(),
          date,
          slot,
          partySize,
          name: form.get("name"),
          phone: form.get("phone"),
          email: form.get("email"),
          note: form.get("note"),
          company: form.get("company"),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "L'envoi a échoué.");
        // A 409 means someone took the slot while the form was being filled.
        if (res.status === 409) void loadAvailability(date, partySize);
      } else {
        setDone({ slot, date });
      }
    } catch {
      setError("L'envoi a échoué. Réessayez ou appelez le restaurant.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white";
  const labelClass = "flex flex-col gap-1 text-sm font-medium text-neutral-700 dark:text-neutral-300";

  if (done) {
    return (
      <section id="reservation" className="px-6 py-20">
        <div className="mx-auto max-w-md rounded-xl border border-neutral-200 p-8 text-center dark:border-neutral-700">
          <p className="text-4xl">🕐</p>
          <h2 className="mt-4 text-xl font-semibold text-neutral-900 dark:text-white">
            Demande envoyée
          </h2>
          <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
            Votre demande pour le {done.date} à {done.slot} a bien été transmise.{" "}
            <strong>Le restaurant vous confirmera la table</strong> — elle n&apos;est pas réservée
            tant que vous n&apos;avez pas reçu sa réponse.
          </p>
          {content.phone && (
            <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400">
              Une question ?{" "}
              <a href={`tel:${content.phone.replace(/\s+/g, "")}`} className="underline">
                {content.phone}
              </a>
            </p>
          )}
        </div>
      </section>
    );
  }

  return (
    <section id="reservation" className="px-6 py-20">
      <div className="mx-auto flex max-w-xl flex-col gap-6">
        {content.title && (
          <h2 className="text-center text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            {content.title}
          </h2>
        )}
        {content.description && (
          <p className="text-center text-neutral-600 dark:text-neutral-400">{content.description}</p>
        )}
        <p className="text-center text-sm text-neutral-500">Service le {openDaysLabel}.</p>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label htmlFor={`${formId}-date`} className={labelClass}>
              Date
              <input
                id={`${formId}-date`}
                type="date"
                required
                value={date}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => {
                  setDate(e.target.value);
                  setSlot("");
                  void loadAvailability(e.target.value, partySize);
                }}
                className={inputClass}
              />
            </label>

            <label htmlFor={`${formId}-party`} className={labelClass}>
              Personnes
              <select
                id={`${formId}-party`}
                value={partySize}
                onChange={(e) => {
                  const next = Number(e.target.value);
                  setPartySize(next);
                  setSlot("");
                  void loadAvailability(date, next);
                }}
                className={inputClass}
              >
                {Array.from({ length: content.maxPartySize }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n} {n > 1 ? "personnes" : "personne"}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div aria-live="polite">
            {loading && <p className="text-sm text-neutral-500">Recherche des disponibilités…</p>}
            {availability.kind === "closed" && (
              <p className="text-sm text-amber-700 dark:text-amber-500">{availability.reason}</p>
            )}
            {availability.kind === "error" && (
              <p className="text-sm text-red-600">{availability.message}</p>
            )}
            {availability.kind === "tooLarge" && (
              <p className="text-sm text-amber-700 dark:text-amber-500">
                Au-delà de {availability.maxPartySize} personnes, appelez le restaurant
                {availability.phone ? ` au ${availability.phone}` : ""}.
              </p>
            )}
            {availability.kind === "slots" && (
              <fieldset className="flex flex-col gap-2">
                <legend className="mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Créneau
                </legend>
                <div className="flex flex-wrap gap-2">
                  {availability.slots.map((s) => (
                    <button
                      key={s.slot}
                      type="button"
                      disabled={!s.available}
                      onClick={() => setSlot(s.slot)}
                      title={
                        s.available
                          ? `${s.seatsLeft} place${s.seatsLeft > 1 ? "s" : ""} restante${s.seatsLeft > 1 ? "s" : ""}`
                          : "Complet"
                      }
                      className={`rounded-md border px-3.5 py-2 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                        slot === s.slot
                          ? "border-transparent text-white"
                          : "border-neutral-300 text-neutral-800 hover:border-neutral-500 dark:border-neutral-600 dark:text-neutral-200"
                      }`}
                      style={slot === s.slot ? { backgroundColor: "var(--site-accent, #171717)" } : undefined}
                    >
                      {s.slot}
                    </button>
                  ))}
                </div>
                {availability.slots.every((s) => !s.available) && (
                  <p className="text-sm text-amber-700 dark:text-amber-500">
                    Complet pour cette date et ce nombre de personnes. Essayez un autre jour.
                  </p>
                )}
              </fieldset>
            )}
          </div>

          {slot && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label htmlFor={`${formId}-name`} className={labelClass}>
                  Nom
                  <input
                    id={`${formId}-name`}
                    name="name"
                    required
                    autoComplete="name"
                    className={inputClass}
                  />
                </label>
                <label htmlFor={`${formId}-phone`} className={labelClass}>
                  Téléphone
                  <input
                    id={`${formId}-phone`}
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    inputMode="tel"
                    className={inputClass}
                  />
                </label>
              </div>
              <label htmlFor={`${formId}-email`} className={labelClass}>
                Email (facultatif)
                <input
                  id={`${formId}-email`}
                  name="email"
                  type="email"
                  autoComplete="email"
                  spellCheck={false}
                  className={inputClass}
                />
              </label>
              <label htmlFor={`${formId}-note`} className={labelClass}>
                Précisions (facultatif)
                <textarea
                  id={`${formId}-note`}
                  name="note"
                  rows={3}
                  placeholder="Allergie, poussette, table en terrasse…"
                  className={inputClass}
                />
              </label>

              {/* Honeypot: hidden from people, irresistible to bots. */}
              <input
                name="company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
              />

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="rounded-md px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60"
                style={{ backgroundColor: "var(--site-accent, #171717)" }}
              >
                {submitting ? "Envoi…" : "Demander cette table"}
              </button>
              <p className="text-center text-xs text-neutral-500">
                Votre table sera confirmée par le restaurant.
              </p>
              {/* Information au moment de la collecte (RGPD art. 13). Le
                  restaurant est responsable de traitement, Siteo n'est
                  qu'hébergeur du formulaire. */}
              <p className="text-center text-xs text-neutral-400">
                Vos nom et téléphone sont transmis au restaurant pour traiter cette demande, et à
                rien d&apos;autre. Ils sont conservés 24 mois puis effacés. Pour y accéder, les
                corriger ou les supprimer, contactez le restaurant.
              </p>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
