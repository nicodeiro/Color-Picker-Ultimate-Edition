# Target spec — Global typography system selector

Date: 2026-08-26
Runtime: active Manifest V3 popup, `popup.html`, fixed at 340 × 470 CSS px

## Approved direction

The previously approved Color Inspector remains intact. The only new element is
a compact typography selector placed to the right of the Inspector title. The
user selected this direction after comparing the earlier ten typography
variants and requested a reversible in-product choice instead of one fixed
family.

## Invariants

- Inspector header remains 50 px high.
- Back button, title start point, large colour circle, spectral halo,
  HEX/RGB/HSL control and saved-colour grid keep their existing rectangles.
- The selector is an overlay and never participates in flex layout.
- Capture, Inspector, Tout voir and Settings all use the confirmed system.
- Each system exposes three distinct roles: Display for titles and section
  emphasis, UI for controls and supporting text, and Code for HEX/RGB/HSL plus
  saved-colour metadata.
- Code remains monospace with tabular numerals. Expressive Display faces are
  never forced onto small controls or metadata when a more readable UI
  companion is specified.

## Selector geometry

- Wrapper: absolute, top 5 px, right 14 px, 96 × 40 px.
- Visible trigger: 96 × 30 px, 8 px radius.
- Pointer target: effective 96 × 44 px through a transparent pseudo-element;
  the visible geometry and surrounding layout stay unchanged.
- Content: `Aa`, short preset name and chevron.
- Popover: fixed, top 44 px, right 12 px, width 252 px, maximum height 312 px.
- Popover surface: opaque theme surface so the spectral circle cannot tint it.
- Search: 34 px high.
- Option: minimum 40 px high, ranked order within its group, real Display font
  preview, localized `3 roles` summary and selection check.
- Below 260 px synthetic width, the visible trigger collapses to `Aa` plus the
  chevron while the title origin remains unchanged.
- The title keeps its original start point but reserves the selector's right
  zone, preventing long translations or wide fonts from passing underneath.

## Ranked systems

The selector keeps the following names, order and role mapping. A repeated
family in the Display and UI columns is intentional.

### Neutral — 10 systems

| Rank | System | Display | UI | Code |
|---:|---|---|---|---|
| 1 | Roboto Flex — default | Roboto Flex | Roboto Flex | Roboto Mono |
| 2 | Inter | Inter | Inter | Geist Mono |
| 3 | Noto Sans | Noto Sans | Noto Sans | Noto Sans Mono |
| 4 | Source Sans 3 | Source Sans 3 | Source Sans 3 | Source Code Pro |
| 5 | IBM Plex Sans | IBM Plex Sans | IBM Plex Sans | IBM Plex Mono |
| 6 | Public Sans | Public Sans | Public Sans | Source Code Pro |
| 7 | Manrope | Manrope | Manrope | Roboto Mono |
| 8 | Spline Sans | Spline Sans | Spline Sans | Spline Sans Mono |
| 9 | Red Hat Text | Red Hat Text | Red Hat Text | Red Hat Mono |
| 10 | Atkinson Hyperlegible Next | Atkinson Hyperlegible Next | Atkinson Hyperlegible Next | Atkinson Hyperlegible Mono |

### Expressive — 10 systems

| Rank | System | Display | UI | Code |
|---:|---|---|---|---|
| 11 | Space Grotesk | Space Grotesk | Inter | Roboto Mono |
| 12 | Bricolage Grotesque | Bricolage Grotesque | Manrope | Roboto Mono |
| 13 | Syne | Syne | Inter | Noto Sans Mono |
| 14 | Unbounded | Unbounded | Manrope | Noto Sans Mono |
| 15 | Fraunces | Fraunces | Source Sans 3 | Source Code Pro |
| 16 | Zilla Slab | Zilla Slab | Source Sans 3 | Source Code Pro |
| 17 | Archivo Black | Archivo Black | Public Sans | Source Code Pro |
| 18 | Chakra Petch | Chakra Petch | IBM Plex Sans | IBM Plex Mono |
| 19 | Bebas Neue | Bebas Neue | Noto Sans | Noto Sans Mono |
| 20 | Cormorant Garamond | Cormorant Garamond | Source Sans 3 | Source Code Pro |

The twenty systems use 27 local Fontsource packages plus the existing
local Geist Mono asset. All files are OFL-licensed. Japanese and Chinese text
uses the operating-system script fallback declared in `font-presets.js`.

## Interaction and accessibility

- Roboto Flex is used for a new profile and when a stored ID is unknown. A known
  legacy ID resolves through the explicit compatibility map to a current
  system; legacy IDs never reappear as visible selector options.
- Selection is allowlisted and saved in `chrome.storage.local.settings` as
  `interfaceFont`.
- Neutral and Expressive are separate, labelled option groups with ten systems
  each. Group labels are announced but never enter the option focus order.
- The popover supports search, Arrow Up/Down, Home, End, Enter, Space and Escape.
- Arrow navigation crosses the group boundary. Filtering hides empty groups and
  preserves an announced empty-result state when neither group matches.
- Display previews are applied lazily only to visible list options; opening the
  menu does not eagerly decode all twenty Display families.
- Escape closes the menu and returns focus to the trigger.
- The trigger exposes `aria-haspopup`, `aria-expanded`, `aria-controls` and the
  selected family in its dynamic accessible name.
- The popup makes no remote font request and adds no permission.

## Acceptance

- Exactly 20 visible options: 10 Neutral and 10 Expressive, in the ranked order
  above, with no legacy preset left in the selector list.
- All active Display, UI and Code faces report loaded before final capture.
- Every title, control and colour value resolves to its documented role without
  silently replacing expressive Display with the UI companion.
- Stored selection survives popup reopen.
- No console error, CSP violation, network font request or horizontal overflow.
- Light, Dark, keyboard, focus, forced colours, reduced motion and the eight
  supported languages are verified.
- Native unpacked-extension evidence remains the release authority.
