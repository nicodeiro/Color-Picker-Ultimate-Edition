# Privacy — Color Picker Ultimate Edition

## Short promise

Color sampling, conversion, history and preferences stay on the device. The
core flow has no network dependency and does not inspect webpage content.

## Data processed

The active `popup.html` runtime processes:

- a six-digit sRGB HEX value returned by Chrome EyeDropper after an explicit
  user gesture, or created explicitly through the local **Nouvelle couleur**
  editor using saturation/value, hue, HEX, RGB or HSL controls;
- derived RGB and HSL values calculated locally;
- up to ten validated and deduplicated HEX values under
  chrome.storage.local.colorHistory;
- up to ten optional favorite HEX values already supported by the runtime
  under chrome.storage.local.favoriteColors;
- the runtime language, system / light / dark theme, preview font and custom
  colour preferences under chrome.storage.local.settings.

Settings are normalized to the supported fields before they are rewritten.
The retired `interfaceFont` field is removed the next time a legacy settings
object is normalized; no replacement interface-font preference is stored.
Unknown fields are not retained. The saved-colour redesign does not add colour
names, accounts, cloud sync or a second store. Screen-picked and manually chosen
values use the same local history boundary.

Transient UI state—loading, picker activity, a manually edited colour draft,
cancellation, copy feedback and errors—is memory-only and is not persisted.

## Data not processed

The active runtime does not read or store:

- page URL, title, favicon, DOM, text, images or browsing history;
- screenshots, screen recordings or pixel buffers;
- clipboard contents;
- identity, account, contact, location or advertising identifiers;
- analytics, diagnostics or telemetry.

After an explicit EyeDropper flow, the extension writes the resulting HEX value
to the clipboard automatically. The visible Copy control writes the currently
selected HEX, RGB or HSL representation. The extension never reads the
clipboard.

## Retention and control

Recent colours and preferences remain in chrome.storage.local until Chrome
clears extension storage, the extension is removed, or a future explicitly
designed clear-data control is used. This MVP does not claim automatic expiry.

If a history storage write fails, the newly sampled colour can remain visible
for the current popup session. The current MVP does not yet present a dedicated
history-save failure message.

## Network and third parties

Colour sampling, conversion, copy and persistence make no network request and
load no remote code, font, icon or image. Roboto Flex and Roboto Mono are
bundled locally with the extension. The manifest grants zero host
permissions and has no content script or service worker. The popup contains
explicit user-activated links to Bitek/support pages; opening one navigates the
browser to that website, but sampled or manually chosen colour data is not
attached or transmitted by the extension.

## Evidence boundary

Static validation proves only the declared source boundary. A final privacy
claim still requires the active unpacked `popup.html` extension to be replayed
in Chrome with console, storage and network inspection at the current source
hashes. The local source version is `1.0.4`; the published Chrome Web Store
`1.0.1` listing is a separate deployed state and is not changed by this local
redesign.
