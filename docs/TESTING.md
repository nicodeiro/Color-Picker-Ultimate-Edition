# Testing — Color Picker Ultimate Edition

## Reproducible static checks

Run from the product root:

~~~bash
npm run check
git diff --check
~~~

npm run check must verify the active local product boundary:

- valid MV3 manifest;
- permission set exactly [storage];
- zero host permissions, content scripts and service worker;
- `popup.html` as the active action popup;
- self-only script and font CSP with object-src none;
- fixed Roboto Flex display/UI typography and fixed Roboto Mono typography for
  HEX, RGB and HSL values with tabular numerals;
- exactly two local Fontsource packages, complete OFL licences, pinned
  provenance, SHA-256 checksums and no runtime font request;
- no typography selector, preset allowlist or dynamic font switching in the
  active HTML, CSS or JavaScript;
- normalization of a legacy settings object removes `interfaceFont`, rewrites
  the supported settings once and never persists a replacement font choice;
- the Inspector header keeps its 50 px height and original title coordinates,
  with no invisible selector target or residual right-side title padding;
- the approved inspector controls: HEX/RGB/HSL tabs, one Copy action, the
  five-colour saved summary with bold HEX plus muted RGB metadata,
  dedicated-library navigation and the integrated manual-colour editor;
- the approved 291×44 format control geometry: one outer border, a 144×30
  segmented selector, one compact value, and a 30×30 borderless Copy tile;
- the dedicated library controls: Back, HEX search, Toutes/Favoris filters,
  Récentes/Anciennes/Code HEX sorting and vertically scrollable colour grid;
- no generated selected-state check badge in the saved-colour cards;
- the selected swatch keeps at least 3 px of visible clearance inside the
  scrolling clip area, and the library plus its header use the exact Color
  Inspector background token;
- syntax, conversion, persistence and interaction contracts covered by the
  current Node tests.

The retained `popup-v2.*` experiment may be validated independently, but it is
not the action popup declared by the manifest.

## Synthetic visual lane

Serve the repository on localhost and open the approved Color Inspector state:

~~~bash
python3 -m http.server 4176 --bind 127.0.0.1
~~~

~~~text
http://127.0.0.1:4176/popup.html?view=details&state=saved-library-target&theme=light
http://127.0.0.1:4176/popup.html?view=details&state=saved-library-target&theme=dark
http://127.0.0.1:4176/popup.html?view=library&state=saved-library-all-target&theme=light
http://127.0.0.1:4176/popup.html?view=library&state=saved-library-all-target&theme=dark
http://127.0.0.1:4176/popup.html?view=library&state=empty&theme=light
~~~

The fixture lane is restricted to localhost / 127.0.0.1. Its storage fallback
uses that origin's localStorage and never touches `chrome.storage.local`; clear
the localhost origin when resetting synthetic state. This lane never claims
native extension API proof.

## Required native Brave matrix

The final gate must use the real unpacked extension and current source hashes:

1. Brave loads the manifest with no manifest, popup or service-worker error.
2. Toolbar action opens the active `popup.html` runtime at 340×470 CSS px.
3. The large central circle, spectral halo, placement and behaviour match the
   pre-redesign inspector; no change below may displace or restyle them.
4. Pick calls the real EyeDropper from the trusted gesture.
   Because an action popup normally closes when focus moves outside it, this
   step must explicitly prove that the EyeDropper promise resolves and the
   selected value reaches storage; source inspection cannot establish that
   lifecycle.
5. Escape returns calmly with focus on Pick.
6. A real `#F96B00` pick persists and reopening the popup restores it.
7. HEX, RGB and HSL tabs expose the canonical value in one compact control; the
   single Copy action writes the active format and reports success only after
   clipboard resolution.
8. Five saved colours are shown in the inspector's two-column summary. Each
   summary entry mirrors the dedicated cards with a bold uppercase HEX value
   and a muted `RGB r, g, b` line. **Tout voir** opens the dedicated
   saved-library view; it does not expand the inspector inline.
9. The dedicated view searches HEX case-insensitively with or without `#`,
   switches between **Toutes** and **Favoris**, and sorts by **Récentes**,
   **Anciennes** or **Code HEX** without mutating persisted history order.
10. The dedicated two-column grid scrolls vertically without horizontal
    overflow. Each entry exposes a rounded swatch, bold uppercase HEX and muted
    RGB; selection uses an outline only—no check badge and no generated colour
    name. Its 3 px outer outline remains fully visible, including in the first
    column, with at least 3 px of clearance before the grid clip edge. At narrow
    reflow it becomes one column.
11. Selecting a saved colour updates the inspector, returns to it, and does not
    create a duplicate history entry. Back and Escape return without changing
    the selected colour and restore focus to **Tout voir**.
12. The dedicated `+` and inspector **Nouvelle couleur** actions both open the
    integrated editor below the unchanged large circle. The plan
    saturation/value, hue control and HEX/RGB/HSL fields remain synchronized.
    No history or storage write occurs before **Enregistrer la couleur**;
    Retour and Escape cancel, restore the previous colour and return focus to
    the exact opener.
13. Search-no-result, empty-history, empty-favourites and populated-favourites
    states remain understandable and keyboard reachable. A favourite can be
    added or removed with its accessible star action.
14. Settings trap focus, close on Escape, return focus to their opener and
    persist language plus System/Light/Dark.
15. Light, Dark, System-light, System-dark, forced-colors, reduced-motion,
    keyboard order and 200% reflow have no hidden focus or horizontal overflow.
    The dedicated view and its sticky header must resolve to the same computed
    background colour as the Color Inspector in every theme.
16. No `Aa` control, typography menu or hidden font-selection target appears in
    the header or keyboard order. Reopening a profile that still contains the
    retired `settings.interfaceFont` field removes it while preserving language,
    theme, preview-font and custom-colour settings.
17. `document.fonts.check()` succeeds for local Roboto Flex and Roboto Mono.
    Titles, controls and small interface text use Roboto Flex; HEX/RGB/HSL and
    saved-colour metadata use Roboto Mono with tabular numerals. The header stays
    50 px high, its title begins at the same x/y coordinates, and the large
    circle, format control and saved grid keep their baseline rectangles. No
    title, control or `RGB 255, 255, 255` metadata clips in the eight languages
    at 100% or the bounded 200% reflow.
18. Console and network inspection report no runtime error, CSP violation,
    telemetry or colour-data transmission. The explicit Bitek/support links are
    navigation controls and are not activated during this matrix. Font requests
    are restricted to the local Roboto Flex and Roboto Mono WOFF2 files under
    `chrome-extension://…/assets/fonts/`.
19. The action identity has approved and inspected assets at 16, 32, 48 and
    128 px before release acceptance. The dedicated 32 px asset must be declared
    both for the action and the extension identity in `manifest.json`.
20. At `340×470`, the existing `#hero-swatch` remains at `x=111`, `y=74`,
    `118×118 px` within `0.5 px`; the editor below it has no horizontal
    overflow, keeps its save action keyboard reachable and never launches an
    operating-system colour picker.

Every screenshot must record Brave and Chromium versions, extension ID,
manifest version, source SHA-256, CSS viewport, device pixel ratio, locale,
theme, state and console result.

The active typography contract and current evidence belong under
`qa/roboto-only-2026-08-26/`. The previous bounded Geist verification under
`qa/typography-geist-2026-08-26/` and the selector measurements, twenty-font
matrix and screenshots under `qa/interface-font-selector-2026-08-26/` remain
historical evidence only. The large central circle must retain its pre-change
position and size.

## Visual comparison

The approved inspector source is:

output/imagegen/color-inspector-saved-hex-only-no-check-r5-2026-08-25/color-inspector-saved-hex-only-no-check-340x470.png

SHA-256:

fb2871cfef81f9f3b64982e528062a3c0ec32bd76dbbc7e7a6e7ab04b19d047f

Compare the real result at 340×470 with this source at normalized density. The
large circle is an invariant rather than a redesign target: focused comparison
must therefore begin immediately below it and cover the format selector plus
saved summary.

The approved dedicated-library source is:

output/imagegen/saved-colors-all-view-r1-2026-08-25/saved-colors-all-view-r1-340x470.png

SHA-256:

948f21333ae9a7e7ed9659742462bbaa1750c96f50d79d5b022717c2d998baed

Compare the real dedicated view at 340×470 against this second source. Verify
the header, retrieval controls, default two-column grid, selected outline and
card metadata independently from the locked inspector circle. A screenshot
alone is not acceptance; each source and its implementation must be inspected
in the same comparison input, then the applicable `design-qa.md` must be
finalized from current native evidence.

## Device applicability

The four iPhone formats are not runtime targets for this fixed Chromium desktop
popup. They may be used only as explicitly synthetic stress tests. Native
acceptance instead covers popup size, 200% zoom, themes, focus and toolbar
anchoring in the chosen Brave browser.

## Release boundary

No current ZIP, saved draft, Store listing or Store asset proves delivery of
this Color Inspector redesign. The public `1.0.1` listing and local `1.0.4`
source state are separate release facts.

`npm run package:extension` may create a bounded local QA candidate from the
explicit runtime allowlist. It verifies the archived file list, the complete
notice set for the two Fontsource packages Roboto Flex and Roboto Mono,
and writes a SHA-256 sidecar. This is not a Store submission or a release
approval. Final release acceptance still requires native evidence,
documentation review, optical icon approval at all required sizes, a clean Git
checkout and explicit user authorization for the external Store action.
