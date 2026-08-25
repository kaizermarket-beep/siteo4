"use client";

import { useState, useTransition } from "react";
import { rescheduleReservation, setReservationStatus } from "@/server-actions/reservations";
import type { ReservationStatus } from "@/lib/db/schema";

const STATUS_COPY: Record<ReservationStatus, { label: string; className: string }> = {
  pending: { label: "En attente", className: "bg-amber-100 text-amber-900" },
  confirmed: { label: "Confirmée", className: "bg-green-100 text-green-900" },
  declined: { label: "Refusée", className: "bg-neutral-100 text-neutral-500" },
  cancelled: { label: "Annulée", className: "bg-neutral-100 text-neutral-500" },
};

export function ReservationRow({
  id,
  slot,
  serviceDate,
  partySize,
  serviceName,
  durationMinutes,
  guestName,
  guestPhone,
  guestEmail,
  note,
  status: initialStatus,
}: {
  id: string;
  slot: string;
  serviceDate: string;
  partySize: number;
  serviceName: string | null;
  durationMinutes: number | null;
  guestName: string;
  guestPhone: string;
  guestEmail: string | null;
  note: string | null;
  status: ReservationStatus;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [when, setWhen] = useState({ date: serviceDate, slot });
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function change(next: ReservationStatus) {
    const previous = status;
    setStatus(next);
    setError(null);
    startTransition(async () => {
      try {
        await setReservationStatus(id, next);
      } catch (e) {
        // Put the badge back rather than leave the owner believing they
        // confirmed a slot they did not.
        setStatus(previous);
        setError(e instanceof Error ? e.message : "Échec de la mise à jour.");
      }
    });
  }

  function move(date: string, time: string) {
    const previous = when;
    setWhen({ date, slot: time });
    setEditing(false);
    setError(null);
    startTransition(async () => {
      try {
        await rescheduleReservation(id, date, time);
      } catch (e) {
        setWhen(previous);
        setError(e instanceof Error ? e.message : "Échec du déplacement.");
      }
    });
  }

  const copy = STATUS_COPY[status];
  const inputClass = "rounded-md border border-neutral-300 px-2 py-1 text-sm";

  return (
    <li className="flex flex-col gap-3 rounded-lg border border-neutral-200 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-neutral-900 [font-variant-numeric:tabular-nums]">
            {when.slot}
          </span>
          <span className="text-sm text-neutral-500">
            {serviceName
              ? `${serviceName}${durationMinutes ? ` · ${durationMinutes} min` : ""}`
              : `${partySize} pers.`}{" "}
            · {guestName}
          </span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${copy.className}`}>
            {copy.label}
          </span>
        </div>
        {when.date !== serviceDate && (
          <p className="text-xs text-neutral-500">Déplacé au {when.date}</p>
        )}
        <div className="flex flex-wrap items-center gap-x-4 text-sm text-neutral-600">
          <a href={`tel:${guestPhone.replace(/\s+/g, "")}`} className="underline">
            {guestPhone}
          </a>
          {guestEmail && (
            <a href={`mailto:${guestEmail}`} className="truncate underline">
              {guestEmail}
            </a>
          )}
        </div>
        {note && <p className="text-sm text-neutral-500 italic">« {note} »</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {editing && (
          <form
            className="mt-1 flex flex-wrap items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.currentTarget);
              move(String(data.get("date")), String(data.get("slot")));
            }}
          >
            <input
              name="date"
              type="date"
              required
              defaultValue={when.date}
              aria-label="Nouvelle date"
              className={inputClass}
            />
            <input
              name="slot"
              type="time"
              required
              defaultValue={when.slot}
              aria-label="Nouvelle heure"
              className={inputClass}
            />
            <button
              type="submit"
              disabled={pending}
              className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm text-white disabled:opacity-50"
            >
              Déplacer
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="text-sm text-neutral-500 underline"
            >
              Fermer
            </button>
          </form>
        )}
      </div>

      <div className="flex shrink-0 flex-wrap gap-2">
        {status !== "confirmed" && (
          <button
            type="button"
            onClick={() => change("confirmed")}
            disabled={pending}
            className="rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
          >
            Confirmer
          </button>
        )}
        <button
          type="button"
          onClick={() => setEditing((v) => !v)}
          disabled={pending}
          className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
        >
          Déplacer
        </button>
        {status !== "cancelled" && (
          <button
            type="button"
            onClick={() => change("cancelled")}
            disabled={pending}
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
          >
            Annuler
          </button>
        )}
        {status !== "declined" && (
          <button
            type="button"
            onClick={() => change("declined")}
            disabled={pending}
            className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
          >
            Refuser
          </button>
        )}
      </div>
    </li>
  );
}
