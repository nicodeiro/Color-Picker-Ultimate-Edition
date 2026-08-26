# QA native — HEX + RGB dans les couleurs enregistrées compactes

Date : 25 août 2026

## Runtime vérifié

- Produit : vraie extension décompressée chargée dans Brave.
- Moteur rapporté : `Chrome/151.0.7922.137`.
- Identifiant local : `jdnmmamijbiceddnlfhgpempfodcgoll`.
- Entrée active : popup d’action `popup.html` ouverte via
  `chrome.action.openPopup()`.
- Viewport naturel : `340 × 470` CSS px, DPR `1`.
- Périmètre : uniquement les cartes compactes placées sous le grand cercle de
  l’Inspecteur couleur.

## Preuves visuelles natives

- thème clair :
  `screenshots/native-inspector-light-340x470.png` ;
- thème sombre :
  `screenshots/native-inspector-dark-340x470.png` ;
- focus clavier sur la couleur sélectionnée :
  `screenshots/native-inspector-focus-saved-light-340x470.png` ;
- valeurs RGB longues :
  `screenshots/native-inspector-longest-rgb-light-340x470.png`.

Comparaisons inspectées :

- composition compacte avant / popup Brave après :
  `comparisons/reference-vs-native-summary.png` ;
- carte « Tout voir » de référence / carte compacte réelle :
  `comparisons/reference-card-vs-native-card.png`.

## Résultats visuels

- Les cinq cartes compactes affichent un HEX gras puis un RGB gris sur la ligne
  suivante, comme dans « Tout voir ».
- La grille reste sur deux colonnes et l'action « Nouvelle couleur » conserve sa
  place avec son bouton « + » distinct.
- `#F96B00` reste sélectionnée par un contour uniquement ; aucun check n’est
  présent.
- Le focus clavier est distinct du contour de sélection et reste entièrement
  visible autour de la carte.
- Le cas long `#FFFFFF` / `RGB 255, 255, 255` tient sans rognage.
- Aucune métadonnée ne dépasse sa carte et aucun chevauchement n’est visible.
- Le grand cercle, son halo, l’en-tête et le contrôle HEX / RGB / HSL ont gardé
  leur géométrie.
- En thème sombre, les nouveaux HEX et RGB restent lisibles sur la surface de
  l’Inspecteur.

Observation hors périmètre : le faible contraste préexistant du titre et de la
flèche Retour dans le thème sombre reste visible au-dessus du cercle. Cette
intervention n’y touche pas, conformément au périmètre verrouillé.

## Valeurs de référence vérifiées

| HEX | RGB affiché | Résultat |
|---|---|---|
| `#F06800` | `RGB 240, 104, 0` | réussi |
| `#0F7BFF` | `RGB 15, 123, 255` | réussi |
| `#F96B00` | `RGB 249, 107, 0` | réussi |
| `#2F853D` | `RGB 47, 133, 61` | réussi |
| `#08274D` | `RGB 8, 39, 77` | réussi |
| `#FFFFFF` | `RGB 255, 255, 255` | réussi, cas long |

Les noms accessibles des cartes exposent également le HEX et le RGB.

## Contrôle multi-formats

Ces captures contrôlent le rendu fixe du popup dans quatre viewports plus
hauts. Il ne s’agit pas d’une application iPhone : la surface de l’extension
reste volontairement `340 × 470` dans chacun de ces viewports.

| Format | Viewport | Preuve | Résultat |
|---|---:|---|---|
| iPhone 12 mini | `375 × 812` | `formats/iphone-12-mini-inspector.png` | réussi |
| iPhone 14 Pro | `393 × 852` | `formats/iphone-14-pro-inspector.png` | réussi |
| iPhone 17 Pro Max | `440 × 956` | `formats/iphone-17-pro-max-inspector.png` | réussi |
| iPhone SE (3e génération) | `375 × 667` | `formats/iphone-se-3-inspector.png` | réussi |

Dans les quatre captures, le popup conserve la même composition, les deux
lignes par couleur et l’intégralité de la grille, sans débordement ni rognage.

## Focus, console et réseau

- Focus clavier visible sur une carte compacte : réussi.
- Contour de sélection complet, sans check : réussi.
- Débordement horizontal du document : aucun.
- Débordement des métadonnées de carte : aucun.
- Erreurs ou avertissements console : aucun.
- Échecs réseau : aucun.
- Requêtes externes : aucune ; seules les ressources locales de l’extension ont
  été observées.

## Vérifications automatisées

- `npm run check` : réussi.
- Validation active de l’Inspecteur : réussie.
- Validation de la tranche V2 inactive : réussie.
- Tests Node : `29/29` réussis, dont le contrat compact HEX + RGB.
- `git diff --check` : réussi.

## Empreintes de l’état vérifié

| Fichier | SHA-256 |
|---|---|
| `popup.js` | `20f79c760b92c6049da17d536c770752e0cf1c9bfe9a01572ae9848abd035bef` |
| `styles.css` | `11d7d87e60a1c39ff493f9fd111785a0870918a92170b2ae0abec804bc770ae8` |
| `tests/inspector-saved-library.test.mjs` | `95dc34eacfb86dc7440405118d75582f5d3f3eef441841c4bcb458667752c107` |
| `scripts/validate-inspector.mjs` | `f57a9c44bfe8a7d012032811a8a5c1775ada34e6c1933fb465e90792542d0210` |
| `scripts/capture-brave-qa.mjs` | `8c7331e20b46afb1b63e4741ec7c0a2184070161ba9081e62d089ab7a7106690` |

## Limite de cette preuve

Cette passe prouve la modification visuelle et sémantique du résumé compact
dans l’extension locale réelle. Elle ne prouve pas un ZIP de publication, un
envoi pour examen ou l’état public du Chrome Web Store.

final result: passed
