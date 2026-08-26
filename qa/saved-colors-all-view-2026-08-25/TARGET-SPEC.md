# Dedicated saved-colours view — approved target

## Approval boundary

- User approval date: 25 August 2026.
- Active product surface: `popup.html` / `popup.js` / `styles.css`.
- Entry point: `Tout voir` in the Color Inspector saved-colour summary.
- Canonical viewport: `340 × 470` CSS px, device pixel ratio `1×` for the
  normalized design comparison.
- Approved target image:
  `output/imagegen/saved-colors-all-view-r1-2026-08-25/saved-colors-all-view-r1-340x470.png`.
- Target SHA-256:
  `948f21333ae9a7e7ed9659742462bbaa1750c96f50d79d5b022717c2d998baed`.

The generated target is a design reference. It is not proof of native extension
behaviour, review submission or Chrome Web Store publication.

## Locked inspector invariant

This is a separate view reached from the inspector. The inspector's large
central colour circle, its size, position, spectral halo, animation and
behaviour remain locked. The dedicated view must not reuse, move, resize or
restyle that circle, and returning to the inspector must restore the existing
layout unchanged.

## Approved visual contract

1. The header contains Back, `Couleurs enregistrées` and an add-colour `+`.
2. A full-width search field retrieves colours by HEX.
3. A compact segmented control switches between `Toutes` and `Favoris`.
4. A sort control exposes `Récentes`, `Anciennes` and `Code HEX`.
5. The default library is a vertically scrollable two-column grid with no
   horizontal overflow. Narrow reflow uses one column.
6. Each entry shows one rounded-square swatch, a bold uppercase HEX code and a
   muted RGB value. No generated colour name is displayed.
7. The selected colour uses an outline only. No check badge is displayed.
8. The favourite star is an accessible per-colour action. It may remain quiet
   until hover, focus or active state so the default grid preserves hierarchy.
9. Light and Dark use the existing neutral theme tokens; the sampled colour is
   evidence, not a new global accent.

## Interaction contract

1. `Tout voir` opens this dedicated view rather than expanding the inspector.
2. Back and Escape return to the unchanged inspector and restore focus to
   `Tout voir` without changing the selected colour.
3. Search is case-insensitive, accepts a leading `#` or no `#`, and filters by
   HEX substring. A no-result state is announced clearly.
4. `Toutes` reads the local history; `Favoris` reads the local favourites.
5. Sorting operates on a view copy and never mutates persisted history order.
6. Selecting a saved colour updates the existing inspector circle and active
   HEX/RGB/HSL value, returns to the inspector, and does not add a duplicate
   history entry.
7. The header `+` opens the browser's native colour input. Confirming a colour
   saves it to the same local history; cancelling changes nothing.
8. Adding or removing a favourite refreshes the grid. Removing the last item
   from the `Favoris` filter leaves focus in a predictable control.
9. Search, tabs, sort, colour entries, favourite actions, Back and add remain
   keyboard reachable with visible focus.

## Required states

- light theme, `Toutes`, `Récentes`, `#F96B00` selected;
- dark theme with the same content hierarchy;
- non-empty search result and no-result search;
- populated and empty `Favoris`;
- `Anciennes` and `Code HEX` sorts;
- empty history with add-colour available;
- keyboard focus for every interactive control;
- one-column narrow reflow and 200% zoom without horizontal overflow;
- native colour-input confirm and cancel paths;
- Back and Escape return paths.

## Acceptance evidence still required

- same-input target-versus-implementation comparison at `340 × 470`;
- native unpacked-extension capture from the toolbar popup in Light and Dark;
- interaction results for search, filters, all three sorts, selection, favourite
  toggle, Back, Escape and native manual colour creation;
- confirmation that selection returns to the inspector without duplicating
  history and without moving or restyling the locked circle;
- console, CSP, storage and network inspection;
- current source hashes, browser version, extension ID, manifest version, CSS
  viewport, device pixel ratio, locale and theme recorded with each capture.

No local screenshot, saved draft or generated reference may be described as
native acceptance, Store review approval or public deployment.
