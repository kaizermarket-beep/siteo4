"use client";

import { useCallback, useId, useState } from "react";
import type { AppointmentContent } from "@/validation/blocks/appointment.schema";
import { currentSiteSlug } from "./current-site-slug";

// The appointment form on a published site — hair salon, cleaning firm,
// anything booked by the slot.
//
// Availability is fetched live from /api/appointments/availability rather
// than rendered into the page: published pages are cached for an hour, and
// an hour-old "11:30 libre" is worse than showing nothing at all.
//
// It never says a slot is booked. The professional confirms — the request is
// stored as "pending" and the screen says so. Telling someone their
// appointment is held when nobody has looked at it is a promise the site
// cannot keep.

type Slot = { slot: string; available: boolean };

type Availability =
  | { kind: "idle" }
  | { kind: "closed"; reason: string }
  | { kind: "slots"; slots: Slot[] }
  | { kind: "error"; message: string };

const REJECTION_COPY: Record<string, string> = {
  closed_day: "Nous sommes fermés ce jour-là.",
  too_soon: "Cette date est déjà passée.",
  too_far: "Cette date est trop lointaine pour réserver en ligne.",
  bad_format: "Date invalide.",
};

const WEEKDAYS = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

const DATE_FMT = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

/** "2026-08-26" → "mercredi 26 août". */
function frenchDate(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return DATE_FMT.format(new Date(Date.UTC(y, m - 1, d)));
}

/** "09:30" → "9h30", "14:00" → "14h" — how opening hours are written here. */
function frenchTime(time: string): string {
  const [h, m] = time.split(":");
  return m === "00" ? `${Number(h)}h` : `${Number(h)}h${m}`;
}

export function AppointmentBlock({ content }: { content: AppointmentContent }) {
  const formId = useId();
  const [serviceName, setServiceName] = useState(content.services[0]?.name ?? "");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  // The answer is stored with the question it answers. That makes "loading" a
  // derived value rather than state set inside an effect, and a slow reply for
  // an old date can never overwrite a newer one — its key no longer matches,
  // so it is simply ignored.
  const [result, setResult] = useState<{ key: string; value: Availability } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ slot: string; date: string; email: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const service = content.services.find((s) => s.name === serviceName) ?? content.services[0];

  const requestKey = date ? `${date}|${serviceName}` : "";
  const loading = requestKey !== "" && result?.key !== requestKey;
  const availability: Availability = result?.key === requestKey ? result.value : { kind: "idle" };

  // Called from the change handlers, not from an effect: looking up
  // availability is a response to the visitor picking a day, which is what
  // event handlers are for. The new values are passed in because setState has
  // not landed yet when the handler runs.
  const loadAvailability = useCallback(async (nextDate: string, nextService: string) => {
    if (!nextDate || !nextService) return;
    const key = `${nextDate}|${nextService}`;
    let value: Availability;
    try {
      const params = new URLSearchParams({
        site: currentSiteSlug(),
        date: nextDate,
        service: nextService,
      });
      const res = await fetch(`/api/appointments/availability?${params}`);
      const data = await res.json();

      if (!res.ok) {
        value = { kind: "error", message: data.error ?? "Indisponible." };
      } else if (data.rejection) {
        value = {
          kind: "closed",
          reason: REJECTION_COPY[data.rejection] ?? "Rendez-vous impossible ce jour-là.",
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
    const email = String(form.get("email") ?? "");
    try {
      const res = await fetch("/api/appointments/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          site: currentSiteSlug(),
          date,
          slot,
          service: serviceName,
          name: form.get("name"),
          phone: form.get("phone"),
          email,
          note: form.get("note"),
          company: form.get("company"),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "L'envoi a échoué.");
        // A 409 means someone took the slot while the form was being filled.
        if (res.status === 409) void loadAvailability(date, serviceName);
      } else {
        setDone({ slot, date, email });
      }
    } catch {
      setError("L'envoi a échoué. Réessayez ou appelez-nous.");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white";
  const labelClass = "flex flex-col gap-1 text-sm font-medium text-neutral-700 dark:text-neutral-300";

  if (done) {
    return (
      <section id="rendez-vous" className="px-6 py-20">
        <div className="mx-auto max-w-md rounded-xl border border-neutral-200 p-8 text-center dark:border-neutral-700">
          <p className="text-4xl">🗓️</p>
          <h2 className="mt-4 text-xl font-semibold text-neutral-900 dark:text-white">
            Demande envoyée
          </h2>
          <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
            Votre demande pour le {frenchDate(done.date)} à {frenchTime(done.slot)} a bien été
            transmise.{" "}
            <strong>Votre rendez-vous vous sera confirmé</strong> — il n&apos;est pas réservé
            tant que vous n&apos;avez pas reçu sa réponse à {done.email}.
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

  const openDays = content.hours.filter((h) => h.ranges.length > 0).sort((a, b) => a.day - b.day);

  return (
    <section id="rendez-vous" className="px-6 py-20">
      <div className="mx-auto flex max-w-xl flex-col gap-6">
        {content.title && (
          <h2 className="text-center text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            {content.title}
          </h2>
        )}
        {content.description && (
          <p className="text-center text-neutral-600 dark:text-neutral-400">{content.description}</p>
        )}

        {openDays.length > 0 && (
          <ul className="mx-auto flex flex-col gap-0.5 text-sm text-neutral-500">
            {openDays.map((day) => (
              <li key={day.day} className="flex justify-between gap-6">
                <span>{WEEKDAYS[day.day]}</span>
                <span className="[font-variant-numeric:tabular-nums]">
                  {day.ranges.map((r) => `${frenchTime(r.start)}–${frenchTime(r.end)}`).join(" · ")}
                </span>
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={submit} className="flex flex-col gap-4">
          <label htmlFor={`${formId}-service`} className={labelClass}>
            Prestation
            <select
              id={`${formId}-service`}
              value={serviceName}
              onChange={(e) => {
                setServiceName(e.target.value);
                setSlot("");
                void loadAvailability(date, e.target.value);
              }}
              className={inputClass}
            >
              {content.services.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name} — {s.durationMinutes} min{s.price ? ` · ${s.price}` : ""}
                </option>
              ))}
            </select>
          </label>

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
                void loadAvailability(e.target.value, serviceName);
              }}
              className={inputClass}
            />
          </label>

          <div aria-live="polite">
            {loading && <p className="text-sm text-neutral-500">Recherche des disponibilités…</p>}
            {availability.kind === "closed" && (
              <p className="text-sm text-amber-700 dark:text-amber-500">{availability.reason}</p>
            )}
            {availability.kind === "error" && (
              <p className="text-sm text-red-600">{availability.message}</p>
            )}
            {availability.kind === "slots" && (
              <fieldset className="flex flex-col gap-2">
                <legend className="mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Créneau {service ? `(${service.durationMinutes} min)` : ""}
                </legend>
                <div className="flex flex-wrap gap-2">
                  {availability.slots.map((s) => (
                    <button
                      key={s.slot}
                      type="button"
                      disabled={!s.available}
                      onClick={() => setSlot(s.slot)}
                      title={s.available ? "Disponible" : "Déjà pris"}
                      className={`rounded-md border px-3.5 py-2 text-sm [font-variant-numeric:tabular-nums] transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                        slot === s.slot
                          ? "border-transparent text-white"
                          : "border-neutral-300 text-neutral-800 hover:border-neutral-500 dark:border-neutral-600 dark:text-neutral-200"
                      }`}
                      style={
                        slot === s.slot
                          ? { backgroundColor: "var(--site-accent, #171717)" }
                          : undefined
                      }
                    >
                      {s.slot}
                    </button>
                  ))}
                </div>
                {availability.slots.length === 0 && (
                  <p className="text-sm text-amber-700 dark:text-amber-500">
                    Aucun créneau assez long pour cette prestation ce jour-là.
                  </p>
                )}
                {availability.slots.length > 0 && availability.slots.every((s) => !s.available) && (
                  <p className="text-sm text-amber-700 dark:text-amber-500">
                    Complet pour cette date. Essayez un autre jour.
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
                Email
                <input
                  id={`${formId}-email`}
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  spellCheck={false}
                  className={inputClass}
                />
                <span className="text-xs font-normal text-neutral-500">
                  C&apos;est là que vous recevrez la confirmation.
                </span>
              </label>
              <label htmlFor={`${formId}-note`} className={labelClass}>
                Précisions (facultatif)
                <textarea
                  id={`${formId}-note`}
                  name="note"
                  rows={3}
                  placeholder={content.notePlaceholder || "Toute précision utile…"}
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
                {submitting ? "Envoi…" : "Demander ce rendez-vous"}
              </button>
              <p className="text-center text-xs text-neutral-500">
                Votre rendez-vous sera confirmé avant d’être définitif.
              </p>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
