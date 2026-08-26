import { spawn } from 'node:child_process';
import { mkdir, mkdtemp, realpath, rm, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import os from 'node:os';
import path from 'node:path';

const BRAVE_PATH = '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser';
const [url, outputPath, widthValue = '340', heightValue = '470', qaMode = 'capture'] = process.argv.slice(2);
const extensionDir = process.env.BRAVE_EXTENSION_DIR
    ? await realpath(path.resolve(process.env.BRAVE_EXTENSION_DIR))
    : null;
const qaSourceSha256 = /^[a-f0-9]{64}$/u.test(process.env.QA_SOURCE_SHA256 || '')
    ? process.env.QA_SOURCE_SHA256
    : null;
const supportedLocales = ['fr', 'en', 'es', 'de', 'pt', 'ru', 'ja', 'zh'];
const qaModeTokens = qaMode.split('-');
const requestedLocale = supportedLocales.find((locale) => qaModeTokens.includes(locale)) || 'fr';
const requestedTheme = qaModeTokens.includes('dark') ? 'dark' : 'light';
const emulatedMediaFeatures = [];
if (qaMode.includes('-reduced-motion-')) {
    emulatedMediaFeatures.push({ name: 'prefers-reduced-motion', value: 'reduce' });
}
if (qaMode.includes('-forced-colors-')) {
    emulatedMediaFeatures.push({ name: 'forced-colors', value: 'active' });
}

if (!url || !outputPath) {
    console.error('Usage: node scripts/capture-brave-qa.mjs <url> <output.png> [width] [height]');
    process.exit(1);
}

const width = Number.parseInt(widthValue, 10);
const height = Number.parseInt(heightValue, 10);
if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1) {
    console.error('Width and height must be positive integers.');
    process.exit(1);
}

const profileDir = await mkdtemp(path.join(os.tmpdir(), 'bitek-brave-qa-'));
const browserArguments = [
    '--headless=new',
    '--remote-debugging-pipe',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-background-networking',
    '--disable-default-apps',
    '--disable-sync',
    '--disable-gpu',
    `--user-data-dir=${profileDir}`
];
if (extensionDir) {
    browserArguments.push(`--disable-extensions-except=${extensionDir}`, `--load-extension=${extensionDir}`);
}
browserArguments.push('about:blank');

const browser = spawn(BRAVE_PATH, browserArguments, {
    stdio: ['ignore', 'ignore', 'pipe', 'pipe', 'pipe']
});

let stderr = '';
browser.stderr.setEncoding('utf8');
browser.stderr.on('data', (chunk) => {
    stderr += chunk;
});

let nextId = 0;
let receiveBuffer = Buffer.alloc(0);
const pending = new Map();
const eventWaiters = new Map();
const observedEvents = [];

function dispatch(message) {
    if (message.id) {
        const request = pending.get(message.id);
        if (!request) return;
        pending.delete(message.id);
        clearTimeout(request.timeout);
        if (message.error) request.reject(new Error(message.error.message));
        else request.resolve(message.result || {});
        return;
    }

    observedEvents.push(message);

    const key = `${message.sessionId || 'browser'}:${message.method}`;
    const waiters = eventWaiters.get(key);
    if (!waiters || !waiters.length) return;
    const waiter = waiters.shift();
    clearTimeout(waiter.timeout);
    waiter.resolve(message.params || {});
    if (!waiters.length) eventWaiters.delete(key);
}

browser.stdio[4].on('data', (chunk) => {
    receiveBuffer = Buffer.concat([receiveBuffer, chunk]);
    let separator = receiveBuffer.indexOf(0);
    while (separator !== -1) {
        const packet = receiveBuffer.subarray(0, separator).toString('utf8');
        receiveBuffer = receiveBuffer.subarray(separator + 1);
        if (packet) dispatch(JSON.parse(packet));
        separator = receiveBuffer.indexOf(0);
    }
});

function send(method, params = {}, sessionId) {
    const id = ++nextId;
    const payload = { id, method, params };
    if (sessionId) payload.sessionId = sessionId;

    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            pending.delete(id);
            reject(new Error(`Timed out waiting for ${method}`));
        }, method === 'Runtime.evaluate' ? 30000 : 12000);
        pending.set(id, { resolve, reject, timeout });
        browser.stdio[3].write(`${JSON.stringify(payload)}\0`);
    });
}

function waitForEvent(method, sessionId, timeoutMs = 12000) {
    const key = `${sessionId || 'browser'}:${method}`;
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            const remaining = (eventWaiters.get(key) || []).filter((entry) => entry.resolve !== resolve);
            if (remaining.length) eventWaiters.set(key, remaining);
            else eventWaiters.delete(key);
            reject(new Error(`Timed out waiting for ${method}`));
        }, timeoutMs);
        const waiters = eventWaiters.get(key) || [];
        waiters.push({ resolve, reject, timeout });
        eventWaiters.set(key, waiters);
    });
}

async function shutdown() {
    if (browser.exitCode === null) {
        await new Promise((resolve) => {
            const timeout = setTimeout(resolve, 1200);
            browser.once('exit', () => {
                clearTimeout(timeout);
                resolve();
            });
            browser.kill('SIGTERM');
        });
    }
    for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
            await rm(profileDir, { recursive: true, force: true });
            break;
        } catch (error) {
            if (error.code !== 'ENOTEMPTY' || attempt === 2) throw error;
            await new Promise((resolve) => setTimeout(resolve, 120));
        }
    }
}

function extensionIdForPath(directory) {
    const digest = createHash('sha256').update(directory).digest().subarray(0, 16);
    return Array.from(digest)
        .flatMap((byte) => [byte >> 4, byte & 15])
        .map((nibble) => String.fromCharCode('a'.charCodeAt(0) + nibble))
        .join('');
}

try {
    const browserVersion = await send('Browser.getVersion');
    let targetUrl = url;
    let extensionId = null;
    let serviceWorkerDetected = false;
    if (extensionDir && targetUrl.includes('__AUTO__')) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const { targetInfos = [] } = await send('Target.getTargets');
        const extensionTarget = targetInfos.find((target) => target.url.startsWith('chrome-extension://'));
        extensionId = extensionTarget
            ? new URL(extensionTarget.url).host
            : extensionIdForPath(extensionDir);
        serviceWorkerDetected = targetInfos.some((target) => (
            target.type === 'service_worker'
            && target.url.startsWith(`chrome-extension://${extensionId}/`)
        ));
        targetUrl = targetUrl.replace('__AUTO__', extensionId);
    }
    let { targetId } = await send('Target.createTarget', { url: 'about:blank' });
    let { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
    const primaryTargetId = targetId;

    await send('Page.enable', {}, sessionId);
    await send('Runtime.enable', {}, sessionId);
    await send('Log.enable', {}, sessionId);
    await send('Network.enable', {}, sessionId);
    await send('Emulation.setDeviceMetricsOverride', {
        width,
        height,
        deviceScaleFactor: 1,
        mobile: false,
        screenWidth: width,
        screenHeight: height
    }, sessionId);
    if (emulatedMediaFeatures.length) {
        await send('Emulation.setEmulatedMedia', { features: emulatedMediaFeatures }, sessionId);
    }

    const loaded = waitForEvent('Page.loadEventFired', sessionId);
    await send('Page.navigate', { url: targetUrl }, sessionId);
    await loaded;
    await send('Runtime.evaluate', {
        expression: `Promise.all([
            document.fonts.ready,
            document.fonts.load('650 16px "Roboto Flex Variable"', 'Color Picker'),
            document.fonts.load('620 10px "Roboto Mono Variable"', '#F96B00')
        ]).then(() => new Promise((resolve) => setTimeout(resolve, 250)))`,
        awaitPromise: true,
        returnByValue: true
    }, sessionId);

    let qaResults = null;
    let actionPopupProbe = null;
    let legacySettingsProbe = null;
    let runtimeMode = qaMode.startsWith('new-color-library-')
        ? 'new-color-library'
        : qaMode.startsWith('new-color-functional-')
            ? 'new-color-functional'
            : qaMode.startsWith('new-color-inline-')
                ? 'new-color-inline'
                : qaMode;
    if (qaMode.startsWith('action-') && qaMode !== 'action-probe') {
        if (!extensionDir) throw new Error('Action-popup QA requires BRAVE_EXTENSION_DIR.');
        if (
            qaMode === 'action-target-light'
            || qaMode === 'action-target-dark'
            || qaMode === 'action-user-reference-light'
            || qaMode.startsWith('action-inspector-')
            || qaMode.startsWith('action-new-color-')
            || qaMode.startsWith('action-open-library-')
            || qaMode.startsWith('action-home-')
            || qaMode.startsWith('action-settings-')
        ) {
            await send('Runtime.evaluate', {
                expression: `new Promise((resolve) => {
                    chrome.storage.local.set({
                        colorHistory: ${qaMode === 'action-user-reference-light'
                            ? `[
                                '#0F7BFF', '#F96B00', '#2F853D', '#08274D', '#6D7278',
                                '#24292F', '#000000', '#2563EB', '#7C3AED', '#FF3B5F'
                            ]`
                            : qaMode.includes('-summary-')
                                ? `[
                                    '#F06800', '#0F7BFF', '#F96B00', '#2F853D',
                                    '#08274D', '#FFFFFF', '#000000', '#2563EB'
                                ]`
                            : `[
                                '#F96B00', '#6FA8F5', '#17191F', '#C764D5',
                                '#FFFFFF', '#34C759', '#FF375F', '#FFD60A'
                            ]`},
                        favoriteColors: [],
                        settings: {
                            theme: ${JSON.stringify(requestedTheme)},
                            language: ${JSON.stringify(requestedLocale)}${qaMode.includes('-legacy-') ? `,
                            interfaceFont: 'unbounded',
                            previewFont: 'system',
                            customColors: {
                                bgColor: '#FFFFFF',
                                cardColor: '#F3F4F6',
                                textColor: '#1F2937',
                                accentColor: '#2563EB'
                            }` : ''}
                        }
                    }, resolve);
                })`,
                awaitPromise: true,
                returnByValue: true
            }, sessionId);
        }

        const beforeTargets = (await send('Target.getTargets')).targetInfos || [];
        const openResult = await send('Runtime.evaluate', {
            expression: `chrome.action.openPopup()
                .then(() => ({ ok: true }))
                .catch((error) => ({ ok: false, message: error.message }))`,
            awaitPromise: true,
            returnByValue: true
        }, sessionId);
        await new Promise((resolve) => setTimeout(resolve, 350));
        const afterTargets = (await send('Target.getTargets')).targetInfos || [];
        const newTargets = afterTargets.filter((target) => (
            !beforeTargets.some((before) => before.targetId === target.targetId)
            && target.url === targetUrl
        ));
        actionPopupProbe = {
            result: openResult.result.value,
            newTargets: newTargets.map((target) => ({
                targetId: target.targetId,
                type: target.type,
                url: target.url,
                title: target.title
            }))
        };
        if (!openResult.result.value?.ok || !newTargets.length) {
            throw new Error(`Unable to open the native action popup: ${JSON.stringify(actionPopupProbe)}`);
        }

        targetId = newTargets[0].targetId;
        ({ sessionId } = await send('Target.attachToTarget', { targetId, flatten: true }));
        await send('Page.enable', {}, sessionId);
        await send('Runtime.enable', {}, sessionId);
        await send('Log.enable', {}, sessionId);
        await send('Network.enable', {}, sessionId);
        if (emulatedMediaFeatures.length) {
            await send('Emulation.setEmulatedMedia', { features: emulatedMediaFeatures }, sessionId);
        }
        const popupReloaded = waitForEvent('Page.loadEventFired', sessionId);
        await send('Page.reload', {}, sessionId);
        await popupReloaded;
        await send('Runtime.evaluate', {
            expression: `Promise.all([
                document.fonts.ready,
                document.fonts.load('650 16px "Roboto Flex Variable"', 'Color Picker'),
                document.fonts.load('620 10px "Roboto Mono Variable"', '#F96B00')
            ]).then(() => new Promise((resolve) => setTimeout(resolve, 250)))`,
            awaitPromise: true,
            returnByValue: true
        }, sessionId);
        runtimeMode = qaMode.startsWith('action-target-')
            ? requestedTheme === 'dark' ? 'open-library-dark' : 'open-library'
            : qaMode === 'action-user-reference-light'
                ? 'open-library'
            : qaMode.startsWith('action-inspector-')
                ? 'inspector'
                : qaMode.startsWith('action-new-color-library-')
                    ? 'new-color-library'
                    : qaMode.startsWith('action-new-color-functional-')
                        ? 'new-color-functional'
                        : qaMode.startsWith('action-new-color-')
                            ? 'new-color-inline'
                : qaMode.startsWith('action-open-library-')
                    ? requestedTheme === 'dark' ? 'open-library-dark' : 'open-library'
                    : qaMode.replace(/^action-/, '');
    }
    if (qaMode === 'action-probe') {
        const beforeTargets = (await send('Target.getTargets')).targetInfos || [];
        const openResult = await send('Runtime.evaluate', {
            expression: `chrome.action.openPopup()
                .then(() => ({ ok: true }))
                .catch((error) => ({ ok: false, message: error.message }))`,
            awaitPromise: true,
            returnByValue: true
        }, sessionId);
        await new Promise((resolve) => setTimeout(resolve, 500));
        const afterTargets = (await send('Target.getTargets')).targetInfos || [];
        actionPopupProbe = {
            result: openResult.result.value,
            newTargets: afterTargets
                .filter((target) => !beforeTargets.some((before) => before.targetId === target.targetId))
                .map((target) => ({
                    targetId: target.targetId,
                    type: target.type,
                    url: target.url,
                    title: target.title
                }))
        };
    }
    if (runtimeMode === 'open-library-dark' && !qaMode.startsWith('action-')) {
        await send('Runtime.evaluate', {
            expression: `new Promise((resolve) => {
                chrome.storage.local.set({ settings: { theme: 'dark' } }, resolve);
            })`,
            awaitPromise: true,
            returnByValue: true
        }, sessionId);
        const reloaded = waitForEvent('Page.loadEventFired', sessionId);
        await send('Page.reload', {}, sessionId);
        await reloaded;
        await send('Runtime.evaluate', {
            expression: `Promise.all([
                document.fonts.ready,
                document.fonts.load('650 16px "Roboto Flex Variable"', 'Color Picker'),
                document.fonts.load('620 10px "Roboto Mono Variable"', '#F96B00')
            ]).then(() => new Promise((resolve) => setTimeout(resolve, 250)))`,
            awaitPromise: true,
            returnByValue: true
        }, sessionId);
    }
    if (runtimeMode === 'open-library' || runtimeMode === 'open-library-dark') {
        await send('Runtime.evaluate', {
            expression: `(async () => {
                const nextFrame = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
                if (document.querySelector('#details-view').classList.contains('hidden')) {
                    document.querySelector('#history-open-btn').click();
                    await nextFrame();
                }
                document.querySelector('#saved-colors-more').click();
                await nextFrame();
            })()`,
            awaitPromise: true,
            returnByValue: true
        }, sessionId);
        if (qaMode.startsWith('action-target-')) {
            await send('Runtime.evaluate', {
                expression: 'document.activeElement?.blur()',
                returnByValue: true
            }, sessionId);
        }
        if (qaMode === 'action-user-reference-light') {
            await send('Runtime.evaluate', {
                expression: `(async () => {
                    const nextFrame = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
                    const blueCard = Array.from(document.querySelectorAll('.saved-library-card'))
                        .find((card) => card.querySelector('strong')?.textContent === '#0F7BFF');
                    blueCard.querySelector('.saved-library-color-button').click();
                    await nextFrame();
                    document.querySelector('#saved-colors-more').click();
                    await nextFrame();
                })()`,
                awaitPromise: true,
                returnByValue: true
            }, sessionId);
        }
    }
    if (runtimeMode === 'inspector') {
        await send('Runtime.evaluate', {
            expression: `(async () => {
                const nextFrame = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
                if (document.querySelector('#details-view').classList.contains('hidden')) {
                    document.querySelector('#history-open-btn').click();
                    await nextFrame();
                }
                const orangeButton = Array.from(document.querySelectorAll('.history-color-button'))
                    .find((button) => button.title === '#F96B00');
                orangeButton?.click();
                await nextFrame();
                const requestedFormat = '${qaMode.includes('-rgb-') ? 'rgb' : qaMode.includes('-hsl-') ? 'hsl' : 'hex'}';
                document.querySelector('[data-color-format="' + requestedFormat + '"]')?.click();
                await nextFrame();
                await new Promise((resolve) => setTimeout(resolve, 180));
                if (${qaMode.includes('-focus-saved-') ? 'true' : 'false'}) {
                    document.querySelector('.history-card.active .history-color-button')?.focus();
                } else if (${qaMode.includes('-focus-copy-') ? 'true' : 'false'}) {
                    document.querySelector('#hero-copy-btn')?.focus();
                } else {
                    document.activeElement?.blur();
                }
            })()`,
            awaitPromise: true,
            returnByValue: true
        }, sessionId);
    }
    if (runtimeMode === 'new-color-inline' || runtimeMode === 'new-color-library' || runtimeMode === 'new-color-functional') {
        await send('Runtime.evaluate', {
            expression: `(async () => {
                const nextFrame = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
                if (document.querySelector('#details-view').classList.contains('hidden')) {
                    document.querySelector('#history-open-btn').click();
                    await nextFrame();
                }
                if ('${runtimeMode}' === 'new-color-library') {
                    document.querySelector('#saved-colors-more').click();
                    await nextFrame();
                    document.querySelector('#saved-library-add').click();
                } else {
                    document.querySelector('.history-new-color').click();
                }
                await nextFrame();

                if (${qaMode.includes('-invalid-') ? 'true' : 'false'}) {
                    const input = document.querySelector('#new-color-hex');
                    input.value = '#12';
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    input.focus();
                    await nextFrame();
                } else if (${qaMode.includes('-rgb-') ? 'true' : 'false'}) {
                    document.querySelector('[data-new-color-format="rgb"]').click();
                    const red = document.querySelector('#new-color-r');
                    const green = document.querySelector('#new-color-g');
                    const blue = document.querySelector('#new-color-b');
                    red.value = '18';
                    green.value = '52';
                    blue.value = '86';
                    blue.dispatchEvent(new Event('input', { bubbles: true }));
                    await nextFrame();
                    document.activeElement?.blur();
                } else {
                    document.activeElement?.blur();
                }
            })()`,
            awaitPromise: true,
            returnByValue: true
        }, sessionId);
    }
    if (runtimeMode === 'new-color-functional') {
        const validation = await send('Runtime.evaluate', {
            expression: `(async () => {
                const nextFrame = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
                const storageGet = (keys) => new Promise((resolve) => chrome.storage.local.get(keys, resolve));
                const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
                const history = async () => (await storageGet(['colorHistory'])).colorHistory || [];
                const setHex = async (value) => {
                    const input = document.querySelector('#new-color-hex');
                    input.value = value;
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                    await nextFrame();
                };
                const results = {};
                const originalHistory = await history();
                const heroBefore = document.querySelector('#hero-swatch').getBoundingClientRect();

                results.editorOpenedInline = document.querySelector('#details-view').classList.contains('is-creating-color')
                    && !document.querySelector('#new-color-editor').classList.contains('hidden');
                results.nativePickerAbsent = !document.querySelector('#manual-color-input')
                    && !Array.from(document.querySelectorAll('input[type="color"]')).some((input) => input.closest('#new-color-editor'));
                results.draftStartsCurrent = document.querySelector('#new-color-hex').value === '#F96B00';
                results.hiddenInspectorControlsNotTabbable = document.querySelector('.current-color-summary').offsetParent === null
                    && document.querySelector('.saved-colors-section').offsetParent === null;

                await setHex('#123456');
                results.hexRgbHslSync = document.querySelector('#current-color-hex').textContent === '#123456'
                    && document.querySelector('#new-color-r').value === '18'
                    && document.querySelector('#new-color-g').value === '52'
                    && document.querySelector('#new-color-b').value === '86'
                    && document.querySelector('#new-color-h').value === '210'
                    && document.querySelector('#new-color-s').value === '65'
                    && document.querySelector('#new-color-l').value === '20';
                results.noStorageBeforeSave = JSON.stringify(await history()) === JSON.stringify(originalHistory);

                await setHex('#12');
                results.invalidDisablesSave = document.querySelector('#new-color-hex').getAttribute('aria-invalid') === 'true'
                    && document.querySelector('#new-color-save').disabled
                    && document.querySelector('#current-color-hex').textContent === '#123456';
                await setHex('#123456');

                const beforeKeyboard = document.querySelector('#current-color-hex').textContent;
                document.querySelector('#new-color-sv').dispatchEvent(new KeyboardEvent('keydown', {
                    key: 'ArrowLeft', shiftKey: true, bubbles: true
                }));
                await nextFrame();
                results.svKeyboardUpdatesDraft = document.querySelector('#current-color-hex').textContent !== beforeKeyboard;
                results.keyboardStillDoesNotStore = JSON.stringify(await history()) === JSON.stringify(originalHistory);
                await setHex('#123456');

                document.querySelector('#new-color-save').click();
                await nextFrame();
                await wait(80);
                const afterSave = await history();
                results.saveReturnsInspector = !document.querySelector('#details-view').classList.contains('is-creating-color')
                    && !document.querySelector('#details-view').classList.contains('hidden');
                results.savePersistsUniqueFirst = afterSave[0] === '#123456'
                    && afterSave.filter((value) => value === '#123456').length === 1;
                results.saveSelectsColor = document.querySelector('#current-color-hex').textContent === '#123456'
                    && document.querySelector('.history-card.active .history-label')?.textContent === '#123456';
                results.saveRestoresFocus = document.activeElement?.classList.contains('history-color-button') === true;

                document.querySelector('.history-new-color').click();
                await nextFrame();
                await setHex('#123456');
                document.querySelector('#new-color-save').click();
                await nextFrame();
                await wait(80);
                const afterDuplicate = await history();
                results.duplicateStaysUnique = afterDuplicate.length === afterSave.length
                    && afterDuplicate.filter((value) => value === '#123456').length === 1;

                document.querySelector('.history-new-color').click();
                await nextFrame();
                await setHex('#654321');
                const beforeCancelStorage = await history();
                document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
                await nextFrame();
                results.escapeCancelsDraft = document.querySelector('#current-color-hex').textContent === '#123456'
                    && JSON.stringify(await history()) === JSON.stringify(beforeCancelStorage)
                    && document.activeElement?.classList.contains('history-new-color') === true;

                document.querySelector('#saved-colors-more').click();
                await nextFrame();
                document.querySelector('#saved-library-add').click();
                await nextFrame();
                await setHex('#ABCDEF');
                document.querySelector('#new-color-save').click();
                await nextFrame();
                await wait(80);
                const afterLibrarySave = await history();
                results.libraryOriginReturnsLibrary = !document.querySelector('#saved-library-view').classList.contains('hidden')
                    && document.querySelector('#new-color-editor').classList.contains('hidden')
                    && document.activeElement?.classList.contains('saved-library-color-button') === true;
                results.librarySavePersists = afterLibrarySave[0] === '#ABCDEF'
                    && afterLibrarySave.filter((value) => value === '#ABCDEF').length === 1;

                document.querySelector('#saved-library-add').click();
                await nextFrame();
                await setHex('#F96B00');
                document.activeElement?.blur();
                const heroAfter = document.querySelector('#hero-swatch').getBoundingClientRect();
                results.heroInvariant = ['x', 'y', 'width', 'height'].every((key) => Math.abs(heroBefore[key] - heroAfter[key]) <= 0.5)
                    && heroAfter.x === 111 && heroAfter.y === 74 && heroAfter.width === 118 && heroAfter.height === 118;
                results.noHorizontalOverflow = document.documentElement.scrollWidth === window.innerWidth;
                return results;
            })()`,
            awaitPromise: true,
            returnByValue: true
        }, sessionId);
        qaResults = validation.result.value;
        const failedChecks = Object.entries(qaResults).filter(([, passed]) => passed !== true);
        if (failedChecks.length) {
            throw new Error(`Integrated new-color Brave QA failed: ${failedChecks.map(([name]) => name).join(', ')}`);
        }
    }
    if (runtimeMode.startsWith('settings-')) {
        await send('Runtime.evaluate', {
            expression: `(async () => {
                const nextFrame = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
                document.querySelector('.settings-trigger')?.click();
                await nextFrame();
                document.activeElement?.blur();
            })()`,
            awaitPromise: true,
            returnByValue: true
        }, sessionId);
    }
    if (runtimeMode === 'saved-library') {
        const validation = await send('Runtime.evaluate', {
            expression: `(async () => {
                const nextFrame = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
                const cards = () => Array.from(document.querySelectorAll('.saved-library-card'));
                const cardHexes = () => cards().map((card) => card.querySelector('strong')?.textContent || '');
                const results = {};

                if (document.querySelector('#details-view').classList.contains('hidden')) {
                    document.querySelector('#history-open-btn').click();
                    await nextFrame();
                }
                document.querySelector('#saved-colors-more').click();
                await nextFrame();
                results.opensDedicatedView = !document.querySelector('#saved-library-view').classList.contains('hidden');
                results.focusesSearch = document.activeElement?.id === 'saved-library-search-input';
                results.chromeStorageAvailable = Boolean(globalThis.chrome?.storage?.local);
                results.actionOpenPopupAvailable = typeof globalThis.chrome?.action?.openPopup === 'function';
                const manifest = globalThis.chrome?.runtime?.getManifest?.() || null;
                results.manifestV3 = manifest ? manifest.manifest_version === 3 : null;
                results.storageOnlyPermission = manifest
                    ? JSON.stringify(manifest.permissions || []) === JSON.stringify(['storage'])
                    : null;

                const initialHexes = cardHexes();

                const search = document.querySelector('#saved-library-search-input');
                search.value = '#f9';
                search.dispatchEvent(new Event('input', { bubbles: true }));
                results.searchIgnoresHashAndCase = cardHexes().join(',') === '#F96B00';
                search.value = '#ABCDEF';
                search.dispatchEvent(new Event('input', { bubbles: true }));
                results.noSearchResultState = cards().length === 0
                    && Boolean(document.querySelector('.saved-library-empty')?.textContent.trim());
                search.value = '';
                search.dispatchEvent(new Event('input', { bubbles: true }));

                const allFilter = document.querySelector('[data-library-filter="history"]');
                const favoritesFilter = document.querySelector('[data-library-filter="favorites"]');
                favoritesFilter.click();
                results.emptyFavoritesState = cards().length === 0
                    && Boolean(document.querySelector('.saved-library-empty')?.textContent.trim());
                allFilter.click();
                const selectedFavorite = document.querySelector('.saved-library-card.active .saved-library-favorite');
                selectedFavorite.click();
                await nextFrame();
                favoritesFilter.click();
                results.favoriteFilterIsActionable = cardHexes().includes('#F96B00');

                allFilter.click();
                const sort = document.querySelector('#saved-library-sort-select');
                sort.value = 'oldest';
                sort.dispatchEvent(new Event('change', { bubbles: true }));
                results.oldestSortWorks = cardHexes()[0] === initialHexes.at(-1);
                sort.value = 'hex';
                sort.dispatchEvent(new Event('change', { bubbles: true }));
                results.hexSortWorks = cardHexes()[0] === initialHexes.slice().sort((a, b) => a.localeCompare(b))[0];
                sort.value = 'recent';
                sort.dispatchEvent(new Event('change', { bubbles: true }));

                const historyBeforeSelection = Array.from(document.querySelectorAll('#color-history .history-label'))
                    .map((label) => label.textContent);
                const selectedCandidate = initialHexes.find((hex) => hex !== '#F96B00');
                const blueCard = cards().find((card) => card.querySelector('strong')?.textContent === selectedCandidate);
                blueCard.querySelector('.saved-library-color-button').click();
                await nextFrame();
                const historyAfterSelection = Array.from(document.querySelectorAll('#color-history .history-label'))
                    .map((label) => label.textContent);
                results.selectionReturnsToInspector = document.querySelector('#saved-library-view').classList.contains('hidden')
                    && document.querySelector('#current-color-hex').textContent === selectedCandidate;
                results.selectionDoesNotReorderHistory = JSON.stringify(historyBeforeSelection) === JSON.stringify(historyAfterSelection);
                results.selectionHasNoCheck = !document.querySelector('.saved-library-card.active [data-lucide-icon="CircleCheck"]');

                document.querySelector('#saved-colors-more').click();
                await nextFrame();
                document.querySelector('#saved-library-back').click();
                await nextFrame();
                results.backRestoresFocus = document.activeElement?.id === 'saved-colors-more';

                document.querySelector('#saved-colors-more').click();
                await nextFrame();
                document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
                await nextFrame();
                results.escapeRestoresFocus = document.activeElement?.id === 'saved-colors-more';

                document.querySelector('#saved-colors-more').click();
                await nextFrame();
                allFilter.focus();
                allFilter.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
                await nextFrame();
                results.filterKeyboardNavigation = favoritesFilter.getAttribute('aria-selected') === 'true'
                    && document.activeElement === favoritesFilter;
                allFilter.click();

                const beforeManualPicker = cardHexes();
                document.querySelector('#saved-library-add').click();
                await nextFrame();
                results.addUsesIntegratedEditor = document.querySelector('#details-view').classList.contains('is-creating-color')
                    && !document.querySelector('#new-color-editor').classList.contains('hidden')
                    && !document.querySelector('#manual-color-input');
                const draftInput = document.querySelector('#new-color-hex');
                draftInput.value = '#654321';
                draftInput.dispatchEvent(new Event('input', { bubbles: true }));
                document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
                await nextFrame();
                results.manualCancelLeavesState = !document.querySelector('#saved-library-view').classList.contains('hidden')
                    && JSON.stringify(beforeManualPicker) === JSON.stringify(cardHexes());

                document.querySelector('#saved-library-add').click();
                await nextFrame();
                draftInput.value = '#123456';
                draftInput.dispatchEvent(new Event('input', { bubbles: true }));
                document.querySelector('#new-color-save').click();
                await nextFrame();
                const afterManualChoice = cardHexes();
                results.manualChoicePersistsUnique = afterManualChoice[0] === '#123456'
                    && afterManualChoice.filter((hex) => hex === '#123456').length === 1;

                const grid = document.querySelector('#saved-library-grid');
                results.noHorizontalOverflow = document.documentElement.scrollWidth === window.innerWidth
                    && grid.scrollWidth === grid.clientWidth;
                results.verticalLibraryScroll = getComputedStyle(grid).overflowY === 'auto';
                results.cardsExposePressedState = cards().every((card) => card.querySelector('.saved-library-color-button')?.hasAttribute('aria-pressed'));

                sort.value = 'recent';
                sort.dispatchEvent(new Event('change', { bubbles: true }));
                return results;
            })()`,
            awaitPromise: true,
            returnByValue: true
        }, sessionId);
        qaResults = validation.result.value;
        const failedChecks = Object.entries(qaResults)
            .filter(([name, passed]) => name !== 'chromeStorageAvailable' && passed !== true);
        if (extensionDir && qaResults.chromeStorageAvailable !== true) {
            failedChecks.push(['chromeStorageAvailable', false]);
        }
        if (extensionDir && qaResults.manifestV3 !== true) {
            failedChecks.push(['manifestV3', false]);
        }
        if (extensionDir && qaResults.storageOnlyPermission !== true) {
            failedChecks.push(['storageOnlyPermission', false]);
        }
        if (extensionDir && qaResults.actionOpenPopupAvailable !== true) {
            failedChecks.push(['actionOpenPopupAvailable', false]);
        }
        if (failedChecks.length) {
            throw new Error(`Saved-library Brave QA failed: ${failedChecks.map(([name]) => name).join(', ')}`);
        }
    }

    if (qaMode.includes('-legacy-')) {
        const legacyProbe = await send('Runtime.evaluate', {
            expression: `new Promise((resolve) => {
                chrome.storage.local.get(['settings'], ({ settings }) => resolve({
                    interfaceFontPurged: !Object.prototype.hasOwnProperty.call(settings || {}, 'interfaceFont'),
                    supportedSettingsPreserved: settings?.language === ${JSON.stringify(requestedLocale)}
                        && settings?.theme === ${JSON.stringify(requestedTheme)}
                        && settings?.previewFont === 'system'
                        && settings?.customColors?.accentColor === '#2563EB'
                }));
            })`,
            awaitPromise: true,
            returnByValue: true
        }, sessionId);
        legacySettingsProbe = legacyProbe.result.value;
        if (legacySettingsProbe.interfaceFontPurged !== true
            || legacySettingsProbe.supportedSettingsPreserved !== true) {
            throw new Error(`Legacy interfaceFont migration failed: ${JSON.stringify(legacySettingsProbe)}`);
        }
    }

    const metrics = await send('Runtime.evaluate', {
        expression: `(() => {
            const grid = document.querySelector('#saved-library-grid');
            const selectedSwatch = document.querySelector('.saved-library-card.active .saved-library-swatch');
            const gridRect = grid?.getBoundingClientRect();
            const swatchRect = selectedSwatch?.getBoundingClientRect();
            const inspectorBackground = getComputedStyle(document.querySelector('#details-view')).backgroundColor;
            const libraryBackground = getComputedStyle(document.querySelector('#saved-library-view')).backgroundColor;
            const libraryHeaderBackground = getComputedStyle(document.querySelector('.saved-library-header')).backgroundColor;
            const formatControl = document.querySelector('.color-format-control');
            const formatTabs = document.querySelector('.color-format-tabs');
            const activeFormatTab = document.querySelector('.color-format-tab.active');
            const formatValue = document.querySelector('.current-format-value');
            const formatCopy = document.querySelector('.current-format-copy');
            const detailsTitle = document.querySelector('.details-header h1');
            const detailsHeader = document.querySelector('.details-header');
            const heroSwatch = document.querySelector('#hero-swatch');
            const savedColorsTitle = document.querySelector('.saved-colors-title');
            const savedColorsMore = document.querySelector('.saved-colors-more');
            const newColorEditor = document.querySelector('#new-color-editor');
            const newColorSv = document.querySelector('#new-color-sv');
            const newColorSvIndicator = document.querySelector('.new-color-sv-indicator');
            const newColorHueControl = document.querySelector('.new-color-hue-control');
            const newColorHue = document.querySelector('#new-color-hue');
            const newColorFormatTabs = document.querySelector('#new-color-format-tabs');
            const newColorActivePanel = document.querySelector('[data-new-color-panel]:not(.hidden)');
            const newColorSave = document.querySelector('#new-color-save');
            const libraryTitle = document.querySelector('.saved-library-header h1');
            const librarySearch = document.querySelector('.saved-library-search input');
            const libraryActiveFilter = document.querySelector('.saved-library-filter.active');
            const librarySort = document.querySelector('.saved-library-sort select');
            const libraryFirstHex = document.querySelector('#saved-library-grid .saved-library-meta strong');
            const libraryFirstRgb = document.querySelector('#saved-library-grid .saved-library-meta > span');
            const libraryCards = Array.from(document.querySelectorAll('#saved-library-grid .saved-library-card'));
            const historyCards = Array.from(document.querySelectorAll('#color-history .history-card'));
            const rootStyle = getComputedStyle(document.documentElement);
            const selectedDisplayStack = rootStyle.getPropertyValue('--font-display').trim();
            const selectedUiStack = rootStyle.getPropertyValue('--font-ui').trim();
            const selectedCodeStack = rootStyle.getPropertyValue('--font-code').trim();
            const firstFamily = (stack) => stack.split(',')[0].trim();
            const normalizedFamily = (stack) => firstFamily(stack).replace(/^['"]|['"]$/gu, '');
            const measure = (element) => {
                if (!element) return null;
                const rect = element.getBoundingClientRect();
                const style = getComputedStyle(element);
                return {
                    x: rect.x,
                    y: rect.y,
                    width: rect.width,
                    height: rect.height,
                    backgroundColor: style.backgroundColor,
                    backgroundImage: style.backgroundImage,
                    forcedColorAdjust: style.forcedColorAdjust,
                    border: style.border,
                    borderRadius: style.borderRadius,
                    boxShadow: style.boxShadow,
                    color: style.color,
                    fontFamily: style.fontFamily,
                    fontSize: style.fontSize,
                    fontWeight: style.fontWeight,
                    boxSizing: style.boxSizing,
                    padding: style.padding,
                    alignItems: style.alignItems,
                    outline: style.outline,
                    outlineOffset: style.outlineOffset,
                    clientWidth: element.clientWidth,
                    scrollWidth: element.scrollWidth,
                    text: element.textContent?.trim() || null
                };
            };
            const measureText = (element) => {
                if (!element) return null;
                const range = document.createRange();
                range.selectNodeContents(element);
                const rect = range.getBoundingClientRect();
                return {
                    x: rect.x,
                    y: rect.y,
                    right: rect.right,
                    width: rect.width,
                    height: rect.height
                };
            };
            return {
                title: document.title,
                manifestVersion: globalThis.chrome?.runtime?.getManifest?.().version || null,
                locale: document.documentElement.lang || null,
                theme: document.documentElement.dataset.theme || null,
                width: window.innerWidth,
                height: window.innerHeight,
                scrollWidth: document.documentElement.scrollWidth,
                scrollHeight: document.documentElement.scrollHeight,
                devicePixelRatio: window.devicePixelRatio,
                activeElement: document.activeElement?.id || document.activeElement?.tagName || null,
                url: location.href,
                inspectorBackground,
                libraryBackground,
                libraryHeaderBackground,
                formatControl: measure(formatControl),
                formatTabs: measure(formatTabs),
                activeFormatTab: measure(activeFormatTab),
                formatValue: measure(formatValue),
                formatCopy: measure(formatCopy),
                detailsHeader: measure(detailsHeader),
                detailsTitle: measure(detailsTitle),
                detailsTitleText: measureText(detailsTitle),
                heroSwatch: measure(heroSwatch),
                selectedDisplayStack,
                selectedUiStack,
                selectedCodeStack,
                fixedTypographyControlsAbsent: !document.querySelector(
                    '#interface-font-trigger, #interface-font-panel, [class*="interface-font"], [data-font-id]'
                )
                    && !document.documentElement.hasAttribute('data-interface-font')
                    && !document.documentElement.hasAttribute('data-interface-font-category'),
                savedColorsTitle: measure(savedColorsTitle),
                savedColorsMore: measure(savedColorsMore),
                newColor: {
                    open: document.querySelector('#details-view')?.classList.contains('is-creating-color') || false,
                    editor: measure(newColorEditor),
                    sv: measure(newColorSv),
                    svIndicator: measure(newColorSvIndicator),
                    hueControl: measure(newColorHueControl),
                    hue: measure(newColorHue),
                    tabs: measure(newColorFormatTabs),
                    activePanel: measure(newColorActivePanel),
                    save: measure(newColorSave),
                    saveDisabled: newColorSave?.disabled ?? null,
                    currentHex: document.querySelector('#new-color-hex')?.value || null,
                    hiddenSummaryNotTabbable: document.querySelector('.current-color-summary')?.offsetParent === null,
                    hiddenSavedColorsNotTabbable: document.querySelector('.saved-colors-section')?.offsetParent === null,
                    nativeManualInputAbsent: !document.querySelector('#manual-color-input')
                },
                libraryTitle: measure(libraryTitle),
                librarySearch: measure(librarySearch),
                libraryActiveFilter: measure(libraryActiveFilter),
                librarySort: measure(librarySort),
                libraryFirstHex: measure(libraryFirstHex),
                libraryFirstRgb: measure(libraryFirstRgb),
                libraryCards: libraryCards.map((card) => {
                    const button = card.querySelector('.saved-library-color-button');
                    const meta = card.querySelector('.saved-library-meta');
                    const hex = card.querySelector('.saved-library-meta strong');
                    const rgb = card.querySelector('.saved-library-meta > span');
                    return {
                        button: measure(button),
                        meta: measure(meta),
                        hex: measure(hex),
                        rgb: measure(rgb),
                        metadataFits: Boolean(meta)
                            && button.scrollWidth === button.clientWidth
                            && meta.scrollWidth === meta.clientWidth
                            && hex?.scrollWidth === hex?.clientWidth
                            && rgb?.scrollWidth === rgb?.clientWidth
                    };
                }),
                fontChecks: {
                    robotoFlex: document.fonts.check('650 16px "Roboto Flex Variable"', 'Color Picker'),
                    robotoMono: document.fonts.check('620 10px "Roboto Mono Variable"', '#F96B00'),
                    displayUsesRobotoFlex: normalizedFamily(selectedDisplayStack) === 'Roboto Flex Variable',
                    uiUsesRobotoFlex: normalizedFamily(selectedUiStack) === 'Roboto Flex Variable',
                    codeUsesRobotoMono: normalizedFamily(selectedCodeStack) === 'Roboto Mono Variable',
                    selectedDisplay: document.fonts.check('400 16px ' + firstFamily(selectedDisplayStack), 'Color Picker'),
                    selectedUi: document.fonts.check('500 12px ' + firstFamily(selectedUiStack), 'Interface'),
                    selectedCode: document.fonts.check('400 10px ' + firstFamily(selectedCodeStack), '#F96B00')
                },
                historyCards: historyCards.map((card) => {
                    const button = card.querySelector('.history-color-button');
                    const meta = card.querySelector('.history-meta');
                    const hex = card.querySelector('.history-label');
                    const rgb = card.querySelector('.history-rgb');
                    return {
                        button: measure(button),
                        meta: measure(meta),
                        hex: measure(hex),
                        rgb: measure(rgb),
                        ariaLabel: button?.getAttribute('aria-label') || null,
                        metadataFits: Boolean(meta)
                            && meta.scrollWidth === meta.clientWidth
                            && hex?.scrollWidth === hex?.clientWidth
                            && rgb?.scrollWidth === rgb?.clientWidth
                    };
                }),
                libraryMatchesInspectorBackground: libraryBackground === inspectorBackground
                    && libraryHeaderBackground === inspectorBackground,
                selectedSwatchOutlineClearanceLeft: gridRect && swatchRect
                    ? swatchRect.left - gridRect.left
                    : null
            };
        })()`,
        returnByValue: true
    }, sessionId);
    const runtimeMetrics = metrics.result.value;
    if ((runtimeMode === 'open-library' || runtimeMode === 'open-library-dark')
        && (runtimeMetrics.libraryMatchesInspectorBackground !== true
            || runtimeMetrics.selectedSwatchOutlineClearanceLeft < 3
            || runtimeMetrics.libraryCards.some((card) => card.metadataFits !== true))) {
        throw new Error(`Saved-library visual invariants failed: ${JSON.stringify(runtimeMetrics)}`);
    }
    if (runtimeMode === 'inspector' && runtimeMetrics.historyCards.some((card) => (
        !card.hex?.text
        || !card.rgb?.text?.startsWith('RGB ')
        || !card.ariaLabel?.includes(', RGB ')
        || card.metadataFits !== true
    ))) {
        throw new Error(`Compact saved-color metadata invariants failed: ${JSON.stringify(runtimeMetrics.historyCards)}`);
    }
    if (runtimeMode.startsWith('new-color')) {
        const within = (actual, expected, tolerance = 0.5) => (
            typeof actual === 'number' && Math.abs(actual - expected) <= tolerance
        );
        const hero = runtimeMetrics.heroSwatch;
        const editor = runtimeMetrics.newColor;
        const isNativePopupViewport = runtimeMetrics.width === 340 && runtimeMetrics.height === 470;
        const nativeGeometryReady = !isNativePopupViewport || (
            within(hero?.x, 111)
            && within(hero?.y, 74)
            && within(editor.sv?.x, 62)
            && within(editor.sv?.y, 205)
            && within(editor.hueControl?.x, 62)
            && within(editor.hueControl?.y, 299)
            && within(editor.hue?.y, 307)
            && within(editor.tabs?.x, 62)
            && within(editor.tabs?.y, 331)
            && within(editor.activePanel?.x, 62)
            && within(editor.activePanel?.y, 375)
            && within(editor.save?.x, 62)
            && within(editor.save?.y, 423)
        );
        const geometryReady = editor?.open === true
            && within(hero?.width, 118)
            && within(hero?.height, 118)
            && within(editor.sv?.width, 216)
            && within(editor.sv?.height, 86)
            && within(editor.hueControl?.width, 216)
            && within(editor.tabs?.width, 216)
            && within(editor.activePanel?.width, 216)
            && within(editor.save?.width, 216)
            && nativeGeometryReady
            && editor.svIndicator?.x >= editor.sv.x
            && editor.svIndicator?.y >= editor.sv.y
            && editor.svIndicator?.x + editor.svIndicator?.width <= editor.sv.x + editor.sv.width
            && editor.svIndicator?.y + editor.svIndicator?.height <= editor.sv.y + editor.sv.height
            && editor.save?.scrollWidth === editor.save?.clientWidth
            && editor.hiddenSummaryNotTabbable === true
            && editor.hiddenSavedColorsNotTabbable === true
            && editor.nativeManualInputAbsent === true
            && runtimeMetrics.scrollWidth === runtimeMetrics.width
            && runtimeMetrics.scrollHeight === runtimeMetrics.height;
        if (!geometryReady) {
            throw new Error(`Integrated new-color geometry failed: ${JSON.stringify({ hero, editor, scrollWidth: runtimeMetrics.scrollWidth, scrollHeight: runtimeMetrics.scrollHeight })}`);
        }
    }
    if (runtimeMetrics.fixedTypographyControlsAbsent !== true
        || runtimeMetrics.fontChecks?.robotoFlex !== true
        || runtimeMetrics.fontChecks?.robotoMono !== true
        || runtimeMetrics.fontChecks?.displayUsesRobotoFlex !== true
        || runtimeMetrics.fontChecks?.uiUsesRobotoFlex !== true
        || runtimeMetrics.fontChecks?.codeUsesRobotoMono !== true
        || runtimeMetrics.fontChecks?.selectedDisplay !== true
        || runtimeMetrics.fontChecks?.selectedUi !== true
        || runtimeMetrics.fontChecks?.selectedCode !== true) {
        throw new Error(`Fixed Roboto typography readiness failed: ${JSON.stringify({
            controlsAbsent: runtimeMetrics.fixedTypographyControlsAbsent,
            ...runtimeMetrics.fontChecks
        })}`);
    }
    const screenshot = await send('Page.captureScreenshot', {
        format: 'png',
        fromSurface: true,
        captureBeyondViewport: false
    }, sessionId);

    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, Buffer.from(screenshot.data, 'base64'));
    const consoleErrors = observedEvents
        .filter((event) => event.sessionId === sessionId)
        .filter((event) => (
            event.method === 'Runtime.exceptionThrown'
            || (event.method === 'Log.entryAdded' && ['error', 'warning'].includes(event.params?.entry?.level))
        ))
        .map((event) => event.params);
    const networkUrls = Array.from(new Set(observedEvents
        .filter((event) => event.sessionId === sessionId && event.method === 'Network.requestWillBeSent')
        .map((event) => event.params?.request?.url)
        .filter(Boolean)));
    const networkFailures = observedEvents
        .filter((event) => event.sessionId === sessionId && event.method === 'Network.loadingFailed')
        .map((event) => event.params);
    if (consoleErrors.length) {
        throw new Error(`Unexpected Brave console errors: ${JSON.stringify(consoleErrors)}`);
    }
    if (networkFailures.length) {
        throw new Error(`Unexpected Brave network failures: ${JSON.stringify(networkFailures)}`);
    }

    const report = {
        ...runtimeMetrics,
        sourceSha256: qaSourceSha256,
        state: runtimeMode.startsWith('settings-')
            ? 'settings'
            : runtimeMode.startsWith('home-')
                ? 'home'
                : runtimeMode.startsWith('new-color')
                    ? 'new-color'
                : runtimeMode === 'open-library' || runtimeMode === 'open-library-dark'
                    ? 'saved-library'
                    : 'inspector',
        qaMode,
        browserVersion,
        extensionId,
        serviceWorkerDetected,
        actionPopupProbe,
        legacySettingsProbe,
        consoleErrors,
        networkUrls,
        networkFailures,
        qaResults
    };
    const reportPath = outputPath.replace(/\.png$/u, '.json');
    await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
    console.log(JSON.stringify(report));
    await send('Target.closeTarget', { targetId });
    if (primaryTargetId !== targetId) {
        await send('Target.closeTarget', { targetId: primaryTargetId });
    }
} catch (error) {
    console.error(error.stack || error.message);
    if (stderr.trim()) console.error(stderr.trim());
    process.exitCode = 1;
} finally {
    await shutdown();
}
