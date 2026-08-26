# Native QA — dedicated saved-colours view

Date: 25 August 2026

## Runtime under test

- Browser application: Brave `151.1.93.136`.
- Chromium engine: `151.0.7922.137`, DevTools protocol `1.3`.
- Profile: isolated temporary Brave QA profile, removed after each run.
- Load mode: unpacked extension from the repository root.
- Local unpacked extension ID: `jdnmmamijbiceddnlfhgpempfodcgoll`.
- Manifest: MV3, version `1.0.1`, action popup `popup.html`.
- Permissions: `storage` only; zero host permissions.
- Service worker: none declared by the active manifest, so none is expected.
- Action-popup proof: `chrome.action.openPopup()` resolved successfully and
  created a new popup target at
  `chrome-extension://jdnmmamijbiceddnlfhgpempfodcgoll/popup.html` without an
  independent browser window.
- Natural popup viewport: `340 × 470` CSS px, DPR `1`, document width and
  height `340 × 470`, with no document-level overflow.
- Git base commit: `d9ec3e93d9cecb1393dd6f62abb4cd6190aca40d`.
  The QA was run against a dirty working tree; the hashes below identify the
  exact tested files.

## Source hashes

| File | SHA-256 |
|---|---|
| `manifest.json` | `89450b6e6af9bdf686d8c94affb310812645e3a45540e2ae13003ae7830e295a` |
| `popup.html` | `acb2e9b6c30e11ac4c86fb239a9e385306e8628ef6f19fb5a5f9a23cd21a59c3` |
| `popup.js` | `0f8aa36db3ede51242ef0fe0473f8a68b982aeeea1ed7aa2d0f29d690896c7bb` |
| `styles.css` | `949c53e1cd87d29ba4187db544ac2e2c9b1187c31b3697a9372d761e454ee342` |
| `vendor/lucide-icons.js` | `f3ad31819fda389909eac6288be950f5a2f5310de515c31c1e76e1d03336fd18` |
| `scripts/capture-brave-qa.mjs` | `fb00de1a79bdbe3f6dbe29698ce8e6c5847cf0ac17bb15906043993d4784c20a` |

Approved target:

- `output/imagegen/saved-colors-all-view-r1-2026-08-25/saved-colors-all-view-r1-340x470.png`
- SHA-256:
  `948f21333ae9a7e7ed9659742462bbaa1750c96f50d79d5b022717c2d998baed`

## Runtime interaction results

| Check | Result |
|---|---|
| Native action popup opens the active `popup.html` | Passed |
| Popup exposes `chrome.storage.local` | Passed |
| Manifest is MV3 with `storage` only | Passed |
| `Tout voir` opens the dedicated view | Passed |
| Search receives focus on entry | Passed |
| Search accepts `f9`, `F9` and `#f9` | Passed |
| Search no-result state | Passed |
| Empty favourites state | Passed |
| Favourite star adds/removes an item | Passed |
| `Récentes`, `Anciennes` and `Code HEX` | Passed |
| Sort works on a view copy, not persisted order | Passed |
| Saved selection returns to the inspector | Passed |
| Saved selection does not duplicate/reorder history | Passed |
| Selected swatch uses an outline with no check | Passed |
| Back restores focus to `Tout voir` | Passed |
| Escape restores focus to `Tout voir` | Passed |
| Filter arrow-key navigation and roving focus | Passed |
| `+` invokes the native colour input through `showPicker()` | Passed |
| Cancelling without a `change` event leaves state unchanged | Passed |
| A native-equivalent `change` persists one normalized `#123456` | Passed |
| Card buttons expose `aria-pressed` | Passed |
| Grid scrolls vertically with no horizontal overflow | Passed |

The macOS colour panel itself was not mouse-automated. The trusted action-popup
gesture invoked the real input's `showPicker()` method; cancellation was
validated by the absence of a `change` event, and confirmation by the same
`change` event emitted after a native selection. This preserves a precise
boundary between verified popup behaviour and OS-panel automation.

## Console, CSP and network

- Runtime exceptions: none.
- Console errors or warnings: none.
- Network loading failures: none.
- Requests observed after reloading the native action popup were restricted to
  the extension origin and these local files: `popup.html`, `styles.css`,
  `popup.js`, `vendor/lucide-icons.js` and the two existing intelligence-ring
  assets.
- No telemetry, host request, colour-data transmission or CSP violation was
  observed.

## Visual evidence

- Light native action popup, same content as target:
  `screenshots/native-action-popup-target-light-340x470.png`
- Dark native action popup, same content hierarchy:
  `screenshots/native-action-popup-target-dark-340x470.png`
- Target-left/native-action-right comparison:
  `screenshots/comparison-target-left-native-action-right-690x470.png`
- Native action-popup runtime after the interaction matrix:
  `screenshots/native-action-popup-library-runtime-final.png`
- Empty Light state:
  `screenshots/preview-empty-light-340x470.png`
- Empty Dark state:
  `screenshots/preview-empty-dark-340x470.png`

The normalized target and native capture both use `340 × 470` at DPR `1` and
the same eight colour values. The comparison was inspected as one combined
image after the final spacing correction.

## Result and boundary

The dedicated saved-colours view passes its current visual, interaction,
accessibility, storage, permission, console and network gate. The large central
Color Inspector circle was not changed by this work and remains outside the
dedicated view.

This pass does not prove Chrome Web Store submission, review approval,
publication, release packaging or the unrelated EyeDropper flow. Those remain
separate release gates.

final result: passed

---

## Corrective native pass — outline clearance and surface parity

The user-reported state was reproduced in the real Brave action popup with
`#0F7BFF` selected in the first column and the HEX search focused.

- User reference, normalized to the native CSS viewport:
  `screenshots/user-reference-normalized-340x470.png`.
- Corrected native popup with the same colours, order, selection and focus:
  `screenshots/native-action-popup-user-reference-fix-light-340x470.png`.
- Same-input comparison, user reference left and corrected popup right:
  `screenshots/comparison-user-before-left-native-after-right-700x505.png`.
- Corrected Light proof:
  `screenshots/native-action-popup-outline-background-fix-light-340x470.png`.
- Corrected Dark proof:
  `screenshots/native-action-popup-outline-background-fix-dark-340x470.png`.
- Corrective interaction-matrix capture:
  `screenshots/native-action-popup-outline-background-fix-runtime-final.png`.

Measured native invariants:

| Check | Light | Dark |
|---|---:|---:|
| Selected swatch clearance before the grid clip edge | `4 px` | `4 px` |
| Required clearance for the 3 px outer outline | `>= 3 px` | `>= 3 px` |
| Inspector background | `rgb(255, 255, 255)` | `rgb(31, 35, 41)` |
| Library background | `rgb(255, 255, 255)` | `rgb(31, 35, 41)` |
| Sticky header background | `rgb(255, 255, 255)` | `rgb(31, 35, 41)` |

The complete native library matrix passed again: search, empty results,
favourites, sorts, selection, focus restoration, keyboard navigation, native
colour input, local persistence, vertical scrolling and pressed semantics.
Document width remained `340 px`; console errors, network failures and external
requests remained empty.

Corrective source hashes:

| File | SHA-256 |
|---|---|
| `styles.css` | `fa2abbaa0d9ff9c7fc78b88188e6876d2d0c2d3ecd2844ff1e18032e10e4b629` |
| `scripts/capture-brave-qa.mjs` | `0f47fdc8730fd5d6bf505c2a521ec286097bb150f63996478b5eb0143725fb48` |
| `tests/inspector-saved-library.test.mjs` | `f72b783e2415d1ed19127cbdb118d4f6c16bc2c6e8d00462560fc9f9627ca73c` |
| `scripts/validate-inspector.mjs` | `fc98d90dda19f7ee6a62d48341e44a0bb0ac62663110ab05ce0b31b4b7146a2d` |

corrective result: passed
