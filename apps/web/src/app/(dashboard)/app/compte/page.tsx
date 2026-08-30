import type { Metadata } from "next";
import Link from "next/link";
import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { sites, users } from "@/lib/db/schema";
import { requireUserId } from "@/lib/require-user";
import { retentionSummary } from "@/lib/retention-policy";
import { DeleteAccountForm } from "./DeleteAccountForm";

export const metadata: Metadata = {
  title: "Mon compte — Siteo",
};

// The screen where the rights announced in the privacy policy are actually
// exercised. A policy that promises access, portability and erasure while
// the product offers no way to obtain them is the gap that turns a
// well-written page into a false statement.
export const dynamic = "force-dynamic";

const DATE_FMT = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" });

export default async function AccountPage() {
  const userId = await requireUserId();

  const [[user], [counted]] = await Promise.all([
    db.select().from(users).where(eq(users.id, userId)),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(sites)
      .where(eq(sites.userId, userId)),
  ]);

  if (!user) return null;
  const siteCount = counted?.count ?? 0;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-10">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">Mon compte</h1>
        <p className="mt-1 text-sm text-neutral-500">{user.email}</p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-medium text-neutral-900">Informations</h2>
        <dl className="divide-y divide-neutral-200 rounded-lg border border-neutral-200 text-sm">
          <div className="flex justify-between gap-4 px-4 py-3">
            <dt className="text-neutral-500">Nom</dt>
            <dd className="text-neutral-900">{user.name || "—"}</dd>
          </div>
          <div className="flex justify-between gap-4 px-4 py-3">
            <dt className="text-neutral-500">Compte créé le</dt>
            <dd className="text-neutral-900">{DATE_FMT.format(user.createdAt)}</dd>
          </div>
          <div className="flex justify-between gap-4 px-4 py-3">
            <dt className="text-neutral-500">CGV et confidentialité acceptées le</dt>
            <dd className="text-neutral-900">
              {user.termsAcceptedAt ? DATE_FMT.format(user.termsAcceptedAt) : "—"}
            </dd>
          </div>
          <div className="flex justify-between gap-4 px-4 py-3">
            <dt className="text-neutral-500">Sites</dt>
            <dd className="text-neutral-900">{siteCount}</dd>
          </div>
        </dl>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-medium text-neutral-900">Récupérer mes données</h2>
        <p className="text-sm text-neutral-600">
          Un fichier JSON contenant tout ce que Siteo détient sur votre compte : vos informations,
          vos sites et leur contenu, les réservations reçues. Format ouvert et lisible par machine,
          conformément aux articles 15 et 20 du RGPD.
        </p>
        <a
          href="/api/account/export"
          download
          className="w-fit rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
        >
          Télécharger mes données
        </a>
        <p className="text-xs text-neutral-500">
          Vos factures ne sont pas dans ce fichier : elles sont détenues par notre prestataire de
          paiement et se téléchargent depuis la{" "}
          <Link href="/app/billing" className="underline">
            page Facturation
          </Link>
          .
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-medium text-neutral-900">Durées de conservation</h2>
        <p className="text-sm text-neutral-600">
          Ces durées sont appliquées automatiquement, chaque nuit, sans intervention de notre part.
        </p>
        <ul className="divide-y divide-neutral-200 rounded-lg border border-neutral-200 text-sm">
          {retentionSummary.map((row) => (
            <li key={row.what} className="flex flex-wrap justify-between gap-x-4 gap-y-1 px-4 py-3">
              <span className="text-neutral-600">{row.what}</span>
              <span className="text-neutral-900">{row.duration}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-medium text-neutral-900">Supprimer mon compte</h2>
        <p className="text-sm text-neutral-600">
          Efface votre compte et tout ce qui y est rattaché. Une exception, imposée par la loi :
          les factures déjà émises sont conservées dix ans par notre prestataire de paiement au
          titre de l&apos;article L123-22 du code de commerce — l&apos;article 17.3 du RGPD prévoit
          expressément ce cas.
        </p>
        <DeleteAccountForm hasPassword={Boolean(user.passwordHash)} siteCount={siteCount} />
      </section>

      <p className="text-xs text-neutral-500">
        Pour toute autre demande (rectification, limitation, opposition), écrivez-nous : les
        coordonnées figurent dans la{" "}
        <Link href="/confidentialite" className="underline">
          politique de confidentialité
        </Link>
        .
      </p>
    </div>
  );
}
