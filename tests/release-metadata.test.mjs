import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const productName = 'Color Picker Ultimate Edition';
const localeIds = ['de', 'en', 'es', 'fr', 'ja', 'pt_BR', 'ru', 'zh_CN'];

const [manifest, packageManifest, popup, runtime, storeAssets, storeListing, ...locales] = await Promise.all([
    readFile(new URL('../manifest.json', import.meta.url), 'utf8').then(JSON.parse),
    readFile(new URL('../package.json', import.meta.url), 'utf8').then(JSON.parse),
    readFile(new URL('../popup.html', import.meta.url), 'utf8'),
    readFile(new URL('../popup.js', import.meta.url), 'utf8'),
    readFile(new URL('../store-assets/manifest.json', import.meta.url), 'utf8').then(JSON.parse),
    readFile(new URL('../store-listing/localized.md', import.meta.url), 'utf8'),
    ...localeIds.map((locale) => (
        readFile(new URL(`../_locales/${locale}/messages.json`, import.meta.url), 'utf8').then(JSON.parse)
    ))
]);

test('the 1.0.4 candidate uses one canonical product name and version', () => {
    assert.equal(manifest.version, '1.0.4');
    assert.equal(packageManifest.version, manifest.version);
    assert.equal(storeAssets.product, productName);
    assert.match(storeListing, new RegExp(`^# ${productName} — Chrome Web Store listing`, 'u'));
    assert.ok(storeListing.includes('Package version: `' + manifest.version + '`'));
    assert.ok(locales.every((messages) => messages.extensionName?.message === productName));
    assert.match(popup, new RegExp(`<title>${productName}</title>`, 'u'));
    assert.equal((runtime.match(new RegExp(`pageTitle: '${productName}'`, 'gu')) || []).length, localeIds.length);
});

test('the 32 px identity asset is declared for both extension and action', () => {
    assert.equal(manifest.icons?.['32'], 'icons/icon32.png');
    assert.equal(manifest.action?.default_icon?.['32'], 'icons/icon32.png');
});
