# Permissions — Color Picker Ultimate Edition

## Active MV3 boundary

The active manifest requests exactly one permission:

| Permission | Why it is required | What it does not permit |
|---|---|---|
| **storage** | Keep screen-picked or manually chosen colours and the user’s language, theme, preview-font and custom-colour preferences locally between popup openings. | It does not grant page access, browsing-history access, host access, network access or clipboard access. |

The product has:

- no host permissions or optional host permissions;
- no content script;
- no activeTab, tabs, scripting, offscreen, downloads or network permission;
- no externally connectable or web-accessible runtime surface.

## EyeDropper and clipboard

The picker is the browser’s EyeDropper Web API. EyeDropper.open() is called
directly from the visible Pick button’s trusted user gesture. The API returns
only one validated six-digit sRGB HEX value. **Nouvelle couleur** uses an
integrated local editor after an explicit user action; its saturation/value,
hue, HEX, RGB and HSL controls run entirely inside the popup. Neither path
grants or requires page access, and both persist only a confirmed HEX value.

After the user explicitly starts EyeDropper and chooses a pixel, the resulting
HEX value is copied automatically. The visible Copy control can also write the
currently selected HEX, RGB or HSL value. Both paths use
`navigator.clipboard.writeText()`; the runtime never reads clipboard contents
and does not request `clipboardWrite`. Copy success is shown only after the
promise resolves.

## Explicit exclusions

The detached legacy background.js is not referenced by manifest.json and does
not run. The active popup loads no remote asset and has no analytics, telemetry
or update service. Its explicit external Bitek/support links are ordinary
user-activated browser navigations; they do not require a host permission and
do not transmit saved colour values.

Any future permission or host-access change requires a new product/privacy
review and updated native evidence. It is not covered by this document.
