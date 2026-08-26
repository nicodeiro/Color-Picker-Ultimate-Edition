# QA native — typographie Geist

Date : 26 août 2026 (Europe/Paris)

## Cible validée

- Geist Sans pour l'interface.
- Geist Mono pour les valeurs HEX, RGB et HSL.
- Hiérarchie plus légère et plus compacte, sans modifier le grand cercle central.
- Même système typographique dans l'Inspecteur, les couleurs enregistrées, l'accueil et les réglages.

## Environnement réel

- Extension non empaquetée chargée dans Brave, puis popup ouverte avec `chrome.action.openPopup()`.
- ID de l'extension de QA : `jdnmmamijbiceddnlfhgpempfodcgoll`.
- Moteur : `Chrome/151.0.7922.137`.
- Version du manifeste : `1.0.1`.
- Police servie uniquement depuis `chrome-extension://…/assets/fonts/geist/`.
- CSP vérifiée : `script-src 'self'; font-src 'self'; object-src 'none'`.
- Aucune erreur de console et aucun échec réseau dans les captures finales.

## Résultats mesurés

- Titre de l'Inspecteur : Geist Sans, 16 px, graisse 650.
- Valeur HEX active : Geist Mono, 11 px, graisse 620.
- Codes HEX enregistrés : Geist Mono, 10 px, graisse 620.
- Valeurs RGB enregistrées : Geist Mono, 8,5 px, graisse 500.
- Les chiffres utilisent les variantes tabulaires.
- La valeur longue `RGB 255, 255, 255` tient dans sa carte sans troncature.
- Le contour de la couleur sélectionnée conserve 4 px de dégagement dans la vue « Tout voir ».
- Le fond de « Tout voir » correspond au fond de l'Inspecteur.
- Le titre et le bouton retour restent lisibles dans le thème sombre.
- La géométrie et le rendu du grand cercle central n'ont pas été modifiés.

## Captures natives vérifiées

Toutes les captures sont dans `screenshots/` :

- Inspecteur : clair, sombre, valeur RGB longue et focus sur une couleur enregistrée.
- Bibliothèque « Tout voir » : clair, sombre et focus dans la recherche.
- Accueil : clair et sombre.
- Réglages : clair et sombre.
- Locales : français, anglais, japonais, chinois et russe.

La localisation chinoise utilise bien la clé runtime `zh`; les titres et actions sont affichés en chinois sans débordement.

## Formats vérifiés

Les rendus synthétiques sont dans `formats/` :

| Format | Dimensions | Débordement | Police | Valeur RGB longue |
| --- | ---: | --- | --- | --- |
| iPhone 12 mini | 375 × 812 | Aucun | Geist chargée | Tient |
| iPhone 14 Pro | 393 × 852 | Aucun | Geist chargée | Tient |
| iPhone 17 Pro Max | 440 × 956 | Aucun | Geist chargée | Tient |
| iPhone SE (3e génération) | 375 × 667 | Aucun | Geist chargée | Tient |

Ces formats servent à contrôler la robustesse de la mise en page ; la preuve principale reste le popup natif 340 × 470 ouvert depuis l'action de l'extension.

## Évaluation visuelle

| Critère | Note |
| --- | ---: |
| Hiérarchie typographique | 9,5/10 |
| Lisibilité | 9,5/10 |
| Cohérence entre écrans | 9,5/10 |
| Thèmes et contrastes | 9/10 |
| Fidélité à la cible approuvée | 9,5/10 |
| Focus et interaction | 9/10 |
| Localisation | 9/10 |
| Sécurité et provenance des polices | 10/10 |

Score final : **94/100**, sans critère inférieur à 9/10.

## Limites de cette passe

- Aucun ZIP de diffusion n'a été reconstruit depuis cet état Git déjà modifié.
- Aucun envoi au Chrome Web Store, commit ou push n'a été effectué.
