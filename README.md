# Siteo

Créateur de sites vitrines par métier (coiffeur, restauration, automobile, artisan,
coach sportif, photographe). Monorepo pnpm ; l'application est dans `apps/web`
(Next.js 16, Drizzle/Postgres, NextAuth, Stripe).

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

Les sites publiés sont servis sur un sous-domaine : `<slug>.localhost:3000` en
développement. Les liens internes d'un site multi-pages sont relatifs à la racine,
donc ils ne fonctionnent qu'à cette adresse — pas via `/s/<slug>`.

| Commande | Effet |
| --- | --- |
| `pnpm --filter web db:push` | Applique le schéma Drizzle à la base |
| `pnpm --filter web db:seed` | Charge les modèles depuis `src/templates/registry.ts` |
| `pnpm --filter web db:backfill-pages` | Rattache les blocs des sites créés avant le multi-pages |
| `pnpm --filter web stripe:setup` | Crée les produits et tarifs Stripe |
| `pnpm --filter web stripe:listen` | Redirige les webhooks Stripe vers le poste local |

## Secrets et variables d'environnement

Deux fichiers, tous les deux ignorés par git, et qui ne sont **pas** lus par les
mêmes programmes :

| Fichier | Lu par | Contient |
| --- | --- | --- |
| `apps/web/.env.local` | Next.js et les scripts `tsx` | `DATABASE_URL`, `AUTH_SECRET`, clés Stripe, `NEXT_PUBLIC_ROOT_DOMAIN` |
| `.mcp.json` | Claude Code | Configuration des serveurs MCP |

### Clé API 21st.dev

`.mcp.json` ne contient plus la clé en clair : il référence
`${TWENTY_FIRST_API_KEY}`, que Claude Code résout depuis **l'environnement du
shell**, et non depuis `apps/web/.env.local`. La valeur y est aussi rangée pour
mémoire, mais Next.js est le seul à lire ce fichier — définir la variable
uniquement là ne suffit pas à faire fonctionner le serveur MCP.

Sur Windows, une fois pour toutes (rouvrir le terminal ensuite) :

```bash
setx TWENTY_FIRST_API_KEY "la-valeur-qui-est-dans-apps/web/.env.local"
```

Si le serveur `21st` ne se connecte plus après ce changement, c'est que la
variable n'est pas visible du processus : vérifier avec `echo $TWENTY_FIRST_API_KEY`
dans le terminal d'où Claude Code est lancé.

### Rotation

Une clé qui a séjourné en clair dans un fichier doit être considérée comme
exposée dès que le dossier local est partagé, copié, sauvegardé sur un service
tiers, ou qu'une capture d'écran en montre le contenu. Dans ce cas : la révoquer
sur 21st.dev, en générer une nouvelle, et mettre à jour la variable
d'environnement — `.mcp.json` n'a pas besoin d'être modifié.

La même règle vaut pour `STRIPE_SECRET_KEY` et `AUTH_SECRET`. Aucun de ces
fichiers n'a été committé à ce jour (`git log --all -- .mcp.json` est vide).

## Sécurité

- En-têtes HTTP (CSP, HSTS, anti-framing, anti-sniffing) : `apps/web/next.config.ts`,
  qui documente les deux directives volontairement permissives et pourquoi.
- Les champs de lien saisis dans l'éditeur sont restreints à une liste de
  protocoles autorisés (`apps/web/src/validation/blocks/shared.ts`) : sans cela,
  un `javascript:` dans un lien de pied de page s'exécute chez chaque visiteur
  du site publié.
- Les images importées sont validées sur leurs octets réels, pas sur le type
  déclaré par le navigateur (`apps/web/src/app/api/upload/route.ts`).
- `pnpm audit` doit rester à zéro ; les correctifs de dépendances transitives
  sont épinglés dans `overrides` de `pnpm-workspace.yaml`.

> Les fichiers de `apps/web/src/app/(marketing)/(legal)/` sont un squelette
> juridique généré, non relu par un professionnel du droit. Ils portent tous un
> avertissement en tête de fichier et des marqueurs `[[À COMPLÉTER]]`. Ne pas
> ouvrir le service au public sans les avoir fait relire.
