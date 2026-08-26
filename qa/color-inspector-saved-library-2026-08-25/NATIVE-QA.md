# Native QA — Color Inspector saved library

Date: 25 August 2026

## Runtime under test

- Browser: Brave `151.1.93.136` (Chromium `151.0.7922.137`).
- Profile: isolated temporary QA profile.
- Load mode: unpacked extension from the repository root.
- Local unpacked extension ID: `jdnmmamijbiceddnlfhgpempfodcgoll`.
- Manifest: MV3, version `1.0.1`, action popup `popup.html`.
- Permission evidence: `storage` only; zero explicit or scriptable hosts.
- Popup evidence: `chrome.action.openPopup()` succeeded after activating the
  isolated browser window and created a popup target without an independent
  browser window. This is the action popup, not a localhost HTML page.
- Popup viewport: `340 × 470` CSS px at device pixel ratio `2`.
- Native raw capture: `680 × 940` physical px; normalized comparison capture:
  `340 × 470`.

Source hashes:

| File | SHA-256 |
|---|---|
| `manifest.json` | `89450b6e6af9bdf686d8c94affb310812645e3a45540e2ae13003ae7830e295a` |
| `popup.html` | `0d4817b634553542aa3c4ecc61f840954ac8c1f877ec5a2f9f5eb08b9a0ac5c5` |
| `popup.js` | `ba8acd8623857be7bc77ab0c806c432fb3a01a8e1b4a9030892f3db325ba065e` |
| `styles.css` | `a500a7a9d6b3cb3bf357c3d7205f71ed83f2f01088b98596b67cbddd7fe82054` |

## Interaction results

| Check | Result |
|---|---|
| Native action popup opens `popup.html` | Passed |
| Large central circle remains above the modified boundary | Passed |
| Collapsed library shows five saved colours | Passed |
| `#F96B00` uses an outline only, with no check badge | Passed |
| HEX | `#F96B00` |
| RGB | `249, 107, 0` |
| HSL | `26°, 100%, 49%` |
| Arrow-key tab navigation | RGB → HSL, focus and roving tabindex passed |
| Copy | Trusted click produced the single `Copié !` confirmation |
| `Tout voir` | Became `Réduire`, exposed ten colour cards, no horizontal overflow |
| Select saved colour | Updated the current format and selected outline |
| Manual save path | `#123456` became the first local history item and survived reload |
| Empty history | `Aucune couleur pour le moment`, add action remains available |
| Light and dark lower-area states | Passed |
| Console/runtime | No exception, warning or CSP error in the tested flow |
| Network | Only `popup.html`, `styles.css`, `popup.js` and the local ring asset loaded |

The manual save persistence test dispatched the same `change` event emitted by
the browser colour input after selection. It did not automate macOS's system
colour panel. The production action remains an explicit native
`input[type=color]` picker invocation.

## Captures

- Approved target:
  `output/imagegen/color-inspector-saved-hex-only-no-check-r5-2026-08-25/color-inspector-saved-hex-only-no-check-340x470.png`
- Native toolbar popup, light, raw 2×:
  `screenshots/native-toolbar-popup-light-340x470.png`
- Native toolbar popup, light, normalized 1×:
  `screenshots/native-toolbar-popup-light-normalized-340x470.png`
- Native toolbar popup, dark, normalized 1×:
  `screenshots/native-toolbar-popup-dark-normalized-340x470.png`
- Empty state:
  `screenshots/native-unpacked-empty-light-340x470.png`
- Expanded state:
  `screenshots/native-unpacked-expanded-light-340x470.png`
- Keyboard focus:
  `screenshots/native-unpacked-focus-hsl-light-340x470.png`
- Final source-left/native-right comparison:
  `screenshots/comparison-final-source-left-native-right-680x470.png`

## Scope observation

The redesigned region below the circle remains legible in both themes. The
legacy dark-theme header above the locked redesign boundary has lower contrast
than the new lower area. It was not changed because the user's explicit scope
was limited to the content below the large circle.
