# Color Inspector saved library — approved target

## Approval boundary

- User approval date: 25 August 2026.
- Active product surface: `popup.html` / `popup.js` / `styles.css`.
- Canonical viewport: `340 × 470` CSS px, device pixel ratio `1×` for the
  normalized design comparison.
- Approved target image:
  `output/imagegen/color-inspector-saved-hex-only-no-check-r5-2026-08-25/color-inspector-saved-hex-only-no-check-340x470.png`.
- Target SHA-256:
  `fb2871cfef81f9f3b64982e528062a3c0ec32bd76dbbc7e7a6e7ab04b19d047f`.

The target image is a design reference, not proof of a working extension or a
published Chrome Web Store update.

## Locked invariant

The redesign begins immediately below the large central colour circle. The
circle itself, its size, position, spectral halo, animation and behaviour are
locked and must remain unchanged. No lower-area layout adjustment may move,
resize or visually restyle this invariant.

## Approved lower-area contract

1. One compact segmented selector exposes `HEX`, `RGB` and `HSL`.
2. The currently selected format shows one value and one Copy action.
3. `Couleurs enregistrées` is the dominant section below the selector.
4. Saved colours use a two-column library of rounded-square swatches and bold
   uppercase HEX labels; no generated colour names are displayed.
5. The selected saved colour uses an outline only. It has no check badge.
6. The inspector summary shows up to five colours. `Tout voir` opens the
   dedicated saved-library view; it does not expand the inspector inline.
7. `Nouvelle couleur` opens the browser's native colour input and stores the
   explicitly chosen value in the same local history as sampled colours.
8. Clicking a saved colour in the summary updates the existing inspector circle
   and active HEX/RGB/HSL value without creating a duplicate history entry.

The dedicated view has its own approved target and interaction contract in
`qa/saved-colors-all-view-2026-08-25/TARGET-SPEC.md`. That screen may not alter
the locked circle, its layout or its behaviour in the inspector.

## States and acceptance evidence

Required design states:

- light theme, five-colour summary, `#F96B00` selected;
- dark theme, five-colour summary;
- navigation from `Tout voir` to the dedicated saved-library view and back;
- empty library with `Nouvelle couleur` available;
- keyboard focus on every tab, Copy, `Tout voir`, saved colour and add action;
- RGB and HSL values that fit without horizontal overflow;
- 200% browser zoom/reflow.

Required evidence:

- same-input target-versus-implementation comparison at `340 × 470`;
- focused comparison of the complete region below the locked circle;
- native unpacked-extension capture from the toolbar popup;
- interaction results for format selection, Copy, saved selection, dedicated
  view navigation and native manual colour creation;
- console, CSP, storage and network inspection;
- confirmation that `manifest.json` activates `popup.html` while `popup-v2.*`
  remains inactive.

No visual acceptance, saved draft or local package may be described as Store
submission, review approval or public deployment.
