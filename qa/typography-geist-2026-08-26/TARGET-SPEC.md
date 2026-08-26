# Typography target — Geist

## Scope

This is a local correction of the already approved Color Inspector and saved
library direction. It does not reopen the large-circle composition or any
layout decision. No geometry, spacing, icon or interaction is in scope. The
header title and Back icon may use the existing theme-aware text token because
the prior fixed ink token fails contrast in Dark.

The user approved the direction before implementation: Geist Sans for the
interface, Geist Mono for colour values, and a quieter weight hierarchy. Under
the design protocol, correcting this bounded defect does not restart a ten-way
visual exploration.

## Font contract

- UI: local `Geist Sans` variable WOFF2, with system fallbacks for unsupported
  scripts.
- Values: local `Geist Mono` variable WOFF2, reserved for HEX, RGB and HSL.
- Preview feature: `var(--preview-font)` remains untouched.
- Numerals: `font-variant-numeric: tabular-nums` on colour values.
- Synthesis: disabled on the popup body.
- Network: no remote font or stylesheet; `font-src 'self'` in extension CSP.

## Inspector scale

| Element | Family | Size / line-height | Weight | Letter-spacing |
| --- | --- | ---: | ---: | ---: |
| Page title | Geist Sans | 16 / 20 px | 650 | -0.025em |
| Saved-colours title | Geist Sans | 13 / 16 px | 650 | -0.02em |
| `Tout voir` | Geist Sans | 10.5 / 14 px | 520 | -0.01em |
| Inactive format tab | Geist Sans | 10 / 12 px | 560 | 0 |
| Active format tab | Geist Sans | 10 / 12 px | 640 | 0 |
| Current HEX | Geist Mono | 11 / 14 px | 620 | -0.01em |
| Current RGB/HSL | Geist Mono | 10 / 13 px | 620 | -0.01em |
| Saved HEX | Geist Mono | 10 / 12 px | 620 | 0 |
| Saved RGB | Geist Mono | 8.5 / 11 px | 500 | -0.01em |
| `Nouvelle couleur` | Geist Sans | 10 / 13 px | 620 | -0.01em |

## Dedicated saved-library scale

| Element | Family | Size / line-height | Weight |
| --- | --- | ---: | ---: |
| Page title | Geist Sans | 16 / 20 px | 650 |
| Search | Geist Sans | 12 / 16 px | 450 |
| Inactive filter | Geist Sans | 10 / 12 px | 520 |
| Active filter | Geist Sans | 10 / 12 px | 620 |
| Sort | Geist Sans | 9.5 / 12 px | 520 |
| Card HEX | Geist Mono | 10 / 12 px | 620 |
| Card RGB | Geist Mono | 8.5 / 11 px | 500 |
| Empty state | Geist Sans | 12 / 16 px | 500 |

## Acceptance

1. The true unpacked action popup loads both local font families.
2. Computed styles match the target families, sizes and weights.
3. `RGB 255, 255, 255` fits every compact metadata cell at 340×470.
4. Light and Dark have no clipping, overlap or unexpected reflow.
5. Search, focus, selected swatch, empty state and settings remain usable.
6. French, English and fallback-script samples render without missing glyphs.
7. The large central circle remains pixel-position compatible with the approved
   pre-typography reference.
8. Required synthetic captures pass at 375×812, 393×852, 440×956 and 375×667.
9. Console and network inspection show no error, CSP violation or remote font
   request.
