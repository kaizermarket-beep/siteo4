import type { Metadata } from "next";
import Link from "next/link";
import { Bullets, LegalHeader, mono, Section, Table, Todo } from "../_components";

export const metadata: Metadata = {
  title: "Cookies — Siteo",
  description: "Liste des cookies déposés par Siteo, leur finalité et leur durée.",
};

export default function CookiesPage() {
  return (
    <>
      {/* CONTENU GÉNÉRÉ — À FAIRE RELIRE PAR UN AVOCAT AVANT MISE EN LIGNE. Ne pas publier tel quel. */}
      <LegalHeader
        title="Cookies"
        updated={<Todo>date d&apos;entrée en vigueur</Todo>}
        intro={
          <>
            <p>
              Siteo ne dépose <strong>aucun cookie de mesure d&apos;audience, publicitaire ou de
              réseau social</strong>. Aucun traceur tiers n&apos;est chargé sur le service.
            </p>
            <p className="mt-3">
              Les seuls cookies utilisés sont strictement nécessaires à la fourniture du service
              expressément demandé par l&apos;utilisateur. À ce titre, ils sont exemptés de
              consentement préalable en application du 2° du II de l&apos;article 82 de la loi
              n° 78-17 du 6 janvier 1978 modifiée, tel qu&apos;interprété par les lignes directrices
              de la CNIL. C&apos;est la raison pour laquelle aucune bannière de consentement
              n&apos;est affichée.
            </p>
          </>
        }
      />

      <Section title="1. Cookies déposés par Siteo">
        <Table
          head={["Nom", "Finalité", "Durée", "Nature"]}
          rows={[
            [
              mono("siteo_guest"),
              <>
                Rattache au navigateur un site en cours de création par un visiteur qui n&apos;a pas
                encore de compte, afin qu&apos;il retrouve son brouillon. Contient un identifiant
                technique signé cryptographiquement, aucune donnée nominative.
              </>,
              "30 jours",
              "Strictement nécessaire — HttpOnly, SameSite=Lax, Secure en production",
            ],
            [
              mono("authjs.session-token"),
              "Maintient la session d'un utilisateur connecté. Sans lui, l'utilisateur devrait ressaisir ses identifiants à chaque page.",
              <>
                <Todo>durée de session configurée — 30 jours par défaut</Todo>
              </>,
              "Strictement nécessaire — HttpOnly, SameSite=Lax, Secure en production",
            ],
            [
              mono("authjs.csrf-token"),
              "Protège les formulaires d'authentification contre les attaques par falsification de requête (CSRF).",
              "Le temps de la session",
              "Strictement nécessaire — HttpOnly",
            ],
            [
              mono("authjs.callback-url"),
              "Mémorise la page vers laquelle rediriger l'utilisateur après sa connexion.",
              "Le temps de la session",
              "Strictement nécessaire — HttpOnly",
            ],
          ]}
        />
        <p className="text-sm text-neutral-600">
          En production, les cookies d&apos;authentification sont préfixés par{" "}
          <code className="rounded bg-neutral-100 px-1 py-0.5 text-[0.9em]">__Secure-</code> ou{" "}
          <code className="rounded bg-neutral-100 px-1 py-0.5 text-[0.9em]">__Host-</code>, préfixes
          qui imposent au navigateur de ne les transmettre que sur une connexion HTTPS.
        </p>
      </Section>

      <Section title="2. Connexion via Google">
        <p>
          Si l&apos;utilisateur choisit de se connecter avec Google, des cookies sont déposés par
          Google sur ses propres domaines, dans le cadre de l&apos;authentification. Ces cookies
          relèvent de la politique de Google et non de celle de Siteo. Cette fonctionnalité est
          facultative : la connexion par adresse électronique et mot de passe ne l&apos;implique
          pas.
        </p>
      </Section>

      <Section title="3. Sites publiés par les utilisateurs">
        <p>
          Les sites créés et publiés par les utilisateurs de Siteo ne déposent, en l&apos;état
          actuel du service, aucun cookie : ce sont des pages statiques sans mesure d&apos;audience.
        </p>
        <p>
          Si un utilisateur ajoute lui-même un service tiers à son site, il lui appartient
          d&apos;informer ses visiteurs et de recueillir leur consentement lorsque la réglementation
          l&apos;exige.
        </p>
      </Section>

      <Section title="4. Gérer les cookies">
        <p>
          Les cookies listés ci-dessus étant nécessaires au fonctionnement du service, leur blocage
          empêche la connexion et la sauvegarde des sites en cours de création. Ils peuvent
          néanmoins être supprimés à tout moment depuis les réglages du navigateur.
        </p>
        <Bullets
          items={[
            "Chrome : Réglages → Confidentialité et sécurité → Cookies et autres données des sites",
            "Firefox : Paramètres → Vie privée et sécurité → Cookies et données de sites",
            "Safari : Réglages → Confidentialité → Gérer les données de sites web",
            "Edge : Paramètres → Cookies et autorisations de site",
          ]}
        />
      </Section>

      <Section title="5. Mise à jour">
        <p>
          Cette page doit être révisée dès qu&apos;un cookie est ajouté ou retiré du code —
          notamment si une mesure d&apos;audience est un jour introduite, auquel cas un mécanisme de
          recueil du consentement deviendrait obligatoire. Les traitements associés sont décrits
          dans la{" "}
          <Link href="/confidentialite" className="underline">
            politique de confidentialité
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
