import type { Metadata } from "next";
import Link from "next/link";
import { Bullets, DefinitionList, LegalHeader, Section, Todo } from "../_components";

export const metadata: Metadata = {
  title: "Mentions légales — Siteo",
  description: "Éditeur, directeur de la publication et hébergeur du service Siteo.",
};

export default function MentionsLegalesPage() {
  return (
    <>
      {/* CONTENU GÉNÉRÉ — À FAIRE RELIRE PAR UN AVOCAT AVANT MISE EN LIGNE. Ne pas publier tel quel. */}
      <LegalHeader
        title="Mentions légales"
        updated={<Todo>date de mise en ligne</Todo>}
        intro={
          <p>
            Informations publiées en application de l&apos;article 6-III de la loi n° 2004-575 du
            21 juin 2004 pour la confiance dans l&apos;économie numérique (LCEN).
          </p>
        }
      />

      <Section title="1. Éditeur du site">
        <DefinitionList
          items={[
            { term: "Dénomination sociale", value: <Todo>raison sociale exacte</Todo> },
            {
              term: "Forme juridique",
              value: <Todo>SAS, SASU, SARL, EI, auto-entrepreneur…</Todo>,
            },
            {
              term: "Capital social",
              value: (
                <>
                  <Todo>montant du capital</Todo> — sans objet si entreprise individuelle
                </>
              ),
            },
            { term: "Siège social", value: <Todo>adresse postale complète</Todo> },
            {
              term: "Immatriculation",
              value: (
                <>
                  RCS de <Todo>ville du greffe</Todo> sous le numéro <Todo>SIREN / SIRET</Todo>
                </>
              ),
            },
            {
              term: "N° TVA intracommunautaire",
              value: (
                <>
                  <Todo>numéro de TVA</Todo> — ou mention « TVA non applicable, article 293 B du
                  CGI » si franchise en base
                </>
              ),
            },
            { term: "Adresse électronique", value: <Todo>email de contact</Todo> },
            { term: "Téléphone", value: <Todo>numéro de téléphone</Todo> },
          ]}
        />
      </Section>

      <Section title="2. Directeur de la publication">
        <p>
          Le directeur de la publication est <Todo>nom et prénom</Todo>, en qualité de{" "}
          <Todo>fonction : président, gérant, entrepreneur individuel…</Todo>.
        </p>
      </Section>

      <Section title="3. Hébergeur du site">
        <DefinitionList
          items={[
            { term: "Dénomination", value: <Todo>hébergeur réellement utilisé</Todo> },
            { term: "Adresse", value: <Todo>adresse postale de l&apos;hébergeur</Todo> },
            { term: "Téléphone", value: <Todo>téléphone de l&apos;hébergeur</Todo> },
          ]}
        />
        <p className="text-sm text-neutral-600">
          Cette information doit décrire l&apos;hébergeur réel au moment de la mise en ligne. Si le
          service est déployé sur Vercel, l&apos;éditeur indique Vercel Inc. et son adresse
          américaine ; la base de données étant opérée par un autre prestataire, les deux sont à
          mentionner. Voir la{" "}
          <Link href="/confidentialite" className="underline">
            politique de confidentialité
          </Link>{" "}
          pour la liste complète des sous-traitants.
        </p>
      </Section>

      <Section title="4. Sites publiés par les utilisateurs">
        <p>
          Siteo est un outil permettant à ses utilisateurs de créer et de publier leur propre site
          internet. Chaque site publié via Siteo est édité sous la responsabilité exclusive de
          l&apos;utilisateur qui l&apos;a créé, lequel est seul éditeur au sens de la LCEN pour ce
          site.
        </p>
        <p>
          Il appartient donc à chaque utilisateur de faire figurer sur son propre site les mentions
          légales le concernant. Siteo intervient à l&apos;égard de ces sites en qualité
          d&apos;hébergeur au sens de l&apos;article 6-I-2 de la LCEN.
        </p>
      </Section>

      <Section title="5. Signalement d&apos;un contenu illicite">
        <p>
          Tout contenu manifestement illicite hébergé sur un site publié via Siteo peut être signalé
          à l&apos;adresse <Todo>email de signalement</Todo>. Pour être exploitable, le signalement
          doit préciser :
        </p>
        <Bullets
          items={[
            "la date du signalement ;",
            "l'identité du déclarant (nom, prénom, domicile ou dénomination et siège social) ;",
            "l'adresse exacte (URL) du contenu litigieux ;",
            "les motifs pour lesquels le contenu doit être retiré, avec la mention des dispositions légales et des justifications de fait.",
          ]}
        />
      </Section>

      <Section title="6. Propriété intellectuelle">
        <p>
          La marque, le nom de domaine, la charte graphique, les textes et le code du service Siteo
          sont la propriété de l&apos;éditeur ou font l&apos;objet d&apos;une licence à son profit.
          Toute reproduction ou représentation, totale ou partielle, sans autorisation écrite
          préalable est interdite.
        </p>
        <p>
          Les modèles de sites proposés dans le service restent la propriété de l&apos;éditeur ;
          l&apos;utilisateur en reçoit un droit d&apos;usage dans les conditions prévues par les{" "}
          <Link href="/cgu" className="underline">
            conditions générales d&apos;utilisation
          </Link>
          . Les photographies d&apos;illustration des modèles proviennent de{" "}
          <Todo>banques d&apos;images utilisées et leurs licences</Todo>.
        </p>
      </Section>
    </>
  );
}
