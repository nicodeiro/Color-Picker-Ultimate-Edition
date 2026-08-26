# Third-party notices

## Lucide

The popup uses a curated local subset of Lucide `1.8.0` icons. Lucide is
distributed under the ISC License; the included descriptors derived from
Feather are also covered by the bundled MIT notice.

- Licence and Feather notice: `vendor/LICENSE-lucide.txt`
- Local icon descriptors: `vendor/lucide-icons.js`

No icon library or asset is downloaded at runtime.

## Roboto typography

The popup uses Roboto Flex for all interface and display text, and Roboto Mono
for HEX, RGB and HSL values. Both families are vendored from two pinned
Fontsource `5.3.0` packages and distributed under the SIL Open Font License 1.1.
Only unchanged upstream WOFF2 subset files are shipped, and no font is fetched
at runtime.

- Per-package licences: `assets/fonts/interface/*/LICENSE`
- Packages, npm integrity values, local files and SHA-256 checksums:
  `assets/fonts/interface/SOURCE.md`
- Reproducible vendor script: `scripts/vendor-interface-fonts.mjs`
