# QA native — libellé « Nouvelle couleur »

Date : 26 août 2026 (Europe/Paris)

## Modification

- Le bouton carré conserve son symbole « + ».
- Le libellé adjacent affiche uniquement « Nouvelle couleur ».
- Le nom accessible du contrôle reste « Nouvelle couleur ».

## Preuves

- Extension non empaquetée 1.0.1 rechargée dans Brave.
- ID local : `jdnmmamijbiceddnlfhgpempfodcgoll`.
- Popup réel ouvert depuis l'action de l'extension et inspecté en clair et sombre.
- Captures natives : `native-inspector-light-340x470.png` et
  `native-inspector-dark-340x470.png`.
- Captures de robustesse : iPhone 12 mini, iPhone 14 Pro, iPhone 17 Pro Max et
  iPhone SE (3e génération).
- Aucun débordement horizontal ou vertical dans les rapports JSON.
- Geist Sans et Geist Mono chargées dans chaque capture.
- Aucune erreur de console et aucun échec réseau dans la lane isolée.
- `npm run check` : 35 tests sur 35 réussis.

## Observation Brave

La session Brave principale conservait deux avertissements préexistants de
focus lors du masquage de vues avec `aria-hidden`. Ils ne proviennent pas de ce
changement de libellé et ne se reproduisent pas dans les captures isolées de
cette passe.

## État de livraison

- Aucun ZIP Store reconstruit.
- Aucun envoi au Chrome Web Store.
- Aucun commit ni push.
