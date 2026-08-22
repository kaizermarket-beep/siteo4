import type { Metadata } from "next";
import Link from "next/link";
import { Bullets, LegalHeader, Section, Todo } from "../_components";

export const metadata: Metadata = {
  title: "Conditions générales d'utilisation — Siteo",
  description: "Règles d'usage du service, contenus publiés et suspension de compte.",
};

export default function CguPage() {
  return (
    <>
      {/* CONTENU GÉNÉRÉ — À FAIRE RELIRE PAR UN AVOCAT AVANT MISE EN LIGNE. Ne pas publier tel quel. */}
      <LegalHeader
        title="Conditions générales d&apos;utilisation"
        updated={<Todo>date d&apos;entrée en vigueur</Todo>}
        intro={
          <p>
            Les présentes conditions (les « CGU ») régissent l&apos;accès et l&apos;utilisation du
            service Siteo, y compris pendant la période d&apos;essai gratuite. Les conditions
            financières figurent dans les{" "}
            <Link href="/cgv" className="underline">
              conditions générales de vente
            </Link>
            .
          </p>
        }
      />

      <Section title="1. Acceptation">
        <p>
          La création d&apos;un compte vaut acceptation sans réserve des présentes CGU. Un
          utilisateur qui ne les accepte pas doit renoncer à utiliser le service.
        </p>
      </Section>

      <Section title="2. Description du service">
        <p>
          Siteo permet de créer un site internet vitrine à partir de modèles, d&apos;en modifier le
          contenu, puis de le publier à une adresse de la forme{" "}
          <code className="rounded bg-neutral-100 px-1 py-0.5 text-[0.9em]">
            votre-site.<Todo>domaine racine</Todo>
          </code>
          .
        </p>
        <p>
          Un visiteur peut commencer à personnaliser un modèle avant de créer un compte. Un compte
          technique temporaire est alors créé pour rattacher le brouillon au navigateur du visiteur
          (voir la{" "}
          <Link href="/cookies" className="underline">
            page cookies
          </Link>
          ). Ce brouillon n&apos;est pas publié et peut être supprimé automatiquement, notamment
          lorsque le nombre de brouillons non enregistrés atteint la limite fixée par le service.
        </p>
      </Section>

      <Section title="3. Compte utilisateur">
        <Bullets
          items={[
            "L'utilisateur fournit une adresse électronique valide et un mot de passe d'au moins huit caractères, ou se connecte via un compte Google.",
            "Les identifiants sont personnels et confidentiels. L'utilisateur est responsable de toute activité effectuée depuis son compte.",
            "Toute utilisation non autorisée doit être signalée sans délai à l'adresse indiquée à l'article 9.",
            <>
              L&apos;utilisateur s&apos;engage à maintenir ses informations à jour, notamment son
              adresse électronique, qui constitue le canal de contact du service.
            </>,
          ]}
        />
      </Section>

      <Section title="4. Contenu publié par l&apos;utilisateur">
        <p>
          L&apos;utilisateur est seul responsable des textes, images, tarifs, coordonnées et de tout
          autre élément qu&apos;il introduit dans son site (le « Contenu »). Il garantit :
        </p>
        <Bullets
          items={[
            "détenir l'ensemble des droits nécessaires sur le Contenu, notamment les droits d'auteur sur les photographies et les autorisations des personnes représentées ;",
            "que le Contenu est licite, exact et non trompeur, en particulier s'agissant des prix, des mentions promotionnelles et des allégations professionnelles ;",
            "que le Contenu ne porte atteinte ni aux droits des tiers, ni à l'ordre public.",
          ]}
        />
        <p>
          L&apos;utilisateur conserve la propriété de son Contenu. Il concède à Siteo, pour la seule
          durée de l&apos;hébergement et aux seules fins d&apos;exploitation du service, une licence
          non exclusive et gratuite de reproduction, de stockage et de représentation de ce Contenu.
          Cette licence prend fin à la dépublication du site, sous réserve des sauvegardes
          techniques dont la durée est indiquée dans la{" "}
          <Link href="/confidentialite" className="underline">
            politique de confidentialité
          </Link>
          .
        </p>
        <p>
          <strong>Obligations propres à l&apos;utilisateur éditeur.</strong> En publiant un site,
          l&apos;utilisateur en devient l&apos;éditeur au sens de la LCEN. Il lui appartient d&apos;y
          faire figurer ses propres mentions légales, et, s&apos;il y collecte des données
          personnelles (formulaire de contact, réservation), d&apos;informer ses visiteurs
          conformément au RGPD. Siteo intervient à l&apos;égard de ces sites en qualité
          d&apos;hébergeur.
        </p>
      </Section>

      <Section title="5. Propriété intellectuelle du service et des modèles">
        <p>
          Le service, son code, son interface, sa charte graphique et ses modèles de sites sont
          protégés et demeurent la propriété de Siteo ou de ses concédants. L&apos;utilisateur reçoit
          un droit d&apos;usage personnel, non exclusif et non transférable des modèles, pour la
          durée de son abonnement et pour les besoins de la publication de ses propres sites.
        </p>
        <p>Il est notamment interdit de :</p>
        <Bullets
          items={[
            "revendre, sous-licencier ou redistribuer les modèles en tant que tels ;",
            "extraire tout ou partie du code ou de la base de données du service ;",
            "reproduire le service pour proposer une offre concurrente.",
          ]}
        />
        <p className="text-sm text-neutral-600">
          Les photographies d&apos;illustration livrées avec les modèles sont soumises aux licences
          de leurs banques d&apos;images d&apos;origine —{" "}
          <Todo>lister les banques d&apos;images et vérifier que leur licence autorise cet usage</Todo>
          . Il est recommandé de remplacer ces images par les photographies réelles de
          l&apos;utilisateur avant publication.
        </p>
      </Section>

      <Section title="6. Comportements interdits">
        <p>Il est interdit d&apos;utiliser le service pour publier ou diffuser :</p>
        <Bullets
          items={[
            "un contenu contrefaisant, diffamatoire, injurieux, ou portant atteinte à la vie privée ou au droit à l'image ;",
            "un contenu incitant à la haine, à la violence ou à la discrimination, ou faisant l'apologie de crimes ;",
            "un contenu pornographique ou accessible aux mineurs en violation de la réglementation applicable ;",
            "un contenu trompeur, une pratique commerciale déloyale, une fausse identité professionnelle ou de faux avis de consommateurs ;",
            "un site destiné à l'hameçonnage, à la diffusion de logiciels malveillants ou à toute activité frauduleuse ;",
            "des activités réglementées sans détenir les autorisations correspondantes.",
          ]}
        />
        <p>Il est également interdit de :</p>
        <Bullets
          items={[
            "tenter d'accéder à des comptes ou à des données qui ne sont pas les siens ;",
            "perturber le fonctionnement du service, notamment par un volume anormal de requêtes ou par contournement des limitations techniques ;",
            "utiliser le service pour l'envoi de communications non sollicitées.",
          ]}
        />
      </Section>

      <Section title="7. Suspension et résiliation">
        <p>
          En cas de manquement aux présentes CGU, Siteo peut, selon la gravité et de manière
          proportionnée, adresser un avertissement, dépublier le site concerné, suspendre l&apos;accès
          au compte, ou le résilier.
        </p>
        <p>
          Sauf urgence, atteinte à un tiers ou obligation légale, la mesure est précédée d&apos;une
          information de l&apos;utilisateur exposant les motifs et lui permettant de présenter ses
          observations. L&apos;utilisateur peut contester une mesure à l&apos;adresse indiquée à
          l&apos;article 9.
        </p>
        <p>
          Un contenu manifestement illicite signalé à Siteo dans les conditions prévues aux{" "}
          <Link href="/mentions-legales" className="underline">
            mentions légales
          </Link>{" "}
          peut être retiré promptement, conformément à l&apos;article 6-I-2 de la LCEN.
        </p>
      </Section>

      <Section title="8. Disponibilité et évolution du service">
        <p>
          Siteo peut faire évoluer le service, ses modèles et ses fonctionnalités. Les évolutions
          susceptibles d&apos;affecter substantiellement l&apos;usage d&apos;un site déjà publié
          font l&apos;objet d&apos;une information préalable. Le service est fourni en l&apos;état,
          sans garantie de disponibilité ininterrompue, dans les conditions de l&apos;article 10 des{" "}
          <Link href="/cgv" className="underline">
            CGV
          </Link>
          .
        </p>
      </Section>

      <Section title="9. Contact">
        <p>
          Toute question relative aux présentes CGU peut être adressée à{" "}
          <Todo>email de contact</Todo>.
        </p>
      </Section>

      <Section title="10. Droit applicable">
        <p>
          Les présentes CGU sont soumises au droit français. Les modalités de règlement des litiges,
          y compris le recours à la médiation de la consommation, figurent à l&apos;article 14 des{" "}
          <Link href="/cgv" className="underline">
            CGV
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
