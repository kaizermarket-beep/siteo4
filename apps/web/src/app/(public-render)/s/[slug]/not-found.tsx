export default function SiteNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Ce site n&apos;est pas disponible</h1>
      <p className="max-w-md text-neutral-600">
        Il n&apos;existe pas, ou n&apos;a pas encore été publié par son propriétaire.
      </p>
    </main>
  );
}
