import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [html, css, runtime] = await Promise.all([
  readFile(new URL("../popup-v2.html", import.meta.url), "utf8"),
  readFile(new URL("../popup-v2.css", import.meta.url), "utf8"),
  readFile(new URL("../popup-v2.js", import.meta.url), "utf8")
]);

test("loading cannot expose an actionable Settings control", () => {
  assert.match(html, /id="settings-button"[\s\S]*?disabled/);
  assert.match(runtime, /settings-button"\]\.disabled = state\.phase === "loading"[\s\S]*?state\.isPersistingHistory/);
});

test("copy feedback stays local, visible and single-announced", () => {
  assert.match(html, /id="hex-feedback" class="copy-feedback" hidden/);
  assert.doesNotMatch(html, /id="hex-feedback"[^>]*aria-live/);
  assert.match(html, /id="rgb-feedback" class="format-inline-feedback" hidden/);
  assert.match(html, /id="hsl-feedback" class="format-inline-feedback" hidden/);
  assert.match(runtime, /inlineFeedback\.textContent = feedbackMessage/);
  assert.match(runtime, /setControlIcon\(nodes\["copy-hex-button"\], "Copy"\)/);
  assert.doesNotMatch(html, /id="(?:empty|result)-notice"[^>]*aria-live/);
});

test("narrow reflow keeps the complete HEX and visible focus", () => {
  assert.match(css, /@media \(max-width: 270px\)[\s\S]*?\.proof-row \{[\s\S]*?grid-template-columns: 56px minmax\(0, 1fr\)/);
  assert.match(css, /@media \(max-width: 270px\)[\s\S]*?\.hex-value \{[\s\S]*?grid-column: 2;[\s\S]*?text-overflow: clip/);
  assert.match(runtime, /copy-hex-button"\]\.focus\(\)/);
  assert.doesNotMatch(runtime, /copy-hex-button"\]\.focus\(\{ preventScroll: true \}\)/);
  assert.match(css, /\.dialog-header h2 \{[\s\S]*?min-width: 0;[\s\S]*?overflow-wrap: anywhere/);
  assert.match(css, /@media \(max-width: 270px\)[\s\S]*?\.dialog-header \{[\s\S]*?gap: 8px/);
});

test("error recovery receives focus and result entry resets its scroll", () => {
  assert.match(runtime, /error-action"\]\.focus\(\)/);
  assert.doesNotMatch(runtime, /error-title"\]\.focus/);
  assert.match(runtime, /main-content"\]\.scrollTop = 0/);
});

test("asynchronous copy and settings writes are last-intent wins", () => {
  assert.match(runtime, /const requestRevision = \+\+copyRequestRevision/);
  assert.match(runtime, /requestRevision !== copyRequestRevision/);
  assert.match(runtime, /const revision = \+\+settingsSaveRevision/);
  assert.match(runtime, /settingsSaveChain[\s\S]*?storageAdapter\.set/);
  assert.match(runtime, /revision !== settingsSaveRevision/);
  assert.match(runtime, /state\.copyFeedback = null;\n\s+renderFeedback\(\);\n\s+try \{/);
});

test("settings persistence failure is visible in the dialog", () => {
  assert.match(html, /id="settings-feedback" class="settings-feedback"/);
  assert.match(css, /\.settings-feedback \{/);
  assert.match(runtime, /settingsFeedback = text\("settingsNotSaved"\)/);
  assert.match(runtime, /settings-feedback"\]\.textContent = state\.settingsFeedback/);
  assert.match(runtime, /settings-done-button"[\s\S]*?disabled = state\.settingsSaving/);
  assert.match(runtime, /if \(state\.settingsSaving\) event\.preventDefault\(\)/);
});

test("a picked value is rendered before persistence and failed history focuses Copy", () => {
  const resultAssignment = runtime.indexOf('state.currentColor = hex;');
  const visibleRender = runtime.indexOf('render();', resultAssignment);
  const persistence = runtime.indexOf('await persistHistory();', resultAssignment);
  assert.ok(resultAssignment >= 0 && visibleRender > resultAssignment && persistence > visibleRender);
  assert.match(runtime, /historySaved[\s\S]*?copy-hex-button"\]\.focus\(\)/);
  assert.match(runtime, /isPersistingHistory = true[\s\S]*?isPersistingHistory = false/);
});

test("empty state and EyeDropper failures always expose a focused recovery", () => {
  assert.match(runtime, /state\.phase === "empty"\)[\s\S]*?pick-button"\]\.focus\(\)/);
  assert.match(runtime, /function showError[\s\S]*?state\.isPicking = false;[\s\S]*?error-action"\]\.focus\(\)/);
  assert.match(runtime, /finally \{\n\s+state\.isPicking = false;\n\s+render\(\);/);
});
