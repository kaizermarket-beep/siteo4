Tu travailles sur le monorepo Siteo (`apps/web`, Next.js 16 / React 19, Drizzle/Postgres, NextAuth, Stripe). Fais deux séries de changements, dans cet ordre. Après chaque étape, explique en une phrase ce que tu as changé et pourquoi — je veux comprendre, pas juste voir un diff.

## Partie 1 — Durcissement sécurité

1. **`src/validation/blocks/shared.ts`** : `linkSchema.href` accepte n'importe quelle chaîne, y compris `javascript:...`, et ce champ est rendu tel quel dans `<a href>` sur les sites publiés (`FooterBlock.tsx` et les CTA de `HeroBlock`/`ContactBlock`/autres blocs qui utilisent `linkSchema`). Ajoute une validation Zod qui n'autorise que les protocoles `http:`, `https:`, `mailto:`, `tel:`, ou une ancre commençant par `#`, ou une URL relative commençant par `/`. Rejette tout le reste avec un message clair. Vérifie tous les usages de `linkSchema`/`href` dans `components/blocks/` pour confirmer qu'aucun autre champ texte libre n'est utilisé comme URL sans passer par ce schéma.

2. **En-têtes de sécurité HTTP** : `next.config.ts` ne définit aucun en-tête. Ajoute une config `headers()` avec au minimum : `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY` (ou `SAMEORIGIN` si besoin d'iframes internes), `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` restrictive (désactive caméra/micro/géoloc par défaut), `Strict-Transport-Security` (en prod uniquement). Pour la CSP, propose une politique de base compatible avec Next.js (scripts inline nécessaires au hot-reload en dev, Google Fonts, Stripe.js si utilisé côté client) plutôt qu'une CSP trop stricte qui casserait le build — explique les compromis que tu fais.

3. **`src/app/api/upload/route.ts`** : le type de fichier est vérifié via `file.type` (déclaré par le client), pas par les octets réels. Ajoute une vérification des magic bytes (signature de fichier) pour confirmer que le contenu correspond réellement à JPG/PNG/WEBP/GIF avant d'écrire sur disque. Une petite lib comme `file-type` convient, ou une vérification manuelle des premiers octets si tu préfères ne pas ajouter de dépendance.

4. **`.mcp.json`** : contient une clé API 21st.dev en clair. Déplace-la vers une variable d'environnement (`.env.local`, déjà gitignoré) et fais lire `.mcp.json` cette variable si le format le permet, sinon documente dans `README.md` qu'il faut la régénérer après tout partage du dossier local. Ne l'affiche jamais en clair dans tes réponses.

5. **`src/lib/auth.ts`** : passe le coût bcrypt de 10 à 12 (dans `signup.ts`, `upgrade-and-publish.ts`, et partout où `bcrypt.hash` est appelé).

6. Fais un `pnpm audit` (ou `pnpm audit --prod`) et corrige ou signale les vulnérabilités trouvées dans les dépendances directes. Si une CVE ne peut pas être corrigée sans breaking change, liste-la avec son niveau de gravité au lieu de l'ignorer.

7. Signale-moi (sans le corriger automatiquement, c'est une décision produit) que le stockage d'upload sur `public/uploads` (disque local) ne fonctionnera pas sur Vercel serverless — je déciderai si on migre vers Vercel Blob/S3 maintenant ou plus tard.

## Partie 2 — Pages légales (CGV, CGU, mentions légales, confidentialité, cookies)

Contexte : Siteo est un SaaS français qui permet de créer et publier des sites vitrine, avec abonnement payant via Stripe (facturation pas encore branchée en prod, mais les CGV doivent déjà exister avant l'ouverture au public). Utilisateurs = professionnels français (coiffeurs, artisans, restaurateurs, etc.), donc B2B dans la majorité des cas, mais le formulaire d'inscription ne distingue pas particulier/professionnel — traite le cas le plus protecteur (consommateur) par défaut sauf si je te dis le contraire.

1. Crée un nouveau groupe de routes `src/app/(marketing)/(legal)/` avec ces pages, chacune en français, contenu structuré et complet mais avec des `[[À COMPLÉTER]]` explicites partout où il faut une donnée réelle que tu ne peux pas inventer (raison sociale, forme juridique, SIRET, capital social, adresse du siège, nom du responsable de publication, hébergeur exact et son adresse, DPO ou contact RGPD, prix réels, durée d'engagement réelle) :
   - `/mentions-legales` — obligations LCEN art. 6-III : éditeur, hébergeur, directeur de publication, contact.
   - `/cgv` — conditions générales de vente : objet, prix et modalités de paiement (Stripe), durée et résiliation de l'abonnement, droit de rétractation à 14 jours pour les consommateurs avec la clause de renonciation applicable aux contenus numériques/services fournis immédiatement (article L221-28 du Code de la consommation — explique la nuance plutôt que de la supprimer), responsabilité, litiges/médiation à la consommation.
   - `/cgu` — conditions d'utilisation du service (compte, contenu déposé par l'utilisateur, propriété intellectuelle des sites créés, comportements interdits, suspension de compte).
   - `/confidentialite` — politique de confidentialité RGPD : données collectées (email, nom, contenu des sites), finalités, base légale, durée de conservation, sous-traitants (Neon pour la base de données, Stripe pour le paiement, Vercel pour l'hébergement, Google pour l'OAuth — indique pour chacun s'il y a un transfert hors UE à documenter), droits de la personne (accès, rectification, effacement, portabilité) et comment les exercer.
   - `/cookies` — liste réellement les cookies posés par le code (`siteo_guest` dans `src/lib/identity.ts`, le cookie de session NextAuth) : finalité, durée, et pourquoi ils sont exemptés de consentement (strictement nécessaires au fonctionnement du service) — n'invente pas de cookies analytics/marketing qui n'existent pas dans le code.

2. Ajoute ces liens dans le footer du site marketing (`app/(marketing)`) et dans le tableau de bord (`app/(dashboard)`) — vérifie s'il existe déjà un composant de footer partagé pour ce groupe de routes avant d'en créer un nouveau.

3. Ajoute une case à cocher obligatoire "J'accepte les CGV et la politique de confidentialité" sur le formulaire d'inscription (`src/server-actions/auth.ts` / `signup`) et sur le flux invité→compte (`upgrade-and-publish.ts`), avec lien vers les pages correspondantes. Un signup sans acceptation doit être refusé côté serveur, pas seulement côté client.

4. En haut du fichier de chaque page légale, ajoute un commentaire JSX bien visible : `{/* CONTENU GÉNÉRÉ — À FAIRE RELIRE PAR UN AVOCAT AVANT MISE EN LIGNE. Ne pas publier tel quel. */}`.

Ne marque aucune des pages légales comme "terminée" dans ton résumé final — dis clairement que c'est un squelette juridique correct sur la forme, pas un document validé, et que je dois le faire relire avant toute mise en production réelle.
