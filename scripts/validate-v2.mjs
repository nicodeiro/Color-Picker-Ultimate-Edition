import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const allowInactive = process.env.ALLOW_INACTIVE_V2 === "1";
const requiredFiles = [
  "manifest.json",
  "popup-v2.html",
  "popup-v2.css",
  "popup-v2.js",
  "vendor/lucide-icons.js",
  "vendor/LICENSE-lucide.txt",
  "icons/icon16.png",
  "icons/icon32.png",
  "icons/icon48.png",
  "icons/icon128.png"
];
const localeFiles = ["de", "en", "es", "fr", "ja", "pt_BR", "ru", "zh_CN"]
  .map((locale) => "_locales/" + locale + "/messages.json");
requiredFiles.push(...localeFiles);

const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

for (const relative of requiredFiles) {
  try {
    const metadata = await stat(path.join(root, relative));
    check(metadata.isFile(), "Required path is not a file: " + relative);
  } catch {
    failures.push("Missing required file: " + relative);
  }
}

const manifest = JSON.parse(await readFile(path.join(root, "manifest.json"), "utf8"));
check(manifest.manifest_version === 3, "Manifest must remain MV3");
check(
  allowInactive || (manifest.action && manifest.action.default_popup === "popup-v2.html"),
  "Manifest must activate popup-v2.html (set ALLOW_INACTIVE_V2=1 to validate the inactive experiment)"
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
check(!Object.hasOwn(manifest, "background"), "The uninstall-only service worker must remain detached");
check(
  manifest.content_security_policy
    && manifest.content_security_policy.extension_pages === "script-src 'self'; font-src 'self'; object-src 'none'",
  "Extension CSP must be self-only with object-src none"
);

for (const relative of localeFiles) {
  const messages = JSON.parse(await readFile(path.join(root, relative), "utf8"));
  check(
    messages.extensionName && messages.extensionName.message === "Color Picker Ultimate Edition",
    "Locale must use the exact product suffix: " + relative
  );
  const description = messages.extensionDescription && messages.extensionDescription.message;
  check(typeof description === "string" && description.length > 20, "Locale description is missing: " + relative);
  check(!/favorite|favourite|favori|favorit|favorito|收藏|お気に入り|избран/i.test(description), "Locale claims removed Favorites: " + relative);
}

const html = await readFile(path.join(root, "popup-v2.html"), "utf8");
const css = await readFile(path.join(root, "popup-v2.css"), "utf8");
const runtime = await readFile(path.join(root, "popup-v2.js"), "utf8");
const vendor = await readFile(path.join(root, "vendor/lucide-icons.js"), "utf8");
const combinedRuntime = [html, css, runtime, vendor].join("\n");

check(html.includes('src="popup-v2.js"'), "Popup must load the v2 module");
check(html.includes('href="popup-v2.css"'), "Popup must load the v2 stylesheet");
check(!/<script(?![^>]*\bsrc=)/i.test(html), "Inline scripts are forbidden");
check(!/<style[\s>]/i.test(html), "Inline styles are forbidden");
check(!/<a[\s>]/i.test(html), "The core surface must not contain external links");

const forbiddenRuntimePatterns = [
  [/\bfetch\s*\(/, "fetch"],
  [/\bXMLHttpRequest\b/, "XMLHttpRequest"],
  [/\bWebSocket\b/, "WebSocket"],
  [/\bEventSource\b/, "EventSource"],
  [/\bsendBeacon\s*\(/, "sendBeacon"],
  [/\beval\s*\(/, "eval"],
  [/\bnew\s+Function\b/, "new Function"],
  [/\.innerHTML\s*=/, "innerHTML"],
  [/\bdocument\.write\s*\(/, "document.write"],
  [/\bsetTimeout\s*\(/, "setTimeout"]
];

for (const [pattern, label] of forbiddenRuntimePatterns) {
  check(!pattern.test(combinedRuntime), "Forbidden runtime primitive: " + label);
}

check(!/DEFAULT_HISTORY|DEFAULT_COLOR/.test(runtime), "Seeded demonstration color/history is forbidden");
check(
  /new globalThis\.EyeDropper\(\)\.open\(\)/.test(runtime),
  "EyeDropper.open must be directly called from the trusted gesture path"
);
check(
  runtime.indexOf("new globalThis.EyeDropper().open()") < runtime.indexOf("const result = await pendingSelection"),
  "EyeDropper.open must occur before the first selection await"
);
check(!/clipboard\.writeText[\s\S]{0,120}persistHistory/.test(runtime), "Picking must never auto-copy");
check(/min-height:\s*44px/.test(css), "44 px control minimum is missing");
check(/min-height:\s*48px/.test(css), "48 px primary minimum is missing");
check(/width:\s*340px/.test(css) && /height:\s*470px/.test(css), "340×470 popup contract is missing");
check(/overflow-x:\s*hidden/.test(css), "Horizontal overflow must be blocked");
check(/prefers-reduced-motion:\s*reduce/.test(css), "Reduced-motion contract is missing");
check(/forced-colors:\s*active/.test(css), "Forced-colors fallback is missing");
check(!/\blinear-gradient\b|\bradial-gradient\b|box-shadow\s*:|filter\s*:\s*blur/.test(css), "Decorative gradient, shadow or blur is forbidden");

for (const name of ["Settings", "Copy", "CircleCheck", "X"]) {
  check(vendor.includes(name + ":"), "Missing vendored Lucide icon: " + name);
}

const secretPatterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\bghp_[A-Za-z0-9]{20,}\b/,
  /\bgithub_pat_[A-Za-z0-9_]{20,}\b/,
  /\bAIza[0-9A-Za-z_-]{30,}\b/,
  /\bsk-[A-Za-z0-9]{20,}\b/
];
for (const pattern of secretPatterns) {
  check(!pattern.test(combinedRuntime), "Potential secret detected in the active slice");
}

if (failures.length) {
  console.error("Color Picker v2 validation failed:");
  for (const failure of failures) console.error("- " + failure);
  process.exitCode = 1;
} else {
  console.log(`Color Picker v2 validation passed${allowInactive ? " (inactive experimental slice)" : ""}`);
  console.log("MV3 · storage only · zero hosts · self-only CSP · no network primitives");
}
