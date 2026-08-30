"use client";

import { useActionState, useState } from "react";
import { deleteAccount } from "@/server-actions/account";

export function DeleteAccountForm({
  hasPassword,
  siteCount,
}: {
  hasPassword: boolean;
  siteCount: number;
}) {
  const [state, formAction, pending] = useActionState(deleteAccount, undefined);
  // Closed by default: an irreversible action should take a deliberate
  // click to even reveal, not sit one stray keypress away from the rest of
  // the page.
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-fit rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
      >
        Supprimer mon compte
      </button>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4 rounded-lg border border-red-200 bg-red-50/60 p-4">
      <p className="text-sm text-red-900">
        Cette action est <strong>définitive</strong>. Elle efface votre compte,{" "}
        {siteCount === 0 ? "vos sites" : `vos ${siteCount} site${siteCount > 1 ? "s" : ""}`}, leurs
        pages, leur contenu et les réservations reçues. Les sites publiés cessent immédiatement
        d&apos;être accessibles. Rien n&apos;est récupérable ensuite.
      </p>

      <label className="flex flex-col gap-1 text-sm font-medium text-neutral-800">
        Tapez SUPPRIMER pour confirmer
        <input
          name="confirmation"
          required
          autoComplete="off"
          spellCheck={false}
          placeholder="SUPPRIMER"
          className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-normal"
        />
      </label>

      {hasPassword ? (
        <label className="flex flex-col gap-1 text-sm font-medium text-neutral-800">
          Votre mot de passe
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-normal"
          />
        </label>
      ) : (
        <label className="flex flex-col gap-1 text-sm font-medium text-neutral-800">
          Votre adresse email
          <span className="text-xs font-normal text-neutral-600">
            Ce compte se connecte via Google et n&apos;a pas de mot de passe à ressaisir.
          </span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            spellCheck={false}
            className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-normal"
          />
        </label>
      )}

      {state?.error && <p className="text-sm text-red-700">{state.error}</p>}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
        >
          {pending ? "Suppression…" : "Supprimer définitivement"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm text-neutral-700"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
