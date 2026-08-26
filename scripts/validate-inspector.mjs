import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const localeNames = ["de", "en", "es", "fr", "ja", "pt_BR", "ru", "zh_CN"];
const localeFiles = localeNames.map((locale) => `_locales/${locale}/messages.json`);
const requiredFiles = [
  "manifest.json",
  "popup.html",
  "fonts.css",
  "styles.css",
  "popup.js",
  "vendor/lucide-icons.js",
  "vendor/LICENSE-lucide.txt",
  "assets/fonts/interface/SOURCE.md",
  "assets/fonts/interface/roboto-flex/LICENSE",
  "assets/fonts/interface/roboto-flex/wght.css",
  "assets/fonts/interface/roboto-mono/LICENSE",
  "assets/fonts/interface/roboto-mono/wght.css",
  "icons/icon16.png",
  "icons/icon32.png",
  "icons/icon48.png",
  "icons/icon128.png",
  ...localeFiles
];
const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

for (const relative of requiredFiles) {
  try {
    const metadata = await stat(path.join(root, relative));
    check(metadata.isFile(), `Required path is not a file: ${relative}`);
  } catch {
    failures.push(`Missing required file: ${relative}`);
  }
}

const manifest = JSON.parse(await readFile(path.join(root, "manifest.json"), "utf8"));
check(manifest.manifest_version === 3, "Manifest must remain MV3");
check(manifest.version === "1.0.4", "Manifest must identify the 1.0.4 update candidate");
check(
  manifest.action?.default_popup === "popup.html",
  "Manifest must activate popup.html"
);
check(
  manifest.action?.default_icon?.["32"] === "icons/icon32.png"
    && manifest.icons?.["32"] === "icons/icon32.png",
  "Manifest must declare the optically verified 32 px icon"
);
check(
  Array.isArray(manifest.permissions)
    && manifest.permissions.length === 1
    && manifest.permissions[0] === "storage",
  "Permission set must be exactly [storage]"
);
check(!Object.hasOwn(manifest, "host_permissions"), "Host permissions are forbidden");
check(!Object.hasOwn(manifest, "optional_host_permissions"), "Optional host permissions are forbidden");
check(!Object.hasOwn(manifest, "content_scripts"), "Content scripts are outside the product boundary");
check(!Object.hasOwn(manifest, "background"), "Background/service-worker execution is outside the product boundary");
check(
  manifest.content_security_policy?.extension_pages
    === "script-src 'self'; font-src 'self'; object-src 'none'",
  "Extension CSP must restrict scripts and fonts to self with object-src none"
);

for (const relative of localeFiles) {
  const messages = JSON.parse(await readFile(path.join(root, relative), "utf8"));
  check(
    messages.extensionName?.message === "Color Picker Ultimate Edition",
    `Locale must use the exact Ultimate Edition product suffix: ${relative}`
  );
  check(
    typeof messages.extensionDescription?.message === "string"
      && messages.extensionDescription.message.trim().length > 20,
    `Locale description is missing: ${relative}`
  );
}

const [html, fontsCss, css, runtime, lucideIcons, interfaceFontSource] = await Promise.all([
  readFile(path.join(root, "popup.html"), "utf8"),
  readFile(path.join(root, "fonts.css"), "utf8"),
  readFile(path.join(root, "styles.css"), "utf8"),
  readFile(path.join(root, "popup.js"), "utf8"),
  readFile(path.join(root, "vendor/lucide-icons.js"), "utf8"),
  readFile(path.join(root, "assets/fonts/interface/SOURCE.md"), "utf8")
]);
const activeSlice = [html, fontsCss, css, runtime, lucideIcons].join("\n");

check(
  html.includes('<script type="module" src="popup.js"></script>'),
  "Active popup must load popup.js as a module"
);
check(html.includes('href="styles.css"'), "Active popup must load styles.css");
check(html.includes('href="fonts.css"'), "Active popup must load the local interface font bundle");
check(!/<script(?![^>]*\bsrc=)/i.test(html), "Inline scripts are forbidden");
check(!/<style[\s>]/i.test(html), "Inline styles are forbidden");
check(
  !/<script[^>]+src=["'](?:https?:)?\/\//i.test(html),
  "Remote executable scripts are forbidden"
);
check(
  !/<link[^>]+href=["'](?:https?:)?\/\//i.test(html),
  "Remote styles/resources are forbidden"
);
check(
  !/@font-face\s*\{[^}]*(?:https?:|data:|local\s*\()/s.test(css),
  "Font faces must not use remote, embedded or system-local sources"
);
check(
  /--font-display:\s*["']Roboto Flex Variable["'][^;]*;/s.test(css)
    && /--font-ui:\s*["']Roboto Flex Variable["'][^;]*;/s.test(css)
    && /--font-code:\s*["']Roboto Mono Variable["'][^;]*;/s.test(css),
  "The fixed Roboto Flex display/UI and Roboto Mono code variables must be present"
);
check(
  /body,\s*button,\s*input,\s*select\s*\{[^}]*font-family:\s*var\(--font-ui\);/s.test(css),
  "The active UI controls must inherit the fixed UI stack"
);
check(
  /body\s*\{[^}]*font-synthesis:\s*none;/s.test(css),
  "Synthetic font weights and styles must remain disabled"
);
const fontImports = [...fontsCss.matchAll(/^@import url\("([^"]+)"\);$/gmu)]
  .map((match) => match[1]);
check(
  fontImports.length === 2
    && fontImports[0] === "assets/fonts/interface/roboto-flex/wght.css"
    && fontImports[1] === "assets/fonts/interface/roboto-mono/wght.css"
    && !/(?:https?:|data:|local\s*\()/s.test(fontsCss),
  "The fixed typography bundle must contain exactly local Roboto Flex and Roboto Mono imports"
);
check(
  (interfaceFontSource.match(/^## @fontsource/gmu) || []).length === 2
    && interfaceFontSource.includes("@fontsource-variable/roboto-flex@5.3.0")
    && interfaceFontSource.includes("@fontsource-variable/roboto-mono@5.3.0")
    && interfaceFontSource.includes("No font is downloaded at runtime")
    && interfaceFontSource.includes("SIL Open Font License"),
  "Roboto font provenance and local licensing must remain documented"
);
check(
  !new RegExp(`\\b${["Ge", "ist"].join("")}\\b`, "iu").test(activeSlice),
  "The active product slice must not reference the retired font family"
);
check(
  !/interface-font-(?:control|trigger|panel|search|list|option|group)/u.test(html)
    && !/\.interface-font-|data-interface-font/u.test(css)
    && !/font-presets|interface-font-(?:trigger|panel|search|list)|dataset\.interfaceFont|closeInterfaceFontPicker/u.test(runtime),
  "The retired interface-font selector must have no DOM, CSS or runtime surface"
);
const legacyInterfaceFontMentions = runtime.match(/interfaceFont/gu) || [];
check(
  legacyInterfaceFontMentions.length === 1
    && runtime.includes("Object.hasOwn(result.settings, 'interfaceFont')")
    && runtime.includes("if (hadLegacyInterfaceFont) saveSettings();"),
  "interfaceFont may remain only as a one-time legacy-storage purge"
);

check(
  runtime.includes("import { createLucideIcon } from './vendor/lucide-icons.js';"),
  "Active popup must import the local Lucide icon module"
);
check(
  runtime.includes("document.querySelectorAll('[data-lucide-icon]')"),
  "Active popup must hydrate declared Lucide icon slots"
);
for (const icon of ["ChevronLeft", "Plus", "Search", "ChevronDown", "Star"]) {
  check(
    new RegExp(`\\b${icon}: \\[`, "u").test(lucideIcons),
    `Local Lucide module is missing the ${icon} icon`
  );
}

const savedLibraryStart = html.indexOf('id="saved-library-view"');
const newColorEditorStart = html.indexOf('id="new-color-editor"');

check(
  /id="saved-colors-more"[^>]*aria-controls="saved-library-view"/.test(html),
  "Tout voir must navigate to the dedicated saved-library view"
);
check(
  savedLibraryStart >= 0 && /id="saved-library-view"[^>]*aria-hidden="true"/.test(html),
  "Dedicated saved-library view is missing"
);
for (const id of [
  "saved-library-back",
  "saved-library-add",
  "saved-library-search-input",
  "saved-library-sort-select",
  "saved-library-status",
  "saved-library-grid"
]) {
  check(html.includes(`id="${id}"`), `Dedicated saved-library control is missing: ${id}`);
}
for (const filter of ["history", "favorites"]) {
  check(
    html.includes(`data-library-filter="${filter}"`),
    `Saved-library filter is missing: ${filter}`
  );
}
for (const sort of ["recent", "oldest", "hex"]) {
  check(html.includes(`<option value="${sort}"`), `Saved-library sort is missing: ${sort}`);
}
for (const id of [
  "new-color-editor",
  "new-color-sv",
  "new-color-hue",
  "new-color-format-tabs",
  "new-color-value-fields",
  "new-color-status",
  "new-color-save"
]) {
  check(html.includes(`id="${id}"`), `Integrated color editor control is missing: ${id}`);
}
check(
  newColorEditorStart >= 0 && newColorEditorStart < savedLibraryStart,
  "Integrated color editor must remain inside the Color Inspector before the dedicated library"
);
check(
  !html.includes('id="manual-color-input"')
    && !runtime.includes("openManualColorPicker")
    && !runtime.includes("manualColorInput")
    && !runtime.includes("showPicker()"),
  "Manual color creation must use the integrated editor, not a native color input"
);
check(
  runtime.includes("openNewColorEditor('details')")
    && runtime.includes("openNewColorEditor('library')")
    && runtime.includes("closeNewColorEditor({ save: true })")
    && runtime.includes("closeNewColorEditor({ save: false })"),
  "Integrated color editor must support both openers, explicit save and cancellation"
);

check(
  runtime.includes("els.savedColorsMore.addEventListener('click', openSavedLibrary)"),
  "Tout voir navigation binding is missing"
);
check(
  runtime.includes("els.savedLibraryBack.addEventListener('click', closeSavedLibrary)"),
  "Saved-library back binding is missing"
);
check(
  runtime.includes("activeView === 'library'") && runtime.includes("closeSavedLibrary();"),
  "Escape must close the dedicated saved-library view"
);
check(
  runtime.includes("savedLibrarySearch.trim().replace(/\\s+/g, '').replace(/^#/, '').toUpperCase()"),
  "Saved-library search must ignore one leading # and character case"
);
check(
  runtime.includes("savedLibraryFilter === 'favorites' ? favoriteColors : colorHistory"),
  "Saved-library history/favorites filtering is missing"
);
check(
  runtime.includes("savedLibrarySort === 'oldest'")
    && runtime.includes("colors = colors.slice().reverse()")
    && runtime.includes("savedLibrarySort === 'hex'")
    && runtime.includes("colors = colors.slice().sort"),
  "Saved-library non-mutating recent/oldest/HEX sorting is missing"
);
check(
  runtime.includes("rgbLabel.textContent = `RGB ${hexToRgb(normalized)}`"),
  "Saved-library cards must expose RGB metadata"
);
check(
  /setColor\(normalized, \{ save: false \}\);\s*showView\('details'\)/.test(runtime),
  "Saved-library selection must update the inspector without mutating history"
);
check(
  runtime.includes("favoriteButton.append(createLucideIcon('Star'))")
    && runtime.includes("toggleFavorite(normalized)"),
  "Saved-library favorite control is missing"
);
check(
  /\.saved-library-grid\s*\{[^}]*overflow-x:\s*hidden;[^}]*overflow-y:\s*auto;/s.test(css),
  "Saved-library grid must scroll vertically without horizontal overflow"
);
check(
  /\.saved-library-grid\s*\{[^}]*margin-inline:\s*-4px;[^}]*padding:\s*0 4px 12px;/s.test(css),
  "Saved-library grid must preserve room for the selected outline inside its scrollport"
);
check(
  /\.saved-library-view\s*\{[^}]*background:\s*var\(--card-bg\)\s*!important;/s.test(css)
    && /\.saved-library-header\s*\{[^}]*background:\s*var\(--card-bg\);/s.test(css)
    && /\.saved-library-card\.active \.saved-library-swatch\s*\{[^}]*0 0 0 2px var\(--card-bg\)/s.test(css),
  "Saved-library view must share the inspector background across the canvas and selected ring"
);
check(
  /\.color-format-control\s*\{[^}]*height:\s*44px;[^}]*grid-template-columns:\s*144px minmax\(0, 1fr\) 30px;[^}]*grid-template-rows:\s*30px;[^}]*padding:\s*6px;[^}]*background:\s*var\(--ui-surface\);[^}]*border:\s*1px solid var\(--ui-separator-strong\);[^}]*border-radius:\s*7px;[^}]*box-shadow:\s*none;/s.test(css),
  "Color format control must keep the approved single-outline geometry"
);
check(
  /\.current-format-copy\s*\{[^}]*width:\s*30px;[^}]*height:\s*30px;[^}]*background:\s*var\(--ui-surface-muted\);[^}]*border:\s*0;[^}]*border-radius:\s*5px;[^}]*box-shadow:\s*none;/s.test(css),
  "Color format copy action must remain a soft borderless tile"
);
check(
  /function renderHistory\(\)[\s\S]*?meta\.className = 'saved-library-meta history-meta'[\s\S]*?label = document\.createElement\('strong'\)[\s\S]*?rgbLabel\.textContent = `RGB \$\{hexToRgb\(hex\)\}`[\s\S]*?colorButton\.append\(swatch, meta\)/.test(runtime),
  "Compact saved colors must reuse the bold HEX and secondary RGB hierarchy"
);
check(
  /@media \(max-width: 260px\)[\s\S]*?\.saved-library-grid\s*\{\s*grid-template-columns:\s*1fr;/s.test(css),
  "Saved-library grid must reflow to one column at narrow widths"
);

const forbiddenNetworkPatterns = [
  [/\bfetch\s*\(/, "fetch"],
  [/\bXMLHttpRequest\b/, "XMLHttpRequest"],
  [/\bWebSocket\b/, "WebSocket"],
  [/\bEventSource\b/, "EventSource"],
  [/\bsendBeacon\s*\(/, "sendBeacon"],
  [/\bchrome\.(?:sockets|proxy|webRequest)\b/, "privileged Chrome network API"],
  [/\bimport\s*\(\s*["']https?:\/\//, "remote dynamic import"]
];
for (const [pattern, label] of forbiddenNetworkPatterns) {
  check(!pattern.test(activeSlice), `Forbidden network primitive: ${label}`);
}

const secretPatterns = [
  [/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/, "private key"],
  [/\bghp_[A-Za-z0-9]{20,}\b/, "GitHub token"],
  [/\bgithub_pat_[A-Za-z0-9_]{20,}\b/, "GitHub fine-grained token"],
  [/\bAIza[0-9A-Za-z_-]{30,}\b/, "Google API key"],
  [/\bsk-[A-Za-z0-9]{20,}\b/, "API secret"]
];
for (const [pattern, label] of secretPatterns) {
  check(!pattern.test(activeSlice), `Potential ${label} detected in the active slice`);
}

if (failures.length) {
  console.error("Color Picker inspector validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log("Color Picker inspector validation passed");
  console.log("popup.html active · MV3 · storage only · zero hosts · self-only CSP · no network or secret patterns");
}
