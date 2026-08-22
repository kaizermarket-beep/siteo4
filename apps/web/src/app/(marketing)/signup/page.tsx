"use client";

import { Suspense, useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signup } from "@/server-actions/auth";
import { TermsCheckbox } from "@/components/TermsCheckbox";

function SignupForm() {
  const [state, formAction, pending] = useActionState(signup, undefined);
  const searchParams = useSearchParams();
  const template = searchParams.get("template") ?? "";

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="template" value={template} />
      <input
        name="name"
        type="text"
        placeholder="Nom"
        className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
      />
      <input
        name="password"
        type="password"
        placeholder="Mot de passe (8 caractères min.)"
        required
        minLength={8}
        className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
      />

      <TermsCheckbox />

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
      >
        {pending ? "Création…" : "Créer mon compte"}
      </button>
    </form>
  );
}

export default function SignupPage() {
  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-6 py-16">
      <h1 className="text-2xl font-semibold">Créer votre compte</h1>
      <p className="text-sm text-neutral-600">Essai gratuit de 7 jours, sans carte bancaire.</p>

      <Suspense fallback={null}>
        <SignupForm />
      </Suspense>

      <p className="text-sm text-neutral-600">
        Déjà un compte ?{" "}
        <Link href="/login" className="underline">
          Se connecter
        </Link>
      </p>
    </main>
  );
}
