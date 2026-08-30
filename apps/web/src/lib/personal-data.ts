import "server-only";
import { asc, eq, inArray } from "drizzle-orm";
import { db } from "./db";
import {
  accounts,
  siteBlocks,
  sitePages,
  siteReservations,
  sites,
  subscriptions,
  users,
} from "./db/schema";

// Everything Siteo holds about one account, assembled in one place.
//
// Article 15 of the RGPD gives a person the right to a copy of their data,
// and article 20 the right to receive it "dans un format structuré,
// couramment utilisé et lisible par machine" — which is what makes this
// JSON rather than a PDF. The same function feeds the export and documents
// what deletion has to reach: if a table appears here it holds personal
// data, and it must be covered by the cascade.

export type PersonalDataExport = {
  exportedAt: string;
  /** Plain-French note travelling with the file, for whoever opens it. */
  aPropos: string;
  compte: Record<string, unknown>;
  connexionsExternes: Record<string, unknown>[];
  abonnements: Record<string, unknown>[];
  sites: Record<string, unknown>[];
  reservations: Record<string, unknown>[];
};

const ABOUT =
  "Export des données personnelles détenues par Siteo pour ce compte, au sens des " +
  "articles 15 et 20 du RGPD. Les données de facturation (factures, moyens de paiement) " +
  "sont détenues par Stripe et s'obtiennent depuis le portail de facturation. " +
  "Les mots de passe ne figurent pas dans cet export : ils ne sont stockés que sous " +
  "forme d'empreinte cryptographique, non réversible.";

export async function collectPersonalData(userId: string): Promise<PersonalDataExport> {
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user) throw new Error("Compte introuvable.");

  const [externalAccounts, subs, ownedSites] = await Promise.all([
    db.select().from(accounts).where(eq(accounts.userId, userId)),
    db.select().from(subscriptions).where(eq(subscriptions.userId, userId)),
    db.select().from(sites).where(eq(sites.userId, userId)).orderBy(asc(sites.createdAt)),
  ]);

  const siteIds = ownedSites.map((s) => s.id);
  const [pages, blocks, bookings] =
    siteIds.length > 0
      ? await Promise.all([
          db.select().from(sitePages).where(inArray(sitePages.siteId, siteIds)),
          db.select().from(siteBlocks).where(inArray(siteBlocks.siteId, siteIds)),
          db.select().from(siteReservations).where(inArray(siteReservations.siteId, siteIds)),
        ])
      : [[], [], []];

  return {
    exportedAt: new Date().toISOString(),
    aPropos: ABOUT,
    compte: {
      id: user.id,
      email: user.email,
      nom: user.name,
      langue: user.locale,
      compteInvite: user.isGuest,
      cgvAccepteesLe: user.termsAcceptedAt,
      creditsSitesSupplementaires: user.extraSiteCredits,
      identifiantClientStripe: user.stripeCustomerId,
      creeLe: user.createdAt,
    },
    // The provider tokens are credentials, not personal data the person
    // needs back: what matters is *that* a Google account is linked.
    connexionsExternes: externalAccounts.map((a) => ({
      fournisseur: a.provider,
      identifiantChezLeFournisseur: a.providerAccountId,
      type: a.type,
    })),
    abonnements: subs.map((s) => ({
      statut: s.status,
      planId: s.planId,
      identifiantAbonnementStripe: s.stripeSubscriptionId,
      periodeEnCoursJusquAu: s.currentPeriodEnd,
      creeLe: s.createdAt,
    })),
    sites: ownedSites.map((site) => ({
      id: site.id,
      nom: site.name,
      adresse: site.slug,
      statut: site.status,
      theme: site.theme,
      publieLe: site.publishedAt,
      creeLe: site.createdAt,
      pages: pages
        .filter((p) => p.siteId === site.id)
        .sort((a, b) => a.position - b.position)
        .map((p) => ({
          titre: p.title,
          adresse: p.slug,
          blocs: blocks
            .filter((b) => b.pageId === p.id)
            .sort((a, b) => a.position - b.position)
            .map((b) => ({ type: b.blockType, visible: b.isVisible, contenu: b.content })),
        })),
    })),
    // Bookings made by *other people* on the person's published sites. They
    // are in the export because the account holder is their controller and
    // has to be able to see what their site collected in their name.
    reservations: bookings.map((r) => ({
      site: ownedSites.find((s) => s.id === r.siteId)?.slug ?? r.siteId,
      date: r.serviceDate,
      heure: r.slot,
      prestation: r.serviceName,
      dureeMinutes: r.durationMinutes,
      nombreDePersonnes: r.partySize,
      nomClient: r.guestName,
      telephoneClient: r.guestPhone,
      emailClient: r.guestEmail,
      precisions: r.note,
      statut: r.status,
      recueLe: r.createdAt,
    })),
  };
}

/**
 * Erases an account and everything attached to it (art. 17).
 *
 * One statement, because `sites` cascades to pages, blocks and bookings and
 * `user` cascades to sites, sessions and linked accounts — see the foreign
 * keys in schema.ts. Anything that ever escapes that cascade has to be
 * deleted explicitly here, which is why collectPersonalData above doubles
 * as the checklist of what holds personal data.
 *
 * What this cannot reach: invoices at Stripe. Accounting records must be
 * kept ten years under article L123-22 du code de commerce, which article
 * 17.3.b of the RGPD explicitly preserves. The interface says so plainly
 * rather than promising an erasure that will not happen.
 */
export async function eraseAccount(userId: string): Promise<void> {
  await db.delete(users).where(eq(users.id, userId));
}
