import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const [html, css, fontsCss, popupSource, manifestSource, sourceDocument] = await Promise.all([
    readFile(new URL('../popup.html', import.meta.url), 'utf8'),
    readFile(new URL('../styles.css', import.meta.url), 'utf8'),
    readFile(new URL('../fonts.css', import.meta.url), 'utf8'),
    readFile(new URL('../popup.js', import.meta.url), 'utf8'),
    readFile(new URL('../manifest.json', import.meta.url), 'utf8'),
    readFile(new URL('../assets/fonts/interface/SOURCE.md', import.meta.url), 'utf8')
]);
const manifest = JSON.parse(manifestSource);
const fontImports = [...fontsCss.matchAll(/^@import url\("([^"]+)"\);$/gmu)]
    .map((match) => match[1]);

function styleBlocksFor(selector) {
    const matches = [];
    const blockPattern = /([^{}]+)\{([^{}]*)\}/gu;
    for (const match of css.matchAll(blockPattern)) {
        const selectors = match[1].split(',').map((candidate) => candidate.trim());
        if (selectors.includes(selector)) matches.push(match[2]);
    }
    return matches;
}

function assertRule(selector, declarations) {
    const blocks = styleBlocksFor(selector);
    assert.ok(blocks.length > 0, `Missing CSS rule for ${selector}`);
    assert.ok(
        blocks.some((block) => declarations.every((pattern) => pattern.test(block))),
        `${selector} does not contain the approved typography declarations`
    );
}

test('the extension exposes one fixed local Roboto typography system', async () => {
    assert.deepEqual(fontImports, [
        'assets/fonts/interface/roboto-flex/wght.css',
        'assets/fonts/interface/roboto-mono/wght.css'
    ]);
    assert.doesNotMatch(fontsCss, /https?:|data:|local\s*\(/u);

    const expectedFamilies = new Map([
        ['assets/fonts/interface/roboto-flex/wght.css', 'Roboto Flex Variable'],
        ['assets/fonts/interface/roboto-mono/wght.css', 'Roboto Mono Variable']
    ]);
    for (const importPath of fontImports) {
        const absoluteCssPath = resolve(projectRoot, importPath);
        await access(absoluteCssPath);
        const source = await readFile(absoluteCssPath, 'utf8');
        assert.match(source, new RegExp(`font-family: '${expectedFamilies.get(importPath)}'`, 'u'));
        assert.doesNotMatch(source, /https?:|data:|local\s*\(/u);

        const fontFiles = [...source.matchAll(/url\(\.\/files\/([^)]+\.woff2)\)/gu)];
        assert.equal(fontFiles.length, 4, `${importPath} must package four script subsets`);
        for (const match of fontFiles) {
            await access(resolve(absoluteCssPath, '..', 'files', match[1]));
        }
    }
});

test('Roboto provenance, checksums, licenses and CSP remain auditable', async () => {
    assert.equal((sourceDocument.match(/^## @fontsource-variable\//gmu) || []).length, 2);
    assert.match(sourceDocument, /@fontsource-variable\/roboto-flex@5\.3\.0/u);
    assert.match(sourceDocument, /@fontsource-variable\/roboto-mono@5\.3\.0/u);
    assert.match(sourceDocument, /No font is downloaded at runtime/u);
    assert.match(sourceDocument, /Japanese and Chinese text deliberately falls back/u);

    const licensePaths = [...sourceDocument.matchAll(/`(assets\/fonts\/interface\/[^`]+\/LICENSE)`/gu)]
        .map((match) => match[1]);
    assert.deepEqual(new Set(licensePaths), new Set([
        'assets/fonts/interface/roboto-flex/LICENSE',
        'assets/fonts/interface/roboto-mono/LICENSE'
    ]));
    for (const licensePath of licensePaths) {
        const license = await readFile(resolve(projectRoot, licensePath), 'utf8');
        assert.match(license, /SIL OPEN FONT LICENSE Version 1\.1/u);
    }

    const checksumRows = [...sourceDocument.matchAll(
        /^\| `(assets\/fonts\/interface\/[^`]+)` \| ([\d,]+) \| `([a-f0-9]{64})` \|$/gmu
    )];
    assert.equal(checksumRows.length, 14);
    for (const [, sourcePath, documentedBytes, documentedDigest] of checksumRows) {
        const bytes = await readFile(resolve(projectRoot, sourcePath));
        assert.equal(bytes.byteLength, Number(documentedBytes.replaceAll(',', '')), `${sourcePath} byte length`);
        assert.equal(createHash('sha256').update(bytes).digest('hex'), documentedDigest, `${sourcePath} SHA-256`);
    }

    assert.equal(
        manifest.content_security_policy?.extension_pages,
        "script-src 'self'; font-src 'self'; object-src 'none'"
    );
    assert.deepEqual(manifest.permissions, ['storage']);
});

test('fixed CSS roles use Roboto Flex for product UI and Roboto Mono for color data', () => {
    assert.match(css, /--font-display:\s*"Roboto Flex Variable"[^;]*;/u);
    assert.match(css, /--font-ui:\s*"Roboto Flex Variable"[^;]*;/u);
    assert.match(css, /--font-code:\s*"Roboto Mono Variable"[^;]*;/u);
    assert.doesNotMatch(css, new RegExp(`\\b${['Ge', 'ist'].join('')}\\b`, 'iu'));
    assert.match(
        css,
        /body,\s*button,\s*input,\s*select\s*\{[^}]*font-family:\s*var\(--font-ui\);/su
    );
    assert.match(css, /body\s*\{[^}]*font-synthesis:\s*none;/su);

    for (const selector of [
        '.current-format-value',
        '.saved-colors-section .history-label',
        '.saved-library-meta strong',
        '.saved-library-meta > span'
    ]) {
        assertRule(selector, [
            /font-family:\s*var\(--font-code\)/u,
            /font-variant-numeric:\s*tabular-nums/u
        ]);
    }
});

test('the retired typography selector has no DOM, CSS or active runtime surface', () => {
    assert.doesNotMatch(html, /interface-font-(?:control|trigger|panel|search|list|option|group)/u);
    assert.doesNotMatch(css, /\.interface-font-|data-interface-font/u);
    assert.doesNotMatch(popupSource, /font-presets|interface-font-(?:trigger|panel|search|list)|dataset\.interfaceFont/u);
    assert.doesNotMatch(popupSource, /closeInterfaceFontPicker/u);

    const legacyMentions = popupSource.match(/interfaceFont/gu) || [];
    assert.equal(legacyMentions.length, 1);
    assert.match(popupSource, /Object\.hasOwn\(result\.settings, 'interfaceFont'\)/u);
    assert.match(popupSource, /if \(hadLegacyInterfaceFont\) saveSettings\(\);/u);
    assert.match(
        popupSource,
        /return \{\s*language:[\s\S]*?theme:[\s\S]*?previewFont:[\s\S]*?customColors\s*\};/u
    );
    assert.doesNotMatch(
        html + css + popupSource,
        new RegExp(`\\b${['Ge', 'ist'].join('')}\\b`, 'iu')
    );
});

test('the Color Inspector keeps the approved restrained type hierarchy', () => {
    assertRule('.details-header h1', [
        /font-family:\s*var\(--font-display\)/u,
        /font-size:\s*16px/u,
        /font-weight:\s*650/u,
        /line-height:\s*20px/u,
        /letter-spacing:\s*-0\.025em/u
    ]);
    assertRule('.color-format-tab', [
        /font-size:\s*10px/u,
        /font-weight:\s*560/u,
        /line-height:\s*12px/u
    ]);
    assertRule('.color-format-tab.active', [/font-weight:\s*640/u]);
    assertRule('.current-format-value', [
        /font-family:\s*var\(--font-code\)/u,
        /font-size:\s*11px/u,
        /font-weight:\s*620/u,
        /line-height:\s*14px/u,
        /letter-spacing:\s*-0\.01em/u,
        /font-variant-numeric:\s*tabular-nums/u
    ]);
    for (const selector of [
        '.current-format-value[data-format="rgb"]',
        '.current-format-value[data-format="hsl"]'
    ]) {
        assertRule(selector, [/font-size:\s*10px/u, /line-height:\s*13px/u]);
    }
    assertRule('.saved-colors-title', [
        /font-family:\s*var\(--font-display\)/u,
        /font-size:\s*13px/u,
        /font-weight:\s*650/u,
        /line-height:\s*16px/u,
        /letter-spacing:\s*-0\.02em/u
    ]);
    assertRule('.saved-colors-more', [
        /font-size:\s*10\.5px/u,
        /font-weight:\s*520/u,
        /line-height:\s*14px/u,
        /letter-spacing:\s*-0\.01em/u
    ]);
    assertRule('.saved-colors-section .history-label', [
        /font-family:\s*var\(--font-code\)/u,
        /font-size:\s*10px/u,
        /font-weight:\s*620/u,
        /line-height:\s*12px/u,
        /letter-spacing:\s*0(?:;|\s)/u,
        /font-variant-numeric:\s*tabular-nums/u
    ]);
    assertRule('.history-new-color-label', [
        /font-size:\s*10px/u,
        /font-weight:\s*620/u,
        /line-height:\s*13px/u,
        /letter-spacing:\s*-0\.01em/u
    ]);
});

test('Tout voir preserves the approved readable hierarchy', () => {
    assertRule('.saved-library-header h1', [
        /font-family:\s*var\(--font-display\)/u,
        /font-size:\s*16px/u,
        /font-weight:\s*650/u,
        /line-height:\s*20px/u,
        /letter-spacing:\s*-0\.025em/u
    ]);
    assertRule('.saved-library-search input', [
        /font-size:\s*12px/u,
        /font-weight:\s*450/u,
        /line-height:\s*16px/u
    ]);
    assertRule('.saved-library-filter', [
        /font-size:\s*10px/u,
        /font-weight:\s*520/u,
        /line-height:\s*12px/u
    ]);
    assertRule('.saved-library-filter.active', [/font-weight:\s*620/u]);
    assertRule('.saved-library-sort select', [
        /font-size:\s*9\.5px/u,
        /font-weight:\s*520/u,
        /line-height:\s*12px/u
    ]);
    assertRule('.saved-library-meta strong', [
        /font-family:\s*var\(--font-code\)/u,
        /font-size:\s*10px/u,
        /font-weight:\s*620/u,
        /line-height:\s*12px/u,
        /font-variant-numeric:\s*tabular-nums/u
    ]);
    assertRule('.saved-library-meta > span', [
        /font-family:\s*var\(--font-code\)/u,
        /font-size:\s*8\.25px/u,
        /font-weight:\s*500/u,
        /line-height:\s*11px/u,
        /letter-spacing:\s*-0\.03em/u,
        /font-variant-numeric:\s*tabular-nums/u
    ]);
    assertRule('.saved-library-empty', [
        /font-size:\s*12px/u,
        /font-weight:\s*500/u,
        /line-height:\s*16px/u
    ]);
});
