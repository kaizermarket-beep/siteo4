import "server-only";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { sites, users } from "./db/schema";
import { sendMailQuietly } from "./email";

// The wording of every booking email, in one place.
//
// One rule runs through all of them: a request is a request. Nothing here
// tells a client their slot is held until the professional has actually
// confirmed it, because the site has no way to know whether they will.

const DATE_FMT = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

/** "2026-09-03" → "jeudi 3 septembre 2026". */
export function frenchDate(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return DATE_FMT.format(new Date(Date.UTC(y, m - 1, d)));
}

/**
 * Where the professional wants to be told, or null.
 *
 * A guest draft has a placeholder address that nobody reads, so it is never
 * used: an owner who has not signed up gets no email, only the dashboard.
 */
export async function ownerNotificationEmail(
  siteId: string,
  override: string
): Promise<string | null> {
  const trimmed = override.trim();
  if (trimmed.includes("@")) return trimmed;

  const [row] = await db
    .select({ email: users.email, isGuest: users.isGuest })
    .from(sites)
    .innerJoin(users, eq(sites.userId, users.id))
    .where(eq(sites.id, siteId));

  if (!row || row.isGuest) return null;
  return row.email;
}

export type BookingSummary = {
  siteName: string;
  /** "Coupe femme", or "Table" for a restaurant. */
  what: string;
  date: string;
  slot: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string | null;
  note: string | null;
  /** Shown to the client so they can reach a human. */
  businessPhone: string;
};

/** To the client, the moment they submit. Says clearly: not yet confirmed. */
export function clientRequestMail(b: BookingSummary) {
  return {
    subject: `Votre demande de rendez-vous — ${b.siteName}`,
    text: [
      `Bonjour ${b.clientName},`,
      ``,
      `Nous avons bien reçu votre demande :`,
      `  ${b.what}`,
      `  ${frenchDate(b.date)} à ${b.slot}`,
      ``,
      `Ce rendez-vous n'est pas encore confirmé : ${b.siteName} vous répond`,
      `rapidement pour le valider. Vous recevrez un second message.`,
      b.businessPhone ? `\nUne question ? ${b.businessPhone}` : ``,
      ``,
      `— ${b.siteName}`,
    ].join("\n"),
  };
}

/** To the professional, so they do not have to watch the dashboard. */
export function ownerRequestMail(b: BookingSummary, dashboardUrl: string) {
  return {
    subject: `Nouvelle demande — ${frenchDate(b.date)} à ${b.slot}`,
    text: [
      `Nouvelle demande de rendez-vous sur ${b.siteName} :`,
      ``,
      `  ${b.what}`,
      `  ${frenchDate(b.date)} à ${b.slot}`,
      `  ${b.clientName} — ${b.clientPhone}`,
      b.clientEmail ? `  ${b.clientEmail}` : ``,
      b.note ? `  « ${b.note} »` : ``,
      ``,
      `Confirmez ou refusez ici : ${dashboardUrl}`,
      `Tant que vous n'avez rien fait, le client sait que ce n'est pas confirmé.`,
    ]
      .filter((line) => line !== ``)
      .join("\n"),
  };
}

/** To the client, once the professional has decided. */
export function clientDecisionMail(b: BookingSummary, confirmed: boolean) {
  return {
    subject: confirmed
      ? `Rendez-vous confirmé — ${frenchDate(b.date)} à ${b.slot}`
      : `Votre demande de rendez-vous — ${b.siteName}`,
    text: confirmed
      ? [
          `Bonjour ${b.clientName},`,
          ``,
          `C'est confirmé :`,
          `  ${b.what}`,
          `  ${frenchDate(b.date)} à ${b.slot}`,
          ``,
          b.businessPhone ? `Un empêchement ? Prévenez-nous au ${b.businessPhone}.` : ``,
          `À très vite,`,
          `— ${b.siteName}`,
        ]
          .filter(Boolean)
          .join("\n")
      : [
          `Bonjour ${b.clientName},`,
          ``,
          `Nous ne pouvons malheureusement pas vous recevoir`,
          `le ${frenchDate(b.date)} à ${b.slot}.`,
          ``,
          b.businessPhone
            ? `Appelez-nous au ${b.businessPhone} et nous trouverons un autre créneau.`
            : `N'hésitez pas à proposer un autre créneau depuis le site.`,
          ``,
          `— ${b.siteName}`,
        ]
          .filter(Boolean)
          .join("\n"),
  };
}

/** Sends both request emails. Never throws — see lib/email.ts. */
export async function notifyBookingRequest({
  siteId,
  notifyEmail,
  summary,
}: {
  siteId: string;
  notifyEmail: string;
  summary: BookingSummary;
}): Promise<void> {
  const owner = await ownerNotificationEmail(siteId, notifyEmail);
  const root = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000";
  const scheme = root.startsWith("localhost") ? "http" : "https";
  const dashboardUrl = `${scheme}://${root}/app/sites/${siteId}/reservations`;

  await Promise.all([
    summary.clientEmail
      ? sendMailQuietly({ to: summary.clientEmail, ...clientRequestMail(summary) })
      : Promise.resolve(),
    owner
      ? sendMailQuietly({
          to: owner,
          replyTo: summary.clientEmail ?? undefined,
          ...ownerRequestMail(summary, dashboardUrl),
        })
      : Promise.resolve(),
  ]);
}
