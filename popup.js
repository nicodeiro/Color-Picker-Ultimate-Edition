document.addEventListener('DOMContentLoaded', () => {
    const storage = (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local)
        ? chrome.storage.local
        : {
            get(keys, callback) {
                const keyList = Array.isArray(keys) ? keys : [keys];
                const result = {};
                keyList.forEach((key) => {
                    const stored = localStorage.getItem(key);
                    if (stored) result[key] = JSON.parse(stored);
                });
                callback(result);
            },
            set(items) {
                Object.entries(items).forEach(([key, value]) => {
                    localStorage.setItem(key, JSON.stringify(value));
                });
            }
        };

    const DEFAULT_COLOR = '#2563EB';
    const DEFAULT_HISTORY = ['#2563EB', '#7C3AED', '#FF3B5F', '#FF7A1A', '#10B981', '#06B6D4', '#F9AB00', '#111827', '#CBD5E1', '#EDE9FE'];
    const MAX_HISTORY = 10;
    const defaultSettings = {
        language: 'fr',
        theme: 'system',
        customColors: {
            bgColor: '#ffffff',
            cardColor: '#f3f4f6',
            textColor: '#1f2937',
            accentColor: '#2563eb'
        }
    };

    let currentColor = DEFAULT_COLOR;
    let colorHistory = DEFAULT_HISTORY.slice();
    let favoriteColors = [];
    let currentCollection = 'history';
    let currentCodeFormat = 'css';
    let settings = { ...defaultSettings };
    let isPicking = false;

    const els = {
        captureView: document.getElementById('capture-view'),
        detailsView: document.getElementById('details-view'),
        pickBtn: document.getElementById('pick-btn'),
        historyOpenBtn: document.getElementById('history-open-btn'),
        historyCount: document.getElementById('history-count'),
        captureTitle: document.getElementById('capture-title'),
        captureFeedback: document.getElementById('capture-feedback'),
        backBtn: document.getElementById('back-btn'),
        settingsModal: document.getElementById('settings-modal'),
        closeSettings: document.getElementById('close-settings'),
        languageSelect: document.getElementById('language-select'),
        themeSelect: document.getElementById('theme-select'),
        customControls: document.getElementById('custom-theme-controls'),
        toast: document.getElementById('toast'),
        toastMessage: document.getElementById('toast-message'),
        heroSwatch: document.getElementById('hero-swatch'),
        colorName: document.getElementById('color-name'),
        hexValue: document.getElementById('hex-value'),
        formatHex: document.getElementById('format-hex'),
        rgbValue: document.getElementById('rgb-value'),
        hslValue: document.getElementById('hsl-value'),
        oklchValue: document.getElementById('oklch-value'),
        usageInput: document.getElementById('usage-input'),
        usageButton: document.getElementById('usage-button'),
        usageText: document.getElementById('usage-text'),
        codeOutput: document.getElementById('code-output'),
        colorHistory: document.getElementById('color-history'),
        historyTab: document.getElementById('history-tab'),
        favoritesTab: document.getElementById('favorites-tab')
    };

    const translations = {
        en: {
            title: 'Color Picker',
            promo: '✨ More free tools? Check out bitek.fr ✨',
            settings: 'Settings',
            language: 'Language',
            theme: 'Theme',
            system: 'System',
            light: 'Light',
            dark: 'Dark',
            midnight: 'Midnight',
            latte: 'Latte',
            forest: 'Forest',
            neon: 'Neon',
            rose: 'Rose',
            custom: 'Custom',
            bgColor: 'Background',
            cardColor: 'Card',
            textColor: 'Text',
            accentColor: 'Accent',
            buyCoffee: 'Buy me a coffee',
            captureCta: 'Choose a color on screen',
            pickingCta: 'Select a color on screen',
            detailsTitle: 'Latest details',
            history: 'History',
            usage: 'Usage',
            formats: 'Formats',
            favorites: 'Favorites',
            noFavorites: 'No favorite colors yet',
            copiedChip: 'Copied',
            copied: 'Copied!',
            error: 'Error picking color'
        },
        fr: {
            title: 'Color Picker',
            promo: '✨ Plus d\'outils gratuits ? C\'est par ici bitek.fr ✨',
            settings: 'Paramètres',
            language: 'Langue',
            theme: 'Thème',
            system: 'Système',
            light: 'Clair',
            dark: 'Sombre',
            midnight: 'Minuit',
            latte: 'Latte',
            forest: 'Forêt',
            neon: 'Néon',
            rose: 'Rose',
            custom: 'Personnalisé',
            bgColor: 'Arrière-plan',
            cardColor: 'Carte',
            textColor: 'Texte',
            accentColor: 'Accent',
            buyCoffee: 'Offrez-moi un café',
            captureCta: 'Choisir une couleur à l\'écran',
            pickingCta: 'Sélectionnez une couleur à l\'écran',
            detailsTitle: 'Derniers détails',
            history: 'Historique',
            usage: 'Usage',
            formats: 'Formats',
            favorites: 'Favoris',
            noFavorites: 'Aucun favori pour le moment',
            copiedChip: 'Copié',
            copied: 'Copié !',
            error: 'Erreur lors de la sélection'
        }
    };

    init();

    function init() {
        loadSettings();
        loadColorHistory();
        loadFavoriteColors();
        setColor(DEFAULT_COLOR, { save: false });
        bindEvents();
        syncUsagePreview();
    }

    function bindEvents() {
        els.pickBtn.addEventListener('click', pickColor);
        els.historyOpenBtn.addEventListener('click', () => showView('details'));
        els.backBtn.addEventListener('click', () => showView('capture'));
        els.usageInput.addEventListener('input', syncUsagePreview);

        [els.historyTab, els.favoritesTab].forEach((button) => {
            button.addEventListener('click', () => setCollection(button.dataset.collection));
        });

        document.querySelectorAll('.settings-trigger').forEach((button) => {
            button.addEventListener('click', () => els.settingsModal.classList.remove('hidden'));
        });

        document.querySelectorAll('#coffee-btn, .coffee-trigger').forEach((button) => {
            button.addEventListener('click', () => {
                window.open('https://buymeacoffee.com/bitek', '_blank', 'noopener,noreferrer');
            });
        });

        els.closeSettings.addEventListener('click', () => els.settingsModal.classList.add('hidden'));
        els.settingsModal.addEventListener('click', (event) => {
            if (event.target === els.settingsModal) els.settingsModal.classList.add('hidden');
        });

        els.languageSelect.addEventListener('change', (event) => {
            settings.language = event.target.value;
            saveSettings();
            applyTranslations();
        });

        els.themeSelect.addEventListener('change', (event) => {
            settings.theme = event.target.value;
            saveSettings();
            applySettings();
        });

        ['custom-bg-color', 'custom-card-color', 'custom-text-color', 'custom-accent-color'].forEach((id) => {
            document.getElementById(id).addEventListener('input', updateCustomColor);
        });

        document.querySelectorAll('.code-tab').forEach((button) => {
            button.addEventListener('click', () => {
                currentCodeFormat = button.dataset.codeFormat;
                document.querySelectorAll('.code-tab').forEach((tab) => tab.classList.toggle('active', tab === button));
                updateCodeOutput();
            });
        });

        document.querySelectorAll('.copy-action').forEach((button) => {
            button.addEventListener('click', () => copyToClipboard(getCopyValue(button.dataset.copyKind)));
        });
    }

    async function pickColor() {
        if (isPicking) return;

        if (!window.EyeDropper) {
            showToast(t('error'));
            return;
        }

        enterPickingState();

        try {
            await wait(240);
            const eyeDropper = new EyeDropper();
            const result = await eyeDropper.open();
            setColor(result.sRGBHex, { save: true });
            await copyToClipboard(result.sRGBHex.toUpperCase(), false);
            await showPickedSuccess(result.sRGBHex.toUpperCase());
            showView('details');
        } catch (error) {
            console.log('EyeDropper cancelled or error:', error);
            exitPickingState();
        }
    }

    function showView(view) {
        const isDetails = view === 'details';
        els.captureView.classList.toggle('hidden', isDetails);
        els.detailsView.classList.toggle('hidden', !isDetails);
        els.detailsView.setAttribute('aria-hidden', String(!isDetails));
    }

    function enterPickingState() {
        isPicking = true;
        els.pickBtn.classList.remove('picked-success');
        els.pickBtn.classList.add('is-picking');
        els.captureTitle.textContent = t('pickingCta');
        els.captureFeedback.classList.add('hidden');
    }

    function exitPickingState() {
        isPicking = false;
        els.pickBtn.classList.remove('is-picking');
        els.captureTitle.textContent = t('captureCta');
    }

    async function showPickedSuccess(hex) {
        exitPickingState();
        els.captureFeedback.textContent = `${hex} ${t('copied').replace('!', '').trim()}`;
        els.captureFeedback.classList.remove('hidden');
        els.pickBtn.classList.add('picked-success');
        await wait(360);
        els.pickBtn.classList.remove('picked-success');
        els.captureFeedback.classList.add('hidden');
    }

    function setColor(hex, options = { save: false }) {
        if (!isValidHex(hex)) return;
        currentColor = hex.toUpperCase();
        document.documentElement.style.setProperty('--selected-color', currentColor);

        const rgb = hexToRgb(currentColor);
        const hsl = hexToHsl(currentColor);
        const oklch = currentColor === DEFAULT_COLOR ? '0.62, 0.16, 250' : hexToOklch(currentColor);

        els.colorName.textContent = getColorName(currentColor);
        els.hexValue.textContent = currentColor;
        els.formatHex.textContent = currentColor;
        els.rgbValue.textContent = rgb;
        els.hslValue.textContent = hsl;
        els.oklchValue.textContent = oklch;

        syncUsagePreview();
        updateCodeOutput();
        if (options.save) addToHistory(currentColor);
        renderHistory();
    }

    function wait(ms) {
        return new Promise((resolve) => window.setTimeout(resolve, ms));
    }

    function syncUsagePreview() {
        const value = els.usageInput.value.trim() || 'Blabla';
        els.usageButton.textContent = value;
        els.usageText.textContent = value;
    }

    function updateCodeOutput() {
        els.codeOutput.textContent = getCodeSnippet(currentCodeFormat);
    }

    function getCodeSnippet(format) {
        const hex = currentColor;
        if (format === 'tailwind') return `text-[${hex}]`;
        if (format === 'swiftui') return `Color(hex: "${hex}")`;
        if (format === 'react') return `style={{ color: "${hex}" }}`;
        return `--color-primary: ${hex};`;
    }

    function getCopyValue(kind) {
        if (kind === 'rgb') return els.rgbValue.textContent;
        if (kind === 'hsl') return els.hslValue.textContent;
        if (kind === 'oklch') return els.oklchValue.textContent;
        if (kind === 'code') return els.codeOutput.textContent;
        return currentColor;
    }

    function addToHistory(hex) {
        colorHistory = colorHistory.filter((item) => item.toLowerCase() !== hex.toLowerCase());
        colorHistory.unshift(hex);
        colorHistory = colorHistory.slice(0, MAX_HISTORY);
        saveColorHistory();
        renderHistory();
    }

    function renderHistory() {
        els.colorHistory.textContent = '';
        els.historyCount.textContent = String(Math.min(colorHistory.length, 2));

        const colors = currentCollection === 'favorites'
            ? favoriteColors.slice(0, MAX_HISTORY)
            : colorHistory.slice(0, MAX_HISTORY);

        if (currentCollection === 'favorites' && !colors.length) {
            const empty = document.createElement('p');
            empty.className = 'history-empty';
            empty.textContent = t('noFavorites');
            els.colorHistory.appendChild(empty);
            return;
        }

        colors.slice(0, MAX_HISTORY).forEach((hex) => {
            if (!isValidHex(hex)) return;
            const isFavorite = isFavoriteColor(hex);
            const card = document.createElement('div');
            card.className = `history-card${hex.toLowerCase() === currentColor.toLowerCase() ? ' active' : ''}`;
            card.style.setProperty('--history-color', hex);

            const colorButton = document.createElement('button');
            colorButton.type = 'button';
            colorButton.className = 'history-color-button';
            colorButton.title = hex.toUpperCase();

            const swatch = document.createElement('span');
            swatch.className = 'history-swatch';
            const label = document.createElement('span');
            label.className = 'history-label';
            label.textContent = hex.toUpperCase();

            const favoriteButton = document.createElement('button');
            favoriteButton.type = 'button';
            favoriteButton.className = `favorite-toggle${isFavorite ? ' active' : ''}`;
            favoriteButton.setAttribute('aria-label', isFavorite ? 'Remove from favorites' : 'Add to favorites');
            favoriteButton.innerHTML = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15 8.8 22 9.3 16.7 13.9 18.4 21 12 17.2 5.6 21 7.3 13.9 2 9.3 9 8.8 12 2"></polygon></svg>';

            colorButton.append(swatch, label);
            colorButton.addEventListener('click', () => setColor(hex, { save: false }));
            favoriteButton.addEventListener('click', () => toggleFavorite(hex));
            card.append(colorButton, favoriteButton);
            els.colorHistory.appendChild(card);
        });
    }

    function setCollection(collection) {
        currentCollection = collection === 'favorites' ? 'favorites' : 'history';
        els.historyTab.classList.toggle('active', currentCollection === 'history');
        els.favoritesTab.classList.toggle('active', currentCollection === 'favorites');
        els.historyTab.setAttribute('aria-selected', String(currentCollection === 'history'));
        els.favoritesTab.setAttribute('aria-selected', String(currentCollection === 'favorites'));
        renderHistory();
    }

    function toggleFavorite(hex) {
        const normalized = hex.toUpperCase();
        if (isFavoriteColor(normalized)) {
            favoriteColors = favoriteColors.filter((item) => item.toLowerCase() !== normalized.toLowerCase());
        } else {
            favoriteColors.unshift(normalized);
        }
        favoriteColors = favoriteColors.filter(isValidHex).slice(0, MAX_HISTORY);
        saveFavoriteColors();
        renderHistory();
    }

    function isFavoriteColor(hex) {
        return favoriteColors.some((item) => item.toLowerCase() === hex.toLowerCase());
    }

    function loadColorHistory() {
        storage.get(['colorHistory'], (result) => {
            colorHistory = Array.isArray(result.colorHistory) && result.colorHistory.length
                ? result.colorHistory.filter(isValidHex).slice(0, MAX_HISTORY)
                : DEFAULT_HISTORY.slice();
            if (!colorHistory.length) colorHistory = DEFAULT_HISTORY.slice();
            renderHistory();
        });
    }

    function loadFavoriteColors() {
        storage.get(['favoriteColors'], (result) => {
            favoriteColors = Array.isArray(result.favoriteColors)
                ? result.favoriteColors.filter(isValidHex).slice(0, MAX_HISTORY)
                : [];
            renderHistory();
        });
    }

    function saveColorHistory() {
        storage.set({ colorHistory });
    }

    function saveFavoriteColors() {
        storage.set({ favoriteColors });
    }

    async function copyToClipboard(text, notify = true) {
        try {
            await navigator.clipboard.writeText(text);
            if (notify) showToast(t('copied'));
        } catch (error) {
            console.error('Copy failed:', error);
        }
    }

    function showToast(message) {
        els.toastMessage.textContent = message;
        els.toast.classList.remove('hidden');
        els.toast.classList.add('show');
        window.setTimeout(() => {
            els.toast.classList.remove('show');
            window.setTimeout(() => els.toast.classList.add('hidden'), 250);
        }, 1300);
    }

    function loadSettings() {
        storage.get(['settings'], (result) => {
            if (result.settings && validateSettings(result.settings)) {
                settings = {
                    ...defaultSettings,
                    ...result.settings,
                    customColors: {
                        ...defaultSettings.customColors,
                        ...(result.settings.customColors || {})
                    }
                };
            }
            applySettings();
            applyTranslations();
        });
    }

    function validateSettings(candidate) {
        if (!candidate || typeof candidate !== 'object') return false;
        if (candidate.language && !translations[candidate.language]) return false;
        const validThemes = ['system', 'light', 'dark', 'midnight', 'latte', 'forest', 'neon', 'rose', 'custom'];
        if (candidate.theme && !validThemes.includes(candidate.theme)) return false;
        return true;
    }

    function saveSettings() {
        storage.set({ settings });
    }

    function applySettings() {
        els.languageSelect.value = translations[settings.language] ? settings.language : 'fr';
        els.themeSelect.value = settings.theme;

        let themeToApply = settings.theme;
        if (settings.theme === 'system') {
            themeToApply = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        document.documentElement.setAttribute('data-theme', themeToApply);

        if (settings.theme === 'custom') {
            els.customControls.classList.remove('hidden');
            const colors = settings.customColors;
            document.documentElement.style.setProperty('--bg-color', colors.bgColor);
            document.documentElement.style.setProperty('--card-bg', colors.cardColor);
            document.documentElement.style.setProperty('--text-primary', colors.textColor);
            document.documentElement.style.setProperty('--primary-color', colors.accentColor);
            document.getElementById('custom-bg-color').value = colors.bgColor;
            document.getElementById('custom-card-color').value = colors.cardColor;
            document.getElementById('custom-text-color').value = colors.textColor;
            document.getElementById('custom-accent-color').value = colors.accentColor;
        } else {
            els.customControls.classList.add('hidden');
            document.documentElement.style.removeProperty('--bg-color');
            document.documentElement.style.removeProperty('--card-bg');
            document.documentElement.style.removeProperty('--text-primary');
            document.documentElement.style.removeProperty('--primary-color');
        }
    }

    function updateCustomColor(event) {
        const map = {
            'custom-bg-color': 'bgColor',
            'custom-card-color': 'cardColor',
            'custom-text-color': 'textColor',
            'custom-accent-color': 'accentColor'
        };
        const key = map[event.target.id];
        const value = event.target.value;
        if (!key || !isValidHex(value)) return;

        settings.customColors[key] = value;
        if (key === 'bgColor') document.documentElement.style.setProperty('--bg-color', value);
        if (key === 'cardColor') document.documentElement.style.setProperty('--card-bg', value);
        if (key === 'textColor') document.documentElement.style.setProperty('--text-primary', value);
        if (key === 'accentColor') document.documentElement.style.setProperty('--primary-color', value);
        clearTimeout(window.saveTimeout);
        window.saveTimeout = setTimeout(saveSettings, 400);
    }

    function applyTranslations() {
        document.querySelectorAll('[data-i18n]').forEach((element) => {
            const key = element.dataset.i18n;
            const value = t(key);
            if (element.classList.contains('promo-link')) {
                renderPromoLink(element, value);
            } else {
                element.textContent = value;
            }
        });

        document.querySelectorAll('[data-i18n-title]').forEach((element) => {
            element.title = t(element.dataset.i18nTitle);
        });
    }

    function t(key) {
        const lang = translations[settings.language] ? settings.language : 'fr';
        return translations[lang][key] || translations.fr[key] || translations.en[key] || key;
    }

    function renderPromoLink(element, text) {
        element.textContent = '';
        const index = text.indexOf('bitek.fr');
        if (index === -1) {
            element.textContent = text;
            return;
        }
        element.append(document.createTextNode(text.slice(0, index)));
        const strong = document.createElement('span');
        strong.className = 'promo-domain';
        strong.textContent = 'bitek.fr';
        element.append(strong);
        element.append(document.createTextNode(text.slice(index + 'bitek.fr'.length)));
    }

    function hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `${r}, ${g}, ${b}`;
    }

    function hexToHsl(hex) {
        let r = parseInt(hex.slice(1, 3), 16) / 255;
        let g = parseInt(hex.slice(3, 5), 16) / 255;
        let b = parseInt(hex.slice(5, 7), 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0;
        let s = 0;
        const l = (max + min) / 2;

        if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
            if (max === g) h = ((b - r) / d + 2) / 6;
            if (max === b) h = ((r - g) / d + 4) / 6;
        }

        return `${Math.round(h * 360)}°, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`;
    }

    function hexToOklch(hex) {
        const r = srgbToLinear(parseInt(hex.slice(1, 3), 16) / 255);
        const g = srgbToLinear(parseInt(hex.slice(3, 5), 16) / 255);
        const b = srgbToLinear(parseInt(hex.slice(5, 7), 16) / 255);

        const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
        const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
        const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

        const lRoot = Math.cbrt(l);
        const mRoot = Math.cbrt(m);
        const sRoot = Math.cbrt(s);

        const okl = 0.2104542553 * lRoot + 0.7936177850 * mRoot - 0.0040720468 * sRoot;
        const oka = 1.9779984951 * lRoot - 2.42859205 * mRoot + 0.4505937099 * sRoot;
        const okb = 0.0259040371 * lRoot + 0.7827717662 * mRoot - 0.808675766 * sRoot;
        const chroma = Math.sqrt(oka * oka + okb * okb);
        const hue = (Math.atan2(okb, oka) * 180 / Math.PI + 360) % 360;

        return `${okl.toFixed(2)}, ${chroma.toFixed(2)}, ${Math.round(hue)}`;
    }

    function srgbToLinear(value) {
        return value <= 0.04045 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
    }

    function isValidHex(hex) {
        return /^#[0-9A-Fa-f]{6}$/.test(hex);
    }

    function getColorName(hex) {
        const names = {
            '#2563EB': 'Royal Blue',
            '#7C3AED': 'Electric Purple',
            '#FF3B5F': 'Coral Red',
            '#FF7A1A': 'Signal Orange',
            '#10B981': 'Emerald',
            '#06B6D4': 'Cyan',
            '#F9AB00': 'Amber',
            '#111827': 'Ink',
            '#CBD5E1': 'Slate Mist',
            '#EDE9FE': 'Soft Lavender'
        };
        return names[hex.toUpperCase()] || hex.toUpperCase();
    }
});
