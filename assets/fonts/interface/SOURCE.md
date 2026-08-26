# Interface font provenance

Roboto Flex and Roboto Mono are vendored locally as the fixed product typography.
Roboto Flex is used for interface and display text; Roboto Mono is reserved for HEX, RGB and HSL data.
No font is downloaded at runtime. Package tarballs were resolved at the pinned version below.
Both packages are redistributed under the SIL Open Font License 1.1; their full licence text is stored beside the font files.
Only the upstream Latin, Latin Extended, Cyrillic and Cyrillic Extended WOFF2 files are packaged; the font binaries are copied unchanged.
Japanese and Chinese text deliberately falls back to the operating-system script fonts declared in `styles.css`.

- Fontsource package version: `5.3.0`
- Package registry: <https://www.npmjs.com/org/fontsource>
- Fontsource source repository: <https://github.com/fontsource/font-files>

## @fontsource-variable/roboto-flex

- Package: `@fontsource-variable/roboto-flex@5.3.0`
- npm integrity: `sha512-bOxckUy0qXNRjhV6e4pcHGSvptix4ZRD1uaj5Za8h+p3qrb2GL4U4TQdpVmPSy0SmqwldfD+JJqEKdF68EyiAw==`
- npm shasum: `f47e978c349819bd78c5f4600e05795dc5b916e0`
- License: copied to the package folder as `LICENSE`.

| Local file | Bytes | SHA-256 |
| --- | ---: | --- |
| `assets/fonts/interface/roboto-flex/LICENSE` | 4,394 | `9d1e34d7081410f85bc1bf4805ce076a16fb1a2306661aef9a7bee72fffb5e23` |
| `assets/fonts/interface/roboto-flex/files/roboto-flex-cyrillic-ext-wght-normal.woff2` | 10,392 | `09837dc0d8ecb711b40c5c58685986052211d955428ea467f54421f1ea86c0c9` |
| `assets/fonts/interface/roboto-flex/files/roboto-flex-cyrillic-wght-normal.woff2` | 15,652 | `c4e64ccd19eee5fca87557f04eec410ef0e69b16baf2a577219f40f6014bbbb2` |
| `assets/fonts/interface/roboto-flex/files/roboto-flex-latin-ext-wght-normal.woff2` | 23,480 | `860475bc6d859474547084d6b7ab158d2c6a107b024abe7d9831faf968e9ec83` |
| `assets/fonts/interface/roboto-flex/files/roboto-flex-latin-wght-normal.woff2` | 34,320 | `8aabd65a22003f488ba7d2da8a8155a7f90e195ab2a11cd006615d00a0ee5eff` |
| `assets/fonts/interface/roboto-flex/metadata.json` | 1,544 | `c99a7b9269c300e1a52192cb755b644024300871cc13ccae9b8cdd088b8ab9fb` |
| `assets/fonts/interface/roboto-flex/wght.css` | 1,524 | `6875191ffb5a134dbbc51ce6d4462c8f365b96514ad85daf28d6a3c31fcceb5d` |

## @fontsource-variable/roboto-mono

- Package: `@fontsource-variable/roboto-mono@5.3.0`
- npm integrity: `sha512-h5r+KY/6qy8JEOj33JgcrFO81YAnvrc1EAwMpl/EPJLb2OIvOy0/jmB5M7qs7x/uXk5JUP5Ux4LrkeOK7faHkQ==`
- npm shasum: `10c0f1c0c283a61fa1e0f24381a1e62ed6ad45fa`
- License: copied to the package folder as `LICENSE`.

| Local file | Bytes | SHA-256 |
| --- | ---: | --- |
| `assets/fonts/interface/roboto-mono/LICENSE` | 4,513 | `b489132782690f2cc1ed23ab56d7057bbb08c42573603e8e704ae2e2ea9c8216` |
| `assets/fonts/interface/roboto-mono/files/roboto-mono-cyrillic-ext-wght-normal.woff2` | 35,912 | `6d72c2150c28b5305e7bfd0290edcf6038e556a9dd11a6ef15a1652548a35693` |
| `assets/fonts/interface/roboto-mono/files/roboto-mono-cyrillic-wght-normal.woff2` | 18,592 | `4052cc0b0f8b1b39da6cfaf90460f8b3c84dfc4b7562e9308ffa0998c3b9a005` |
| `assets/fonts/interface/roboto-mono/files/roboto-mono-latin-ext-wght-normal.woff2` | 22,916 | `4cc0d52e0fa37c28084e0cbce3589a8ab32dd21e6ea619489c5f7c6e8c43b922` |
| `assets/fonts/interface/roboto-mono/files/roboto-mono-latin-wght-normal.woff2` | 32,796 | `b81cd55177300649be8f95b3b747d721ce607e8ed2856e25bd0c630cfd631faf` |
| `assets/fonts/interface/roboto-mono/metadata.json` | 899 | `b22f8ba53fefdafafdb1fa78248faf6fdd59fa9130af5fc7b937316b4da7f9f5` |
| `assets/fonts/interface/roboto-mono/wght.css` | 1,520 | `9f4ed85c4485f4c20a5d4efb7623b31de757ce3b7255c8c83f72d1c015bddd0b` |
