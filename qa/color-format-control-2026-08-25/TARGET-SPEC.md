# Cible — sélecteur HEX / RGB / HSL

## Décision propriétaire

Le 25 août 2026, le propriétaire a demandé que le contrôle sous le grand cercle
reprenne exactement la référence fournie. Cette passe est une correction locale
d’une cible déjà sélectionnée : elle ne relance pas l’exploration `10 → 3 → 1`
et ne modifie ni le cercle, ni son halo, ni l’en-tête.

Source conservée :

- `reference/user-approved-format-control-2230x705.png` ;
- SHA-256 `e5102a31bbf02af22c06796532c8ea485fd4a4bafd3d829fdc6c1671013d31b1`.

## Géométrie reconstruite à 340 × 470

- Contrôle : `291 × 44 px`, bordure extérieure unique de `1 px`, rayon `7 px`.
- Fond : surface pleine ; aucune ombre extérieure ni lumière `inset`.
- Padding : `6 px` ; deux espaces de grille de `6 px`.
- Colonnes : `144 px / minmax(0, 1fr) / 30 px`.
- Ligne : `30 px` pour neutraliser les anciennes lignes implicites du composant.
- Sélecteur : `144 × 30 px`, padding interne `1 px`, rayon `5 px`.
- Onglet actif : `47.33 × 28 px` environ, surface blanche et ombre douce.
- Valeur : SF Mono `11 px / 720`, alignée à droite ; `10 px` pour RGB et HSL.
- Copier : `30 × 30 px`, surface grise douce, sans bordure ni ombre, rayon `5 px`.
- Icône : le SVG Copier local déjà présent est conservé.

## États obligatoires

- HEX `#F96B00` ;
- RGB `249, 107, 0` ;
- HSL `26°, 100%, 49%` ;
- thème clair et thème sombre ;
- focus clavier visible sur Copier ;
- aucune troncature ni extension du document à `340 × 470`.

## Critères de refus

- double contour ou reflet intérieur sur le cadre ;
- bordure persistante autour du bouton Copier ;
- ancienne grille à deux lignes faisant remonter les contrôles de `3 px` ;
- modification du grand cercle ou de son halo ;
- texte RGB/HSL tronqué ;
- focus masqué.
