import type { Metadata } from "next";
import Link from "next/link";
import { Bullets, LegalHeader, Section, Table, todo, Todo } from "../_components";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Siteo",
  description: "Données collectées, finalités, sous-traitants et droits RGPD.",
};

export default function ConfidentialitePage() {
  return (
    <>
      {/* CONTENU GÉNÉRÉ — À FAIRE RELIRE PAR UN AVOCAT AVANT MISE EN LIGNE. Ne pas publier tel quel. */}
      <LegalHeader
        title="Politique de confidentialité"
        updated={<Todo>date d&apos;entrée en vigueur</Todo>}
        intro={
          <p>
            Cette politique décrit les traitements de données à caractère personnel mis en œuvre par
            Siteo en qualité de responsable de traitement, conformément au règlement (UE) 2016/679
            (RGPD) et à la loi n° 78-17 du 6 janvier 1978 modifiée.
          </p>
        }
      />

      <Section title="1. Responsable de traitement">
        <p>
          Le responsable de traitement est <Todo>raison sociale</Todo>, dont les coordonnées
          figurent dans les{" "}
          <Link href="/mentions-legales" className="underline">
            mentions légales
          </Link>
          .
        </p>
        <p>
          Contact pour toute question relative aux données personnelles :{" "}
          <Todo>email RGPD, et coordonnées du DPO s&apos;il en existe un</Todo>.
        </p>
        <p className="text-sm text-neutral-600">
          La désignation d&apos;un délégué à la protection des données n&apos;est obligatoire que
          dans les cas de l&apos;article 37 du RGPD, qui ne sont a priori pas réunis ici ; elle
          reste possible à titre volontaire.
        </p>
      </Section>

      <Section title="2. Rôles : responsable de traitement et sous-traitant">
        <p>
          <strong>Pour les données de ses propres clients</strong> (compte, facturation, usage du
          service), Siteo agit en qualité de responsable de traitement.
        </p>
        <p>
          <strong>
            Pour les données que les visiteurs déposent sur les sites publiés par les utilisateurs
          </strong>{" "}
          — par exemple via un formulaire de contact — l&apos;utilisateur est responsable de
          traitement et Siteo agit comme sous-traitant. Un contrat de sous-traitance au sens de
          l&apos;article 28 du RGPD doit encadrer cette relation :{" "}
          <Todo>rédiger et annexer l&apos;accord de sous-traitance (DPA) proposé aux utilisateurs</Todo>
          .
        </p>
      </Section>

      <Section title="3. Données collectées, finalités et bases légales">
        <Table
          head={["Données", "Finalité", "Base légale", "Conservation"]}
          rows={[
            [
              "Adresse électronique, nom (facultatif), mot de passe (stocké sous forme de condensat bcrypt)",
              "Création et gestion du compte, authentification",
              "Exécution du contrat (art. 6.1.b)",
              <>
                Durée du compte, puis <Todo>durée retenue</Todo> après suppression
              </>,
            ],
            [
              "Contenu des sites : textes, images importées, coordonnées professionnelles, tarifs",
              "Fourniture du service : édition, publication et hébergement du site",
              "Exécution du contrat (art. 6.1.b)",
              <>
                Durée du compte, puis <Todo>durée retenue</Todo>
              </>,
            ],
            [
              "Identifiant client Stripe, statut et échéances de l'abonnement",
              "Gestion des abonnements et de la facturation",
              "Exécution du contrat (art. 6.1.b) et obligation légale (art. 6.1.c) pour les pièces comptables",
              "10 ans pour les pièces comptables (art. L123-22 du code de commerce)",
            ],
            [
              "Adresse IP, associée aux tentatives d'inscription, de connexion et d'import d'images",
              "Limitation du nombre de tentatives, prévention des abus et des attaques par force brute",
              "Intérêt légitime à la sécurité du service (art. 6.1.f)",
              <>
                <Todo>durée retenue — recommandation : quelques jours à 12 mois maximum</Todo>
              </>,
            ],
            [
              "Identifiant de session et cookie de rattachement d'un brouillon",
              "Maintien de la session, rattachement d'un site en cours de création",
              "Exécution du contrat (art. 6.1.b) ; cookies strictement nécessaires",
              <>
                Voir la{" "}
                <Link href="/cookies" className="underline">
                  page cookies
                </Link>
              </>,
            ],
            [
              "Identifiant Google, adresse électronique et nom, en cas de connexion via Google",
              "Authentification par fournisseur tiers, au choix de l'utilisateur",
              "Exécution du contrat (art. 6.1.b)",
              "Durée du compte",
            ],
          ]}
        />
        <p className="text-sm text-neutral-600">
          Siteo ne met en œuvre aucune mesure d&apos;audience, aucun traceur publicitaire et aucun
          profilage. Aucune décision produisant des effets juridiques n&apos;est prise sur le
          fondement d&apos;un traitement automatisé.
        </p>
        <p className="text-sm text-neutral-600">
          Aucune donnée relevant de l&apos;article 9 du RGPD (données dites sensibles) n&apos;est
          demandée. Les utilisateurs sont invités à ne pas en publier dans le contenu de leurs
          sites.
        </p>
      </Section>

      <Section title="4. Destinataires et sous-traitants">
        <p>
          Les données ne sont ni vendues ni louées. Elles sont accessibles aux personnes habilitées
          chez Siteo et aux prestataires techniques suivants, agissant comme sous-traitants :
        </p>
        <Table
          head={["Prestataire", "Rôle", "Localisation et transfert hors UE"]}
          rows={[
            [
              "Neon",
              "Hébergement de la base de données (comptes, sites, contenus)",
              <>
                Région du projet à vérifier et à indiquer :{" "}
                <Todo>région Neon réellement utilisée — une région UE évite tout transfert</Todo>. Si
                la région est hors UE, encadrement par clauses contractuelles types et analyse
                d&apos;impact du transfert à documenter.
              </>,
            ],
            [
              "Vercel Inc.",
              "Hébergement de l'application et diffusion des sites publiés",
              <>
                Société établie aux États-Unis. Transfert hors UE encadré par les clauses
                contractuelles types et, le cas échéant, par la certification au{" "}
                <em>EU-U.S. Data Privacy Framework</em> —{" "}
                <Todo>vérifier la certification en cours et la région de déploiement</Todo>.
              </>,
            ],
            [
              "Stripe Payments Europe, Ltd.",
              "Traitement des paiements et gestion des abonnements",
              <>
                Entité contractante établie en Irlande ; le groupe Stripe comporte des entités aux
                États-Unis. Transfert encadré par les clauses contractuelles types et le{" "}
                <em>Data Privacy Framework</em>. Siteo ne reçoit ni ne stocke aucune donnée de carte
                bancaire.
              </>,
            ],
            [
              "Google Ireland Limited",
              "Authentification « Se connecter avec Google », uniquement si l'utilisateur y recourt",
              <>
                Entité européenne ; transferts vers Google LLC (États-Unis) encadrés par les clauses
                contractuelles types et le <em>Data Privacy Framework</em>.
              </>,
            ],
            [
              todo("prestataire d'envoi d'emails"),
              "Emails transactionnels : confirmation, facturation, réinitialisation de mot de passe",
              <>
                <Todo>
                  aucun prestataire d&apos;email n&apos;est branché à ce jour — à compléter dès que
                  c&apos;est le cas
                </Todo>
              </>,
            ],
          ]}
        />
        <p className="text-sm text-neutral-600">
          Cette liste doit refléter l&apos;infrastructure réellement déployée au moment de la mise
          en ligne. Le registre des activités de traitement (art. 30 du RGPD) doit être tenu à jour
          en parallèle.
        </p>
      </Section>

      <Section title="5. Sécurité">
        <p>Les mesures techniques en place comprennent notamment :</p>
        <Bullets
          items={[
            "le stockage des mots de passe sous forme de condensats bcrypt, jamais en clair ;",
            "la transmission chiffrée des échanges (HTTPS) et l'activation de HSTS en production ;",
            "des cookies d'authentification HttpOnly, SameSite et Secure ;",
            "des en-têtes de sécurité restrictifs (politique de sécurité de contenu, anti-framing, anti-sniffing) ;",
            "une limitation du nombre de tentatives d'inscription, de connexion et d'import ;",
            "la vérification du contenu réel des fichiers importés, et non de leur seule extension déclarée.",
          ]}
        />
        <p className="text-sm text-neutral-600">
          En cas de violation de données susceptible d&apos;engendrer un risque pour les droits et
          libertés des personnes, Siteo notifie la CNIL dans les 72 heures et, lorsque le risque est
          élevé, informe les personnes concernées (art. 33 et 34 du RGPD).{" "}
          <Todo>définir la procédure interne de gestion des violations</Todo>
        </p>
      </Section>

      <Section title="6. Vos droits">
        <p>
          Toute personne concernée dispose des droits d&apos;accès, de rectification, d&apos;effacement,
          de limitation, d&apos;opposition et de portabilité, ainsi que du droit de définir des
          directives relatives au sort de ses données après son décès.
        </p>
        <Bullets
          items={[
            <>
              <strong>Accès et portabilité</strong> : obtenir une copie des données et, pour celles
              fournies par la personne, un format structuré et lisible par machine.
            </>,
            <>
              <strong>Rectification</strong> : corriger une donnée inexacte. Les informations du
              compte et le contenu des sites sont directement modifiables depuis le service.
            </>,
            <>
              <strong>Effacement</strong> : demander la suppression du compte et des sites associés,
              sous réserve des données que Siteo doit conserver au titre d&apos;une obligation
              légale (facturation notamment).
            </>,
            <>
              <strong>Opposition et limitation</strong> : s&apos;opposer à un traitement fondé sur
              l&apos;intérêt légitime, ou en demander la limitation.
            </>,
          ]}
        />
        <p>
          Ces droits s&apos;exercent à l&apos;adresse <Todo>email RGPD</Todo>. Une réponse est
          apportée dans un délai d&apos;un mois, prorogeable de deux mois en cas de demande
          complexe. Une preuve d&apos;identité peut être demandée en cas de doute raisonnable.
        </p>
        <p>
          Toute personne peut également introduire une réclamation auprès de la Commission nationale
          de l&apos;informatique et des libertés (CNIL), 3 place de Fontenoy — TSA 80715 — 75334
          Paris Cedex 07, ou sur cnil.fr.
        </p>
      </Section>

      <Section title="7. Données des visiteurs des sites publiés">
        <p>
          Lorsqu&apos;un visiteur remplit un formulaire de contact sur un site publié via Siteo, les
          informations qu&apos;il transmet relèvent de la responsabilité de l&apos;utilisateur
          éditeur de ce site, auquel il revient de l&apos;informer et de recueillir, le cas échéant,
          son consentement.
        </p>
        <p className="text-sm text-neutral-600">
          <Todo>
            à vérifier : décrire ici le fonctionnement réel du formulaire de contact des modèles
            (destinataire, stockage éventuel, durée)
          </Todo>
        </p>
      </Section>

      <Section title="8. Modification de la présente politique">
        <p>
          Cette politique peut être mise à jour. Toute modification substantielle est portée à la
          connaissance des utilisateurs par courriel ou par une information dans le service, avant
          son entrée en vigueur.
        </p>
      </Section>
    </>
  );
}
