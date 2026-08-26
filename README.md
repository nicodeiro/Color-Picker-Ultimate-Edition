# 🎨 Color Picker Ultimate Edition

Color Picker Ultimate Edition samples a colour through Chrome's native
EyeDropper, converts it locally to HEX, RGB and HSL, and keeps a compact local
library of colours. The active local runtime is `popup.html`.

The approved Color Inspector redesign keeps the large central colour circle,
its spectral halo and its behaviour unchanged. The redesign begins below that
circle: it adds a compact HEX/RGB/HSL selector with one copy action and gives
saved colours the primary visual hierarchy.

The active popup now uses one fixed typography system: Roboto Flex for titles,
controls and supporting interface text, and Roboto Mono for HEX, RGB and HSL
values. Both variable families are bundled locally through Fontsource under the
OFL; no font is downloaded at runtime. Unsupported Japanese and Chinese glyphs
fall back to the operating-system script stack. There is no typography selector
and no user-facing font preference.

## Publication Chrome Web Store

La version `1.0.1` est publiée publiquement par Bitek sur le
[Chrome Web Store](https://chromewebstore.google.com/detail/color-picker-ultimate-edi/alpmipfaedbgikinkjndmfagbeknaeaf),
sous l'identifiant `alpmipfaedbgikinkjndmfagbeknaeaf`. Ce statut a été vérifié
le 25 août 2026.

Le Color Inspector retravaillé dans ce dépôt reste local : il n'a pas été
soumis à l'examen et n'est pas, par cette modification locale, devenu la version
distribuée. Le manifeste local est désormais en `1.0.4` afin de distinguer ce
candidat de mise à jour de la version publique `1.0.1`. Ce numéro local ne
constitue pas une preuve de mise à jour de la fiche publique. Une soumission,
une approbation et une mise en ligne Chrome Web Store doivent toujours être
vérifiées séparément.

Les fichiers `popup-v2.*` sont conservés comme expérimentation inactive. Ils ne
sont plus la cible déclarée par `manifest.json` et ne doivent pas être confondus
avec le Color Inspector actif.

## ✨ Features

- **🎯 Chrome EyeDropper**: Pick a color from the screen after an explicit gesture.
- **🔄 Format Conversion**: Automatically converts between HEX, RGB, and HSL.
- **📋 Honest Copy Feedback**: Success appears only after the clipboard write resolves.
- **📚 Saved Colour Library**: Shows five colours in the inspector summary;
  **Show all / Tout voir** opens a dedicated, scrollable library for the complete
  local collection of up to ten colours.
- **🔎 Library Retrieval Tools**: Searches by HEX, filters all colours or
  favourites, and sorts by recent, oldest or HEX without changing stored order.
- **➕ Integrated Colour Creation**: Opens a local saturation/value editor with
  a hue control and synchronized HEX, RGB and HSL fields, then saves the chosen
  value to the same local library.
- **✅ Quiet Selection State**: The selected saved colour uses a clipping-safe
  outline only, without a check badge or generated colour name. The dedicated
  library shares the Color Inspector surface in Light and Dark.
- **🌓 Neutral Theming**: System, Light, or Dark; sampled color remains evidence only.
- **🔤 Fixed Product Typography**: Roboto Flex for interface hierarchy and
  Roboto Mono for colour data, with both families bundled locally under the OFL.
- **🌍 Multi-Language Support**: English (Default), Français, Español, Deutsch, Português, 简体中文, 日本語, Русский.
- **🔒 Minimal Access**: MV3 with the `storage` permission only and zero host permissions.

## 🚀 Installation

1. Clone this repository:
   ```bash
   git clone git@github.com:nicodeiro/Color-Picker-Ultimate-Edition.git
   ```
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer Mode** (toggle in top-right).
4. Click **Load unpacked**.
5. Select the extension directory.

## 🛠 Usage

1. Click the extension icon in your toolbar.
2. Click the **eyedropper** button to activate color picking mode.
3. Click a point on screen in Chrome’s native EyeDropper.
4. Reopen the popup after the native selection if Chrome closes it.
5. Select HEX, RGB or HSL in the compact control and use its single Copy action.
6. Select a saved colour from the five-colour summary, open the dedicated
   library with **Tout voir**, or choose **Nouvelle couleur** to create one in
   the integrated editor. Adjust saturation/value and hue, or enter HEX, RGB or
   HSL, then confirm with **Enregistrer la couleur**.
7. In the dedicated library, search by HEX, switch between **Toutes** and
   **Favoris**, or sort by **Récentes**, **Anciennes** or **Code HEX**. Selecting a
   colour returns to the inspector and updates the locked central circle without
   duplicating the history entry; Back or Escape returns without changing it.
8. Open Settings to change the language or select System, Light or Dark. The
   product typography is fixed and does not add a font preference to storage.

The integrated editor keeps its draft in memory until confirmation. Back or
Escape cancels without writing to storage and restores the previously selected
colour.

Native unpacked-extension QA remains the authority for EyeDropper persistence,
clipboard behaviour, storage and visual acceptance.

## 📁 Project structure

- `docs/`: design briefs and project documentation.
- `assets/fonts/interface/`: local Roboto Flex and Roboto Mono files, OFL
  licences and reproducible Fontsource checksums.
- `fonts.css`: local two-family font-face bundle.
- `popup.html`, `popup.js`, `styles.css`: active Color Inspector runtime.
- `popup-v2.*`: retained inactive experiment; not referenced by the manifest.
- `dist/`: locally generated, allowlisted QA packages. They prove neither Store
  submission nor public availability and must still pass release validation.
- `output/`: generated images and browser captures.
- `qa/`: visual verification artifacts.
- `store-assets/`: Store material; it is separate from runtime acceptance.
- `store-listing/`: localized Store copy; it must be revalidated against the
  release candidate before any future submission.

Run project scripts from this directory so generated files remain scoped to
Color Picker Ultimate Edition.

## 🎨 Personalization

Go to **Settings** in the popup to change the language or select System,
Light, or Dark. Roboto Flex and Roboto Mono are fixed product typography and do
not create a user preference. When settings are next normalized, the runtime
removes any legacy `interfaceFont` field left by an earlier local candidate.

## ✅ Validation

```bash
npm run check
npm run package:extension
```

`npm run package:extension` creates a deterministic runtime-only ZIP and its
SHA-256 sidecar. The builder excludes Git data, QA captures, tests, scripts,
Store media and macOS metadata, and requires the complete local font notice set.

The approved inspector target and dedicated saved-library target are recorded
in `qa/color-inspector-saved-library-2026-08-25/TARGET-SPEC.md` and
`qa/saved-colors-all-view-2026-08-25/TARGET-SPEC.md`. The approved typography
baseline is recorded in `qa/roboto-only-2026-08-26/TARGET-SPEC.md`. The former
Geist baseline under `qa/typography-geist-2026-08-26/` and the former
twenty-font selector evidence under `qa/interface-font-selector-2026-08-26/`
are retained as historical records only; neither describes the active product.
Generated references and localhost fixtures are design evidence, not native
extension proof; see `docs/TESTING.md` for the unpacked-extension matrix. No
result in this repository, by itself, proves Chrome Web Store submission or
publication.

---
*Created with ❤️ by [Bitek](https://bitek.fr)*
