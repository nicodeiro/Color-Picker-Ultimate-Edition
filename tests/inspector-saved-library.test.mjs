import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [manifestSource, html, runtime, css, lucideIcons] = await Promise.all([
  readFile(new URL("../manifest.json", import.meta.url), "utf8"),
  readFile(new URL("../popup.html", import.meta.url), "utf8"),
  readFile(new URL("../popup.js", import.meta.url), "utf8"),
  readFile(new URL("../styles.css", import.meta.url), "utf8"),
  readFile(new URL("../vendor/lucide-icons.js", import.meta.url), "utf8")
]);
const manifest = JSON.parse(manifestSource);

function sourceBetween(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start + startMarker.length);
  assert.ok(start >= 0, `Missing source marker: ${startMarker}`);
  assert.ok(end > start, `Missing source marker after ${startMarker}: ${endMarker}`);
  return source.slice(start, end);
}

function inspectorTranslationsStart(language) {
  const languages = ["en", "fr", "es", "de", "pt", "zh", "ja", "ru"];
  const translationSource = sourceBetween(runtime, "const inspectorTranslations = {", "Object.entries(inspectorTranslations)");
  const index = languages.indexOf(language);
  assert.ok(index >= 0, `Unknown inspector language: ${language}`);
  const startMarker = `        ${language}: {`;
  const start = translationSource.indexOf(startMarker);
  const end = index < languages.length - 1
    ? translationSource.indexOf(`        ${languages[index + 1]}: {`, start + startMarker.length)
    : translationSource.length;
  assert.ok(start >= 0 && end > start, `Missing inspector translations for ${language}`);
  return translationSource.slice(start, end);
}

test("the active extension surface is the module-based Color Inspector popup", () => {
  assert.equal(manifest.action?.default_popup, "popup.html");
  assert.match(html, /<script type="module" src="popup\.js"><\/script>/);
  assert.match(runtime, /import \{ createLucideIcon \} from '\.\/vendor\/lucide-icons\.js';/);
});

test("the approved large central color circle markup remains intact", () => {
  assert.match(
    html,
    /<button id="hero-swatch" class="hero-swatch"[^>]*>\s*<span class="hero-ring intelligence-ring" aria-hidden="true"><\/span>\s*<span class="hero-swatch-fill" aria-hidden="true"><\/span>\s*<\/button>/
  );
});

test("the lower inspector exposes HEX, RGB and HSL through one copy control", () => {
  for (const format of ["hex", "rgb", "hsl"]) {
    assert.match(
      html,
      new RegExp(`class="color-format-tab(?: active)?"[^>]*data-color-format="${format}"`)
    );
  }
  assert.match(html, /id="hero-copy-btn" class="current-format-copy"/);
  assert.match(runtime, /COLOR_VALUE_FORMATS\s*=\s*\['hex', 'rgb', 'hsl'\]/);
});

test("the format control matches the approved single-outline composition", () => {
  const controlRule = sourceBetween(css, ".color-format-control {", ".color-format-tabs {");
  const tabsRule = sourceBetween(css, ".color-format-tabs {", ".color-format-tab {");
  const activeTabRule = sourceBetween(css, ".color-format-tab.active {", ".current-format-value {");
  const valueRule = sourceBetween(css, ".current-format-value {", ".current-format-value[data-format=\"rgb\"]");
  const copyRule = sourceBetween(css, ".current-format-copy {", ".current-format-copy:hover {");

  assert.match(controlRule, /height:\s*44px/);
  assert.match(controlRule, /grid-template-columns:\s*144px minmax\(0, 1fr\) 30px/);
  assert.match(controlRule, /grid-template-rows:\s*30px/);
  assert.match(controlRule, /padding:\s*6px/);
  assert.match(controlRule, /background:\s*var\(--ui-surface\)/);
  assert.match(controlRule, /border:\s*1px solid var\(--ui-separator-strong\)/);
  assert.match(controlRule, /border-radius:\s*7px/);
  assert.match(controlRule, /box-shadow:\s*none/);

  assert.match(tabsRule, /height:\s*30px/);
  assert.match(tabsRule, /padding:\s*1px/);
  assert.match(tabsRule, /border-radius:\s*5px/);
  assert.match(activeTabRule, /background:\s*var\(--ui-surface\)/);
  assert.match(valueRule, /font-family:\s*var\(--font-code\)/);
  assert.match(valueRule, /font-weight:\s*620/);
  assert.match(valueRule, /font-variant-numeric:\s*tabular-nums/);

  assert.match(copyRule, /width:\s*30px/);
  assert.match(copyRule, /height:\s*30px/);
  assert.match(copyRule, /background:\s*var\(--ui-surface-muted\)/);
  assert.match(copyRule, /border:\s*0/);
  assert.match(copyRule, /border-radius:\s*5px/);
  assert.match(copyRule, /box-shadow:\s*none/);
});

test("Tout voir opens a dedicated saved-library surface with complete controls", () => {
  assert.match(
    html,
    /id="saved-colors-more"[^>]*aria-controls="saved-library-view"/
  );
  assert.match(
    html,
    /<section id="saved-library-view" class="view saved-library-view hidden"[^>]*aria-hidden="true"/
  );
  for (const id of [
    "saved-library-back",
    "saved-library-add",
    "saved-library-search-input",
    "saved-library-sort-select",
    "saved-library-status",
    "saved-library-grid"
  ]) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.match(html, /data-library-filter="history"/);
  assert.match(html, /data-library-filter="favorites"/);
  for (const sort of ["recent", "oldest", "hex"]) {
    assert.match(html, new RegExp(`<option value="${sort}"`));
  }
});

test("dedicated-view navigation supports Tout voir, back and Escape with focus restoration", () => {
  const showView = sourceBetween(runtime, "function showView(view)", "function openSavedLibrary()");
  const openLibrary = sourceBetween(runtime, "function openSavedLibrary()", "function closeSavedLibrary()");
  const closeLibrary = sourceBetween(runtime, "function closeSavedLibrary()", "function enterPickingState()");
  const globalKeydown = sourceBetween(runtime, "function handleGlobalKeydown(event)", "function handleCollectionKeydown(event)");

  assert.match(runtime, /savedColorsMore\.addEventListener\('click', openSavedLibrary\)/);
  assert.match(runtime, /savedLibraryBack\.addEventListener\('click', closeSavedLibrary\)/);
  assert.match(showView, /\['capture', 'details', 'library'\]\.includes\(view\)/);
  assert.match(showView, /\[els\.savedLibraryView, 'library'\]/);
  assert.match(openLibrary, /showView\('library'\)/);
  assert.match(openLibrary, /savedLibrarySearchInput\.focus\(\)/);
  assert.match(closeLibrary, /showView\('details'\)/);
  assert.match(closeLibrary, /savedColorsMore\.focus\(\)/);
  assert.match(globalKeydown, /event\.key === 'Escape'/);
  assert.match(globalKeydown, /activeView === 'library'/);
  assert.match(globalKeydown, /closeSavedLibrary\(\)/);
});

test("saved-library search, filters and sorting are implemented without mutating storage order", () => {
  const renderLibrary = sourceBetween(runtime, "function renderSavedLibrary()", "function openNewColorEditor(");
  const filterHandler = sourceBetween(runtime, "function handleSavedLibraryFilterKeydown(event)", "function selectColorFormat(format");

  assert.match(runtime, /savedLibrarySearchInput\.addEventListener\('input'/);
  assert.match(runtime, /savedLibraryFilters\.forEach/);
  assert.match(runtime, /savedLibrarySortSelect\.addEventListener\('change'/);
  assert.match(filterHandler, /filter === 'favorites' \? 'favorites' : 'history'/);
  assert.match(filterHandler, /setAttribute\('aria-selected', String\(selected\)\)/);

  assert.match(renderLibrary, /savedLibrarySearch\.trim\(\)\.replace\(\/\\s\+\/g, ''\)\.replace\(\/\^#\/, ''\)\.toUpperCase\(\)/);
  assert.match(renderLibrary, /hex\.slice\(1\)\.toUpperCase\(\)\.includes\(query\)/);
  assert.match(renderLibrary, /savedLibraryFilter === 'favorites' \? favoriteColors : colorHistory/);
  assert.match(renderLibrary, /savedLibrarySort === 'oldest'\) colors = colors\.slice\(\)\.reverse\(\)/);
  assert.match(renderLibrary, /savedLibrarySort === 'hex'\) colors = colors\.slice\(\)\.sort\(/);
  assert.doesNotMatch(renderLibrary, /colorHistory\.(?:reverse|sort)\(/);
  assert.match(renderLibrary, /t\('noSearchResults'\)/);
  assert.match(renderLibrary, /t\('noFavorites'\)/);
  assert.match(renderLibrary, /t\('noHistory'\)/);
});

test("saved cards expose bold HEX, secondary RGB, selection and favorites", () => {
  const renderLibrary = sourceBetween(runtime, "function renderSavedLibrary()", "function openNewColorEditor(");

  assert.match(renderLibrary, /card\.className = `saved-library-card\$\{isSelected \? ' active' : ''\}`/);
  assert.match(renderLibrary, /hexLabel\.textContent = normalized/);
  assert.match(renderLibrary, /rgbLabel\.textContent = `RGB \$\{hexToRgb\(normalized\)\}`/);
  assert.match(renderLibrary, /setColor\(normalized, \{ save: false \}\);\s*showView\('details'\)/);
  assert.match(renderLibrary, /heroSwatch\.focus\(\)/);
  assert.match(renderLibrary, /favoriteButton\.append\(createLucideIcon\('Star'\)\)/);
  assert.match(renderLibrary, /toggleFavorite\(normalized\)/);
  assert.doesNotMatch(renderLibrary, /CircleCheck|checkmark|selected-badge|selection-badge|✓|✔/i);
  assert.match(css, /\.saved-library-card\.active \.saved-library-swatch\s*\{[^}]*box-shadow:/s);
});

test("inline saved colors reuse the dedicated HEX and RGB hierarchy", () => {
  const renderHistory = sourceBetween(runtime, "function renderHistory()", "function renderSavedLibrary()");

  assert.match(renderHistory, /meta\.className = 'saved-library-meta history-meta'/);
  assert.match(renderHistory, /label = document\.createElement\('strong'\)/);
  assert.match(renderHistory, /label\.className = 'history-label'/);
  assert.match(renderHistory, /rgbLabel\.className = 'history-rgb'/);
  assert.match(renderHistory, /rgbLabel\.textContent = `RGB \$\{hexToRgb\(hex\)\}`/);
  assert.match(renderHistory, /meta\.append\(label, rgbLabel\)/);
  assert.match(renderHistory, /colorButton\.append\(swatch, meta\)/);
  assert.match(renderHistory, /setAttribute\('aria-label', `\$\{hex\.toUpperCase\(\)\}, RGB \$\{hexToRgb\(hex\)\}/);
  assert.match(css, /\.saved-colors-section \.history-meta\s*\{[^}]*gap:\s*5px;/s);
});

test("integrated color creation is shared by the inspector and dedicated library", () => {
  const editor = sourceBetween(html, '<section id="new-color-editor"', "</section>");
  const openEditor = sourceBetween(runtime, "function openNewColorEditor(", "function closeNewColorEditor(");
  const closeEditor = sourceBetween(runtime, "function closeNewColorEditor(", "function applyNewColorDraft(");

  for (const id of [
    "new-color-editor",
    "new-color-sv",
    "new-color-hue",
    "new-color-format-tabs",
    "new-color-value-fields",
    "new-color-status",
    "new-color-save"
  ]) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  for (const format of ["hex", "rgb", "hsl"]) {
    assert.match(editor, new RegExp(`data-new-color-format="${format}"`));
    assert.match(editor, new RegExp(`data-new-color-panel="${format}"`));
  }

  assert.doesNotMatch(html, /id="manual-color-input"/);
  assert.doesNotMatch(editor, /type="color"/);
  assert.doesNotMatch(runtime, /openManualColorPicker|manualColorInput|showPicker\(/);
  assert.match(runtime, /savedLibraryAdd\.addEventListener\('click', \(\) => openNewColorEditor\('library'\)\)/);
  assert.match(runtime, /newColorButton\.addEventListener\('click', \(\) => openNewColorEditor\('details'\)\)/);
  assert.match(runtime, /class="history-new-color-icon" aria-hidden="true">\+<\/span>/);
  assert.match(runtime, /class="history-new-color-label">\$\{t\('newColor'\)\}<\/span>/);
  assert.doesNotMatch(runtime, /history-new-color-label"><span[^>]*>\+<\/span>/);
  assert.match(openEditor, /newColorOriginalColor = currentColor/);
  assert.match(openEditor, /detailsView\.classList\.add\('is-creating-color'\)/);
  assert.match(closeEditor, /setColor\(nextColor, \{ save: Boolean\(save\) \}\)/);
  assert.match(closeEditor, /showView\(destination\)/);
});

test("new-color mode preserves the locked hero and matches the approved 340 by 470 geometry", () => {
  const modeCss = sourceBetween(css, ".details-view.is-creating-color .current-color-summary", "@media (forced-colors: active)");
  const editorRule = sourceBetween(css, ".new-color-editor {", ".new-color-editor.hidden {");
  const svRule = sourceBetween(css, ".new-color-sv {", ".new-color-sv-indicator {");
  const markerRule = sourceBetween(css, ".new-color-sv-indicator {", ".new-color-hue-control {");
  const hueRule = sourceBetween(css, ".new-color-hue-control {", ".new-color-hue-control input {");
  const tabsRule = sourceBetween(css, ".new-color-format-tabs {", ".new-color-format-tab {");
  const fieldsRule = sourceBetween(css, ".new-color-value-fields,", ".new-color-value-panel[data-new-color-panel=\"hex\"]");
  const saveRule = sourceBetween(css, ".new-color-save {", ".new-color-save:hover");
  const integratedStart = css.indexOf('Integrated “Nouvelle couleur” editor');
  const forcedColorsStart = css.indexOf('@media (forced-colors: active)', integratedStart);
  const forcedColorsRule = css.slice(forcedColorsStart);

  assert.doesNotMatch(modeCss, /\.hero-(?:swatch|ring|swatch-fill)\s*\{/);
  assert.match(editorRule, /width:\s*216px/);
  assert.match(editorRule, /flex:\s*0 0 258px/);
  assert.match(editorRule, /gap:\s*8px/);
  assert.match(svRule, /width:\s*216px/);
  assert.match(svRule, /height:\s*86px/);
  assert.match(markerRule, /left:\s*clamp\(9px,/);
  assert.match(markerRule, /top:\s*clamp\(9px,/);
  assert.match(hueRule, /height:\s*24px/);
  assert.match(tabsRule, /height:\s*36px/);
  assert.match(fieldsRule, /height:\s*40px/);
  assert.match(saveRule, /height:\s*40px/);
  assert.match(forcedColorsRule, /\.new-color-sv,\s*\.new-color-hue-control input\s*\{[^}]*forced-color-adjust:\s*none;/s);
  assert.match(forcedColorsRule, /\.new-color-sv\s*\{[^}]*linear-gradient\(to top,[^}]*linear-gradient\(to right,/s);
  assert.match(forcedColorsRule, /\.new-color-hue-control input\s*\{[^}]*linear-gradient\(90deg,/s);
  assert.match(html, /id="new-color-sv"[^>]*role="slider"[^>]*aria-valuemin="0"[^>]*aria-valuemax="100"/);
});

test("new-color controls synchronize all formats with validation and keyboard support", () => {
  const openEditor = sourceBetween(runtime, "function openNewColorEditor(", "function updateSavedColorsDisclosure(");
  const globalKeydown = sourceBetween(runtime, "function handleGlobalKeydown(event)", "function handleCollectionKeydown(event)");

  assert.match(openEditor, /hexToHsv\(currentColor\)/);
  assert.match(openEditor, /hsvToHex\(newColorDraft\)/);
  assert.match(openEditor, /rgbToHex\(values\[0\], values\[1\], values\[2\]\)/);
  assert.match(openEditor, /hslToHex\(values\[0\], values\[1\], values\[2\]\)/);
  assert.match(openEditor, /aria-invalid/);
  assert.match(openEditor, /newColorSave\.disabled = !valid/);
  assert.match(openEditor, /role="status"|newColorStatus\.textContent/);
  assert.match(openEditor, /event\.shiftKey \? 10 : 1/);
  assert.match(openEditor, /direction \* 10/);
  assert.match(openEditor, /setAttribute\('aria-selected', String\(selected\)\)/);
  assert.match(openEditor, /button\.tabIndex = selected \? 0 : -1/);
  assert.match(globalKeydown, /if \(isCreatingColor\)/);
  assert.match(globalKeydown, /closeNewColorEditor\(\{ save: false \}\)/);
});

test("new-color strings are localized in all eight supported languages", () => {
  for (const language of ["en", "fr", "es", "de", "pt", "zh", "ja", "ru"]) {
    const languageStart = inspectorTranslationsStart(language);
    for (const key of ["saveColor", "invalidColor", "saturationBrightness", "hexValue", "hue", "red", "green", "blue", "saturation", "lightness"]) {
      assert.match(languageStart, new RegExp(`${key}:`), `${language} is missing ${key}`);
    }
  }
});

test("the library grid scrolls vertically, never horizontally and reflows to one column", () => {
  const gridRule = sourceBetween(css, ".saved-library-grid {", ".saved-library-grid::-webkit-scrollbar");
  const narrowLayout = sourceBetween(css, "@media (max-width: 260px)", "@media (forced-colors: active)");

  assert.match(gridRule, /grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(gridRule, /overflow-x:\s*hidden/);
  assert.match(gridRule, /overflow-y:\s*auto/);
  assert.match(gridRule, /margin-inline:\s*-4px/);
  assert.match(gridRule, /padding:\s*0 4px 12px/);
  assert.match(narrowLayout, /\.saved-library-grid\s*\{\s*grid-template-columns:\s*1fr;/s);
});

test("the dedicated library shares the inspector background and keeps the active outline inside its scrollport", () => {
  const inspectorRule = sourceBetween(css, ".details-view,\n.details-header,\n.details-main {", ".inspector-hidden-controls");
  const libraryViewRule = sourceBetween(css, ".saved-library-view {", ".saved-library-header {");
  const libraryHeaderRule = sourceBetween(css, ".saved-library-header {", ".saved-library-header h1 {");
  const activeSwatchRule = sourceBetween(
    css,
    ".saved-library-card.active .saved-library-swatch {",
    ".saved-library-meta {"
  );

  assert.match(inspectorRule, /background:\s*var\(--card-bg\)\s*!important/);
  assert.match(libraryViewRule, /background:\s*var\(--card-bg\)\s*!important/);
  assert.match(libraryHeaderRule, /background:\s*var\(--card-bg\)/);
  assert.match(activeSwatchRule, /0 0 0 2px var\(--card-bg\)/);
});

test("all dedicated-view glyphs come from the local Lucide icon module", () => {
  for (const icon of ["ChevronLeft", "Plus", "Search", "ChevronDown"]) {
    assert.match(html, new RegExp(`data-lucide-icon="${icon}"`));
  }
  for (const icon of ["ChevronLeft", "Plus", "Search", "ChevronDown", "Star"]) {
    assert.match(lucideIcons, new RegExp(`\\b${icon}: \\[`));
  }
  assert.match(runtime, /querySelectorAll\('\[data-lucide-icon\]'\)/);
  assert.match(runtime, /createLucideIcon\(slot\.dataset\.lucideIcon\)/);
});
