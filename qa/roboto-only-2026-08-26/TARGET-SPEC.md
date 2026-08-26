# Target spec — Fixed Roboto typography

Date: 2026-08-26
Local version: `1.0.3`
Runtime: active Manifest V3 action popup, `popup.html`, 340 × 470 CSS px

## Approved direction

The product uses one fixed, locally bundled typography system. Roboto Flex is
the display and interface family; Roboto Mono is reserved for HEX, RGB and HSL
data. The former twenty-system selector is retired. This is a typography
simplification, not a redesign of the approved Color Inspector or saved-colour
library.

The published Chrome Web Store `1.0.1` listing remains a separate deployed
state. This target describes local `1.0.3` acceptance only and does not establish
Store submission, approval or publication.

## Font contract

- Display and UI: local `Roboto Flex Variable`, with the existing
  operating-system script fallbacks for unsupported glyphs.
- Colour data: local `Roboto Mono Variable`, with tabular numerals.
- Preview feature: `var(--preview-font)` remains independent and unchanged.
- Delivery: exactly two Fontsource packages, Roboto Flex and Roboto Mono, with
  their OFL licences, provenance and reproducible checksums.
- Network: no remote font, stylesheet or runtime download; extension CSP keeps
  `font-src 'self'`.
- Choice: no `Aa` control, font popover, preset allowlist or dynamic interface
  font switching appears in the active product.
- Migration: when settings are next normalized, a legacy `interfaceFont` field
  is removed and the remaining supported settings are preserved. No replacement
  interface-font preference is persisted.

## Locked visual invariants

- Popup viewport: 340 × 470 CSS px with no horizontal overflow.
- Inspector header: 50 px high.
- Inspector title: origin x = 57 px, y = 16 px; Roboto Flex, 16 px, weight 650.
- No residual title padding or invisible pointer target remains where the former
  typography selector appeared.
- Large colour circle: x = 111 px, y = 74 px, 118 × 118 px. Its spectral halo,
  position, size and behaviour are unchanged.
- Format control: x = 22 px, y = 219 px, 291 × 44 px.
- Segmented HEX/RGB/HSL tabs: 144 × 30 px within the format control.
- Copy tile: 30 × 30 px.
- Saved-colour section origin: x = 22 px, y = 283 px.
- Saved-colour summary: two 139.5 px columns, 50 px rows, five colours plus the
  `Nouvelle couleur` action.
- Selected colour: clipping-safe outline only, without a check badge.
- Inspector and dedicated-library backgrounds resolve to the same theme token in
  Light and Dark.

## Type hierarchy

| Element | Family | Size / line-height | Weight |
| --- | --- | ---: | ---: |
| Page title | Roboto Flex | 16 / 20 px | 650 |
| Saved-colours title | Roboto Flex | 13 / 16 px | 650 |
| `Tout voir` | Roboto Flex | 10.5 / 14 px | 520 |
| Inactive format tab | Roboto Flex | 10 / 12 px | 560 |
| Active format tab | Roboto Flex | 10 / 12 px | 640 |
| Current HEX | Roboto Mono | 11 / 14 px | 620 |
| Current RGB/HSL | Roboto Mono | 10 / 13 px | 620 |
| Saved HEX | Roboto Mono | 10 / 12 px | 620 |
| Saved RGB | Roboto Mono | 8.25 / 11 px | 500 |
| `Nouvelle couleur` | Roboto Flex | 10 / 13 px | 620 |

The dedicated saved-library cards use the same Roboto Mono hierarchy for HEX
and RGB metadata. Search, filters, sorting, empty states, Settings and Capture
use Roboto Flex.

## Acceptance

1. The true unpacked action popup and a freshly extracted `1.0.3` package both
   load local Roboto Flex and Roboto Mono successfully.
2. Computed styles match the family roles, sizes and weights above; colour data
   uses tabular numerals.
3. No typography control appears visually, in the keyboard order or in the
   active accessibility tree.
4. A stored legacy `settings.interfaceFont` value is purged without changing
   language, theme, preview-font or custom-colour preferences.
5. The locked rectangles remain stable in Inspector Light and Dark, including
   the large circle, compact format control and saved-colour summary.
6. The dedicated library, Capture, Settings, populated and empty states retain
   their approved layout and use the fixed family roles.
7. `RGB 255, 255, 255`, long RGB/HSL values and translated labels do not clip or
   overlap in any of the eight supported languages at 100% or bounded 200%
   reflow.
8. Keyboard order, focus return, forced colours and reduced motion have no
   hidden focus, horizontal overflow or regression.
9. Console and network inspection show no runtime error, CSP violation,
   telemetry or remote font request.
10. Native screenshots and measurements, not a localhost fixture alone, remain
    the visual acceptance authority.

## Historical evidence

`qa/typography-geist-2026-08-26/` and
`qa/interface-font-selector-2026-08-26/` are retained to explain earlier local
directions. They are historical only and are not acceptance targets for the
active product.
