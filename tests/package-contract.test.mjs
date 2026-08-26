import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageSource = await readFile(new URL('../scripts/package-extension.mjs', import.meta.url), 'utf8');
const notices = await readFile(new URL('../THIRD_PARTY_NOTICES.md', import.meta.url), 'utf8');

test('release packaging uses a bounded runtime allowlist and audits license coverage', () => {
    assert.match(packageSource, /const ROOT_FILES = Object\.freeze/u);
    assert.match(packageSource, /const ROOT_DIRECTORIES = Object\.freeze\(\['_locales', 'assets\/fonts', 'icons', 'vendor'\]\)/u);
    assert.match(packageSource, /assets\/intelligence-ring\.png/u);
    assert.match(packageSource, /assets\/intelligence-ring-home-reflections-v1\.png/u);
    assert.match(packageSource, /assets\/intelligence-ring-wide-edge-reflections-v3\.png/u);
    assert.match(packageSource, /expectedFontLicenses = new Set/u);
    assert.match(packageSource, /missingFontLicenses/u);
    assert.match(packageSource, /vendor\/LICENSE-lucide\.txt/u);
    assert.match(packageSource, /incomplete Lucide notice or licence set/u);
    assert.doesNotMatch(packageSource, /fontLicenses\.length !== \d+/u);
    assert.match(packageSource, /ZIP content does not match the deterministic runtime allowlist/u);
    assert.match(packageSource, /LC_ALL: 'C'/u);
    assert.match(packageSource, /TZ: 'UTC'/u);
    assert.match(packageSource, /chmod\(join\(stageRoot, sourcePath\), 0o644\)/u);
    assert.doesNotMatch(packageSource, /localeCompare/u);
    assert.match(packageSource, /\.git\|qa\|tests\|scripts\|store-assets\|dist/u);
    assert.doesNotMatch(packageSource, /cp -R|zip -r \./u);
});

test('release ZIP is byte-identical across caller time zones', async () => {
    const tempRoot = await mkdtemp(join(tmpdir(), 'color-picker-package-test-'));
    const utcPath = join(tempRoot, 'utc.zip');
    const parisPath = join(tempRoot, 'paris.zip');
    try {
        const packageScript = fileURLToPath(new URL('../scripts/package-extension.mjs', import.meta.url));
        execFileSync(process.execPath, [packageScript, utcPath], {
            env: { ...process.env, TZ: 'UTC' },
            stdio: 'pipe'
        });
        execFileSync(process.execPath, [packageScript, parisPath], {
            env: { ...process.env, TZ: 'Europe/Paris' },
            stdio: 'pipe'
        });
        const [utcBytes, parisBytes] = await Promise.all([readFile(utcPath), readFile(parisPath)]);
        const digest = (bytes) => createHash('sha256').update(bytes).digest('hex');
        assert.equal(digest(utcBytes), digest(parisBytes));
        assert.deepEqual(utcBytes, parisBytes);
    } finally {
        await rm(tempRoot, { recursive: true, force: true });
    }
});

test('consolidated notices identify the local Lucide subset and bundled licence', () => {
    assert.match(notices, /## Lucide/u);
    assert.match(notices, /vendor\/LICENSE-lucide\.txt/u);
    assert.match(notices, /vendor\/lucide-icons\.js/u);
});
