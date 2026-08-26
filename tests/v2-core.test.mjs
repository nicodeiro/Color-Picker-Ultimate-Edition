import test from "node:test";
import assert from "node:assert/strict";

import {
  classifyEyeDropperError,
  formatColor,
  hexToRgb,
  isValidHex,
  normalizeHex,
  normalizeHistory,
  resolveLanguage,
  resolveTheme,
  rgbToHsl
} from "../popup-v2.js";

test("six-digit HEX validation rejects fabricated or malformed values", () => {
  assert.equal(isValidHex("#F96B00"), true);
  assert.equal(isValidHex("#f96b00"), true);
  assert.equal(isValidHex("#FFF"), false);
  assert.equal(isValidHex("F96B00"), false);
  assert.equal(isValidHex(null), false);
});

test("HEX normalization is uppercase and fail-closed", () => {
  assert.equal(normalizeHex("#f96b00"), "#F96B00");
  assert.equal(normalizeHex("#f96b0z"), null);
});

test("history contains only real unique values in newest-first order", () => {
  assert.deepEqual(
    normalizeHistory(["#f96b00", "#F96B00", "invalid", "#000000", "#FFFFFF"], 10),
    ["#F96B00", "#000000", "#FFFFFF"]
  );
  assert.deepEqual(normalizeHistory(undefined), []);
  assert.equal(normalizeHistory(Array(20).fill("#F96B00")).length, 1);
});

test("canonical fixture converts exactly to its approved RGB and HSL values", () => {
  assert.deepEqual(hexToRgb("#F96B00"), { r: 249, g: 107, b: 0 });
  assert.deepEqual(rgbToHsl(249, 107, 0), { h: 26, s: 100, l: 49 });
  assert.deepEqual(formatColor("#F96B00"), {
    hex: "#F96B00",
    rgb: "249, 107, 0",
    hsl: "26°, 100%, 49%"
  });
});

test("achromatic conversion remains deterministic", () => {
  assert.deepEqual(rgbToHsl(0, 0, 0), { h: 0, s: 0, l: 0 });
  assert.deepEqual(rgbToHsl(255, 255, 255), { h: 0, s: 0, l: 100 });
});

test("locale resolution preserves the supported legacy identifiers", () => {
  assert.equal(resolveLanguage("pt_BR"), "pt");
  assert.equal(resolveLanguage("zh-CN"), "zh");
  assert.equal(resolveLanguage("fr-FR"), "fr");
  assert.equal(resolveLanguage("unknown"), "en");
});

test("theme resolution is closed to System, Light and Dark", () => {
  assert.equal(resolveTheme("system"), "system");
  assert.equal(resolveTheme("dark"), "dark");
  assert.equal(resolveTheme("midnight"), "system");
});

test("EyeDropper errors map to calm cancellation or bounded recovery", () => {
  assert.equal(classifyEyeDropperError({ name: "AbortError" }), "cancel");
  assert.equal(classifyEyeDropperError({ name: "NotAllowedError" }), "rejected");
  assert.equal(classifyEyeDropperError({ name: "InvalidStateError" }), "rejected");
  assert.equal(classifyEyeDropperError({ name: "OperationError" }), "operation");
  assert.equal(classifyEyeDropperError(new Error("unknown")), "operation");
});
