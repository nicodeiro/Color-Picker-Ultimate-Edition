# Cible visuelle — RGB dans les couleurs enregistrées compactes

Date : 25 août 2026

## Intention approuvée

La vue compacte « Couleurs enregistrées » de l’Inspecteur couleur doit reprendre
la hiérarchie d’information déjà utilisée dans la vue dédiée « Tout voir » :

- le nuancier reste le premier repère visuel ;
- le code HEX est affiché en gras sur la première ligne ;
- la valeur `RGB r, g, b` est affichée en plus petit et en gris sur la seconde
  ligne ;
- aucun nom de couleur n’est généré ;
- aucun check n’est ajouté à la couleur sélectionnée.

Références fournies et conservées dans le dossier QA :

- composition compacte avant ajout du RGB :
  `reference/user-inline-saved-colors-hex-only.png` ;
- hiérarchie HEX + RGB demandée, issue de la vue « Tout voir » :
  `reference/user-dedicated-card-hex-rgb.png`.

La cible finale est la combinaison explicite de ces deux références : conserver
la grille compacte de la première, puis appliquer à chaque couleur la
disposition d’information de la seconde.

## Périmètre modifiable

La modification est strictement limitée au contenu de chaque couleur
enregistrée sous le grand cercle :

- ajout de la ligne RGB ;
- regroupement du HEX et du RGB dans une pile verticale ;
- ajustement local de la typographie et de l’espacement nécessaires pour que les
  deux lignes tiennent sans rognage.

## Invariants verrouillés

Ces éléments doivent rester inchangés :

- en-tête et navigation Retour ;
- grand cercle central, halo spectral, taille, position et animation ;
- sélecteur de format HEX / RGB / HSL, valeur active et action Copier ;
- titre « Couleurs enregistrées » et action « Tout voir » ;
- grille en deux colonnes ;
- ordre et couleurs des éléments ;
- action « Nouvelle couleur » accompagnée de son bouton « + » distinct ;
- contour seul pour la couleur sélectionnée, sans check.

## Contrat d’affichage

Pour chaque carte compacte :

1. Le nuancier est placé à gauche.
2. Les métadonnées sont placées à droite du nuancier.
3. Le HEX est en capitale, gras et monospace, par exemple `#F06800`.
4. Le RGB est en dessous, atténué et composé dans la typographie secondaire du
   système, par exemple `RGB 240, 104, 0`.
5. Les deux lignes restent entièrement visibles avec les valeurs longues,
   notamment `RGB 255, 255, 255`.
6. La zone cliquable, le focus clavier, la sélection et l’accessibilité existants
   sont conservés.
7. Aucun débordement horizontal ou vertical n’est introduit dans le popup
   naturel `340 × 470`.

## États à vérifier

- thème clair ;
- thème sombre ;
- couleur sélectionnée ;
- focus clavier sur une couleur sélectionnée ;
- valeur RGB la plus longue ;
- popup naturel `340 × 470` ;
- viewports de contrôle iPhone 12 mini, iPhone 14 Pro, iPhone 17 Pro Max et
  iPhone SE (3e génération).

## Critères d’acceptation

- chaque couleur compacte affiche simultanément le HEX et le RGB ;
- la disposition correspond à celle de la vue « Tout voir » ;
- la hiérarchie reste dominée par le nuancier, puis le HEX, puis le RGB ;
- les cinq couleurs et « Nouvelle couleur » restent visibles dans la vue
  compacte ;
- le contour de sélection n’est pas coupé et aucun check n’apparaît ;
- aucun texte, séparateur ou carte ne se chevauche ;
- aucun débordement n’est observé ;
- aucune erreur console ou réseau n’est introduite.

Statut de la cible : approuvée et implémentée.
