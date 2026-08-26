# Historical Design QA — En-tête de l’Inspecteur couleur

## Cible et preuves

- Objectif : retirer le bouton pipette placé à droite du titre « Inspecteur couleur » et supprimer le séparateur horizontal situé sous l’en-tête.
- Source visuelle : `qa/inspector-header-cleanup/source-inspector-header.png`.
- Implémentation : `qa/inspector-header-cleanup/implementation-inspector-header.png`.
- Comparaison normalisée : `qa/inspector-header-cleanup/source-vs-implementation.png`.
- État comparé : Inspecteur couleur, thème clair, couleur `#202124`.
- Source : `337 × 466 px`, normalisée à `340 × 470 px`.
- Implémentation : viewport CSS `340 × 470`, capture `340 × 470 px`, densité `1×`.

## Comparaison visuelle

La comparaison montre le même écran avant et après la modification. La capture source sert à localiser les deux éléments demandés ; l’implémentation conserve la flèche retour, le titre, le disque coloré, les valeurs et la collection, tout en retirant :

- le bouton pipette à droite de l’en-tête ;
- la ligne horizontale sous l’en-tête.

Le comparatif plein écran et le contrôle focalisé de l’en-tête utilisent tous deux `qa/inspector-header-cleanup/source-vs-implementation.png`. Aucun second recadrage n’est nécessaire : le titre, l’ancien bouton et le séparateur sont lisibles à la taille native.

## Findings

Aucun écart P0, P1 ou P2 ne reste.

- Le bouton `#header-pick-btn` n’existe plus dans le DOM.
- La bordure inférieure calculée de `.details-header` vaut `0px` avec le style `none`.
- L’en-tête ne produit aucune ombre pouvant recréer un faux séparateur.
- La flèche retour est le seul bouton réellement visible dans l’en-tête.

## Surfaces de fidélité

- Fonts et typographie : famille, taille, graisse, interlettrage et alignement du titre sont inchangés.
- Espacement et rythme : hauteur d’en-tête `50 px`, position de la flèche et marge du titre conservées ; l’espace libéré à droite reste vide.
- Couleurs et tokens : arrière-plan, texte et palette de l’écran inchangés ; seul le séparateur demandé est supprimé.
- Images et assets : couronne spectrale, couleurs enregistrées et icônes de copie inchangées, sans modification de qualité ou de cadrage.
- Copy et contenu : « Inspecteur couleur », `#202124`, HEX, RGB, HSL et « Enregistrées » restent identiques.

## Interaction et accessibilité

- La flèche retour reste accessible sous le nom « Retour ».
- Le clic sur Retour masque correctement l’Inspecteur et réaffiche l’écran principal.
- Aucun gestionnaire JavaScript ne référence l’ancien bouton pipette.
- Console navigateur : aucune erreur ni aucun avertissement.

## Captures multi-formats

- iPhone 12 mini — `375 × 812` : réussi.
- iPhone 14 Pro — `393 × 852` : réussi.
- iPhone 17 Pro Max — `440 × 956` : réussi.
- iPhone SE (3e génération) — `375 × 667` : réussi.

Captures : `output/playwright/inspector-header-cleanup-2026-07-27/*-inspector.png`.

Sur les quatre formats :

- aucune icône pipette dans l’en-tête ;
- aucun trait sous le titre ;
- aucun débordement horizontal ou vertical ;
- aucun rognage ou chevauchement.

## Historique de comparaison

1. La source fournie identifie l’icône et le séparateur à retirer.
2. L’implémentation supprime le contrôle, ses références JavaScript et ses règles CSS dédiées, puis neutralise la bordure.
3. La première comparaison post-implémentation ne révèle aucun écart P0, P1 ou P2 ; aucune passe corrective supplémentaire n’est nécessaire.

## Vérifications techniques

- `node --check popup.js` : réussi.
- `git diff --check` : réussi.
- Références `headerPickBtn` et `header-pick-btn` : aucune restante.
- Navigation Retour : réussie.
- Prévisualisation locale : réponse HTTP réussie.

historical result: passed

---

# Historical Design QA — Color Inspector saved summary (pre-dedicated view)

This section records the previously accepted inline-expansion state. The new
dedicated `Tout voir` view supersedes that behaviour and is evaluated in the
current section below; the evidence here is retained as historical context.

## Contrat de comparaison

- Source visuelle approuvée :
  `output/imagegen/color-inspector-saved-hex-only-no-check-r5-2026-08-25/color-inspector-saved-hex-only-no-check-340x470.png`.
- SHA-256 source :
  `fb2871cfef81f9f3b64982e528062a3c0ec32bd76dbbc7e7a6e7ab04b19d047f`.
- Viewport : `340 × 470` CSS px, densité normalisée `1×`.
- État : français, thème clair, bibliothèque repliée, `#F96B00`
  sélectionnée.
- Invariant : le grand cercle central, son halo, sa position, son animation et
  son comportement ne font pas partie de la modification.
- Zone comparée : sélecteur HEX/RGB/HSL, valeur active, copie et bibliothèque
  enregistrée sous le cercle.
- Capture native du popup d'action, claire, normalisée :
  `qa/color-inspector-saved-library-2026-08-25/screenshots/native-toolbar-popup-light-normalized-340x470.png`.
- Capture native du popup d'action, sombre, normalisée :
  `qa/color-inspector-saved-library-2026-08-25/screenshots/native-toolbar-popup-dark-normalized-340x470.png`.
- Comparaison normalisée finale, cible à gauche et popup natif à droite :
  `qa/color-inspector-saved-library-2026-08-25/screenshots/comparison-final-source-left-native-right-680x470.png`.
- Comparaison focalisée clavier :
  `qa/color-inspector-saved-library-2026-08-25/screenshots/native-unpacked-focus-hsl-light-340x470.png`.

## Findings finaux

- Aucun écart P0, P1 ou P2 ne reste dans la zone approuvée sous le cercle.
- La hiérarchie correspond à la cible : un sélecteur compact, puis la
  bibliothèque enregistrée dominante en deux colonnes.
- La sélection orange utilise uniquement un contour ; aucun check ni nom de
  couleur généré n'est présent.
- L'état replié montre cinq couleurs. L'état déplié montre dix couleurs,
  remplace « Tout voir » par « Réduire » et conserve une largeur de document de
  `340 px` sans débordement horizontal.
- L'état vide garde « Nouvelle couleur » accessible.
- Les thèmes clair et sombre de la zone inférieure sont lisibles. Observation
  hors périmètre : le contraste de l'ancien titre/flèche du thème sombre,
  au-dessus du cercle, reste inférieur à celui de la nouvelle zone. Il n'a pas
  été modifié afin de respecter la limite explicite de cette intervention.

## Surfaces de fidélité

- Typographie : libellés HEX/RGB/HSL, valeur active et codes enregistrés doivent
  rester lisibles à la taille native et au zoom 200 %.
- Espacement : le nouveau contenu ne déplace pas le cercle verrouillé ; la zone
  inférieure respecte le rythme vertical de la cible à `340 × 470`.
- Couleurs : fonds, séparateurs, sélection et contrastes doivent être vérifiés
  en clair, sombre, système et forced-colors.
- Contenu : aucun nom de couleur généré et aucun badge check ; uniquement les
  valeurs HEX en gras dans la bibliothèque.
- Interaction : tablist clavier, copie du format actif, sélection, Tout voir /
  Réduire et Nouvelle couleur doivent rester accessibles et persistants.

## Vérifications techniques réalisées

- Brave `151.1.93.136` a chargé le dossier comme extension décompressée sous
  l'identifiant local `jdnmmamijbiceddnlfhgpempfodcgoll`.
- `chrome.action.openPopup()` a créé le vrai popup d'action, sans fenêtre
  indépendante, à `340 × 470` CSS px et DPR `2`.
- `manifest.json` ouvre `popup.html`; `popup-v2.*` reste présent mais inactif.
- Permission unique `storage`, zéro host permission, aucun content script ou
  service worker.
- HEX `#F96B00`, RGB `249, 107, 0` et HSL `26°, 100%, 49%` sont exacts.
- Un clic de confiance sur Copier affiche l'unique confirmation « Copié ! ».
- La navigation clavier RGB → HSL déplace la sélection, le focus et le
  `tabindex` itinérant correctement.
- « Tout voir » / « Réduire », la sélection d'une couleur, l'état vide et
  l'ajout manuel ont été testés. `#123456` a été écrit dans
  `chrome.storage.local.colorHistory` puis restauré après rechargement.
- Aucun avertissement, exception, échec réseau ou violation CSP n'a été relevé.
  Les seules URL chargées appartiennent à l'origine locale de l'extension.
- `node --check popup.js`, `npm run check` et `git diff --check` réussissent ;
  la suite compte `21/21` tests réussis.

## Historique d'itération

1. La cible R5 sans nom de couleur ni check a été approuvée à `340 × 470`.
2. Le cercle central et son halo ont été verrouillés comme invariants.
3. R1 à R4 ont affiné exclusivement la zone inférieure : sélecteur compact,
   alignement de la valeur, tailles des nuanciers et grille deux colonnes.
4. La capture synthétique a été remplacée comme preuve finale par le popup
   d'action réel, capturé à DPR `2` puis normalisé à `1×` pour la comparaison.
5. La preuve finale confirme la fidélité de la zone inférieure sans modifier le
   cercle verrouillé.

## Grille finale — périmètre sous le cercle

| Critère | Note |
|---|---:|
| Fidélité à la cible approuvée | 9.5/10 |
| Hiérarchie et densité | 9.5/10 |
| Typographie et lisibilité | 9/10 |
| Couleur et contraste de la zone modifiée | 9/10 |
| Interactions et persistance | 9.5/10 |
| Clavier, focus et sémantique | 8.5/10 |
| États replié, déplié, vide, clair et sombre | 9/10 |
| Intégrité locale, permissions et réseau | 10/10 |
| Reproductibilité des preuves | 9.5/10 |

Score final : `93/100`. Aucun critère du périmètre approuvé n'est inférieur à
`8/10`.

historical result: passed

---

# Design QA — dedicated saved-colours view

## Contract and evidence

- Approved target:
  `output/imagegen/saved-colors-all-view-r1-2026-08-25/saved-colors-all-view-r1-340x470.png`.
- Target SHA-256:
  `948f21333ae9a7e7ed9659742462bbaa1750c96f50d79d5b022717c2d998baed`.
- Native action-popup capture, Light:
  `qa/saved-colors-all-view-2026-08-25/screenshots/native-action-popup-target-light-340x470.png`.
- Native action-popup capture, Dark:
  `qa/saved-colors-all-view-2026-08-25/screenshots/native-action-popup-target-dark-340x470.png`.
- Same-input comparison, target left and native action popup right:
  `qa/saved-colors-all-view-2026-08-25/screenshots/comparison-target-left-native-action-right-690x470.png`.
- Viewport and density: `340 × 470` CSS px, DPR `1`.
- State: French, `Toutes`, `Récentes`, `#F96B00` selected, eight identical
  colour values in target and implementation.
- Native runtime details and interaction evidence:
  `qa/saved-colors-all-view-2026-08-25/NATIVE-QA.md`.

## Findings

- No P0, P1 or P2 visual difference remains.
- The final implementation matches the target's compact header, HEX search,
  segmented `Toutes` / `Favoris` filter, quiet sorting control and two-column
  saved-colour grid.
- Each card keeps the intended hierarchy: colour first, bold uppercase HEX,
  muted RGB. No generated colour name or selection check is present.
- The selected orange swatch uses only a restrained outline.
- The existing Light background token is slightly cooler than the generated
  reference, and the add-colour target is deliberately `36 × 36` rather than
  the reference's smaller visual control so it remains reliably actionable.
  Neither difference changes hierarchy or identity.
- The Dark implementation preserves the requested near-black direction with
  clear separation between controls, swatches, dividers and secondary values.
- The large Color Inspector circle, spectral halo, geometry and animation were
  not edited; this is a separate view.

## Interaction and accessibility

- `Tout voir`, Back and Escape navigate correctly with focus restoration.
- Search ignores HEX case and an optional leading `#`; no-result, empty-history
  and empty-favourites states remain understandable.
- Recent, oldest and HEX sorts do not mutate storage order.
- A saved selection returns to the inspector without duplicating history.
- Favourite actions are exposed on hover, focus or active state without adding
  default visual noise.
- The add action invokes the native colour input. Cancel and confirm event paths
  preserve or persist state as expected.
- Filter tabs support arrow navigation and every colour button exposes its
  pressed state.
- The popup remains `340 × 470`, the grid scrolls vertically, and neither the
  document nor grid produces horizontal overflow in the verified native state.

## Comparison history

1. The approved Imagen target established the dedicated-screen composition and
   fixed eight-colour content at `340 × 470`.
2. The first implementation pass was functionally complete but vertically too
   loose: header, search and filter controls pushed the grid too low.
3. The corrective pass reduced the header and retrieval-control heights,
   aligned the two grid columns and card metadata to the source, and preserved
   minimum action targets.
4. A combined target-left/native-right image was inspected at identical content,
   viewport and density. No further visual correction was required.
5. The same view then passed the real unpacked Brave action-popup matrix in
   Light, Dark, empty, search, favourites, sorting and keyboard states.

## Final score

| Criterion | Score |
|---|---:|
| Fidelity to the approved target | 9.2/10 |
| Hierarchy and density | 9.5/10 |
| Typography and legibility | 9/10 |
| Light/Dark colour and contrast | 9.2/10 |
| Interaction and local persistence | 9.5/10 |
| Keyboard, focus and semantics | 9.2/10 |
| Empty, search, favourite and sorting states | 9.3/10 |
| Permissions, console and network integrity | 10/10 |
| Reproducibility of evidence | 9.5/10 |

Final score: `94/100`. No criterion is below `8/10`.

final result: passed

---

# Design QA — éditeur intégré « Nouvelle couleur »

## Contrat et preuves

- Source approuvée : `qa/new-color-view-2026-08-26/target-imagen.png`.
- Implémentation native :
  `qa/new-color-view-2026-08-26/action-new-color-inline-fr-light.png`.
- Comparaison normalisée, source à gauche et implémentation à droite :
  `qa/new-color-view-2026-08-26/comparison-target-vs-implementation.png`.
- Viewport d’implémentation : `340 × 470 px`, DPR `1`.
- Mesures, états et interactions :
  `qa/new-color-view-2026-08-26/NATIVE-QA.md`.

Le périmètre est strict : le grand cercle, son halo, son DOM et sa géométrie ne
doivent pas changer. Seule la zone située en dessous accueille l’éditeur.

## Findings

- Aucun écart P0, P1 ou P2 ne reste dans la zone demandée.
- Le cercle conserve son rectangle natif `x=111`, `y=74`, `118 × 118 px` avant,
  pendant et après le nouveau flux.
- La composition suit la cible : plan SV, teinte, onglets, valeur, CTA, tous
  centrés sur une colonne de `216 px`.
- La hiérarchie est claire à `340 × 470` sans scroll ni débordement ; le CTA est
  entièrement visible.
- Les états clair, sombre, invalide, RGB, couleurs forcées et mouvement réduit
  sont lisibles et cohérents.
- Les huit langues tiennent sans rognage. Les valeurs utilisent Roboto Mono et
  l’interface Roboto Flex.
- Le brouillon ne touche pas au stockage avant validation ; sauvegarde,
  déduplication, annulation, navigation et restitution du focus fonctionnent.
- Aucun picker natif, aucune requête externe et aucune erreur console ne reste.
- Le paquet `1.0.4` extrait reproduit la capture source et réussit la même suite
  fonctionnelle native.

## Historique de comparaison

1. La référence complète a été normalisée à la taille du popup.
2. L’en-tête et le cercle ont été exclus de l’adaptation conformément à
   l’instruction explicite de l’utilisateur.
3. La première implémentation native a fixé la géométrie inférieure exacte.
4. Les états invalide, RGB et sombre ont confirmé que la hauteur reste stable.
5. Le contrôle forced-colors a révélé des gradients supprimés ; la règle a été
   corrigée et la capture finale conserve maintenant les surfaces essentielles.
6. La comparaison finale combinée confirme la fidélité de la zone inférieure
   et l’intégrité de la zone verrouillée.

## Grille finale

| Critère | Note |
|---|---:|
| Respect du cercle verrouillé | 10/10 |
| Fidélité de la zone inférieure | 9.5/10 |
| Hiérarchie et densité | 9.6/10 |
| Typographie et lisibilité | 9.4/10 |
| Thèmes et contrastes | 9.2/10 |
| Clavier, focus et sémantique | 9.3/10 |
| Sauvegarde, annulation et déduplication | 9.8/10 |
| Huit langues et formats de stress | 9.4/10 |
| Sécurité locale et reproductibilité | 9.8/10 |

Score final : `95/100`. Aucun critère n’est inférieur à `8/10`.

final result: passed

---

# Corrective Design QA — selected outline and inspector background

Date: 25 August 2026

## Evidence contract

- User-reported source: capture supplied in the product-design task on
  25 August 2026.
- Source normalized to the native popup viewport:
  `qa/saved-colors-all-view-2026-08-25/screenshots/user-reference-normalized-340x470.png`.
- Corrected real Brave action popup with the same colour order, selected blue
  and focused search:
  `qa/saved-colors-all-view-2026-08-25/screenshots/native-action-popup-user-reference-fix-light-340x470.png`.
- Same-input comparison:
  `qa/saved-colors-all-view-2026-08-25/screenshots/comparison-user-before-left-native-after-right-700x505.png`.
- Theme proofs:
  `qa/saved-colors-all-view-2026-08-25/screenshots/native-action-popup-outline-background-fix-light-340x470.png`
  and
  `qa/saved-colors-all-view-2026-08-25/screenshots/native-action-popup-outline-background-fix-dark-340x470.png`.
- Viewport and density: `340 × 470` CSS px, DPR `1`.
- Browser: real unpacked Brave action popup opened through
  `chrome.action.openPopup()`.

## Findings and correction

- The source defect was a 3 px selection shadow touching the horizontal clip
  edge of the grid. The scrollport now extends 4 px beyond the preserved card
  alignment, so the complete outline remains visible in the first column.
- The dedicated library and its sticky header now use the same `--card-bg`
  surface as the Color Inspector. Computed values match exactly in Light
  (`rgb(255, 255, 255)`) and Dark (`rgb(31, 35, 41)`).
- The selected-state inner separation ring also uses `--card-bg`, so it remains
  continuous with the surrounding surface in both themes.
- No Color Inspector circle, halo, format control, content order or saved-colour
  interaction was changed.
- No P0, P1 or P2 visual difference remains in the requested corrective scope.

## Verification

- Native outline clearance: `4 px`; required: at least `3 px`.
- Document and grid horizontal overflow: none.
- Search, favourites, sorting, selection, Back, Escape, arrow navigation,
  manual colour choice and persistence: passed.
- Console errors or warnings: none.
- Network failures or non-extension requests: none.
- Static suite: `27/27` tests after the corrective assertions.

## Iteration history

1. The user screenshot established the clipped first-column selection and the
   surface mismatch.
2. The clip area was expanded without moving the visible card grid.
3. The library, header and selected-ring separator were aligned to the existing
   inspector surface token.
4. The exact user colour order and selected blue were reproduced in a native
   Brave action popup and compared side by side at normalized density.
5. Light, Dark and the full native interaction matrix passed without further
   correction.

## Corrective score

| Criterion | Score |
|---|---:|
| Fidelity to the requested correction | 10/10 |
| Outline integrity and spacing | 10/10 |
| Inspector/library surface parity | 10/10 |
| Light/Dark consistency | 9.7/10 |
| Interaction and accessibility preservation | 9.5/10 |
| Native evidence and reproducibility | 9.7/10 |

Corrective score: `98/100`. No criterion is below `8/10`.

corrective result: passed

---

# Design QA — RGB dans le résumé compact des couleurs enregistrées

Date : 25 août 2026

## Contrat et preuves

- Spécification approuvée :
  `qa/inline-saved-rgb-2026-08-25/TARGET-SPEC.md`.
- Référence de la grille compacte avant ajout du RGB :
  `qa/inline-saved-rgb-2026-08-25/reference/user-inline-saved-colors-hex-only.png`.
- Référence de la disposition HEX + RGB dans « Tout voir » :
  `qa/inline-saved-rgb-2026-08-25/reference/user-dedicated-card-hex-rgb.png`.
- Capture du vrai popup d’action Brave, thème clair :
  `qa/inline-saved-rgb-2026-08-25/screenshots/native-inspector-light-340x470.png`.
- Capture du vrai popup d’action Brave, thème sombre :
  `qa/inline-saved-rgb-2026-08-25/screenshots/native-inspector-dark-340x470.png`.
- Comparaison de la composition avant / après :
  `qa/inline-saved-rgb-2026-08-25/comparisons/reference-vs-native-summary.png`.
- Comparaison focalisée d’une carte :
  `qa/inline-saved-rgb-2026-08-25/comparisons/reference-card-vs-native-card.png`.
- Viewport comparé : `340 × 470` CSS px, DPR `1`.
- Runtime détaillé :
  `qa/inline-saved-rgb-2026-08-25/NATIVE-QA.md`.

La cible ne remplace pas la composition compacte fournie : elle lui ajoute la
seconde ligne RGB selon la hiérarchie visuelle déjà approuvée dans « Tout voir ».

## Findings

- Aucun écart P0, P1 ou P2 ne reste dans le périmètre demandé.
- Chaque carte affiche maintenant le nuancier, un HEX gras et un RGB gris sur
  deux lignes, sans nom de couleur.
- La grille conserve ses deux colonnes et les cinq couleurs visibles.
- La couleur sélectionnée conserve son contour complet sans check.
- Le cas long `RGB 255, 255, 255` ne déborde pas.
- Le focus clavier est complet et distinct de la sélection.
- Aucun texte, séparateur ou contrôle ne se chevauche dans le popup naturel.
- Le thème sombre conserve une hiérarchie lisible pour les nouvelles valeurs.

Observation P3 hors périmètre : le contraste préexistant de l’en-tête dans le
thème sombre reste faible. Il n’a pas été corrigé parce que l’utilisateur a
explicitement verrouillé toute la zone au-dessus du grand cercle.

## Surfaces de fidélité

- **Zone verrouillée** : en-tête, grand cercle, halo spectral, taille, position,
  animation et contrôle HEX / RGB / HSL inchangés.
- **Hiérarchie** : nuancier dominant, HEX gras, RGB secondaire et atténué.
- **Composition** : grille deux colonnes, cinq couleurs puis « Nouvelle
  couleur », sans déplacement structurel.
- **Sélection** : contour uniquement, intégralement visible, sans check.
- **Typographie** : HEX monospace ; RGB dans la typographie secondaire du
  système, cohérent avec la vue « Tout voir » et lisible à la taille native.
- **Contenu** : conversion exacte du HEX vers le RGB pour chaque carte.
- **Accessibilité** : nom accessible enrichi avec HEX et RGB ; focus clavier
  visible.

## États vérifiés

| État | Preuve | Résultat |
|---|---|---|
| Clair, valeurs de référence | `screenshots/native-inspector-light-340x470.png` | réussi |
| Sombre | `screenshots/native-inspector-dark-340x470.png` | réussi dans le périmètre |
| Focus carte sélectionnée | `screenshots/native-inspector-focus-saved-light-340x470.png` | réussi |
| RGB le plus long | `screenshots/native-inspector-longest-rgb-light-340x470.png` | réussi |

Les quatre captures multi-formats requises sont présentes et réussies : iPhone
12 mini `375 × 812`, iPhone 14 Pro `393 × 852`, iPhone 17 Pro Max `440 × 956`
et iPhone SE (3e génération) `375 × 667`. La surface d’extension reste fixe à
`340 × 470` et ne déborde dans aucun viewport.

## Vérification native

- Vrai popup Brave de l’extension décompressée, moteur
  `Chrome/151.0.7922.137`.
- Identifiant local `jdnmmamijbiceddnlfhgpempfodcgoll`.
- Ouverture par `chrome.action.openPopup()`.
- Console : aucune erreur ni aucun avertissement.
- Réseau : aucun échec ni aucune requête externe.
- Document et métadonnées de cartes : aucun débordement.
- `npm run check` : réussi, `29/29` tests réussis.
- `git diff --check` : réussi.

## Historique de comparaison

1. La première référence a fixé la composition compacte à conserver.
2. La seconde a fixé la hiérarchie exacte à réutiliser : HEX gras, RGB gris en
   dessous.
3. L’implémentation a été capturée dans le vrai popup Brave avec les mêmes
   couleurs et le même ordre.
4. Une comparaison plein résumé puis une comparaison focalisée sur une carte
   ont été inspectées.
5. Les thèmes clair et sombre, le focus, le cas RGB le plus long et les quatre
   viewports de contrôle ont confirmé l’absence de rognage ou de débordement.

## Grille finale — périmètre compact

| Critère | Note |
|---|---:|
| Fidélité aux références combinées | 9.7/10 |
| Hiérarchie nuancier / HEX / RGB | 9.7/10 |
| Densité et grille deux colonnes | 9.5/10 |
| Typographie et lisibilité | 9.3/10 |
| Sélection et focus | 9.5/10 |
| Thèmes clair et sombre dans la zone modifiée | 9.2/10 |
| Valeurs longues et absence de débordement | 10/10 |
| Sémantique accessible | 9.5/10 |
| Reproductibilité des preuves | 9.7/10 |

Score final : `96/100`. Aucun critère du périmètre approuvé n’est inférieur à
`8/10`.

final result: passed

---

# Design QA — fixed Roboto product typography

## Contract and evidence

- Approved decision: one neutral product system, with Roboto Flex for the
  interface and Roboto Mono for HEX, RGB and HSL.
- Target specification: `qa/roboto-only-2026-08-26/TARGET-SPEC.md`.
- Native evidence and measurements:
  `qa/roboto-only-2026-08-26/NATIVE-QA.md`.
- Real source-extension and freshly extracted-package captures: 22 report
  pairs at `340 × 470`, covering all eight locales, Light/Dark, Inspector,
  library, Capture/Home, Settings, migration and library interactions.

## Findings

- No P0, P1 or P2 visual issue remains in the typography scope.
- Removing the former selector makes the header quieter without moving the
  title, circle, format control or saved-colour grid.
- Roboto Flex is neutral and legible across Latin and Cyrillic UI; Japanese and
  Chinese use the declared system-script fallbacks without clipping.
- Roboto Mono gives HEX/RGB/HSL a stable tabular rhythm while keeping the colour
  swatches visually primary.
- The extracted ZIP reproduces the same hierarchy and geometry as the source
  extension. The library outline retains 4 px of visible clearance and its
  background matches the Inspector in both themes.
- No typography chooser, stale target, dynamic font state or new preference is
  visible or keyboard reachable.

## Final score

| Criterion | Score |
|---|---:|
| Neutrality and product fit | 9.7/10 |
| Inspector hierarchy | 9.6/10 |
| HEX/RGB/HSL legibility | 9.6/10 |
| Light/Dark consistency | 9.5/10 |
| Eight-locale robustness | 9.3/10 |
| Layout preservation | 10/10 |
| Keyboard and focus integrity | 9.3/10 |
| Local delivery and reproducibility | 9.8/10 |

Final score: `96/100`. No criterion is below `8/10`.

final result: passed
