# QA native Brave — sélecteur de format

## Environnement

- Navigateur : Brave, moteur `Chrome/151.0.7922.137`.
- Extension non empaquetée : racine de ce dépôt.
- ID local déterministe : `jdnmmamijbiceddnlfhgpempfodcgoll`.
- Surface : vraie action popup ouverte par `chrome.action.openPopup()`.
- Viewport : `340 × 470`, DPR `1`.
- Source active : `popup.html` + `styles.css` + `popup.js`.

## Mesures calculées

- Cadre : `x 22`, `y 219`, `291 × 44`, rayon `7 px`.
- Bordure : `1 px solid rgba(60, 60, 67, 0.28)` en clair.
- Ombre : `none`.
- Sélecteur : `x 29`, `y 226`, `144 × 30`, rayon `5 px`.
- Onglet actif : `47.328 × 28`, fonte `10 px / 650`.
- Valeur : cellule `91 px`, SF Mono `11 px / 720`, sans débordement.
- Copier : `x 276`, `y 226`, `30 × 30`, bordure `0`, ombre `none`.

## Résultats

- Ouverture de la vraie action popup : réussie en clair et sombre.
- Service worker : absent, conforme au manifeste actif.
- Console : `0` erreur et `0` avertissement.
- Réseau : uniquement les fichiers locaux de l’extension ; `0` échec.
- Document : `scrollWidth 340`, `scrollHeight 470`.
- RGB et HSL : valeurs complètes, `clientWidth === scrollWidth`.
- Focus Copier : `outline 2 px solid rgb(10, 100, 255)`, offset `2 px`.
- Tests : `28/28` réussis.
- Validation MV3/CSP/permissions : réussie.

## Preuves

- `screenshots/final-native-light-340x470.png`
- `screenshots/final-native-dark-340x470.png`
- `screenshots/final-native-rgb-light-340x470.png`
- `screenshots/final-native-hsl-light-340x470.png`
- `screenshots/final-native-focus-copy-light-340x470.png`

Le contrôle sombre est vérifié dans le périmètre de cette modification. Le
contraste préexistant du titre sombre n’a pas été modifié, conformément à la
consigne de ne toucher qu’à la zone sous le grand cercle.
