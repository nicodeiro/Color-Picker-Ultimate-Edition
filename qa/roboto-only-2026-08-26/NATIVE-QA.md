# Native QA — fixed Roboto typography

Date: 26 August 2026 (Europe/Paris)
Local candidate: `1.0.3`
Browser: Brave Browser `151.1.93.136`
Viewport: `340 × 470` CSS px, DPR `1`

## Candidate identity

- ZIP: `dist/color-picker-ultimate-edition-1.0.3.zip`
- Bytes: `2,310,345`
- Files: `46`
- Font licences: `2`
- SHA-256:
  `228cffc4e44ee5cf9c878f4b1b4b4bba3d0a376fdedec4fb1f459362c1e2b45b`
- The package was built twice with the same byte count and SHA-256.

The unpacked source loaded as extension ID
`jdnmmamijbiceddnlfhgpempfodcgoll`. A fresh extraction of the ZIP loaded as
the separate extension ID `nppifpkpncfapjfhcdpiepmafjljehob`. Both used the
real Manifest V3 action popup opened through `chrome.action.openPopup()`.

## Evidence matrix

Twenty-two PNG/JSON report pairs were captured under `source/` and `package/`:

- Inspector: all eight supported locales (`fr`, `en`, `es`, `de`, `pt`, `ru`,
  `ja`, `zh`) across Light and Dark;
- dedicated saved-colour library in Light and Dark;
- Capture/Home in Dark;
- Settings in Light;
- legacy `interfaceFont` migration in source and extracted-package lanes;
- the complete saved-library interaction contract in source and
  extracted-package lanes.

All reports identify version `1.0.3`, the candidate SHA-256 and the expected
extension origin. Every document remained exactly `340 × 470` with no document
overflow.

## Typography and visual result

- `document.fonts.check()` passed for local `Roboto Flex Variable` and
  `Roboto Mono Variable` in every report.
- Computed display and UI roles begin with Roboto Flex; computed colour-data
  roles begin with Roboto Mono.
- No `Aa` control, interface-font popover, `data-interface-font` state or
  hidden typography target exists in the runtime.
- Inspector title: x `57`, y `16`; header height `50`.
- Central colour circle: x `111`, y `74`, `118 × 118`, unchanged.
- Format control: x `22`, y `219`, `291 × 44`; copy tile `30 × 30`.
- Saved-colour section: x `22`, y `283`; all HEX and RGB metadata fit in the
  eight languages.
- The dedicated library shares the exact Inspector background in Light and
  Dark. The selected swatch keeps `4 px` of left clearance, above the required
  `3 px`, so its outline is not clipped.

The key native images were inspected at original resolution:

- `source/inspector-fr-light-340x470.png`
- `source/inspector-zh-dark-340x470.png`
- `source/library-fr-light-340x470.png`
- `source/library-de-dark-340x470.png`
- `source/home-en-dark-340x470.png`
- `source/settings-fr-light-340x470.png`
- the six corresponding images under `package/`

No title, control, HEX value or `RGB 255, 255, 255` metadata is clipped or
overlapped. The removal of the former selector does not displace the locked
Inspector geometry.

## Interaction and migration

The functional saved-library runs passed every scripted assertion: dedicated
view opening, focus, search, no-result and empty-favourites states, filters,
recent/oldest/HEX sorting, selection without history reordering, no check badge,
Back and Escape focus restoration, filter keyboard navigation, native manual
colour picker, unique persistence, vertical scrolling and zero horizontal
overflow.

The legacy migration was replayed in both source and package lanes. A stored
`settings.interfaceFont = "unbounded"` was removed while language, theme,
preview font and custom colours were preserved.

## Runtime integrity

- Console errors or warnings: `0`.
- Network failures: `0`.
- External requests: `0`; all observed requests used `chrome-extension://` and
  only local runtime, image, Lucide and Roboto assets.
- Service worker detected: no.
- Permission boundary: `storage` only, zero hosts.
- `npm run check`: `39/39` tests passed.
- `git diff --check`: passed.

## Boundary

This QA proves the local typography change and the bounded `1.0.3` candidate.
The popup is a fixed Chromium desktop surface, so the four iPhone simulator
formats are not applicable runtime targets. The native EyeDropper lifecycle was
not changed by this typography pass and was not re-enacted in headless QA.

The worktree remains intentionally dirty and no commit, push, Chrome Web Store
submission, review or publication was performed. The public `1.0.1` listing is
a separate deployed state.
