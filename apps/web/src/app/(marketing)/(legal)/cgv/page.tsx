import type { Metadata } from "next";
import Link from "next/link";
import { Bullets, LegalHeader, Section, Table, Todo } from "../_components";

export const metadata: Metadata = {
  title: "Conditions générales de vente — Siteo",
  description: "Prix, paiement, durée, résiliation et droit de rétractation de l'abonnement Siteo.",
};

export default function CgvPage() {
  return (
    <>
      {/* CONTENU GÉNÉRÉ — À FAIRE RELIRE PAR UN AVOCAT AVANT MISE EN LIGNE. Ne pas publier tel quel. */}
      <LegalHeader
        title="Conditions générales de vente"
        updated={<Todo>date d&apos;entrée en vigueur</Todo>}
        intro={
          <p>
            Les présentes conditions générales de vente (les « CGV ») régissent la souscription aux
            abonnements payants du service Siteo. Elles complètent les{" "}
            <Link href="/cgu" className="underline">
              conditions générales d&apos;utilisation
            </Link>
            , qui régissent l&apos;usage du service lui-même.
          </p>
        }
      />

      <Section title="1. Identité du prestataire">
        <p>
          Le service est édité par <Todo>raison sociale</Todo>, dont les coordonnées complètes
          figurent dans les{" "}
          <Link href="/mentions-legales" className="underline">
            mentions légales
          </Link>{" "}
          (ci-après « Siteo »).
        </p>
      </Section>

      <Section title="2. Objet et champ d&apos;application">
        <p>
          Siteo fournit un service en ligne (SaaS) permettant de créer, personnaliser, publier et
          héberger un ou plusieurs sites internet vitrines à partir de modèles prédéfinis.
        </p>
        <p>
          Les CGV s&apos;appliquent à toute souscription d&apos;un abonnement, sans distinction
          entre client consommateur et client professionnel. Lorsqu&apos;une stipulation est
          réservée aux consommateurs au sens de l&apos;article liminaire du code de la
          consommation, elle est signalée comme telle. En l&apos;absence de recueil de la qualité du
          client lors de l&apos;inscription, Siteo applique par défaut le régime protecteur du
          consommateur.
        </p>
        <p className="text-sm text-neutral-600">
          Si Siteo décide de s&apos;adresser exclusivement à des professionnels, il faut à la fois
          collecter la qualité du client à l&apos;inscription (numéro SIRET, par exemple) et
          adapter les articles 8 et 14 en conséquence — la seule mention « service réservé aux
          professionnels » ne suffit pas à écarter le droit de la consommation.
        </p>
      </Section>

      <Section title="3. Formules et contenu du service">
        <Table
          head={["Formule", "Prix", "Contenu"]}
          rows={[
            [
              "Starter",
              <>
                <Todo>12 € — préciser TTC ou HT</Todo> / mois
              </>,
              "1 site publié, modèles de base, hébergement et nom de sous-domaine inclus.",
            ],
            [
              "Pro",
              <>
                <Todo>28 € — préciser TTC ou HT</Todo> / mois
              </>,
              "1 site publié, modèles premium multi-pages, hébergement et nom de sous-domaine inclus.",
            ],
            [
              "Agence",
              <>
                <Todo>40 € — préciser TTC ou HT</Todo> / mois
              </>,
              "Jusqu'à 5 sites publiés, mêmes fonctionnalités que la formule Pro.",
            ],
          ]}
        />
        <p className="text-sm text-neutral-600">
          Les tarifs annuels affichés sur la page publique (deux mois offerts) sont indicatifs :
          la souscription en ligne est aujourd&apos;hui mensuelle uniquement. Cette mention doit
          être retirée le jour où le paiement annuel est réellement proposé.
        </p>
        <p>
          Le détail à jour des formules figure sur la page de tarification du site. Siteo peut faire
          évoluer le contenu des formules ; toute évolution défavorable au client en cours
          d&apos;abonnement fait l&apos;objet d&apos;une information préalable dans les conditions
          de l&apos;article 13.
        </p>
      </Section>

      <Section title="4. Période d&apos;essai gratuite">
        <p>
          Tout nouveau compte bénéficie d&apos;une période d&apos;essai de <Todo>7</Todo> jours,
          sans saisie de carte bancaire et sans engagement. À l&apos;issue de cette période, le
          compte ne permet plus de publier ni de créer de nouveaux sites tant qu&apos;aucun
          abonnement n&apos;est souscrit. Aucun prélèvement automatique n&apos;intervient à la fin
          de l&apos;essai.
        </p>
      </Section>

      <Section title="5. Commande">
        <p>
          La souscription s&apos;effectue en ligne depuis l&apos;espace de facturation du compte.
          Le client sélectionne sa formule, vérifie le détail et le prix total de sa commande,
          corrige le cas échéant les erreurs, puis confirme en cliquant sur le bouton de paiement —
          ce clic vaut acceptation du prix et des présentes CGV, conformément à l&apos;article
          1127-2 du code civil.
        </p>
        <p>
          Un courriel de confirmation, ainsi que la facture correspondante, sont adressés au client
          après validation du paiement.
        </p>
      </Section>

      <Section title="6. Prix et modalités de paiement">
        <Bullets
          items={[
            <>
              Les prix sont indiqués en euros. La mention <Todo>TTC ou HT</Todo> et le taux de TVA
              applicable (<Todo>20 % ou franchise en base — art. 293 B du CGI</Todo>) doivent être
              précisés avant toute mise en ligne.
            </>,
            "Le paiement s'effectue par carte bancaire, ou par tout autre moyen proposé lors du parcours de paiement.",
            <>
              Le traitement des paiements est assuré par <strong>Stripe Payments Europe, Ltd.</strong>{" "}
              (Irlande). Les coordonnées bancaires du client sont saisies directement sur les pages
              hébergées par Stripe et ne transitent ni ne sont conservées par Siteo.
            </>,
            "L'abonnement est facturé d'avance, par période mensuelle, à la date anniversaire de la souscription.",
            <>
              En cas d&apos;échec de prélèvement, Siteo peut suspendre l&apos;accès aux
              fonctionnalités payantes après <Todo>délai de relance retenu</Todo> et information du
              client.
            </>,
            <>
              Pour un client professionnel, tout retard de paiement entraîne de plein droit des
              pénalités au taux de <Todo>taux retenu, au moins 3× le taux d&apos;intérêt légal</Todo>{" "}
              ainsi qu&apos;une indemnité forfaitaire de recouvrement de 40 € (art. L441-10 du code
              de commerce).
            </>,
          ]}
        />
      </Section>

      <Section title="7. Durée, reconduction et résiliation">
        <p>
          L&apos;abonnement est conclu pour une durée de <Todo>durée réelle : 1 mois, 12 mois…</Todo>
          , reconduite tacitement par périodes identiques, sauf résiliation.
        </p>
        <p>
          Le client peut résilier à tout moment depuis son espace de facturation. La résiliation
          prend effet à l&apos;échéance de la période en cours ; les sommes déjà réglées au titre de
          cette période restent dues et ne donnent pas lieu à remboursement au prorata.
        </p>
        <p>
          <strong>Consommateurs.</strong> Conformément à l&apos;article L215-1 du code de la
          consommation, Siteo informe le client, par écrit et au plus tôt trois mois et au plus tard
          un mois avant le terme de la période autorisant le rejet de la reconduction, de la
          possibilité de ne pas reconduire le contrat. Conformément à l&apos;article L215-1-1 du même
          code, la résiliation est possible en ligne, par une fonctionnalité accessible en
          permanence et directement depuis l&apos;interface du service —{" "}
          <Todo>emplacement exact du bouton de résiliation en ligne</Todo>.
        </p>
        <p>
          Après résiliation, les sites publiés sont dépubliés. Les données du compte sont conservées
          pendant <Todo>durée de rétention après résiliation</Todo> pour permettre une
          réactivation, puis supprimées dans les conditions de la{" "}
          <Link href="/confidentialite" className="underline">
            politique de confidentialité
          </Link>
          .
        </p>
      </Section>

      <Section title="8. Droit de rétractation (clients consommateurs)">
        <p>
          Le client consommateur dispose d&apos;un délai de quatorze (14) jours à compter de la
          conclusion du contrat pour exercer son droit de rétractation, sans avoir à motiver sa
          décision ni à supporter de pénalité (art. L221-18 du code de la consommation).
        </p>
        <p>
          Pour l&apos;exercer, le client informe Siteo de sa décision par une déclaration dénuée
          d&apos;ambiguïté adressée à <Todo>email ou adresse de rétractation</Todo>. Il peut
          utiliser le formulaire type de rétractation figurant à l&apos;annexe des présentes, sans
          que cela soit obligatoire.
        </p>
        <p>
          <strong>
            Nuance importante : exécution immédiate et perte du droit de rétractation.
          </strong>{" "}
          L&apos;abonnement Siteo est un service exécuté immédiatement — dès le paiement, le client
          peut publier son site. L&apos;article L221-28 du code de la consommation prévoit deux cas
          d&apos;exclusion susceptibles de s&apos;appliquer :
        </p>
        <Bullets
          items={[
            <>
              <strong>1° — service pleinement exécuté avant la fin du délai.</strong> Le droit de
              rétractation ne peut être exercé pour un contrat de prestation de services pleinement
              exécuté avant la fin du délai de rétractation, à condition que l&apos;exécution ait
              commencé après accord préalable exprès du consommateur et qu&apos;il ait reconnu
              expressément perdre son droit de rétractation.
            </>,
            <>
              <strong>13° — contenu numérique non fourni sur support matériel.</strong> Le droit ne
              peut davantage être exercé pour la fourniture d&apos;un contenu numérique non fourni
              sur un support matériel dont l&apos;exécution a commencé après accord préalable exprès
              du consommateur et renoncement exprès à son droit de rétractation.
            </>,
          ]}
        />
        <p>
          En pratique, deux conditions cumulatives sont nécessaires pour que cette perte joue :{" "}
          <strong>l&apos;accord exprès</strong> du consommateur à une exécution immédiate,{" "}
          <em>et</em> sa <strong>renonciation expresse</strong> au droit de rétractation, tous deux
          recueillis avant l&apos;exécution et confirmés sur support durable. Une case
          pré-cochée, ou une simple mention dans les CGV, ne suffit pas.
        </p>
        <p>
          Siteo recueille donc, au moment du paiement, une acceptation distincte formulée ainsi :{" "}
          <em>
            « Je demande expressément que l&apos;exécution du service commence immédiatement et je
            reconnais que je perdrai mon droit de rétractation une fois le service pleinement
            exécuté. »
          </em>{" "}
          <Todo>
            à implémenter dans le parcours de paiement — cette case n&apos;existe pas encore dans le
            code
          </Todo>
        </p>
        <p>
          À défaut de recueillir cet accord, le droit de rétractation reste entier pendant 14 jours,
          et le client peut être redevable d&apos;un montant proportionnel au service fourni jusqu&apos;à
          sa rétractation. En cas de rétractation valablement exercée, Siteo rembourse les sommes
          versées au plus tard quatorze jours après avoir été informé, par le même moyen de paiement
          que celui utilisé lors de la transaction.
        </p>
      </Section>

      <Section title="9. Obligations du client">
        <p>
          Le client garantit l&apos;exactitude des informations fournies lors de la souscription et
          s&apos;engage à respecter les{" "}
          <Link href="/cgu" className="underline">
            conditions générales d&apos;utilisation
          </Link>
          , notamment s&apos;agissant du contenu qu&apos;il publie. Le non-respect des CGU peut
          entraîner la suspension du service dans les conditions qui y sont prévues, sans que cette
          suspension n&apos;ouvre droit à remboursement.
        </p>
      </Section>

      <Section title="10. Disponibilité et maintenance">
        <p>
          Siteo met en œuvre les moyens raisonnables pour assurer la disponibilité du service 24
          heures sur 24 et 7 jours sur 7, sans garantir un taux de disponibilité déterminé. Des
          interruptions peuvent survenir pour maintenance, mise à jour ou en raison de faits
          imputables à un prestataire d&apos;hébergement. Siteo s&apos;efforce d&apos;informer les
          clients des interruptions programmées.
        </p>
        <p className="text-sm text-neutral-600">
          Si un engagement chiffré de disponibilité (SLA) est un jour proposé, il doit figurer ici
          avec ses modalités de calcul et ses compensations —{" "}
          <Todo>SLA : aucun engagement chiffré à ce jour</Todo>.
        </p>
      </Section>

      <Section title="11. Responsabilité">
        <p>
          Siteo est tenu d&apos;une obligation de moyens. Sa responsabilité ne saurait être engagée
          en cas de dommage résultant d&apos;une faute du client, du contenu qu&apos;il publie, de
          l&apos;utilisation de ses identifiants par un tiers, ou d&apos;un fait imprévisible et
          insurmontable d&apos;un tiers au contrat.
        </p>
        <p>
          <strong>Clients professionnels.</strong> La responsabilité de Siteo, toutes causes
          confondues, est plafonnée au montant des sommes effectivement versées par le client au
          titre des <Todo>durée retenue : 12 mois, par exemple</Todo> précédant le fait générateur.
        </p>
        <p>
          <strong>Clients consommateurs.</strong> Aucune clause des présentes n&apos;a pour effet de
          limiter les droits que le consommateur tient de la loi, notamment la garantie légale de
          conformité applicable aux contrats de fourniture de contenus et services numériques (art.
          L224-25-12 et suivants du code de la consommation).
        </p>
      </Section>

      <Section title="12. Données personnelles">
        <p>
          Le traitement des données personnelles est décrit dans la{" "}
          <Link href="/confidentialite" className="underline">
            politique de confidentialité
          </Link>
          , qui fait partie intégrante des présentes.
        </p>
      </Section>

      <Section title="13. Modification des CGV">
        <p>
          Siteo peut modifier les présentes CGV. Les clients abonnés en sont informés par courriel
          au moins <Todo>délai retenu : 30 jours, par exemple</Todo> avant l&apos;entrée en vigueur
          des nouvelles conditions. Le client qui refuse les modifications peut résilier son
          abonnement sans frais avant cette date. Les CGV applicables sont celles en vigueur à la
          date de la commande.
        </p>
      </Section>

      <Section title="14. Droit applicable et règlement des litiges">
        <p>
          Les présentes CGV sont soumises au droit français. En cas de litige, le client est invité
          à contacter en premier lieu Siteo à l&apos;adresse <Todo>email du service client</Todo>
          afin de rechercher une solution amiable.
        </p>
        <p>
          <strong>Consommateurs.</strong> Conformément à l&apos;article L612-1 du code de la
          consommation, le client consommateur peut recourir gratuitement au service de médiation de
          la consommation dont relève Siteo :
        </p>
        <ul className="flex list-disc flex-col gap-1 pl-5 marker:text-neutral-400">
          <li>
            Médiateur : <Todo>nom du médiateur de la consommation — adhésion obligatoire</Todo>
          </li>
          <li>
            Adresse postale : <Todo>adresse du médiateur</Todo>
          </li>
          <li>
            Site : <Todo>site de saisine du médiateur</Todo>
          </li>
        </ul>
        <p className="text-sm text-neutral-600">
          L&apos;adhésion à un dispositif de médiation de la consommation est une obligation légale
          pour tout professionnel vendant à des consommateurs : cette section ne peut pas rester
          vide au moment de l&apos;ouverture au public.
        </p>
        <p>
          <strong>Professionnels.</strong> À défaut d&apos;accord amiable, tout litige sera soumis
          aux tribunaux compétents de <Todo>ressort retenu</Todo>.
        </p>
      </Section>

      <Section title="Annexe — Formulaire type de rétractation">
        <p className="text-sm text-neutral-600">
          À compléter et à renvoyer uniquement si le client consommateur souhaite se rétracter du
          contrat, et sous réserve de l&apos;article 8 ci-dessus.
        </p>
        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-5 text-sm leading-relaxed text-neutral-700">
          <p>
            À l&apos;attention de <Todo>raison sociale, adresse postale, email</Todo> :
          </p>
          <p className="mt-3">
            Je vous notifie par la présente ma rétractation du contrat portant sur la prestation de
            services ci-dessous :
          </p>
          <p className="mt-3">— Commandé le : ………………… / Reçu le : …………………</p>
          <p>— Nom du consommateur : …………………</p>
          <p>— Adresse du consommateur : …………………</p>
          <p className="mt-3">
            Signature du consommateur (uniquement en cas de notification sur papier) : …………………
          </p>
          <p className="mt-3">Date : …………………</p>
        </div>
      </Section>
    </>
  );
}
