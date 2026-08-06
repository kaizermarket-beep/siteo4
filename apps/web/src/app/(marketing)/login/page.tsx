import Link from "next/link";
import { signIn } from "@/lib/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; signup?: string }>;
}) {
  const { error, signup } = await searchParams;

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-6 py-16">
      <h1 className="text-2xl font-semibold">Se connecter</h1>

      {signup === "success" && (
        <p className="text-sm text-green-700">Compte créé, vous pouvez vous connecter.</p>
      )}

      <form
        action={async (formData) => {
          "use server";
          await signIn("credentials", { ...Object.fromEntries(formData), redirectTo: "/app" });
        }}
        className="flex flex-col gap-4"
      >
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
          placeholder="Mot de passe"
          required
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
        />

        {error && <p className="text-sm text-red-600">Email ou mot de passe incorrect.</p>}

        <button
          type="submit"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          Se connecter
        </button>
      </form>

      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/app" });
        }}
      >
        <button
          type="submit"
          className="w-full rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-50"
        >
          Continuer avec Google
        </button>
      </form>

      <p className="text-sm text-neutral-600">
        Pas encore de compte ?{" "}
        <Link href="/signup" className="underline">
          Créer un compte
        </Link>
      </p>
    </main>
  );
}
