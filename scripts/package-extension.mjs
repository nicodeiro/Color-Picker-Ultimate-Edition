import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import {
    chmod,
    copyFile,
    lstat,
    mkdir,
    mkdtemp,
    readFile,
    readdir,
    rm,
    utimes,
    writeFile
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(SCRIPT_DIR, '..');
const manifest = JSON.parse(await readFile(join(PROJECT_ROOT, 'manifest.json'), 'utf8'));
const requestedOutput = process.argv[2];
const outputPath = requestedOutput
    ? resolve(PROJECT_ROOT, requestedOutput)
    : join(PROJECT_ROOT, 'dist', `color-picker-ultimate-edition-${manifest.version}.zip`);

// Runtime-only allowlist. In particular, this excludes Git data, QA captures,
// store media, source scripts, tests, old packages and macOS metadata.
const ROOT_FILES = Object.freeze([
    'THIRD_PARTY_NOTICES.md',
    'assets/intelligence-ring-home-reflections-v1.png',
    'assets/intelligence-ring-wide-edge-reflections-v3.png',
    'assets/intelligence-ring.png',
    'fonts.css',
    'manifest.json',
    'popup.html',
    'popup.js',
    'styles.css'
]);
const ROOT_DIRECTORIES = Object.freeze(['_locales', 'assets/fonts', 'icons', 'vendor']);
const FIXED_MTIME = new Date('1980-01-01T00:00:00.000Z');
const comparePaths = (left, right) => left < right ? -1 : left > right ? 1 : 0;

async function collectFiles(root, directory = root) {
    const entries = await readdir(directory, { withFileTypes: true });
    const files = [];
    for (const entry of entries.sort((a, b) => comparePaths(a.name, b.name))) {
        if (entry.name === '.DS_Store') continue;
        const absolutePath = join(directory, entry.name);
        const stat = await lstat(absolutePath);
        if (stat.isSymbolicLink()) throw new Error(`Symlinks are not allowed in the extension package: ${absolutePath}`);
        if (stat.isDirectory()) files.push(...await collectFiles(root, absolutePath));
        else if (stat.isFile()) files.push(relative(root, absolutePath));
    }
    return files;
}

async function copyAllowlistedSource(stageRoot) {
    for (const sourcePath of ROOT_FILES) {
        const source = join(PROJECT_ROOT, sourcePath);
        const target = join(stageRoot, sourcePath);
        await mkdir(dirname(target), { recursive: true });
        await copyFile(source, target);
    }
    for (const directory of ROOT_DIRECTORIES) {
        const sourceRoot = join(PROJECT_ROOT, directory);
        for (const sourcePath of await collectFiles(PROJECT_ROOT, sourceRoot)) {
            const source = join(PROJECT_ROOT, sourcePath);
            const target = join(stageRoot, sourcePath);
            await mkdir(dirname(target), { recursive: true });
            await copyFile(source, target);
        }
    }
}

async function normalizeTimestamps(stageRoot, files) {
    for (const sourcePath of files) {
        await chmod(join(stageRoot, sourcePath), 0o644);
        await utimes(join(stageRoot, sourcePath), FIXED_MTIME, FIXED_MTIME);
    }
}

function sha256(bytes) {
    return createHash('sha256').update(bytes).digest('hex');
}

const stageRoot = await mkdtemp(join(tmpdir(), 'color-picker-package-'));
try {
    await copyAllowlistedSource(stageRoot);
    const files = (await collectFiles(stageRoot)).sort(comparePaths);
    if (!files.includes('manifest.json') || !files.includes('popup.html')) {
        throw new Error('The staged extension is missing a required root file');
    }
    const fontLicenses = files.filter((file) => /^assets\/fonts\/interface\/[^/]+\/LICENSE$/u.test(file));
    const stagedFontsCss = await readFile(join(stageRoot, 'fonts.css'), 'utf8');
    const expectedFontLicenses = new Set(
        [...stagedFontsCss.matchAll(/assets\/fonts\/interface\/([^/]+)\//gu)]
            .map((match) => `assets/fonts/interface/${match[1]}/LICENSE`)
    );
    const missingFontLicenses = [...expectedFontLicenses]
        .filter((licensePath) => !fontLicenses.includes(licensePath));
    const stagedNotices = await readFile(join(stageRoot, 'THIRD_PARTY_NOTICES.md'), 'utf8');
    if (
        fontLicenses.length !== expectedFontLicenses.size
        || missingFontLicenses.length
        || !files.includes('THIRD_PARTY_NOTICES.md')
    ) {
        throw new Error(
            `The staged extension has an incomplete font notice set (${fontLicenses.length}/${expectedFontLicenses.size})`
        );
    }
    if (
        !files.includes('vendor/LICENSE-lucide.txt')
        || !files.includes('vendor/lucide-icons.js')
        || !/## Lucide/u.test(stagedNotices)
        || !/vendor\/LICENSE-lucide\.txt/u.test(stagedNotices)
    ) {
        throw new Error('The staged extension has an incomplete Lucide notice or licence set');
    }
    if (files.some((file) => /(^|\/)(?:\.git|qa|tests|scripts|store-assets|dist)(?:\/|$)|\.DS_Store$/u.test(file))) {
        throw new Error('A forbidden development artifact entered the staged extension');
    }

    await normalizeTimestamps(stageRoot, files);
    await mkdir(dirname(outputPath), { recursive: true });
    await rm(outputPath, { force: true });
    execFileSync('zip', ['-X', '-q', outputPath, '-@'], {
        cwd: stageRoot,
        input: `${files.join('\n')}\n`,
        env: {
            ...process.env,
            LC_ALL: 'C',
            TZ: 'UTC'
        }
    });

    const archivedFiles = execFileSync('unzip', ['-Z1', outputPath], { encoding: 'utf8' })
        .trim()
        .split('\n')
        .filter(Boolean)
        .sort(comparePaths);
    if (JSON.stringify(archivedFiles) !== JSON.stringify(files)) {
        throw new Error('ZIP content does not match the deterministic runtime allowlist');
    }

    const archive = await readFile(outputPath);
    const digest = sha256(archive);
    await writeFile(`${outputPath}.sha256`, `${digest}  ${outputPath.split('/').at(-1)}\n`, 'utf8');
    process.stdout.write(`${JSON.stringify({
        output: relative(PROJECT_ROOT, outputPath),
        bytes: archive.byteLength,
        sha256: digest,
        files: files.length,
        fontLicenses: fontLicenses.length
    })}\n`);
} finally {
    await rm(stageRoot, { recursive: true, force: true });
}
