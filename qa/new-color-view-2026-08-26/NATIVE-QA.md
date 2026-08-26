# QA native — éditeur intégré « Nouvelle couleur »

## Contrat

- Cible approuvée : `target-imagen.png` (`1066 × 1476 px`).
- SHA-256 : `921b066992558d2e4b84d6d59ddb9d8e148e7bbaa55eb8244f417d8b77c1e4bd`.
- Comparaison normalisée, cible à gauche et popup réel à droite :
  `comparison-target-vs-implementation.png`.
- Surface native : popup d’action Brave `340 × 470 px`, DPR `1`.
- Périmètre : uniquement les contrôles sous le grand cercle existant.

Le titre « Inspecteur couleur » et le cercle existant sont conservés sur ordre
explicite. La cible visuelle est donc adaptée à la géométrie du produit, sans
recréer son en-tête ni son cercle.

## Invariant du grand cercle

Les captures natives avant et après l’implémentation sont :

- `before-action-inspector-light.png` ;
- `after-action-inspector-light.png`.

Dans les deux rapports, `#hero-swatch` reste exactement à :

- x `111 px` ;
- y `74 px` ;
- largeur `118 px` ;
- hauteur `118 px`.

Le DOM `#hero-swatch > .hero-ring + .hero-swatch-fill`, ses classes et ses
règles de base n’ont pas été remplacés. Le test fonctionnel vérifie également
la géométrie avant et après ouverture, saisie, annulation et sauvegarde.

## Géométrie native du nouvel éditeur

La capture principale est `action-new-color-inline-fr-light.png`.

| Élément | x | y | Largeur | Hauteur |
|---|---:|---:|---:|---:|
| Plan saturation / valeur | 62 | 205 | 216 | 86 |
| Contrôle de teinte | 62 | 299 | 216 | 24 |
| Piste de teinte | 62 | 307 | 216 | 8 |
| Onglets HEX / RGB / HSL | 62 | 331 | 216 | 36 |
| Valeur active | 62 | 375 | 216 | 40 |
| CTA | 62 | 423 | 216 | 40 |

Le document reste `340 × 470 px`. Le repère SV est entièrement contenu dans le
plan et le libellé du CTA ne déborde dans aucune langue.

## États visuellement inspectés

- clair : `action-new-color-inline-fr-light.png` ;
- sombre, ouverture depuis la bibliothèque :
  `action-new-color-library-fr-dark.png` ;
- HEX invalide et focus visible :
  `action-new-color-inline-invalid-fr-light.png` ;
- édition RGB : `action-new-color-inline-rgb-fr-light.png` ;
- couleurs forcées :
  `action-new-color-inline-fr-light-forced-colors.png` ;
- mouvement réduit :
  `action-new-color-inline-fr-light-reduced-motion.png`.

En couleurs forcées, les deux surfaces essentielles de choix conservent leurs
gradients grâce à `forced-color-adjust: none`, tandis que les bordures, onglets,
champs et CTA utilisent les contrastes système.

## Huit langues

Les huit captures `action-new-color-inline-<locale>-light.png` ont été ouvertes
et inspectées : `fr`, `en`, `es`, `de`, `pt`, `ru`, `ja`, `zh`.

- Aucun titre ni CTA rogné.
- Le CTA a `scrollWidth === clientWidth` dans les huit langues.
- Roboto Flex reste la police d’interface et Roboto Mono celle des valeurs ;
  les fallbacks japonais et chinois s’appliquent correctement.
- Chaque rapport contient zéro erreur console et zéro échec réseau.

## Interaction réelle

`action-new-color-functional-fr-light.json` valide les 19 contrôles suivants :

- ouverture depuis l’Inspecteur et absence du picker natif ;
- brouillon initial identique à la couleur active ;
- anciens contrôles masqués et non tabulables ;
- synchronisation HEX / RGB / HSL ;
- aucune écriture avant sauvegarde ;
- saisie invalide annoncée et CTA désactivé ;
- plan SV pilotable au clavier sans écriture prématurée ;
- sauvegarde, sélection, déduplication et retour Inspecteur ;
- restauration du focus ;
- annulation par Échap sans mutation ;
- ouverture et sauvegarde depuis « Tout voir » ;
- invariant du cercle et absence de débordement horizontal.

La régression `action-saved-library-regression.json` valide en plus les 24
contrôles de la bibliothèque : recherche, états vides, favoris, tris,
sélection, Retour, Échap, clavier, ajout intégré, annulation, persistance,
scroll vertical et états accessibles.

## Formats de contrôle

Les captures synthétiques suivantes ont été inspectées comme tests de stress,
et non comme tailles natives Chrome :

- iPhone 12 mini — `375 × 812` : `stress-iphone-12-mini.png` ;
- iPhone 14 Pro — `393 × 852` : `stress-iphone-14-pro.png` ;
- iPhone 17 Pro Max — `440 × 956` : `stress-iphone-17-pro-max.png` ;
- iPhone SE (3e génération) — `375 × 667` : `stress-iphone-se-3.png`.

La surface d’extension reste volontairement fixe à `340 px`, le cercle garde
`118 × 118 px`, l’éditeur garde `216 px` de large et aucun document ne déborde.

## Fidélité et décisions

- Le plan, la teinte, les onglets, le champ et le CTA suivent la cible dans la
  même hiérarchie et la même colonne de `216 px`.
- La position réelle de la poignée de teinte représente `26°` sur une piste
  conventionnelle allant du rouge vers le jaune ; elle n’est pas placée
  artificiellement comme dans le concept statique.
- L’en-tête et le grand cercle divergent volontairement du concept complet,
  car ils appartiennent à la zone explicitement verrouillée.

## Environnement et sécurité

- Brave/Chromium : `Chrome/151.0.7922.137`.
- Extension décompressée réelle : `jdnmmamijbiceddnlfhgpempfodcgoll`.
- Manifeste V3 ; permission unique `storage` ; aucune host permission.
- Toutes les ressources réseau proviennent de l’origine locale
  `chrome-extension://` ; zéro requête distante et zéro échec.
- Le ZIP local `dist/color-picker-ultimate-edition-1.0.4.zip` contient 46
  fichiers allowlistés, les deux licences de polices et la licence Lucide.
- SHA-256 du ZIP :
  `ea9d0d084e89e55a0293687a2de56cced14d1192c9179bf1fe6aada394418cab`.
- Le ZIP extrait a été rechargé comme vraie extension :
  `packaged-action-new-color-inline-fr-light.png` et
  `packaged-action-new-color-functional-fr-light.json` confirment la version
  `1.0.4`, les 19 contrôles fonctionnels, le cercle `111, 74, 118 × 118`, zéro
  erreur console et zéro échec réseau.

## Résultat

Score visuel et produit : `95/100`. Aucun critère n’est inférieur à `8/10`.

final result: passed
