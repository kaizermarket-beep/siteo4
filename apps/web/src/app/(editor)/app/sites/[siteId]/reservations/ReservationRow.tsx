"use client";

import { useState, useTransition } from "react";
import { setReservationStatus } from "@/server-actions/reservations";
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
  partySize,
  guestName,
  guestPhone,
  guestEmail,
  note,
  status: initialStatus,
}: {
  id: string;
  slot: string;
  partySize: number;
  guestName: string;
  guestPhone: string;
  guestEmail: string | null;
  note: string | null;
  status: ReservationStatus;
}) {
  const [status, setStatus] = useState(initialStatus);
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
        // confirmed a table they did not.
        setStatus(previous);
        setError(e instanceof Error ? e.message : "Échec de la mise à jour.");
      }
    });
  }

  const copy = STATUS_COPY[status];

  return (
    <li className="flex flex-col gap-3 rounded-lg border border-neutral-200 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-neutral-900 [font-variant-numeric:tabular-nums]">
            {slot}
          </span>
          <span className="text-sm text-neutral-500">
            {partySize} pers. · {guestName}
          </span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${copy.className}`}>
            {copy.label}
          </span>
        </div>
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
      </div>

      <div className="flex shrink-0 gap-2">
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
