# Audit honnête — projet Siteo

Date : 22 août 2026
Périmètre : `apps/web` (Next.js 16 / React 19), monorepo pnpm, base Postgres (Drizzle), auth NextAuth, paiement Stripe.

Ceci est une revue de code statique (lecture des fichiers sources, config, schéma DB), pas un pentest actif ni un scan de dépendances complet (voir "Limites" en bas). Je te donne mon avis franc : le code applicatif est **nettement plus soigné que la moyenne d'un projet à ce stade** — les points faibles sont surtout ailleurs (légal, durcissement, prod-readiness), pas dans la logique métier.

---

## 1. Ce qui est bien fait (pour être honnête dans les deux sens)

- **Contrôle d'accès systématique** : chaque server action qui touche un bloc, une page ou un site revérifie la propriété (`assertBlockOwnership`, `assertSiteOwnership`, `getOwnedSite`) avant toute lecture/écriture. C'est le genre de discipline qui manque dans 90 % des projets à ce stade.
- **Cookie invité signé correctement** : `src/lib/identity.ts` signe le cookie avec HMAC-SHA256 et compare avec `timingSafeEqual` (évite les attaques par timing), cookie `httpOnly` + `secure` en prod + `sameSite: lax`. C'est fait dans les règles.
- **Rate limiting réel** sur login, signup et upload, stocké en base (bon raisonnement : un `Map` en mémoire ne survit pas au serverless — le commentaire dans le code le dit explicitement).
- **Mots de passe** : bcrypt (coût 10), jamais stockés en clair.
- **Webhook Stripe** : vérifie la signature (`stripe.webhooks.constructEvent`) sur le corps brut avant tout traitement, renvoie 500 en cas d'échec transitoire pour déclencher un retry Stripe. C'est exactement la bonne pratique.
- **Upload de fichiers** : authentifié, rate-limité, liste blanche de types MIME, taille plafonnée à 5 Mo, nom de fichier régénéré aléatoirement (pas d'écrasement ni de traversée de chemin).
- **Pas d'injection SQL** : tout passe par Drizzle ORM avec requêtes paramétrées, y compris le seul `sql` brut du rate-limiter.
- **Pas de `dangerouslySetInnerHTML` ni `eval`** dans tout `src/` — le rendu du contenu texte des blocs passe par l'échappement automatique de React.
- **Secrets** : `.env*` et `.mcp.json` sont bien dans `.gitignore`, avec un commentaire qui explique pourquoi. Rien de sensible ne semble être parti sur Git.

## 2. Failles et risques — classés par gravité

### Critique
**Aucune mention légale, CGV, CGU, politique de confidentialité ni politique cookies.** J'ai cherché dans tout `apps/web/src` et `apps/web/public` — zéro occurrence. Pour un site marchand français qui va facturer via Stripe et collecter des données personnelles (email, nom), c'est une obligation légale, pas une option :
- Mentions légales obligatoires (LCEN, art. 6-III) dès qu'un site est accessible au public, même sans vente.
- CGV obligatoires dès qu'il y a vente à distance à des particuliers (Code de la consommation) : prix, modalités de paiement, droit de rétractation (14 jours, avec les exceptions/renoncements applicables aux services numériques), durée d'engagement, résiliation.
- Politique de confidentialité + base légale de traitement + durées de conservation (RGPD, obligatoire dès qu'il y a compte utilisateur avec email).
- Registre des traitements (même simplifié) si tu factures et stockes des données de clients.

C'est le point qui correspond directement à ta demande — je le détaille dans le prompt plus bas.

### Élevé
**`href` de lien non validé, exploitable en `javascript:` URI sur les sites publiés.**
`src/validation/blocks/shared.ts` définit `linkSchema.href` comme `z.string().max(2048)` — aucune restriction de schéma. Ce champ est rendu tel quel dans `<a href={link.href}>` (`FooterBlock.tsx` ligne 9, et probablement `HeroBlock.tsx`/`ContactBlock.tsx` pour les CTA — non vérifiés un par un). Un propriétaire de site malveillant (ou un compte invité) peut donc poser `href="javascript:...”` sur un bouton de son propre site public et faire exécuter du JS dans le navigateur de ses visiteurs au clic. Impact limité (les visiteurs d'un site publié ne sont pas connectés à Siteo), mais c'est une XSS stockée classique et le correctif est trivial (valider que le protocole est `http:`, `https:`, `mailto:`, `tel:` ou une ancre `#...`).

**Aucun en-tête de sécurité HTTP configuré.** `next.config.ts` est vide — pas de CSP, pas de `X-Frame-Options`, pas de `X-Content-Type-Options`, pas de `Referrer-Policy`, pas de `Strict-Transport-Security`, pas de `Permissions-Policy`. Ça ne casse rien aujourd'hui, mais ça retire une couche de défense en profondeur qui aurait justement limité l'impact du point précédent.

### Moyen
- **Clé API 21st.dev en clair sur le disque** (`.mcp.json`). Elle est bien gitignorée donc pas sur GitHub, mais elle reste en clair dans un fichier local — à faire migrer vers une variable d'environnement, et à révoquer/régénérer si ce fichier a pu circuler (partage d'écran, sauvegarde cloud du dossier, etc.).
- **Aucune vérification d'email** : le champ `emailVerified` existe dans le schéma mais n'est jamais utilisé — n'importe qui peut créer un compte avec l'email de quelqu'un d'autre sans jamais le prouver. Pas dramatique tant qu'il n'y a pas de récupération de mot de passe par email, mais à corriger avant d'en ajouter une.
- **Pas de flux "mot de passe oublié"** — absent du code. Pas une faille en soi, mais son absence pousse souvent à l'ajouter plus tard dans l'urgence, moins proprement.
- **Type MIME de l'upload vérifié côté client** (`file.type` du `FormData`, pas les octets réels du fichier) — un en-tête falsifié pourrait en théorie passer le filtre. Impact limité car l'extension reste contrainte par la liste blanche, mais un vrai contrôle "magic bytes" serait plus robuste.
- **Stockage des uploads sur le disque local (`public/uploads`)** — le commentaire du code le dit lui-même : ça ne fonctionnera pas sur Vercel serverless. C'est une bombe à retardement de mise en prod plus qu'une faille de sécu : le jour du déploiement, les images uploadées ne persisteront pas.
- **Facturation Stripe non branchée** : `entitlements.ts` l'indique explicitement — "Stripe isn't wired yet... everyone rides the trial". Ce n'est pas un problème de sécurité, mais ça veut dire qu'aujourd'hui *personne ne peut réellement payer*, ce qui doit rester cohérent avec ce que promettent tes futures CGV (ne pas décrire des modalités de facturation qui ne sont pas encore fonctionnelles).

### Faible / hygiène
- Coût bcrypt à 10 (recommandation actuelle : 12) — à relever quand tu y penseras, pas urgent.
- Aucun test automatisé (`vitest`/`jest` absent des devDependencies) alors que la logique de propriété/entitlements est exactement le genre de code qui mérite des tests de non-régression.
- Aucune CI (pas de workflow GitHub Actions trouvé) : pas de lint/build/audit de dépendances exécuté automatiquement avant merge.

## 3. Limites de cet audit (pour rester honnête)

Je n'ai pas :
- fait de scan de vulnérabilités sur les dépendances (`npm audit`/`pnpm audit` a échoué faute de lockfile reconnu dans l'environnement où j'ai tourné la commande — à relancer toi-même avec `pnpm audit`) ;
- relu `templates/registry.ts` (157 Ko) ni chaque composant `components/blocks/*` un par un — j'ai vérifié qu'aucun `dangerouslySetInnerHTML`/`eval` n'existe dans tout `src/`, ce qui couvre la XSS "directe", mais pas chaque rendu de champ un par un ;
- testé l'infrastructure réelle (config Vercel, DNS wildcard, TLS, en-têtes réellement envoyés en prod) ;
- fait de test d'intrusion actif (pas de tentative d'exploitation, juste lecture de code) ;
- évalué la conformité RGPD au-delà du constat "il n'y a rien" (durées de conservation, sous-traitants, transferts hors UE — Neon, Vercel, Stripe étant potentiellement hors UE selon la région choisie).

---

**En résumé** : le code est solide sur les fondamentaux (auth, autorisation, paiement, upload) — c'est plutôt rare et ça vaut la peine d'être dit. Les vrais trous sont : zéro page légale, zéro en-tête de sécurité, et un `href` non validé. Rien d'insurmontable, mais rien à laisser traîner non plus si le site doit vraiment recevoir du public payant.
