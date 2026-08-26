# Native QA — 10 neutral + 10 expressive typography systems

Date: 2026-08-26
Runtime: extracted allowlisted package, loaded as an unpacked Manifest V3
extension in Brave Headless (`Chrome/151.0.7922.137`)
Popup viewport: 340 × 470 CSS px
Ephemeral package QA extension ID: `cfoplpcochnkgodohgilafaeejcphchd`

## Package under test

- File: `dist/color-picker-ultimate-edition-1.0.2.zip`
- Manifest version: `1.0.2`
- Bytes: `5,076,719`
- Files: `229`
- Fontsource package licences: `27`
- Documented local interface-font files: `192`
- SHA-256: `018bbc6ab0722c5cbf771683c0ea2f27f6c0837dc5d6ffce6026559b85888f54`

The ZIP was extracted into a fresh temporary directory before the final native
run. This proves the bounded package contents used by QA, not Chrome Web Store
submission, review or publication.

## Automated native results

- Inspector matrix per theme: `20` font systems × `8` locales = `160/160`
  passing in Light and `160/160` passing in Dark (`320/320` total).
- Dedicated saved-library matrix: `20/20` passing per theme (`40/40` total).
- Keyboard, search and persistence checks: `16/16` passing, including two
  named groups, ten options per group, group-boundary arrow navigation,
  Enter/Space selection, empty search announcement, Escape focus restoration
  and storage restoration.
- The selector exposes `10` neutral and `10` expressive systems. Every system
  applies a display, UI and code/data role; Roboto Flex is the default.
- Inspector header remains fixed at 50 px. The title origin, large central
  circle, format control and selector trigger stay on their approved rectangles.
- The title-fit assertion checks both trigger clearance and the title's own
  content box, preventing clipped ellipsis regressions such as wide Unbounded
  titles in French or Spanish.
- Saved summary and dedicated library keep complete HEX/RGB metadata. The
  selected swatch outline remains inside the library scrollport.
- Light and Dark backgrounds match between Inspector and dedicated library.
- Console errors: `0`.
- Network failures: `0`; observed font requests are local
  `chrome-extension://…/assets/fonts/interface/` files only.
- Static validation: `45/45` tests passing, including all `192` documented
  interface-font byte lengths and SHA-256 digests.
- The manifest and action declare the dedicated `32 × 32` icon alongside the
  verified `16`, `48` and `128` px assets. Independent optical review found no
  clipping, artefact or light/dark contrast defect.
- Independent final DESIGN-PROTOCOL review: `92/100`, with no criterion below
  `9/10`; No AI Slop and design gates pass without reservation.
- Independent privacy/security review: `PASS`; the package remains storage-only,
  has zero host permissions, content scripts, service workers, telemetry or
  remote runtime dependencies.
- Independent release review: technical `PASS` for this exact ZIP. Git
  provenance remains a separate `HOLD` until the intentionally dirty worktree
  is reviewed and committed with explicit user approval.

## Visual evidence from the extracted package

- `native-v2/package-font-keyboard-light.png`
- `native-v2/package-font-matrix-light.png`
- `native-v2/package-font-matrix-dark.png`
- `native-v2/package-inspector-unbounded-light.png`
- `native-v2/package-font-menu-expressive-dark.png`
- `native-v2/package-library-fraunces-dark.png`
- `native-v2/package-settings-archivo-light.png`
- `native-v2/package-home-bebas-dark.png`

Each PNG has a same-name JSON report containing browser metadata, extension ID,
manifest version, tested ZIP SHA-256, locale, theme, state, computed geometry,
active typography roles, console events, network observations and applicable
matrix or keyboard results.

## Scope boundary

The four iPhone formats do not apply to this fixed desktop Chromium popup. The
applicable visual matrix is the native 340 × 470 popup, Light/Dark, eight
locales, keyboard navigation, font persistence, saved-library rendering and
bounded reflow. Store delivery remains a separate external verification.
