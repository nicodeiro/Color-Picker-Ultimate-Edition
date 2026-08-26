# Design QA — sélecteur de format du Color Inspector

## Cible et comparaison

- Source originale : `reference/user-approved-format-control-2230x705.png`.
- Source normalisée : `reference/approved-control-normalized-291x44.png`.
- Popup réelle : `screenshots/final-native-light-340x470.png`.
- Gros plan réel : `screenshots/final-control-light-291x44.png`.
- Comparaison combinée : `comparisons/source-vs-native-732x640.png`.
- Viewport natif : `340 × 470` CSS px, DPR `1`.
- État : Inspecteur couleur, thème clair, couleur `#F96B00`, format HEX.

La source et l’implémentation ont été inspectées ensemble au même gabarit. Le
comparatif plein écran contextualise la seule zone modifiée ; le second rang
compare les deux composants à `291 × 44` sans mise à l’échelle différente.

## Findings

Aucun écart P0, P1 ou P2 ne reste dans le périmètre demandé.

- Le cadre ne possède plus qu’une bordure extérieure.
- Le sélecteur, la valeur et Copier suivent les proportions mesurées de la
  référence.
- La ligne de grille explicite à `30 px` supprime le décalage vertical hérité de
  l’ancienne composition à deux lignes.
- La valeur conserve le rendu SF Mono étroit de la cible.
- Le bouton Copier est une tuile grise sans bordure ou ombre permanente.
- Le grand cercle, son halo et le contenu au-dessus sont inchangés.

## États et interactions

- HEX : `#F96B00`, complet.
- RGB : `249, 107, 0`, complet.
- HSL : `26°, 100%, 49%`, complet.
- Copier reçoit un contour de focus bleu `2 px`, offset `2 px`.
- Les onglets gardent leurs rôles, `aria-selected`, navigation fléchée et action
  Copier existants ; aucun HTML ou JavaScript produit n’a été modifié.
- Clair et sombre : géométrie identique ; fond, texte et séparateur utilisent
  les tokens existants du thème.

## Captures multi-formats synthétiques

- iPhone 12 mini — `375 × 812` : réussi.
- iPhone 14 Pro — `393 × 852` : réussi.
- iPhone 17 Pro Max — `440 × 956` : réussi.
- iPhone SE (3e génération) — `375 × 667` : réussi.

Captures : `formats/*-inspector.png`. Le popup reste volontairement fixé à
`340 × 470`; ces formats sont des stress tests synthétiques et non des cibles
Chrome natives.

## Grille finale

Gate « No AI Slop » : réussie.

| Dimension | Note / 10 |
|---|---:|
| Clarté | 10 |
| Hiérarchie | 10 |
| Espacement | 10 |
| Typographie | 9 |
| Matière | 10 |
| Contrôles et retours | 10 |
| Accessibilité | 9 |
| Réalisme Chrome | 10 |
| Cohérence de suite | 9 |
| Originalité Bitek | 9 |
| **Total** | **96 / 100** |

Le composant dépasse `90/100`, aucune dimension n’est sous `8/10`, et la cible
a été explicitement choisie par le propriétaire.

## Historique

1. Mesure de la source `2230 × 705` et reconstruction à `291 × 44`.
2. Première capture native : double effet retiré, proportions rapprochées.
3. Comparaison focalisée : la fonte SF Mono d’origine correspond mieux à la
   largeur de la valeur cible que la fonte proportionnelle ; elle est rétablie.
4. Inspection des coordonnées : l’ancienne ligne de grille vide remontait les
   contrôles de `3 px`; `grid-template-rows: 30px` corrige l’alignement.
5. Nouvelle comparaison combinée : aucune différence matérielle restante.

final result: passed
