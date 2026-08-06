import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        Créez votre site professionnel en quelques minutes
      </h1>
      <p className="max-w-xl text-lg text-neutral-600">
        Siteo vous aide à publier un site qui donne confiance, à partir de modèles pensés
        pour les indépendants et les entreprises.
      </p>
      <div className="flex gap-4">
        <Link
          href="/signup"
          className="rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
        >
          Créer mon site
        </Link>
        <Link
          href="/login"
          className="rounded-md border border-neutral-300 px-5 py-2.5 text-sm font-medium hover:bg-neutral-50"
        >
          Se connecter
        </Link>
      </div>
    </main>
  );
}
