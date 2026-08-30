import type { Metadata } from "next";
import Link from "next/link";
import { Bullets, LegalHeader, Section, Table, Todo } from "../_components";
import { retentionSummary } from "@/lib/retention-policy";

export const metadata: Metadata = {
  title: "Accord de sous-traitance (DPA) — Siteo",
  description:
    "Contrat de sous-traitance au sens de l'article 28 du RGPD entre l'utilisateur de Siteo et Siteo.",
};

export default function SousTraitancePage() {
  return (
    <>
      {/* CONTENU GÉNÉRÉ — À FAIRE RELIRE PAR UN AVOCAT AVANT MISE EN LIGNE. Ne pas publier tel quel. */}
      <LegalHeader
        title="Accord de sous-traitance (DPA)"
        updated={<Todo>date d&apos;entrée en vigueur</Todo>}
        intro={
          <>
            <p>
              Cet accord complète les{" "}
              <Link href="/cgv" className="underline">
                conditions générales
              </Link>{" "}
              et régit les traitements que Siteo effectue <strong>pour le compte</strong> de
              l&apos;utilisateur, conformément à l&apos;article 28 du règlement (UE) 2016/679.
            </p>
            <p className="mt-3">
              Il concerne les données que des tiers déposent sur un site publié avec Siteo :
              demandes de réservation, prises de rendez-vous, messages. Pour ces données,{" "}
              <strong>l&apos;utilisateur est responsable de traitement</strong> et{" "}
              <strong>Siteo est sous-traitant</strong>. Les données du compte Siteo lui-même
              relèvent de la{" "}
              <Link href="/confidentialite" className="underline">
                politique de confidentialité
              </Link>
              , où Siteo est responsable de traitement.
            </p>
          </>
        }
      />

      <Section title="1. Objet, durée et nature du traitement">
        <Table
          head={["Élément", "Contenu"]}
          rows={[
            ["Objet", "Hébergement d'un site web et collecte des demandes que ses visiteurs y déposent"],
            [
              "Nature des opérations",
              "Collecte, enregistrement, conservation, consultation par l'utilisateur, transmission par email, effacement",
            ],
            [
              "Finalité",
              "Permettre au professionnel de recevoir et de traiter les demandes de ses propres clients",
            ],
            ["Durée", "Durée du contrat d'abonnement, majorée des durées de conservation ci-dessous"],
          ]}
        />
      </Section>

      <Section title="2. Catégories de personnes et de données">
        <Bullets
          items={[
            <>
              <strong>Personnes concernées</strong> : les clients et prospects de l&apos;utilisateur
              qui remplissent un formulaire sur le site publié.
            </>,
            <>
              <strong>Données</strong> : nom, numéro de téléphone, adresse électronique, date et
              heure demandées, nombre de personnes, prestation choisie, et le texte libre saisi dans
              le champ « précisions ».
            </>,
            <>
              <strong>Aucune donnée sensible</strong> au sens de l&apos;article 9 n&apos;est
              demandée. Le champ libre étant ouvert, l&apos;utilisateur s&apos;engage à ne pas
              solliciter de telles données et à ne pas en conserver s&apos;il en reçoit
              spontanément — une allergie alimentaire renseignée par un client relève de la donnée
              de santé.
            </>,
          ]}
        />
      </Section>

      <Section title="3. Obligations de Siteo">
        <Bullets
          items={[
            <>
              <strong>Instructions documentées</strong> : Siteo ne traite les données que sur
              instruction de l&apos;utilisateur, dont le présent accord et l&apos;usage du service
              constituent l&apos;expression. Siteo n&apos;exploite ces données à aucune fin propre,
              ne les revend pas et ne les utilise ni pour du profilage ni pour de la prospection.
            </>,
            <>
              <strong>Confidentialité</strong> : seules les personnes habilitées chez Siteo, tenues
              à une obligation de confidentialité, peuvent accéder aux données, et uniquement pour
              les besoins de l&apos;exploitation ou du support.
            </>,
            <>
              <strong>Sécurité</strong> : voir la section 5.
            </>,
            <>
              <strong>Assistance</strong> : Siteo aide l&apos;utilisateur à répondre aux demandes
              d&apos;exercice de droits et à ses obligations des articles 32 à 36 du RGPD, dans la
              mesure de ce que permet le service.
            </>,
            <>
              <strong>Sort des données en fin de contrat</strong> : suppression du compte depuis{" "}
              <Link href="/app/compte" className="underline">
                Mon compte
              </Link>
              , qui efface immédiatement et en cascade les sites, leur contenu et les demandes
              reçues. L&apos;utilisateur peut exporter ces données avant suppression.
            </>,
          ]}
        />
      </Section>

      <Section title="4. Sous-traitants ultérieurs">
        <p>
          L&apos;utilisateur autorise de façon générale le recours aux sous-traitants ultérieurs
          listés dans la{" "}
          <Link href="/confidentialite" className="underline">
            politique de confidentialité
          </Link>{" "}
          (hébergement, base de données, envoi d&apos;emails, paiement). Siteo informe
          l&apos;utilisateur de tout ajout ou remplacement{" "}
          <Todo>délai de préavis retenu — 30 jours est l&apos;usage</Todo> avant qu&apos;il ne
          prenne effet, l&apos;utilisateur pouvant s&apos;y opposer et, à défaut d&apos;accord,
          résilier.
        </p>
        <p className="text-sm text-neutral-600">
          Les transferts hors Union européenne, leur encadrement et les analyses d&apos;impact
          correspondantes sont décrits dans cette même politique.
        </p>
      </Section>

      <Section title="5. Mesures de sécurité (art. 32)">
        <p>Les mesures suivantes sont effectivement en place :</p>
        <Bullets
          items={[
            "Chiffrement des échanges en HTTPS, en-tête HSTS en production.",
            "Mots de passe stockés sous forme de condensat bcrypt à coût 12, jamais en clair, jamais réversibles.",
            "Limitation du nombre de tentatives de connexion, par compte et par adresse IP, contre la force brute et le bourrage d'identifiants.",
            "Cloisonnement par propriétaire : chaque lecture et chaque écriture vérifie que la ressource appartient au compte qui la demande.",
            "Politique de sécurité de contenu (CSP), protection contre le détournement de clic et contre l'inférence de type MIME.",
            "Contrôle du contenu réel des images importées par lecture de leur signature binaire, et non de leur extension.",
            "Effacement automatique quotidien des données dont la durée de conservation est écoulée.",
          ]}
        />
        <p className="text-sm text-neutral-600">
          En cas de violation de données, Siteo notifie l&apos;utilisateur{" "}
          <Todo>délai retenu — « dans les meilleurs délais » et au plus tard 48 h est l&apos;usage</Todo>{" "}
          après en avoir eu connaissance, avec les éléments nécessaires à sa propre notification à
          la CNIL.
        </p>
      </Section>

      <Section title="6. Durées de conservation appliquées">
        <p>
          Ces durées sont celles réellement mises en œuvre par le service, et non de simples
          engagements : une tâche automatique les applique chaque nuit.
        </p>
        <Table
          head={["Donnée", "Durée"]}
          rows={retentionSummary.map((row) => [row.what, row.duration])}
        />
        <p className="text-sm text-neutral-600">
          L&apos;utilisateur peut à tout moment supprimer une demande individuelle depuis son
          tableau de bord, sans attendre l&apos;échéance.
        </p>
      </Section>

      <Section title="7. Audit">
        <p>
          Siteo met à disposition de l&apos;utilisateur les informations nécessaires pour démontrer
          le respect de l&apos;article 28 et permet la réalisation d&apos;audits.{" "}
          <Todo>
            préciser les modalités : préavis, fréquence, prise en charge des frais, recours à un
            tiers auditeur
          </Todo>
        </p>
      </Section>

      <Section title="8. Responsabilités de l&apos;utilisateur">
        <Bullets
          items={[
            "Informer ses propres clients du traitement de leurs données, de sa finalité et de leurs droits — le formulaire de réservation affiche déjà une mention à cet effet, qui ne dispense pas d'une politique de confidentialité sur le site publié.",
            "Ne collecter que des données nécessaires et ne pas détourner les champs libres pour recueillir des données sensibles.",
            "Répondre aux demandes d'exercice de droits de ses clients : c'est lui, et non Siteo, qui en est le destinataire.",
            "Tenir son propre registre des activités de traitement lorsque l'article 30 l'exige.",
          ]}
        />
      </Section>
    </>
  );
}
