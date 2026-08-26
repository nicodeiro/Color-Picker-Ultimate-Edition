# Color Picker — Chrome Web Store visual pack

## Files to upload

### Localized screenshots — English

Upload these three files, in this order:

1. `exports/01-en-pick-any-color-1280x800.png`
2. `exports/02-en-copy-color-values-1280x800.png`
3. `exports/03-en-history-favorites-1280x800.png`

### International screenshot

Upload:

- `exports/04-international-no-text-1280x800.png`

### Small promotional tile

Upload:

- `exports/05-small-promo-440x280.png`

### Marquee promotional tile

Optional, but ready to use:

- `exports/06-marquee-1400x560.png`

## Technical validation

All exports are:

- PNG
- 8-bit per RGB channel / 24-bit RGB
- Opaque, with no alpha channel
- Exported at their exact Chrome Web Store dimensions

## Source and reproducibility

- Real English extension captures: `source/ui/`
- Deterministic renderer: `source/render-store-assets.swift`
- Capture setup: `source/capture-en.html`

Run the renderer from the Color Picker extension directory:

```sh
swift 'store-assets/source/render-store-assets.swift'
```
