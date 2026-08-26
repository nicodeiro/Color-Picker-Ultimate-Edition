import { createLucideIcon } from './vendor/lucide-icons.js';

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
            set(items, callback) {
                Object.entries(items).forEach(([key, value]) => {
                    localStorage.setItem(key, JSON.stringify(value));
                });
                if (callback) callback();
            }
        };

    const DEFAULT_COLOR = '#F96B00';
    const DEFAULT_HISTORY = ['#F96B00', '#2F853D', '#08274D', '#6D7278', '#24292F', '#000000', '#2563EB', '#7C3AED', '#FF3B5F', '#06B6D4'];
    const MAX_HISTORY = 10;
    const COLLAPSED_SAVED_COLORS = 5;
    const COLOR_VALUE_FORMATS = ['hex', 'rgb', 'hsl'];
    const VALID_THEMES = ['system', 'light', 'dark'];
    const FONT_OPTIONS = [
        { id: 'american-typewriter', name: 'American Typewriter', category: 'Serif', stack: '"American Typewriter", "Courier New", serif' },
        { id: 'andale-mono', name: 'Andale Mono', category: 'Mono', stack: '"Andale Mono", "SF Mono", Menlo, monospace' },
        { id: 'apple-chancery', name: 'Apple Chancery', category: 'Script', stack: '"Apple Chancery", "Snell Roundhand", cursive' },
        { id: 'arial', name: 'Arial', category: 'Sans', stack: 'Arial, Helvetica, sans-serif' },
        { id: 'arial-narrow', name: 'Arial Narrow', category: 'Condensed', stack: '"Arial Narrow", Arial, sans-serif' },
        { id: 'arial-rounded', name: 'Arial Rounded', category: 'Rounded', stack: '"Arial Rounded MT Bold", "SF Pro Rounded", Arial, sans-serif' },
        { id: 'athelas', name: 'Athelas', category: 'Serif', stack: 'Athelas, Georgia, serif' },
        { id: 'avenir', name: 'Avenir', category: 'Sans', stack: 'Avenir, "Avenir Next", "Helvetica Neue", sans-serif' },
        { id: 'display', name: 'Avenir Next', category: 'Sans', stack: '"Avenir Next", Avenir, "Helvetica Neue", sans-serif' },
        { id: 'baskerville', name: 'Baskerville', category: 'Serif', stack: 'Baskerville, Georgia, serif' },
        { id: 'big-caslon', name: 'Big Caslon', category: 'Serif', stack: '"Big Caslon", "Times New Roman", serif' },
        { id: 'bodoni-72', name: 'Bodoni 72', category: 'Serif', stack: '"Bodoni 72", Didot, Georgia, serif' },
        { id: 'bodoni-72-smallcaps', name: 'Bodoni 72 Smallcaps', category: 'Serif', stack: '"Bodoni 72 Smallcaps", "Bodoni 72", Didot, serif' },
        { id: 'bradley-hand', name: 'Bradley Hand', category: 'Hand', stack: '"Bradley Hand", "Marker Felt", cursive' },
        { id: 'brush-script', name: 'Brush Script MT', category: 'Script', stack: '"Brush Script MT", "Snell Roundhand", cursive' },
        { id: 'cambria', name: 'Cambria', category: 'Serif', stack: 'Cambria, Georgia, serif' },
        { id: 'candara', name: 'Candara', category: 'Sans', stack: 'Candara, Optima, sans-serif' },
        { id: 'chalkduster', name: 'Chalkduster', category: 'Display', stack: 'Chalkduster, "Marker Felt", fantasy' },
        { id: 'charter', name: 'Charter', category: 'Serif', stack: 'Charter, Georgia, serif' },
        { id: 'cochin', name: 'Cochin', category: 'Serif', stack: 'Cochin, Georgia, serif' },
        { id: 'constantia', name: 'Constantia', category: 'Serif', stack: 'Constantia, Georgia, serif' },
        { id: 'copperplate', name: 'Copperplate', category: 'Display', stack: 'Copperplate, "Copperplate Gothic Light", fantasy' },
        { id: 'courier', name: 'Courier', category: 'Mono', stack: 'Courier, "Courier New", monospace' },
        { id: 'courier-new', name: 'Courier New', category: 'Mono', stack: '"Courier New", Courier, monospace' },
        { id: 'damascus', name: 'Damascus', category: 'Sans', stack: 'Damascus, Arial, sans-serif' },
        { id: 'devanagari-sangam', name: 'Devanagari Sangam MN', category: 'Sans', stack: '"Devanagari Sangam MN", Arial, sans-serif' },
        { id: 'didot', name: 'Didot', category: 'Serif', stack: 'Didot, "Bodoni 72", Georgia, serif' },
        { id: 'din-alternate', name: 'DIN Alternate', category: 'Sans', stack: '"DIN Alternate", "Arial Narrow", sans-serif' },
        { id: 'din-condensed', name: 'DIN Condensed', category: 'Condensed', stack: '"DIN Condensed", "Arial Narrow", sans-serif' },
        { id: 'euphemia', name: 'Euphemia UCAS', category: 'Sans', stack: '"Euphemia UCAS", Arial, sans-serif' },
        { id: 'futura', name: 'Futura', category: 'Display', stack: 'Futura, "Avenir Next", sans-serif' },
        { id: 'galvji', name: 'Galvji', category: 'Sans', stack: 'Galvji, "Helvetica Neue", Arial, sans-serif' },
        { id: 'garamond', name: 'Garamond', category: 'Serif', stack: 'Garamond, "Times New Roman", serif' },
        { id: 'geneva', name: 'Geneva', category: 'Sans', stack: 'Geneva, Verdana, sans-serif' },
        { id: 'serif', name: 'Georgia', category: 'Serif', stack: 'Georgia, "New York", "Times New Roman", serif' },
        { id: 'gill-sans', name: 'Gill Sans', category: 'Sans', stack: '"Gill Sans", "Gill Sans MT", sans-serif' },
        { id: 'helvetica', name: 'Helvetica', category: 'Sans', stack: 'Helvetica, "Helvetica Neue", Arial, sans-serif' },
        { id: 'helvetica-neue', name: 'Helvetica Neue', category: 'Sans', stack: '"Helvetica Neue", Helvetica, Arial, sans-serif' },
        { id: 'herculanum', name: 'Herculanum', category: 'Display', stack: 'Herculanum, Papyrus, fantasy' },
        { id: 'hiragino-sans', name: 'Hiragino Sans', category: 'Sans', stack: '"Hiragino Sans", "Hiragino Kaku Gothic ProN", sans-serif' },
        { id: 'hoefler-text', name: 'Hoefler Text', category: 'Serif', stack: '"Hoefler Text", Georgia, serif' },
        { id: 'impact', name: 'Impact', category: 'Display', stack: 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif' },
        { id: 'inaimathi', name: 'InaiMathi', category: 'Sans', stack: 'InaiMathi, Arial, sans-serif' },
        { id: 'iowan-old-style', name: 'Iowan Old Style', category: 'Serif', stack: '"Iowan Old Style", Georgia, serif' },
        { id: 'kailasa', name: 'Kailasa', category: 'Sans', stack: 'Kailasa, Arial, sans-serif' },
        { id: 'kannada-sangam', name: 'Kannada Sangam MN', category: 'Sans', stack: '"Kannada Sangam MN", Arial, sans-serif' },
        { id: 'kefa', name: 'Kefa', category: 'Serif', stack: 'Kefa, Georgia, serif' },
        { id: 'khmer-sangam', name: 'Khmer Sangam MN', category: 'Sans', stack: '"Khmer Sangam MN", Arial, sans-serif' },
        { id: 'kohinoor-bangla', name: 'Kohinoor Bangla', category: 'Sans', stack: '"Kohinoor Bangla", Arial, sans-serif' },
        { id: 'kohinoor-devanagari', name: 'Kohinoor Devanagari', category: 'Sans', stack: '"Kohinoor Devanagari", Arial, sans-serif' },
        { id: 'kohinoor-gujarati', name: 'Kohinoor Gujarati', category: 'Sans', stack: '"Kohinoor Gujarati", Arial, sans-serif' },
        { id: 'kohinoor-telugu', name: 'Kohinoor Telugu', category: 'Sans', stack: '"Kohinoor Telugu", Arial, sans-serif' },
        { id: 'lao-sangam', name: 'Lao Sangam MN', category: 'Sans', stack: '"Lao Sangam MN", Arial, sans-serif' },
        { id: 'lucida-grande', name: 'Lucida Grande', category: 'Sans', stack: '"Lucida Grande", "Lucida Sans Unicode", sans-serif' },
        { id: 'luminari', name: 'Luminari', category: 'Display', stack: 'Luminari, fantasy' },
        { id: 'malayalam-sangam', name: 'Malayalam Sangam MN', category: 'Sans', stack: '"Malayalam Sangam MN", Arial, sans-serif' },
        { id: 'marker-felt', name: 'Marker Felt', category: 'Hand', stack: '"Marker Felt", "Bradley Hand", fantasy' },
        { id: 'menlo', name: 'Menlo', category: 'Mono', stack: 'Menlo, Monaco, "SF Mono", monospace' },
        { id: 'microsoft-sans-serif', name: 'Microsoft Sans Serif', category: 'Sans', stack: '"Microsoft Sans Serif", Arial, sans-serif' },
        { id: 'monaco', name: 'Monaco', category: 'Mono', stack: 'Monaco, Menlo, "SF Mono", monospace' },
        { id: 'myanmar-sangam', name: 'Myanmar Sangam MN', category: 'Sans', stack: '"Myanmar Sangam MN", Arial, sans-serif' },
        { id: 'new-york', name: 'New York', category: 'Serif', stack: '"New York", Georgia, serif' },
        { id: 'noto-sans', name: 'Noto Sans', category: 'Sans', stack: '"Noto Sans", Arial, sans-serif' },
        { id: 'noto-serif', name: 'Noto Serif', category: 'Serif', stack: '"Noto Serif", Georgia, serif' },
        { id: 'noteworthy', name: 'Noteworthy', category: 'Hand', stack: 'Noteworthy, "Bradley Hand", cursive' },
        { id: 'optima', name: 'Optima', category: 'Sans', stack: 'Optima, Candara, sans-serif' },
        { id: 'oriya-sangam', name: 'Oriya Sangam MN', category: 'Sans', stack: '"Oriya Sangam MN", Arial, sans-serif' },
        { id: 'palatino', name: 'Palatino', category: 'Serif', stack: 'Palatino, "Palatino Linotype", serif' },
        { id: 'papyrus', name: 'Papyrus', category: 'Display', stack: 'Papyrus, fantasy' },
        { id: 'phosphate', name: 'Phosphate', category: 'Display', stack: 'Phosphate, Impact, fantasy' },
        { id: 'pingfang-hk', name: 'PingFang HK', category: 'Sans', stack: '"PingFang HK", "Helvetica Neue", sans-serif' },
        { id: 'pingfang-sc', name: 'PingFang SC', category: 'Sans', stack: '"PingFang SC", "Helvetica Neue", sans-serif' },
        { id: 'pingfang-tc', name: 'PingFang TC', category: 'Sans', stack: '"PingFang TC", "Helvetica Neue", sans-serif' },
        { id: 'plantagenet-cherokee', name: 'Plantagenet Cherokee', category: 'Serif', stack: '"Plantagenet Cherokee", Georgia, serif' },
        { id: 'pt-mono', name: 'PT Mono', category: 'Mono', stack: '"PT Mono", "SF Mono", Menlo, monospace' },
        { id: 'pt-sans', name: 'PT Sans', category: 'Sans', stack: '"PT Sans", Arial, sans-serif' },
        { id: 'pt-serif', name: 'PT Serif', category: 'Serif', stack: '"PT Serif", Georgia, serif' },
        { id: 'rockwell', name: 'Rockwell', category: 'Serif', stack: 'Rockwell, "Courier New", serif' },
        { id: 'savoye-let', name: 'Savoye LET', category: 'Script', stack: '"Savoye LET", "Snell Roundhand", cursive' },
        { id: 'sf-compact', name: 'SF Compact', category: 'Sans', stack: '"SF Compact Text", "SF Pro Text", -apple-system, sans-serif' },
        { id: 'sf-compact-rounded', name: 'SF Compact Rounded', category: 'Rounded', stack: '"SF Compact Rounded", "SF Pro Rounded", sans-serif' },
        { id: 'mono', name: 'SF Mono', category: 'Mono', stack: '"SF Mono", Menlo, Monaco, Consolas, monospace' },
        { id: 'sf-pro', name: 'SF Pro', category: 'Sans', stack: '"SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif' },
        { id: 'sf-pro-display', name: 'SF Pro Display', category: 'Sans', stack: '"SF Pro Display", "SF Pro Text", -apple-system, sans-serif' },
        { id: 'rounded', name: 'SF Pro Rounded', category: 'Rounded', stack: '"SF Pro Rounded", "Avenir Next", "Nunito", sans-serif' },
        { id: 'silom', name: 'Silom', category: 'Sans', stack: 'Silom, Arial, sans-serif' },
        { id: 'sinhala-sangam', name: 'Sinhala Sangam MN', category: 'Sans', stack: '"Sinhala Sangam MN", Arial, sans-serif' },
        { id: 'skia', name: 'Skia', category: 'Display', stack: 'Skia, "Gill Sans", sans-serif' },
        { id: 'snell-roundhand', name: 'Snell Roundhand', category: 'Script', stack: '"Snell Roundhand", "Apple Chancery", cursive' },
        { id: 'songti-sc', name: 'Songti SC', category: 'Serif', stack: '"Songti SC", Georgia, serif' },
        { id: 'system', name: 'System', category: 'Sans', stack: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif' },
        { id: 'tahoma', name: 'Tahoma', category: 'Sans', stack: 'Tahoma, Geneva, sans-serif' },
        { id: 'tamil-sangam', name: 'Tamil Sangam MN', category: 'Sans', stack: '"Tamil Sangam MN", Arial, sans-serif' },
        { id: 'telugu-sangam', name: 'Telugu Sangam MN', category: 'Sans', stack: '"Telugu Sangam MN", Arial, sans-serif' },
        { id: 'thonburi', name: 'Thonburi', category: 'Sans', stack: 'Thonburi, Arial, sans-serif' },
        { id: 'times', name: 'Times', category: 'Serif', stack: 'Times, "Times New Roman", serif' },
        { id: 'times-new-roman', name: 'Times New Roman', category: 'Serif', stack: '"Times New Roman", Times, serif' },
        { id: 'trebuchet', name: 'Trebuchet MS', category: 'Sans', stack: '"Trebuchet MS", "Lucida Grande", sans-serif' },
        { id: 'verdana', name: 'Verdana', category: 'Sans', stack: 'Verdana, Geneva, sans-serif' },
        { id: 'zapfino', name: 'Zapfino', category: 'Script', stack: 'Zapfino, "Snell Roundhand", cursive' }
    ];
    const FONT_STACKS = Object.fromEntries(FONT_OPTIONS.map((font) => [font.id, font.stack]));
    const defaultSettings = {
        language: 'fr',
        theme: 'light',
        previewFont: 'system',
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
    let currentValueFormat = 'hex';
    let activeView = 'capture';
    let savedLibraryFilter = 'history';
    let savedLibrarySort = 'recent';
    let savedLibrarySearch = '';
    let isCreatingColor = false;
    let newColorOrigin = 'details';
    let newColorOriginalColor = DEFAULT_COLOR;
    let newColorFormat = 'hex';
    let newColorDraft = { h: 26, s: 100, v: 98 };
    let newColorPointerId = null;
    let settings = { ...defaultSettings };
    let isPicking = false;
    let isDeleteMode = false;
    let historyDragState = null;
    let suppressHistoryClick = false;
    let lastFocusedBeforeModal = null;
    const RING_IDLE_DURATION = 16000;
    const RING_IDLE_RATE = 1.25;
    const RING_ACTIVE_RATE = 8;
    let ringAnimations = [];
    let ringRateFrame = 0;
    let ringPlaybackRate = RING_IDLE_RATE;
    const systemThemeQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    const reducedMotionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

    const els = {
        captureView: document.getElementById('capture-view'),
        detailsView: document.getElementById('details-view'),
        savedLibraryView: document.getElementById('saved-library-view'),
        pickBtn: document.getElementById('pick-btn'),
        historyOpenBtn: document.getElementById('history-open-btn'),
        historyCount: document.getElementById('history-count'),
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
        intelligenceRings: Array.from(document.querySelectorAll('.intelligence-ring')),
        currentColorHex: document.getElementById('current-color-hex'),
        heroCopyBtn: document.getElementById('hero-copy-btn'),
        heroFavoriteBtn: document.getElementById('hero-favorite-btn'),
        colorFormatTabs: Array.from(document.querySelectorAll('.color-format-tab')),
        formatHex: document.getElementById('format-hex'),
        rgbValue: document.getElementById('rgb-value'),
        hslValue: document.getElementById('hsl-value'),
        oklchValue: document.getElementById('oklch-value'),
        fontControl: document.getElementById('font-control'),
        previewFontTrigger: document.getElementById('preview-font-trigger'),
        previewFontLabel: document.getElementById('preview-font-label'),
        fontPickerPanel: document.getElementById('font-picker-panel'),
        fontSearch: document.getElementById('font-search'),
        fontList: document.getElementById('font-list'),
        fontScrollbar: document.getElementById('font-scrollbar'),
        fontScrollbarThumb: document.getElementById('font-scrollbar-thumb'),
        usageInput: document.getElementById('usage-input'),
        usageButton: document.getElementById('usage-button'),
        usageText: document.getElementById('usage-text'),
        codeOutput: document.getElementById('code-output'),
        codeDisclosure: document.getElementById('code-disclosure'),
        codePanel: document.getElementById('code-panel'),
        inspectorToolTabs: Array.from(document.querySelectorAll('.inspector-tool-tab')),
        inspectorToolPanels: Array.from(document.querySelectorAll('[data-tool-panel-content]')),
        colorHistory: document.getElementById('color-history'),
        historyRow: document.querySelector('.saved-colors-section .history-row'),
        savedColorsMore: document.getElementById('saved-colors-more'),
        newColorEditor: document.getElementById('new-color-editor'),
        newColorSv: document.getElementById('new-color-sv'),
        newColorHue: document.getElementById('new-color-hue'),
        newColorFormatTabs: Array.from(document.querySelectorAll('[data-new-color-format]')),
        newColorPanels: Array.from(document.querySelectorAll('[data-new-color-panel]')),
        newColorHex: document.getElementById('new-color-hex'),
        newColorR: document.getElementById('new-color-r'),
        newColorG: document.getElementById('new-color-g'),
        newColorB: document.getElementById('new-color-b'),
        newColorH: document.getElementById('new-color-h'),
        newColorS: document.getElementById('new-color-s'),
        newColorL: document.getElementById('new-color-l'),
        newColorStatus: document.getElementById('new-color-status'),
        newColorSave: document.getElementById('new-color-save'),
        collectionPanel: document.getElementById('collection-panel'),
        clearCollectionBtn: document.getElementById('clear-collection-btn'),
        savedLibraryBack: document.getElementById('saved-library-back'),
        savedLibraryAdd: document.getElementById('saved-library-add'),
        savedLibrarySearchInput: document.getElementById('saved-library-search-input'),
        savedLibraryGrid: document.getElementById('saved-library-grid'),
        savedLibraryStatus: document.getElementById('saved-library-status'),
        savedLibraryFilters: Array.from(document.querySelectorAll('.saved-library-filter')),
        savedLibrarySortSelect: document.getElementById('saved-library-sort-select')
    };

    const translations = {
        en: {
            pageTitle: 'Color Picker Ultimate Edition',
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
            detailsTitle: 'Color Inspector',
            history: 'History',
            usage: 'Usage',
            formats: 'Formats',
            favorites: 'Favorites',
            noFavorites: 'No favorite colors yet',
            copiedChip: 'Copied',
            copied: 'Copied!',
            error: 'Error picking color',
            code: 'Code',
            font: 'Font',
            fontSearch: 'Search fonts',
            noResults: 'No results',
            supportFreeTools: 'Support free tools',
            pickColor: 'Pick color',
            back: 'Back',
            copyHex: 'Copy HEX',
            copyCode: 'Copy code',
            codeFormat: 'Code format',
            previewText: 'Preview text',
            colorCollection: 'Color collection',
            closeSettings: 'Close settings',
            addFavorite: 'Add to favorites',
            removeFavorite: 'Remove from favorites',
            clearHistory: 'Clear history',
            clearFavorites: 'Clear favorites',
            enterDeleteMode: 'Delete colors',
            exitDeleteMode: 'Done deleting',
            removeColor: 'Remove color',
            noHistory: 'No colors yet',
            colorNames: {
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
            }
        },
        fr: {
            pageTitle: 'Color Picker Ultimate Edition',
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
            detailsTitle: 'Inspecteur couleur',
            history: 'Historique',
            usage: 'Usage',
            formats: 'Formats',
            favorites: 'Favoris',
            noFavorites: 'Aucun favori pour le moment',
            copiedChip: 'Copié',
            copied: 'Copié !',
            error: 'Erreur lors de la sélection',
            code: 'Code',
            font: 'Police',
            fontSearch: 'Rechercher une police',
            noResults: 'Aucun résultat',
            supportFreeTools: 'Soutenir les outils gratuits',
            pickColor: 'Choisir une couleur',
            back: 'Retour',
            copyHex: 'Copier le HEX',
            copyCode: 'Copier le code',
            codeFormat: 'Format du code',
            previewText: 'Texte d\'aperçu',
            colorCollection: 'Collection de couleurs',
            closeSettings: 'Fermer les paramètres',
            addFavorite: 'Ajouter aux favoris',
            removeFavorite: 'Retirer des favoris',
            clearHistory: 'Vider l\'historique',
            clearFavorites: 'Vider les favoris',
            enterDeleteMode: 'Supprimer des couleurs',
            exitDeleteMode: 'Terminer la suppression',
            removeColor: 'Supprimer la couleur',
            noHistory: 'Aucune couleur pour le moment',
            colorNames: {
                '#2563EB': 'Bleu royal',
                '#7C3AED': 'Violet électrique',
                '#FF3B5F': 'Rouge corail',
                '#FF7A1A': 'Orange signal',
                '#10B981': 'Émeraude',
                '#06B6D4': 'Cyan',
                '#F9AB00': 'Ambre',
                '#111827': 'Encre',
                '#CBD5E1': 'Brume ardoise',
                '#EDE9FE': 'Lavande douce'
            }
        },
        es: {
            pageTitle: 'Color Picker Ultimate Edition',
            title: 'Color Picker',
            promo: '✨ ¿Más herramientas gratis? Visita bitek.fr ✨',
            settings: 'Configuración',
            language: 'Idioma',
            theme: 'Tema',
            system: 'Sistema',
            light: 'Claro',
            dark: 'Oscuro',
            midnight: 'Medianoche',
            latte: 'Latte',
            forest: 'Bosque',
            neon: 'Neón',
            rose: 'Rosa',
            custom: 'Personalizado',
            bgColor: 'Fondo',
            cardColor: 'Tarjeta',
            textColor: 'Texto',
            accentColor: 'Acento',
            buyCoffee: 'Invítame a un café',
            captureCta: 'Elige un color en pantalla',
            pickingCta: 'Selecciona un color en pantalla',
            detailsTitle: 'Inspector de color',
            history: 'Historial',
            usage: 'Uso',
            formats: 'Formatos',
            favorites: 'Favoritos',
            noFavorites: 'Aún no hay colores favoritos',
            copiedChip: 'Copiado',
            copied: '¡Copiado!',
            error: 'Error al elegir el color',
            code: 'Código',
            font: 'Fuente',
            fontSearch: 'Buscar fuentes',
            noResults: 'Sin resultados',
            supportFreeTools: 'Apoyar herramientas gratis',
            pickColor: 'Elegir color',
            back: 'Volver',
            copyHex: 'Copiar HEX',
            copyCode: 'Copiar código',
            codeFormat: 'Formato de código',
            previewText: 'Texto de vista previa',
            colorCollection: 'Colección de colores',
            closeSettings: 'Cerrar configuración',
            addFavorite: 'Añadir a favoritos',
            removeFavorite: 'Quitar de favoritos',
            colorNames: {
                '#2563EB': 'Azul real',
                '#7C3AED': 'Morado eléctrico',
                '#FF3B5F': 'Rojo coral',
                '#FF7A1A': 'Naranja señal',
                '#10B981': 'Esmeralda',
                '#06B6D4': 'Cian',
                '#F9AB00': 'Ámbar',
                '#111827': 'Tinta',
                '#CBD5E1': 'Niebla pizarra',
                '#EDE9FE': 'Lavanda suave'
            }
        },
        de: {
            pageTitle: 'Color Picker Ultimate Edition',
            title: 'Color Picker',
            promo: '✨ Mehr kostenlose Tools? Schau auf bitek.fr vorbei ✨',
            settings: 'Einstellungen',
            language: 'Sprache',
            theme: 'Design',
            system: 'System',
            light: 'Hell',
            dark: 'Dunkel',
            midnight: 'Mitternacht',
            latte: 'Latte',
            forest: 'Wald',
            neon: 'Neon',
            rose: 'Rose',
            custom: 'Benutzerdefiniert',
            bgColor: 'Hintergrund',
            cardColor: 'Karte',
            textColor: 'Text',
            accentColor: 'Akzent',
            buyCoffee: 'Spendiere mir einen Kaffee',
            captureCta: 'Farbe auf dem Bildschirm wählen',
            pickingCta: 'Wähle eine Farbe auf dem Bildschirm',
            detailsTitle: 'Farbinspektor',
            history: 'Verlauf',
            usage: 'Verwendung',
            formats: 'Formate',
            favorites: 'Favoriten',
            noFavorites: 'Noch keine Lieblingsfarben',
            copiedChip: 'Kopiert',
            copied: 'Kopiert!',
            error: 'Fehler beim Auswählen der Farbe',
            code: 'Code',
            font: 'Schrift',
            fontSearch: 'Schriften suchen',
            noResults: 'Keine Ergebnisse',
            supportFreeTools: 'Kostenlose Tools unterstützen',
            pickColor: 'Farbe wählen',
            back: 'Zurück',
            copyHex: 'HEX kopieren',
            copyCode: 'Code kopieren',
            codeFormat: 'Codeformat',
            previewText: 'Vorschautext',
            colorCollection: 'Farbsammlung',
            closeSettings: 'Einstellungen schließen',
            addFavorite: 'Zu Favoriten hinzufügen',
            removeFavorite: 'Aus Favoriten entfernen',
            colorNames: {
                '#2563EB': 'Königsblau',
                '#7C3AED': 'Elektrisches Violett',
                '#FF3B5F': 'Korallenrot',
                '#FF7A1A': 'Signalorange',
                '#10B981': 'Smaragd',
                '#06B6D4': 'Cyan',
                '#F9AB00': 'Bernstein',
                '#111827': 'Tinte',
                '#CBD5E1': 'Schiefernebel',
                '#EDE9FE': 'Sanftes Lavendel'
            }
        },
        pt: {
            pageTitle: 'Color Picker Ultimate Edition',
            title: 'Color Picker',
            promo: '✨ Mais ferramentas grátis? Confira bitek.fr ✨',
            settings: 'Configurações',
            language: 'Idioma',
            theme: 'Tema',
            system: 'Sistema',
            light: 'Claro',
            dark: 'Escuro',
            midnight: 'Meia-noite',
            latte: 'Latte',
            forest: 'Floresta',
            neon: 'Neon',
            rose: 'Rosa',
            custom: 'Personalizado',
            bgColor: 'Fundo',
            cardColor: 'Cartão',
            textColor: 'Texto',
            accentColor: 'Destaque',
            buyCoffee: 'Pague-me um café',
            captureCta: 'Escolha uma cor na tela',
            pickingCta: 'Selecione uma cor na tela',
            detailsTitle: 'Inspetor de cor',
            history: 'Histórico',
            usage: 'Uso',
            formats: 'Formatos',
            favorites: 'Favoritos',
            noFavorites: 'Ainda sem cores favoritas',
            copiedChip: 'Copiado',
            copied: 'Copiado!',
            error: 'Erro ao escolher a cor',
            code: 'Código',
            font: 'Fonte',
            fontSearch: 'Buscar fontes',
            noResults: 'Sem resultados',
            supportFreeTools: 'Apoiar ferramentas grátis',
            pickColor: 'Escolher cor',
            back: 'Voltar',
            copyHex: 'Copiar HEX',
            copyCode: 'Copiar código',
            codeFormat: 'Formato do código',
            previewText: 'Texto de pré-visualização',
            colorCollection: 'Coleção de cores',
            closeSettings: 'Fechar configurações',
            addFavorite: 'Adicionar aos favoritos',
            removeFavorite: 'Remover dos favoritos',
            colorNames: {
                '#2563EB': 'Azul real',
                '#7C3AED': 'Roxo elétrico',
                '#FF3B5F': 'Vermelho coral',
                '#FF7A1A': 'Laranja sinal',
                '#10B981': 'Esmeralda',
                '#06B6D4': 'Ciano',
                '#F9AB00': 'Âmbar',
                '#111827': 'Tinta',
                '#CBD5E1': 'Névoa ardósia',
                '#EDE9FE': 'Lavanda suave'
            }
        },
        zh: {
            pageTitle: 'Color Picker Ultimate Edition',
            title: 'Color Picker',
            promo: '✨ 想要更多免费工具？请访问 bitek.fr ✨',
            settings: '设置',
            language: '语言',
            theme: '主题',
            system: '系统',
            light: '浅色',
            dark: '深色',
            midnight: '午夜',
            latte: '拿铁',
            forest: '森林',
            neon: '霓虹',
            rose: '玫瑰',
            custom: '自定义',
            bgColor: '背景',
            cardColor: '卡片',
            textColor: '文字',
            accentColor: '强调色',
            buyCoffee: '请我喝咖啡',
            captureCta: '在屏幕上选择颜色',
            pickingCta: '请在屏幕上选择颜色',
            detailsTitle: '颜色检查器',
            history: '历史',
            usage: '用法',
            formats: '格式',
            favorites: '收藏',
            noFavorites: '还没有收藏颜色',
            copiedChip: '已复制',
            copied: '已复制！',
            error: '取色出错',
            code: '代码',
            font: '字体',
            fontSearch: '搜索字体',
            noResults: '无结果',
            supportFreeTools: '支持免费工具',
            pickColor: '选择颜色',
            back: '返回',
            copyHex: '复制 HEX',
            copyCode: '复制代码',
            codeFormat: '代码格式',
            previewText: '预览文本',
            colorCollection: '颜色集合',
            closeSettings: '关闭设置',
            addFavorite: '添加到收藏',
            removeFavorite: '从收藏中移除',
            colorNames: {
                '#2563EB': '皇家蓝',
                '#7C3AED': '电光紫',
                '#FF3B5F': '珊瑚红',
                '#FF7A1A': '信号橙',
                '#10B981': '祖母绿',
                '#06B6D4': '青色',
                '#F9AB00': '琥珀色',
                '#111827': '墨色',
                '#CBD5E1': '石板雾',
                '#EDE9FE': '柔和薰衣草'
            }
        },
        ja: {
            pageTitle: 'Color Picker Ultimate Edition',
            title: 'Color Picker',
            promo: '✨ 無料ツールをもっと見るなら bitek.fr ✨',
            settings: '設定',
            language: '言語',
            theme: 'テーマ',
            system: 'システム',
            light: 'ライト',
            dark: 'ダーク',
            midnight: 'ミッドナイト',
            latte: 'ラテ',
            forest: 'フォレスト',
            neon: 'ネオン',
            rose: 'ローズ',
            custom: 'カスタム',
            bgColor: '背景',
            cardColor: 'カード',
            textColor: 'テキスト',
            accentColor: 'アクセント',
            buyCoffee: 'コーヒーをおごる',
            captureCta: '画面上の色を選択',
            pickingCta: '画面上の色を選択してください',
            detailsTitle: 'カラーインスペクター',
            history: '履歴',
            usage: '使用例',
            formats: '形式',
            favorites: 'お気に入り',
            noFavorites: 'お気に入りの色はまだありません',
            copiedChip: 'コピー済み',
            copied: 'コピーしました！',
            error: '色の取得中にエラーが発生しました',
            code: 'コード',
            font: 'フォント',
            fontSearch: 'フォントを検索',
            noResults: '結果なし',
            supportFreeTools: '無料ツールを支援',
            pickColor: '色を選択',
            back: '戻る',
            copyHex: 'HEX をコピー',
            copyCode: 'コードをコピー',
            codeFormat: 'コード形式',
            previewText: 'プレビューテキスト',
            colorCollection: 'カラーコレクション',
            closeSettings: '設定を閉じる',
            addFavorite: 'お気に入りに追加',
            removeFavorite: 'お気に入りから削除',
            colorNames: {
                '#2563EB': 'ロイヤルブルー',
                '#7C3AED': 'エレクトリックパープル',
                '#FF3B5F': 'コーラルレッド',
                '#FF7A1A': 'シグナルオレンジ',
                '#10B981': 'エメラルド',
                '#06B6D4': 'シアン',
                '#F9AB00': 'アンバー',
                '#111827': 'インク',
                '#CBD5E1': 'スレートミスト',
                '#EDE9FE': 'ソフトラベンダー'
            }
        },
        ru: {
            pageTitle: 'Color Picker Ultimate Edition',
            title: 'Color Picker',
            promo: '✨ Больше бесплатных инструментов? Загляните на bitek.fr ✨',
            settings: 'Настройки',
            language: 'Язык',
            theme: 'Тема',
            system: 'Системная',
            light: 'Светлая',
            dark: 'Темная',
            midnight: 'Полночь',
            latte: 'Латте',
            forest: 'Лес',
            neon: 'Неон',
            rose: 'Роза',
            custom: 'Своя',
            bgColor: 'Фон',
            cardColor: 'Карточка',
            textColor: 'Текст',
            accentColor: 'Акцент',
            buyCoffee: 'Купить мне кофе',
            captureCta: 'Выберите цвет на экране',
            pickingCta: 'Выберите цвет на экране',
            detailsTitle: 'Инспектор',
            history: 'История',
            usage: 'Пример',
            formats: 'Форматы',
            favorites: 'Избранное',
            noFavorites: 'Избранных цветов пока нет',
            copiedChip: 'Скопировано',
            copied: 'Скопировано!',
            error: 'Ошибка выбора цвета',
            code: 'Код',
            font: 'Шрифт',
            fontSearch: 'Поиск шрифтов',
            noResults: 'Нет результатов',
            supportFreeTools: 'Поддержать бесплатные инструменты',
            pickColor: 'Выбрать цвет',
            back: 'Назад',
            copyHex: 'Копировать HEX',
            copyCode: 'Копировать код',
            codeFormat: 'Формат кода',
            previewText: 'Текст предпросмотра',
            colorCollection: 'Коллекция цветов',
            closeSettings: 'Закрыть настройки',
            addFavorite: 'Добавить в избранное',
            removeFavorite: 'Удалить из избранного',
            colorNames: {
                '#2563EB': 'Королевский синий',
                '#7C3AED': 'Электрический фиолетовый',
                '#FF3B5F': 'Кораллово-красный',
                '#FF7A1A': 'Сигнальный оранжевый',
                '#10B981': 'Изумрудный',
                '#06B6D4': 'Циан',
                '#F9AB00': 'Янтарный',
                '#111827': 'Чернила',
                '#CBD5E1': 'Сланцевый туман',
                '#EDE9FE': 'Мягкая лаванда'
            }
        }
    };

    const inspectorTranslations = {
        en: {
            currentColor: 'Current color', copyCurrentColor: 'Copy current color', favoriteAction: 'Favorite',
            preview: 'Preview', previewCaption: 'Test the color in context', previewFont: 'Preview font',
            textPreview: 'Text', buttonPreview: 'Button', values: 'Values', copyHint: 'Select a row to copy',
            codeCaption: 'CSS, Tailwind, SwiftUI and React', library: 'Library', recents: 'Recents',
            manage: 'Manage', done: 'Done', manageColors: 'Manage colors', moreTools: 'More Bitek tools',
            copyFailed: 'Unable to copy', eyedropperUnsupported: 'Color sampling is unavailable',
            savedColors: 'Saved colors', showAll: 'Show all', showLess: 'Show less', newColor: 'New color', colorFormat: 'Color format',
            backToInspector: 'Back to Color Inspector', searchHex: 'Search a HEX code…', filterColors: 'Filter colors', allColors: 'All',
            sortColors: 'Sort colors', sortRecent: 'Recent', sortOldest: 'Oldest', sortHex: 'HEX code', noSearchResults: 'No matching color', colorResults: 'colors displayed',
            copiedFormat: 'Copied', colorSelected: 'selected', favoriteState: 'favorite',
            saveColor: 'Save color', invalidColor: 'Enter a valid color', saturationBrightness: 'Saturation and brightness',
            hexValue: 'HEX code', hue: 'Hue', red: 'Red', green: 'Green', blue: 'Blue', saturation: 'Saturation', lightness: 'Lightness'
        },
        fr: {
            currentColor: 'Couleur actuelle', copyCurrentColor: 'Copier la couleur actuelle', favoriteAction: 'Favori',
            preview: 'Aperçu', previewCaption: 'Testez la couleur en contexte', previewFont: 'Police d’aperçu',
            textPreview: 'Texte', buttonPreview: 'Bouton', values: 'Valeurs', copyHint: 'Sélectionnez une ligne pour copier',
            codeCaption: 'CSS, Tailwind, SwiftUI et React', library: 'Bibliothèque', recents: 'Récentes',
            manage: 'Gérer', done: 'Terminé', manageColors: 'Gérer les couleurs', moreTools: 'Plus d’outils Bitek',
            copyFailed: 'Impossible de copier', eyedropperUnsupported: 'Le prélèvement de couleur est indisponible',
            savedColors: 'Couleurs enregistrées', showAll: 'Tout voir', showLess: 'Réduire', newColor: 'Nouvelle couleur', colorFormat: 'Format de couleur',
            backToInspector: 'Retour à l’inspecteur', searchHex: 'Rechercher un code HEX…', filterColors: 'Filtrer les couleurs', allColors: 'Toutes',
            sortColors: 'Trier les couleurs', sortRecent: 'Récentes', sortOldest: 'Anciennes', sortHex: 'Code HEX', noSearchResults: 'Aucune couleur correspondante', colorResults: 'couleurs affichées',
            copiedFormat: 'Copié', colorSelected: 'sélectionnée', favoriteState: 'favorite',
            saveColor: 'Enregistrer la couleur', invalidColor: 'Saisissez une couleur valide', saturationBrightness: 'Saturation et luminosité',
            hexValue: 'Code HEX', hue: 'Teinte', red: 'Rouge', green: 'Vert', blue: 'Bleu', saturation: 'Saturation', lightness: 'Luminosité'
        },
        es: {
            currentColor: 'Color actual', copyCurrentColor: 'Copiar color actual', favoriteAction: 'Favorito',
            preview: 'Vista previa', previewCaption: 'Prueba el color en contexto', previewFont: 'Fuente de vista previa',
            textPreview: 'Texto', buttonPreview: 'Botón', values: 'Valores', copyHint: 'Selecciona una fila para copiar',
            codeCaption: 'CSS, Tailwind, SwiftUI y React', library: 'Biblioteca', recents: 'Recientes',
            manage: 'Gestionar', done: 'Listo', manageColors: 'Gestionar colores', moreTools: 'Más herramientas Bitek',
            copyFailed: 'No se pudo copiar', eyedropperUnsupported: 'El muestreo de color no está disponible',
            savedColors: 'Colores guardados', showAll: 'Ver todo', showLess: 'Ver menos', newColor: 'Nuevo color', colorFormat: 'Formato de color',
            backToInspector: 'Volver al inspector', searchHex: 'Buscar un código HEX…', filterColors: 'Filtrar colores', allColors: 'Todos',
            sortColors: 'Ordenar colores', sortRecent: 'Recientes', sortOldest: 'Antiguos', sortHex: 'Código HEX', noSearchResults: 'Ningún color coincide', colorResults: 'colores mostrados',
            copiedFormat: 'Copiado', colorSelected: 'seleccionado', favoriteState: 'favorito',
            saveColor: 'Guardar color', invalidColor: 'Introduce un color válido', saturationBrightness: 'Saturación y brillo',
            hexValue: 'Código HEX', hue: 'Tono', red: 'Rojo', green: 'Verde', blue: 'Azul', saturation: 'Saturación', lightness: 'Luminosidad'
        },
        de: {
            currentColor: 'Aktuelle Farbe', copyCurrentColor: 'Aktuelle Farbe kopieren', favoriteAction: 'Favorit',
            preview: 'Vorschau', previewCaption: 'Farbe im Kontext testen', previewFont: 'Vorschauschrift',
            textPreview: 'Text', buttonPreview: 'Taste', values: 'Werte', copyHint: 'Zeile zum Kopieren auswählen',
            codeCaption: 'CSS, Tailwind, SwiftUI und React', library: 'Bibliothek', recents: 'Zuletzt',
            manage: 'Verwalten', done: 'Fertig', manageColors: 'Farben verwalten', moreTools: 'Weitere Bitek-Tools',
            copyFailed: 'Kopieren nicht möglich', eyedropperUnsupported: 'Farbaufnahme ist nicht verfügbar',
            savedColors: 'Gespeicherte Farben', showAll: 'Alle anzeigen', showLess: 'Weniger anzeigen', newColor: 'Neue Farbe', colorFormat: 'Farbformat',
            backToInspector: 'Zurück zum Inspektor', searchHex: 'HEX-Code suchen…', filterColors: 'Farben filtern', allColors: 'Alle',
            sortColors: 'Farben sortieren', sortRecent: 'Neueste', sortOldest: 'Älteste', sortHex: 'HEX-Code', noSearchResults: 'Keine passende Farbe', colorResults: 'Farben angezeigt',
            copiedFormat: 'Kopiert', colorSelected: 'ausgewählt', favoriteState: 'Favorit',
            saveColor: 'Farbe speichern', invalidColor: 'Gültige Farbe eingeben', saturationBrightness: 'Sättigung und Helligkeit',
            hexValue: 'HEX-Code', hue: 'Farbton', red: 'Rot', green: 'Grün', blue: 'Blau', saturation: 'Sättigung', lightness: 'Helligkeit'
        },
        pt: {
            currentColor: 'Cor atual', copyCurrentColor: 'Copiar cor atual', favoriteAction: 'Favorito',
            preview: 'Prévia', previewCaption: 'Teste a cor em contexto', previewFont: 'Fonte da prévia',
            textPreview: 'Texto', buttonPreview: 'Botão', values: 'Valores', copyHint: 'Selecione uma linha para copiar',
            codeCaption: 'CSS, Tailwind, SwiftUI e React', library: 'Biblioteca', recents: 'Recentes',
            manage: 'Gerenciar', done: 'Concluído', manageColors: 'Gerenciar cores', moreTools: 'Mais ferramentas Bitek',
            copyFailed: 'Não foi possível copiar', eyedropperUnsupported: 'A captura de cor não está disponível',
            savedColors: 'Cores salvas', showAll: 'Ver tudo', showLess: 'Ver menos', newColor: 'Nova cor', colorFormat: 'Formato de cor',
            backToInspector: 'Voltar ao inspetor', searchHex: 'Buscar um código HEX…', filterColors: 'Filtrar cores', allColors: 'Todas',
            sortColors: 'Ordenar cores', sortRecent: 'Recentes', sortOldest: 'Antigas', sortHex: 'Código HEX', noSearchResults: 'Nenhuma cor correspondente', colorResults: 'cores exibidas',
            copiedFormat: 'Copiado', colorSelected: 'selecionada', favoriteState: 'favorita',
            saveColor: 'Salvar cor', invalidColor: 'Insira uma cor válida', saturationBrightness: 'Saturação e brilho',
            hexValue: 'Código HEX', hue: 'Matiz', red: 'Vermelho', green: 'Verde', blue: 'Azul', saturation: 'Saturação', lightness: 'Luminosidade'
        },
        zh: {
            currentColor: '当前颜色', copyCurrentColor: '复制当前颜色', favoriteAction: '收藏',
            preview: '预览', previewCaption: '在情境中测试颜色', previewFont: '预览字体',
            textPreview: '文本', buttonPreview: '按钮', values: '颜色值', copyHint: '选择一行进行复制',
            codeCaption: 'CSS、Tailwind、SwiftUI 和 React', library: '颜色库', recents: '最近使用',
            manage: '管理', done: '完成', manageColors: '管理颜色', moreTools: '更多 Bitek 工具',
            copyFailed: '无法复制', eyedropperUnsupported: '颜色取样不可用',
            savedColors: '已保存颜色', showAll: '查看全部', showLess: '收起', newColor: '新颜色', colorFormat: '颜色格式',
            backToInspector: '返回颜色检查器', searchHex: '搜索 HEX 代码…', filterColors: '筛选颜色', allColors: '全部',
            sortColors: '排序颜色', sortRecent: '最近', sortOldest: '最早', sortHex: 'HEX 代码', noSearchResults: '没有匹配的颜色', colorResults: '种颜色已显示',
            copiedFormat: '已复制', colorSelected: '已选择', favoriteState: '已收藏',
            saveColor: '保存颜色', invalidColor: '请输入有效颜色', saturationBrightness: '饱和度和亮度',
            hexValue: 'HEX 代码', hue: '色相', red: '红色', green: '绿色', blue: '蓝色', saturation: '饱和度', lightness: '亮度'
        },
        ja: {
            currentColor: '現在のカラー', copyCurrentColor: '現在のカラーをコピー', favoriteAction: 'お気に入り',
            preview: 'プレビュー', previewCaption: 'カラーを実際の表示で確認', previewFont: 'プレビューフォント',
            textPreview: 'テキスト', buttonPreview: 'ボタン', values: 'カラー値', copyHint: '行を選択してコピー',
            codeCaption: 'CSS、Tailwind、SwiftUI、React', library: 'ライブラリ', recents: '最近使った項目',
            manage: '管理', done: '完了', manageColors: 'カラーを管理', moreTools: 'その他の Bitek ツール',
            copyFailed: 'コピーできませんでした', eyedropperUnsupported: 'カラー抽出は利用できません',
            savedColors: '保存したカラー', showAll: 'すべて表示', showLess: '折りたたむ', newColor: '新しいカラー', colorFormat: 'カラーフォーマット',
            backToInspector: 'インスペクターに戻る', searchHex: 'HEX コードを検索…', filterColors: 'カラーを絞り込む', allColors: 'すべて',
            sortColors: 'カラーを並べ替える', sortRecent: '新しい順', sortOldest: '古い順', sortHex: 'HEX コード', noSearchResults: '一致するカラーがありません', colorResults: '色を表示中',
            copiedFormat: 'コピー済み', colorSelected: '選択中', favoriteState: 'お気に入り',
            saveColor: 'カラーを保存', invalidColor: '有効なカラーを入力してください', saturationBrightness: '彩度と明るさ',
            hexValue: 'HEX コード', hue: '色相', red: '赤', green: '緑', blue: '青', saturation: '彩度', lightness: '明るさ'
        },
        ru: {
            currentColor: 'Текущий цвет', copyCurrentColor: 'Копировать текущий цвет', favoriteAction: 'Избранное',
            preview: 'Предпросмотр', previewCaption: 'Проверьте цвет в контексте', previewFont: 'Шрифт предпросмотра',
            textPreview: 'Текст', buttonPreview: 'Кнопка', values: 'Значения', copyHint: 'Выберите строку для копирования',
            codeCaption: 'CSS, Tailwind, SwiftUI и React', library: 'Библиотека', recents: 'Недавние',
            manage: 'Управлять', done: 'Готово', manageColors: 'Управлять цветами', moreTools: 'Другие инструменты Bitek',
            copyFailed: 'Не удалось скопировать', eyedropperUnsupported: 'Захват цвета недоступен',
            savedColors: 'Сохранённые цвета', showAll: 'Показать все', showLess: 'Свернуть', newColor: 'Новый цвет', colorFormat: 'Формат цвета',
            backToInspector: 'Назад к инспектору', searchHex: 'Найти HEX-код…', filterColors: 'Фильтровать цвета', allColors: 'Все',
            sortColors: 'Сортировать цвета', sortRecent: 'Недавние', sortOldest: 'Старые', sortHex: 'HEX-код', noSearchResults: 'Совпадений нет', colorResults: 'цветов показано',
            copiedFormat: 'Скопировано', colorSelected: 'выбрано', favoriteState: 'в избранном',
            saveColor: 'Сохранить цвет', invalidColor: 'Введите корректный цвет', saturationBrightness: 'Насыщенность и яркость',
            hexValue: 'HEX-код', hue: 'Тон', red: 'Красный', green: 'Зелёный', blue: 'Синий', saturation: 'Насыщенность', lightness: 'Светлота'
        }
    };

    Object.entries(inspectorTranslations).forEach(([language, entries]) => {
        Object.assign(translations[language], entries);
    });

    init();

    function init() {
        hydrateLucideIcons();
        loadSettings();
        loadColorHistory();
        loadFavoriteColors();
        setColor(DEFAULT_COLOR, { save: false });
        bindEvents();
        initRingMotion();
        syncUsagePreview();
        applyLocalPreviewState();
    }

    function hydrateLucideIcons() {
        document.querySelectorAll('[data-lucide-icon]').forEach((slot) => {
            slot.replaceChildren(createLucideIcon(slot.dataset.lucideIcon));
        });
    }

    function applyLocalPreviewState() {
        if (!['127.0.0.1', 'localhost'].includes(window.location.hostname)) return;
        const params = new URLSearchParams(window.location.search);
        const state = params.get('state') || 'default';
        const mockEyeDropperColor = params.get('mock-eyedropper');

        if (mockEyeDropperColor && isValidHex(mockEyeDropperColor)) {
            window.EyeDropper = class LocalPreviewEyeDropper {
                async open() {
                    await wait(420);
                    return { sRGBHex: mockEyeDropperColor.toUpperCase() };
                }
            };
        }

        const requestedView = params.get('view');
        if (!['details', 'library'].includes(requestedView)) {
            if (state === 'picking') window.requestAnimationFrame(enterPickingState);
            if (state === 'motion-cycle') window.requestAnimationFrame(runMotionPreviewCycle);
            return;
        }

        const previewColor = params.get('color');
        if (previewColor && isValidHex(previewColor)) {
            setColor(previewColor, { save: false });
        }
        if (state === 'saved-library-target') {
            colorHistory = [
                '#FFFFFF', '#6FA8F5', '#17191F', '#C764D5', '#F96B00',
                '#2F853D', '#08274D', '#6D7278', '#2563EB', '#06B6D4'
            ];
            currentCollection = 'history';
            setColor('#F96B00', { save: false });
        }
        if (state === 'saved-library-all-target') {
            colorHistory = [
                '#F96B00', '#6FA8F5', '#17191F', '#C764D5',
                '#FFFFFF', '#34C759', '#FF375F', '#FFD60A'
            ];
            favoriteColors = [];
            savedLibraryFilter = 'history';
            savedLibrarySort = 'recent';
            savedLibrarySearch = '';
            setColor('#F96B00', { save: false });
            setSavedLibraryFilter('history');
            els.savedLibrarySortSelect.value = 'recent';
            renderSavedLibrary();
        }
        showView(requestedView === 'library' ? 'library' : 'details');
        const previewTheme = params.get('theme');
        if (previewTheme === 'light' || previewTheme === 'dark') {
            settings.theme = previewTheme;
            applySettings();
        }

        if (state === 'favorites') {
            if (!isFavoriteColor(currentColor)) favoriteColors = [currentColor];
            updateFavoriteControl();
            setCollection('favorites');
            setInspectorTool('library');
        }
        if (state === 'empty') {
            favoriteColors = [];
            if (requestedView === 'library') colorHistory = [];
            updateFavoriteControl();
            if (requestedView === 'library') {
                setSavedLibraryFilter('history');
            } else {
                setCollection('favorites');
                setInspectorTool('library');
            }
        }

        window.requestAnimationFrame(() => {
            if (state === 'new-color-target') openNewColorEditor('details');
            if (state === 'font') openInterfaceFontPicker();
            if (state === 'settings') openSettings(document.querySelector('.settings-trigger'));
            if (state === 'code') {
                setInspectorTool('code');
            }
            if (state === 'manage') {
                setInspectorTool('library');
                toggleDeleteMode();
            }
            if (state === 'copy') showToast(t('copied'));
            if (state === 'focus') els.backBtn.focus();
            if (state === 'picking') enterPickingState();
            if (state === 'motion-cycle') runMotionPreviewCycle();
        });
    }

    function runMotionPreviewCycle() {
        enterPickingState();
        window.setTimeout(exitPickingState, 420);
    }

    function initRingMotion() {
        if (!els.intelligenceRings.length || (reducedMotionQuery && reducedMotionQuery.matches)) {
            document.documentElement.dataset.ringMotion = 'reduced';
            return;
        }

        const sharedTime = performance.now() % RING_IDLE_DURATION;
        ringAnimations = els.intelligenceRings.map((ring) => {
            const animation = ring.animate(
                [
                    { transform: 'rotate(0deg)' },
                    { transform: 'rotate(360deg)' }
                ],
                {
                    duration: RING_IDLE_DURATION,
                    iterations: Infinity,
                    easing: 'linear'
                }
            );
            animation.currentTime = sharedTime;
            animation.playbackRate = ringPlaybackRate;
            return animation;
        });
        document.documentElement.dataset.ringMotion = 'idle';
    }

    function setRingMotion(active) {
        document.documentElement.dataset.ringMotion = active ? 'active' : 'idle';
        if (!ringAnimations.length) return;

        const targetRate = active ? RING_ACTIVE_RATE : RING_IDLE_RATE;
        const duration = active ? 260 : 650;
        const startRate = ringPlaybackRate;
        const startedAt = performance.now();

        if (ringRateFrame) window.cancelAnimationFrame(ringRateFrame);

        const update = (now) => {
            const progress = Math.min(1, (now - startedAt) / duration);
            const eased = progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;
            ringPlaybackRate = startRate + (targetRate - startRate) * eased;

            ringAnimations.forEach((animation) => {
                animation.playbackRate = ringPlaybackRate;
            });

            if (progress < 1) {
                ringRateFrame = window.requestAnimationFrame(update);
            } else {
                ringPlaybackRate = targetRate;
                ringRateFrame = 0;
            }
        };

        ringRateFrame = window.requestAnimationFrame(update);
    }

    function bindEvents() {
        els.pickBtn.addEventListener('click', pickColor);
        els.heroSwatch.addEventListener('click', () => {
            if (isCreatingColor) {
                els.newColorSv.focus();
                return;
            }
            pickColor();
        });
        els.historyOpenBtn.addEventListener('click', () => showView('details'));
        els.backBtn.addEventListener('click', () => {
            if (isCreatingColor) {
                closeNewColorEditor({ save: false });
                return;
            }
            showView('capture');
        });
        els.usageInput.addEventListener('input', syncUsagePreview);
        els.previewFontTrigger.addEventListener('click', toggleFontPicker);
        els.fontSearch.addEventListener('input', renderFontOptions);
        els.fontSearch.addEventListener('keydown', handleFontSearchKeydown);
        els.fontList.addEventListener('scroll', updateFontScrollbar);
        window.addEventListener('resize', updateFontScrollbar);
        document.addEventListener('click', closeFontPickerFromOutside);
        document.addEventListener('keydown', handleGlobalKeydown);

        document.querySelectorAll('.history-selector-option').forEach((button) => {
            button.addEventListener('click', () => {
                setCollection(button.dataset.collection);
            });
            button.addEventListener('keydown', handleCollectionKeydown);
        });
        els.colorFormatTabs.forEach((button) => {
            button.addEventListener('click', () => selectColorFormat(button.dataset.colorFormat));
            button.addEventListener('keydown', handleColorFormatKeydown);
        });
        els.savedColorsMore.addEventListener('click', openSavedLibrary);
        els.savedLibraryBack.addEventListener('click', closeSavedLibrary);
        els.savedLibraryAdd.addEventListener('click', () => openNewColorEditor('library'));
        els.savedLibrarySearchInput.addEventListener('input', (event) => {
            savedLibrarySearch = event.target.value;
            renderSavedLibrary();
        });
        els.savedLibraryFilters.forEach((button) => {
            button.addEventListener('click', () => setSavedLibraryFilter(button.dataset.libraryFilter));
            button.addEventListener('keydown', handleSavedLibraryFilterKeydown);
        });
        els.savedLibrarySortSelect.addEventListener('change', (event) => {
            savedLibrarySort = ['recent', 'oldest', 'hex'].includes(event.target.value)
                ? event.target.value
                : 'recent';
            renderSavedLibrary();
        });
        els.newColorSv.addEventListener('pointerdown', handleNewColorSvPointerDown);
        els.newColorSv.addEventListener('pointermove', handleNewColorSvPointerMove);
        els.newColorSv.addEventListener('pointerup', handleNewColorSvPointerEnd);
        els.newColorSv.addEventListener('pointercancel', handleNewColorSvPointerEnd);
        els.newColorSv.addEventListener('keydown', handleNewColorSvKeydown);
        els.newColorHue.addEventListener('input', handleNewColorHueInput);
        els.newColorHue.addEventListener('keydown', handleNewColorHueKeydown);
        els.newColorFormatTabs.forEach((button) => {
            button.addEventListener('click', () => selectNewColorFormat(button.dataset.newColorFormat));
            button.addEventListener('keydown', handleNewColorFormatKeydown);
        });
        [els.newColorHex, els.newColorR, els.newColorG, els.newColorB, els.newColorH, els.newColorS, els.newColorL]
            .forEach((input) => input.addEventListener('input', handleNewColorValueInput));
        els.newColorSave.addEventListener('click', () => closeNewColorEditor({ save: true }));
        els.historyRow.addEventListener('pointerdown', startHistoryDrag);
        els.historyRow.addEventListener('pointermove', moveHistoryDrag);
        els.historyRow.addEventListener('pointerup', endHistoryDrag);
        els.historyRow.addEventListener('pointercancel', endHistoryDrag);
        els.historyRow.addEventListener('click', preventClickAfterHistoryDrag, true);
        els.historyRow.addEventListener('wheel', scrollHistoryWithWheel, { passive: false });
        els.clearCollectionBtn.addEventListener('click', toggleDeleteMode);
        els.heroFavoriteBtn.addEventListener('click', () => toggleFavorite(currentColor));
        els.heroCopyBtn.addEventListener('click', () => copyToClipboard(getCopyValue(currentValueFormat), true, els.heroCopyBtn));
        els.codeDisclosure.addEventListener('click', toggleCodePanel);
        els.inspectorToolTabs.forEach((button) => {
            button.addEventListener('click', () => setInspectorTool(button.dataset.toolPanel));
            button.addEventListener('keydown', handleInspectorToolKeydown);
        });

        document.querySelectorAll('.settings-trigger').forEach((button) => {
            button.addEventListener('click', () => openSettings(button));
        });

        document.querySelectorAll('#coffee-btn, .coffee-trigger').forEach((button) => {
            button.addEventListener('click', () => {
                window.open('https://buymeacoffee.com/bitek', '_blank', 'noopener,noreferrer');
            });
        });

        els.closeSettings.addEventListener('click', closeSettingsModal);
        els.settingsModal.addEventListener('click', (event) => {
            if (event.target === els.settingsModal) closeSettingsModal();
        });

        els.languageSelect.addEventListener('change', (event) => {
            settings.language = event.target.value;
            saveSettings();
            applyTranslations();
            refreshLocalizedDynamicText();
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
            button.addEventListener('click', () => selectCodeFormat(button));
            button.addEventListener('keydown', handleCodeTabKeydown);
        });

        document.querySelectorAll('.copy-action').forEach((button) => {
            button.addEventListener('click', async (event) => {
                const isFormatRow = button.classList.contains('format-row');
                await copyToClipboard(
                    getCopyValue(button.dataset.copyKind),
                    !isFormatRow,
                    isFormatRow ? null : button
                );
                if (isFormatRow && event.detail > 0) button.blur();
            });
        });

        if (systemThemeQuery) {
            systemThemeQuery.addEventListener('change', () => {
                if (settings.theme === 'system') applyTheme();
            });
        }
    }

    function openSettings(trigger) {
        lastFocusedBeforeModal = trigger || document.activeElement;
        els.settingsModal.classList.remove('hidden');
        els.settingsModal.setAttribute('aria-hidden', 'false');
        window.setTimeout(() => els.closeSettings.focus(), 0);
    }

    function closeSettingsModal() {
        els.settingsModal.classList.add('hidden');
        els.settingsModal.setAttribute('aria-hidden', 'true');
        if (lastFocusedBeforeModal && typeof lastFocusedBeforeModal.focus === 'function') {
            lastFocusedBeforeModal.focus();
        }
    }

    function handleGlobalKeydown(event) {
        if (event.key === 'Escape') {
            if (!els.settingsModal.classList.contains('hidden')) {
                event.preventDefault();
                closeSettingsModal();
                return;
            }
            if (!els.fontPickerPanel.classList.contains('hidden')) {
                event.preventDefault();
                closeFontPicker();
                els.previewFontTrigger.focus();
                return;
            }
            if (isCreatingColor) {
                event.preventDefault();
                closeNewColorEditor({ save: false });
                return;
            }
            if (activeView === 'library') {
                event.preventDefault();
                closeSavedLibrary();
            }
        }

        if (event.key === 'Tab' && !els.settingsModal.classList.contains('hidden')) {
            const focusable = Array.from(els.settingsModal.querySelectorAll('button, select, input, a[href], [tabindex]:not([tabindex="-1"])'))
                .filter((element) => !element.disabled && !element.classList.contains('hidden'));
            if (!focusable.length) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    }

    function toggleCodePanel() {
        const willOpen = els.codePanel.classList.contains('hidden');
        els.codePanel.classList.toggle('hidden', !willOpen);
        els.codeDisclosure.setAttribute('aria-expanded', String(willOpen));
    }

    function setInspectorTool(tool) {
        els.inspectorToolTabs.forEach((button) => {
            const selected = button.dataset.toolPanel === tool;
            button.classList.toggle('active', selected);
            button.setAttribute('aria-selected', String(selected));
            button.tabIndex = selected ? 0 : -1;
        });

        els.inspectorToolPanels.forEach((panel) => {
            panel.classList.toggle('hidden', panel.dataset.toolPanelContent !== tool);
        });

        if (tool === 'code') {
            els.codePanel.classList.remove('hidden');
            els.codeDisclosure.setAttribute('aria-expanded', 'true');
        }
        closeFontPicker();
    }

    function handleInspectorToolKeydown(event) {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const tabs = els.inspectorToolTabs;
        const currentIndex = tabs.indexOf(event.currentTarget);
        let nextIndex = currentIndex;
        if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabs.length;
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = tabs.length - 1;
        setInspectorTool(tabs[nextIndex].dataset.toolPanel);
        tabs[nextIndex].focus();
    }

    function selectCodeFormat(button) {
        currentCodeFormat = button.dataset.codeFormat;
        document.querySelectorAll('.code-tab').forEach((tab) => {
            const isActive = tab === button;
            tab.classList.toggle('active', isActive);
            tab.setAttribute('aria-selected', String(isActive));
            tab.tabIndex = isActive ? 0 : -1;
        });
        updateCodeOutput();
    }

    function handleCodeTabKeydown(event) {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        const tabs = Array.from(document.querySelectorAll('.code-tab'));
        const currentIndex = tabs.indexOf(event.currentTarget);
        let nextIndex = currentIndex;
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = tabs.length - 1;
        if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabs.length;
        event.preventDefault();
        selectCodeFormat(tabs[nextIndex]);
        tabs[nextIndex].focus();
    }

    function handleCollectionKeydown(event) {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        const tabs = Array.from(document.querySelectorAll('.history-selector-option'));
        const currentIndex = tabs.indexOf(event.currentTarget);
        let nextIndex = currentIndex;
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = tabs.length - 1;
        if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabs.length;
        event.preventDefault();
        tabs[nextIndex].focus();
        setCollection(tabs[nextIndex].dataset.collection);
    }

    function handleSavedLibraryFilterKeydown(event) {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        const tabs = els.savedLibraryFilters;
        const currentIndex = tabs.indexOf(event.currentTarget);
        let nextIndex = currentIndex;
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = tabs.length - 1;
        if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabs.length;
        event.preventDefault();
        setSavedLibraryFilter(tabs[nextIndex].dataset.libraryFilter, true);
    }

    function setSavedLibraryFilter(filter, moveFocus = false) {
        savedLibraryFilter = filter === 'favorites' ? 'favorites' : 'history';
        els.savedLibraryFilters.forEach((button) => {
            const selected = button.dataset.libraryFilter === savedLibraryFilter;
            button.classList.toggle('active', selected);
            button.setAttribute('aria-selected', String(selected));
            button.tabIndex = selected ? 0 : -1;
            if (selected && moveFocus) button.focus();
        });
        renderSavedLibrary();
    }

    function selectColorFormat(format, moveFocus = false) {
        if (!COLOR_VALUE_FORMATS.includes(format)) return;
        currentValueFormat = format;
        els.colorFormatTabs.forEach((button) => {
            const selected = button.dataset.colorFormat === currentValueFormat;
            button.classList.toggle('active', selected);
            button.setAttribute('aria-selected', String(selected));
            button.tabIndex = selected ? 0 : -1;
            if (selected && moveFocus) button.focus();
        });
        updateColorFormatControl();
    }

    function handleColorFormatKeydown(event) {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        const currentIndex = els.colorFormatTabs.indexOf(event.currentTarget);
        let nextIndex = currentIndex;
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = els.colorFormatTabs.length - 1;
        if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + els.colorFormatTabs.length) % els.colorFormatTabs.length;
        if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % els.colorFormatTabs.length;
        event.preventDefault();
        selectColorFormat(els.colorFormatTabs[nextIndex].dataset.colorFormat, true);
    }

    async function pickColor() {
        if (isPicking) return;

        if (!window.EyeDropper) {
            showToast(t('eyedropperUnsupported'), 'error');
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
        activeView = ['capture', 'details', 'library'].includes(view) ? view : 'capture';
        if (activeView !== 'details') closeFontPicker();
        const views = [
            [els.captureView, 'capture'],
            [els.detailsView, 'details'],
            [els.savedLibraryView, 'library']
        ];
        views.forEach(([element, name]) => {
            const visible = activeView === name;
            element.classList.toggle('hidden', !visible);
            element.setAttribute('aria-hidden', String(!visible));
        });
    }

    function openSavedLibrary() {
        savedLibraryFilter = 'history';
        savedLibrarySort = 'recent';
        savedLibrarySearch = '';
        els.savedLibrarySearchInput.value = '';
        els.savedLibrarySortSelect.value = savedLibrarySort;
        setSavedLibraryFilter(savedLibraryFilter);
        showView('library');
        window.requestAnimationFrame(() => els.savedLibrarySearchInput.focus());
    }

    function closeSavedLibrary() {
        showView('details');
        window.requestAnimationFrame(() => els.savedColorsMore.focus());
    }

    function enterPickingState() {
        isPicking = true;
        setRingMotion(true);
        els.pickBtn.classList.remove('picked-success');
        els.heroSwatch.classList.remove('picked-success');
        els.pickBtn.classList.add('is-picking');
        els.heroSwatch.classList.add('is-picking');
        els.captureFeedback.classList.add('hidden');
    }

    function exitPickingState() {
        isPicking = false;
        setRingMotion(false);
        els.pickBtn.classList.remove('is-picking');
        els.heroSwatch.classList.remove('is-picking');
    }

    async function showPickedSuccess(hex) {
        exitPickingState();
        els.captureFeedback.textContent = `${hex} ${t('copied').replace('!', '').trim()}`;
        els.captureFeedback.classList.remove('hidden');
        els.pickBtn.classList.add('picked-success');
        els.heroSwatch.classList.add('picked-success');
        await wait(360);
        els.pickBtn.classList.remove('picked-success');
        els.heroSwatch.classList.remove('picked-success');
        els.captureFeedback.classList.add('hidden');
    }

    function setColor(hex, options = { save: false }) {
        if (!isValidHex(hex)) return;
        currentColor = hex.toUpperCase();
        document.documentElement.style.setProperty('--selected-color', currentColor);
        document.documentElement.style.setProperty('--selected-contrast', readableForeground(currentColor));

        const rgb = hexToRgb(currentColor);
        const hsl = hexToHsl(currentColor);
        const oklch = hexToOklch(currentColor);

        els.formatHex.textContent = currentColor;
        els.rgbValue.textContent = rgb;
        els.hslValue.textContent = hsl;
        els.oklchValue.textContent = oklch;

        syncUsagePreview();
        updateCodeOutput();
        if (options.save) addToHistory(currentColor);
        updateColorFormatControl();
        updateCopyLabels();
        updateFavoriteControl();
        if (!options.save && options.renderCollections !== false) renderHistory();
    }

    function wait(ms) {
        return new Promise((resolve) => window.setTimeout(resolve, ms));
    }

    function syncUsagePreview() {
        const value = els.usageInput.value.trim() || t('textPreview');
        els.usageButton.textContent = value;
        els.usageText.textContent = value;
    }

    function readableForeground(hex) {
        const rgb = hexToRgbObject(hex);
        const luminance = [rgb.r, rgb.g, rgb.b]
            .map((channel) => channel / 255)
            .map((channel) => channel <= 0.04045 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4))
            .reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0);
        const whiteContrast = 1.05 / (luminance + 0.05);
        const blackContrast = (luminance + 0.05) / 0.05;
        return whiteContrast >= blackContrast ? '#FFFFFF' : '#0B0B0F';
    }

    function updateCopyLabels() {
        const values = {
            hex: currentColor,
            rgb: els.rgbValue.textContent,
            hsl: els.hslValue.textContent,
            oklch: els.oklchValue.textContent
        };
        document.querySelectorAll('.format-row').forEach((button) => {
            const kind = button.dataset.copyKind;
            button.setAttribute('aria-label', `${t('copyHex').replace('HEX', kind.toUpperCase())} ${values[kind]}`);
        });
        updateColorFormatControl();
        els.heroSwatch.setAttribute('aria-label', t('pickColor'));
    }

    function updateColorFormatControl() {
        const value = getCopyValue(currentValueFormat);
        const formatLabel = currentValueFormat.toUpperCase();
        els.currentColorHex.textContent = value;
        els.currentColorHex.dataset.format = currentValueFormat;
        els.heroCopyBtn.setAttribute('aria-label', `${t('copyHex').replace('HEX', formatLabel)} ${value}`);
        els.heroCopyBtn.title = t('copyHex').replace('HEX', formatLabel);
    }

    function updateFavoriteControl() {
        const favorite = isFavoriteColor(currentColor);
        els.heroFavoriteBtn.classList.toggle('active', favorite);
        els.heroFavoriteBtn.setAttribute('aria-pressed', String(favorite));
        els.heroFavoriteBtn.setAttribute('aria-label', favorite ? t('removeFavorite') : t('addFavorite'));
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
        els.historyCount.textContent = String(Math.min(colorHistory.length, MAX_HISTORY));

        const colors = currentCollection === 'favorites'
            ? favoriteColors.slice(0, MAX_HISTORY)
            : colorHistory.slice(0, MAX_HISTORY);
        const visibleColors = colors.slice(0, COLLAPSED_SAVED_COLORS);

        if (!colors.length) {
            const empty = document.createElement('p');
            empty.className = 'history-empty';
            empty.textContent = currentCollection === 'favorites' ? t('noFavorites') : t('noHistory');
            els.colorHistory.appendChild(empty);
        }

        visibleColors.forEach((hex) => {
            if (!isValidHex(hex)) return;
            const isSelected = hex.toLowerCase() === currentColor.toLowerCase();
            const card = document.createElement('div');
            card.className = `history-card${isSelected ? ' active' : ''}`;
            card.style.setProperty('--history-color', hex);

            const colorButton = document.createElement('button');
            colorButton.type = 'button';
            colorButton.className = 'history-color-button';
            colorButton.title = hex.toUpperCase();
            const stateLabels = [];
            if (isSelected) stateLabels.push(t('colorSelected'));
            colorButton.setAttribute('aria-label', `${hex.toUpperCase()}, RGB ${hexToRgb(hex)}${stateLabels.length ? `, ${stateLabels.join(', ')}` : ''}`);
            colorButton.setAttribute('aria-pressed', String(isSelected));

            const swatch = document.createElement('span');
            swatch.className = 'history-swatch';
            swatch.setAttribute('aria-hidden', 'true');

            const meta = document.createElement('span');
            meta.className = 'saved-library-meta history-meta';
            const label = document.createElement('strong');
            label.className = 'history-label';
            label.textContent = hex.toUpperCase();
            const rgbLabel = document.createElement('span');
            rgbLabel.className = 'history-rgb';
            rgbLabel.textContent = `RGB ${hexToRgb(hex)}`;
            meta.append(label, rgbLabel);
            colorButton.append(swatch, meta);
            colorButton.addEventListener('click', () => setColor(hex, { save: false }));

            if (isDeleteMode) {
                colorButton.disabled = true;
                const actionButton = document.createElement('button');
                actionButton.type = 'button';
                actionButton.className = 'history-delete-toggle';
                actionButton.setAttribute('aria-label', `${t('removeColor')} ${hex.toUpperCase()}`);
                actionButton.innerHTML = '<span aria-hidden="true">−</span>';
                actionButton.addEventListener('click', () => removeColorFromCurrentCollection(hex));
                card.append(colorButton, actionButton);
            } else {
                card.append(colorButton);
            }

            els.colorHistory.appendChild(card);
        });

        const newColorButton = document.createElement('button');
        newColorButton.type = 'button';
        newColorButton.className = 'history-new-color';
        newColorButton.setAttribute('aria-label', t('newColor'));
        newColorButton.innerHTML = `
            <span class="history-new-color-icon" aria-hidden="true">+</span>
            <span class="history-new-color-label">${t('newColor')}</span>`;
        newColorButton.addEventListener('click', () => openNewColorEditor('details'));
        els.colorHistory.appendChild(newColorButton);
        updateSavedColorsDisclosure(colors.length);
        renderSavedLibrary();
    }

    function renderSavedLibrary() {
        if (!els.savedLibraryGrid) return;

        const source = savedLibraryFilter === 'favorites' ? favoriteColors : colorHistory;
        const query = savedLibrarySearch.trim().replace(/\s+/g, '').replace(/^#/, '').toUpperCase();
        let colors = source
            .filter(isValidHex)
            .filter((hex) => !query || hex.slice(1).toUpperCase().includes(query));

        if (savedLibrarySort === 'oldest') colors = colors.slice().reverse();
        if (savedLibrarySort === 'hex') colors = colors.slice().sort((a, b) => a.localeCompare(b));

        els.savedLibraryGrid.textContent = '';
        els.savedLibraryStatus.textContent = `${colors.length} ${t('colorResults')}`;

        if (!colors.length) {
            const empty = document.createElement('p');
            empty.className = 'saved-library-empty';
            empty.setAttribute('role', 'status');
            empty.textContent = query
                ? t('noSearchResults')
                : (savedLibraryFilter === 'favorites' ? t('noFavorites') : t('noHistory'));
            els.savedLibraryGrid.appendChild(empty);
            return;
        }

        colors.forEach((hex) => {
            const normalized = hex.toUpperCase();
            const isSelected = normalized === currentColor.toUpperCase();
            const isFavorite = isFavoriteColor(normalized);
            const card = document.createElement('article');
            card.className = `saved-library-card${isSelected ? ' active' : ''}`;
            card.style.setProperty('--library-color', normalized);
            card.setAttribute('role', 'listitem');

            const colorButton = document.createElement('button');
            colorButton.type = 'button';
            colorButton.className = 'saved-library-color-button';
            colorButton.setAttribute('aria-pressed', String(isSelected));
            colorButton.setAttribute('aria-label', `${normalized}, RGB ${hexToRgb(normalized)}${isSelected ? `, ${t('colorSelected')}` : ''}`);

            const swatch = document.createElement('span');
            swatch.className = 'saved-library-swatch';
            swatch.setAttribute('aria-hidden', 'true');

            const meta = document.createElement('span');
            meta.className = 'saved-library-meta';
            const hexLabel = document.createElement('strong');
            hexLabel.textContent = normalized;
            const rgbLabel = document.createElement('span');
            rgbLabel.textContent = `RGB ${hexToRgb(normalized)}`;
            meta.append(hexLabel, rgbLabel);
            colorButton.append(swatch, meta);
            colorButton.addEventListener('click', () => {
                setColor(normalized, { save: false });
                showView('details');
                window.requestAnimationFrame(() => els.heroSwatch.focus());
            });

            const favoriteButton = document.createElement('button');
            favoriteButton.type = 'button';
            favoriteButton.className = `saved-library-favorite${isFavorite ? ' active' : ''}`;
            favoriteButton.dataset.color = normalized;
            favoriteButton.setAttribute('aria-pressed', String(isFavorite));
            favoriteButton.setAttribute('aria-label', `${t(isFavorite ? 'removeFavorite' : 'addFavorite')} ${normalized}`);
            favoriteButton.title = t(isFavorite ? 'removeFavorite' : 'addFavorite');
            favoriteButton.append(createLucideIcon('Star'));
            favoriteButton.addEventListener('click', () => {
                const shouldRestoreFilterFocus = savedLibraryFilter === 'favorites' && isFavorite;
                toggleFavorite(normalized);
                window.requestAnimationFrame(() => {
                    if (shouldRestoreFilterFocus) {
                        const selectedFilter = els.savedLibraryFilters.find((button) => button.dataset.libraryFilter === savedLibraryFilter);
                        if (selectedFilter) selectedFilter.focus();
                        return;
                    }
                    const restoredFavorite = Array.from(els.savedLibraryGrid.querySelectorAll('.saved-library-favorite'))
                        .find((button) => button.dataset.color === normalized);
                    if (restoredFavorite) restoredFavorite.focus();
                });
            });

            card.append(colorButton, favoriteButton);
            els.savedLibraryGrid.appendChild(card);
        });
    }

    function openNewColorEditor(origin = activeView) {
        newColorOrigin = origin === 'library' ? 'library' : 'details';
        newColorOriginalColor = currentColor;
        newColorDraft = hexToHsv(currentColor);
        isCreatingColor = true;

        showView('details');
        els.detailsView.classList.add('is-creating-color');
        els.newColorEditor.classList.remove('hidden');
        els.newColorEditor.setAttribute('aria-hidden', 'false');
        selectNewColorFormat('hex');
        applyNewColorDraft();
        window.requestAnimationFrame(() => els.newColorSv.focus());
    }

    function closeNewColorEditor({ save }) {
        if (!isCreatingColor) return;
        if (save && els.newColorSave.disabled) {
            const invalidInput = getActiveNewColorInputs().find((input) => input.getAttribute('aria-invalid') === 'true');
            if (invalidInput) invalidInput.focus();
            return;
        }

        const destination = newColorOrigin;
        const nextColor = save ? hsvToHex(newColorDraft) : newColorOriginalColor;
        isCreatingColor = false;
        newColorPointerId = null;
        els.detailsView.classList.remove('is-creating-color');
        els.newColorEditor.classList.add('hidden');
        els.newColorEditor.setAttribute('aria-hidden', 'true');
        setColor(nextColor, { save: Boolean(save) });
        showView(destination);

        window.requestAnimationFrame(() => {
            if (destination === 'library') {
                if (save) {
                    const selected = els.savedLibraryGrid.querySelector('.saved-library-card.active .saved-library-color-button');
                    if (selected) {
                        selected.focus();
                        return;
                    }
                }
                els.savedLibraryAdd.focus();
                return;
            }

            const target = save
                ? els.colorHistory.querySelector('.history-card.active .history-color-button')
                : els.colorHistory.querySelector('.history-new-color');
            (target || els.heroSwatch).focus();
        });
    }

    function applyNewColorDraft() {
        const hex = hsvToHex(newColorDraft);
        setColor(hex, { save: false, renderCollections: false });
        setNewColorValidity(true);

        const displayHue = Math.round(newColorDraft.h) % 360;
        const displaySaturation = Math.round(newColorDraft.s);
        const displayValue = Math.round(newColorDraft.v);
        els.newColorEditor.style.setProperty('--new-color-hue', `${newColorDraft.h}deg`);
        els.newColorEditor.style.setProperty('--new-color-saturation', `${newColorDraft.s}%`);
        els.newColorEditor.style.setProperty('--new-color-value-position', `${100 - newColorDraft.v}%`);
        els.newColorHue.value = String(displayHue);
        els.newColorSv.setAttribute('aria-valuenow', String(displayValue));
        els.newColorSv.setAttribute('aria-valuetext', `${t('saturation')} ${displaySaturation}%, ${t('lightness')} ${displayValue}%`);

        const rgb = hexToRgbObject(hex);
        const hsl = hexToHslObject(hex);
        els.newColorHex.value = hex;
        els.newColorR.value = String(rgb.r);
        els.newColorG.value = String(rgb.g);
        els.newColorB.value = String(rgb.b);
        els.newColorH.value = String(hsl.h);
        els.newColorS.value = String(hsl.s);
        els.newColorL.value = String(hsl.l);
    }

    function setNewColorValidity(valid) {
        getActiveNewColorInputs().forEach((input) => input.setAttribute('aria-invalid', String(!valid)));
        els.newColorSave.disabled = !valid;
        els.newColorStatus.textContent = valid ? '' : t('invalidColor');
    }

    function getActiveNewColorInputs() {
        const panel = els.newColorPanels.find((candidate) => candidate.dataset.newColorPanel === newColorFormat);
        return panel ? Array.from(panel.querySelectorAll('input')) : [];
    }

    function selectNewColorFormat(format, moveFocus = false) {
        if (!COLOR_VALUE_FORMATS.includes(format)) return;
        newColorFormat = format;
        els.newColorFormatTabs.forEach((button) => {
            const selected = button.dataset.newColorFormat === newColorFormat;
            button.classList.toggle('active', selected);
            button.setAttribute('aria-selected', String(selected));
            button.tabIndex = selected ? 0 : -1;
            if (selected && moveFocus) button.focus();
        });
        els.newColorPanels.forEach((panel) => {
            panel.classList.toggle('hidden', panel.dataset.newColorPanel !== newColorFormat);
        });
        setNewColorValidity(true);
    }

    function handleNewColorFormatKeydown(event) {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        const currentIndex = els.newColorFormatTabs.indexOf(event.currentTarget);
        let nextIndex = currentIndex;
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = els.newColorFormatTabs.length - 1;
        if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + els.newColorFormatTabs.length) % els.newColorFormatTabs.length;
        if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % els.newColorFormatTabs.length;
        event.preventDefault();
        selectNewColorFormat(els.newColorFormatTabs[nextIndex].dataset.newColorFormat, true);
    }

    function handleNewColorValueInput() {
        if (newColorFormat === 'hex') {
            const value = els.newColorHex.value.trim().toUpperCase();
            if (!isValidHex(value)) {
                setNewColorValidity(false);
                return;
            }
            newColorDraft = hexToHsv(value);
            applyNewColorDraft();
            return;
        }

        if (newColorFormat === 'rgb') {
            const values = [els.newColorR, els.newColorG, els.newColorB].map((input) => parseIntegerInput(input, 0, 255));
            if (values.some((value) => value === null)) {
                setNewColorValidity(false);
                return;
            }
            newColorDraft = hexToHsv(rgbToHex(values[0], values[1], values[2]));
            applyNewColorDraft();
            return;
        }

        const values = [
            parseIntegerInput(els.newColorH, 0, 359),
            parseIntegerInput(els.newColorS, 0, 100),
            parseIntegerInput(els.newColorL, 0, 100)
        ];
        if (values.some((value) => value === null)) {
            setNewColorValidity(false);
            return;
        }
        newColorDraft = hexToHsv(hslToHex(values[0], values[1], values[2]));
        applyNewColorDraft();
    }

    function parseIntegerInput(input, min, max) {
        if (input.value.trim() === '') return null;
        const value = Number(input.value);
        if (!Number.isInteger(value) || value < min || value > max) return null;
        return value;
    }

    function handleNewColorSvPointerDown(event) {
        if (event.pointerType === 'mouse' && event.button !== 0) return;
        newColorPointerId = event.pointerId;
        els.newColorSv.setPointerCapture(event.pointerId);
        updateNewColorSvFromPointer(event);
    }

    function handleNewColorSvPointerMove(event) {
        if (newColorPointerId !== event.pointerId) return;
        updateNewColorSvFromPointer(event);
    }

    function handleNewColorSvPointerEnd(event) {
        if (newColorPointerId !== event.pointerId) return;
        if (els.newColorSv.hasPointerCapture(event.pointerId)) els.newColorSv.releasePointerCapture(event.pointerId);
        newColorPointerId = null;
    }

    function updateNewColorSvFromPointer(event) {
        const rect = els.newColorSv.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        newColorDraft.s = Math.round(clamp((event.clientX - rect.left) / rect.width, 0, 1) * 100);
        newColorDraft.v = Math.round((1 - clamp((event.clientY - rect.top) / rect.height, 0, 1)) * 100);
        applyNewColorDraft();
    }

    function handleNewColorSvKeydown(event) {
        if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
        const step = event.shiftKey ? 10 : 1;
        if (event.key === 'ArrowLeft') newColorDraft.s = clamp(newColorDraft.s - step, 0, 100);
        if (event.key === 'ArrowRight') newColorDraft.s = clamp(newColorDraft.s + step, 0, 100);
        if (event.key === 'ArrowUp') newColorDraft.v = clamp(newColorDraft.v + step, 0, 100);
        if (event.key === 'ArrowDown') newColorDraft.v = clamp(newColorDraft.v - step, 0, 100);
        event.preventDefault();
        applyNewColorDraft();
    }

    function handleNewColorHueInput(event) {
        newColorDraft.h = clamp(Number(event.target.value), 0, 359);
        applyNewColorDraft();
    }

    function handleNewColorHueKeydown(event) {
        if (!event.shiftKey || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
        const direction = ['ArrowRight', 'ArrowUp'].includes(event.key) ? 1 : -1;
        event.preventDefault();
        newColorDraft.h = clamp(newColorDraft.h + direction * 10, 0, 359);
        applyNewColorDraft();
    }

    function updateSavedColorsDisclosure(colorCount = colorHistory.length) {
        els.savedColorsMore.hidden = colorCount === 0;
        els.savedColorsMore.textContent = t('showAll');
        els.savedColorsMore.setAttribute('aria-label', t('showAll'));
        els.colorHistory.classList.remove('is-expanded');
    }

    function setCollection(collection) {
        currentCollection = collection === 'favorites' ? 'favorites' : 'history';
        isDeleteMode = false;
        updateCollectionControl();
        updateCollectionTitle();
        renderHistory();
        els.historyRow.scrollLeft = 0;
    }

    function updateCollectionControl() {
        document.querySelectorAll('.history-selector-option').forEach((button) => {
            const isSelected = button.dataset.collection === currentCollection;
            button.setAttribute('aria-selected', String(isSelected));
            button.tabIndex = isSelected ? 0 : -1;
        });
        const colorCount = currentCollection === 'favorites' ? favoriteColors.length : colorHistory.length;
        updateSavedColorsDisclosure(colorCount);
    }

    function startHistoryDrag(event) {
        if (event.pointerType !== 'mouse' || event.button !== 0) return;
        if (els.historyRow.scrollWidth <= els.historyRow.clientWidth) return;
        historyDragState = {
            pointerId: event.pointerId,
            startX: event.clientX,
            scrollLeft: els.historyRow.scrollLeft,
            dragging: false
        };
    }

    function moveHistoryDrag(event) {
        if (!historyDragState || event.pointerId !== historyDragState.pointerId) return;
        const delta = event.clientX - historyDragState.startX;
        if (!historyDragState.dragging && Math.abs(delta) < 5) return;
        if (!historyDragState.dragging) {
            historyDragState.dragging = true;
            suppressHistoryClick = true;
            els.historyRow.classList.add('is-dragging');
            els.historyRow.setPointerCapture(event.pointerId);
        }
        event.preventDefault();
        els.historyRow.scrollLeft = historyDragState.scrollLeft - delta;
    }

    function endHistoryDrag(event) {
        if (!historyDragState || event.pointerId !== historyDragState.pointerId) return;
        if (els.historyRow.hasPointerCapture(event.pointerId)) {
            els.historyRow.releasePointerCapture(event.pointerId);
        }
        els.historyRow.classList.remove('is-dragging');
        const dragged = historyDragState.dragging;
        historyDragState = null;
        if (dragged) window.setTimeout(() => { suppressHistoryClick = false; }, 0);
    }

    function preventClickAfterHistoryDrag(event) {
        if (!suppressHistoryClick) return;
        event.preventDefault();
        event.stopPropagation();
        suppressHistoryClick = false;
    }

    function scrollHistoryWithWheel(event) {
        if (els.historyRow.scrollWidth <= els.historyRow.clientWidth) return;
        if (Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return;
        event.preventDefault();
        els.historyRow.scrollLeft += event.deltaY;
    }

    function updateCollectionTitle() {
        const labelKey = isDeleteMode ? 'done' : 'manageColors';
        els.clearCollectionBtn.classList.toggle('active', isDeleteMode);
        els.clearCollectionBtn.setAttribute('aria-label', t(labelKey));
        els.clearCollectionBtn.title = t(labelKey);
        const label = els.clearCollectionBtn.querySelector('.manage-label');
        if (label) label.textContent = t(isDeleteMode ? 'done' : 'manage');
    }

    function toggleDeleteMode() {
        isDeleteMode = !isDeleteMode;
        updateCollectionTitle();
        renderHistory();
    }

    function removeColorFromCurrentCollection(hex) {
        const normalized = hex.toUpperCase();
        if (currentCollection === 'favorites') {
            favoriteColors = favoriteColors.filter((item) => item.toLowerCase() !== normalized.toLowerCase());
            saveFavoriteColors();
        } else {
            colorHistory = colorHistory.filter((item) => item.toLowerCase() !== normalized.toLowerCase());
            saveColorHistory();
        }
        updateFavoriteControl();
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
        updateFavoriteControl();
        renderHistory();
    }

    function isFavoriteColor(hex) {
        return favoriteColors.some((item) => item.toLowerCase() === hex.toLowerCase());
    }

    function loadColorHistory() {
        storage.get(['colorHistory'], (result) => {
            colorHistory = Array.isArray(result.colorHistory)
                ? result.colorHistory.filter(isValidHex).slice(0, MAX_HISTORY)
                : DEFAULT_HISTORY.slice();
            renderHistory();
        });
    }

    function loadFavoriteColors() {
        storage.get(['favoriteColors'], (result) => {
            favoriteColors = Array.isArray(result.favoriteColors)
                ? result.favoriteColors.filter(isValidHex).slice(0, MAX_HISTORY)
                : [];
            updateFavoriteControl();
            renderHistory();
        });
    }

    function saveColorHistory() {
        storage.set({ colorHistory });
    }

    function saveFavoriteColors() {
        storage.set({ favoriteColors });
    }

    async function copyToClipboard(text, notify = true, source = null) {
        try {
            await navigator.clipboard.writeText(text);
            if (source) {
                source.classList.add('copied');
                source.dataset.copyState = t('copiedFormat');
                window.setTimeout(() => {
                    source.classList.remove('copied');
                    delete source.dataset.copyState;
                }, 1400);
            }
            if (notify) showToast(t('copied'));
            return true;
        } catch (error) {
            console.error('Copy failed:', error);
            showToast(t('copyFailed'), 'error');
            return false;
        }
    }

    function showToast(message, tone = 'success') {
        els.toastMessage.textContent = message;
        els.toast.dataset.tone = tone;
        els.toast.classList.remove('hidden');
        els.toast.classList.add('show');
        window.setTimeout(() => {
            els.toast.classList.remove('show');
            window.setTimeout(() => els.toast.classList.add('hidden'), 250);
        }, 1300);
    }

    function loadSettings() {
        storage.get(['settings'], (result) => {
            const hadLegacyInterfaceFont = Boolean(
                result.settings
                && typeof result.settings === 'object'
                && Object.hasOwn(result.settings, 'interfaceFont')
            );
            settings = normalizeSettings(result.settings);
            applySettings();
            applyTranslations();
            if (hadLegacyInterfaceFont) saveSettings();
        });
    }

    function normalizeSettings(candidate) {
        const source = candidate && typeof candidate === 'object' && !Array.isArray(candidate)
            ? candidate
            : {};
        const sourceColors = source.customColors && typeof source.customColors === 'object' && !Array.isArray(source.customColors)
            ? source.customColors
            : {};
        const customColors = Object.fromEntries(
            Object.entries(defaultSettings.customColors).map(([key, fallback]) => [
                key,
                isValidHex(sourceColors[key]) ? sourceColors[key].toUpperCase() : fallback
            ])
        );

        return {
            language: translations[source.language] ? source.language : defaultSettings.language,
            theme: VALID_THEMES.includes(source.theme) ? source.theme : defaultSettings.theme,
            previewFont: FONT_STACKS[source.previewFont] ? source.previewFont : defaultSettings.previewFont,
            customColors
        };
    }

    function saveSettings() {
        const snapshot = {
            ...settings,
            customColors: { ...settings.customColors }
        };
        storage.set({ settings: snapshot }, () => {
            const error = typeof chrome !== 'undefined' && chrome.runtime
                ? chrome.runtime.lastError
                : null;
            if (error) console.warn('Unable to persist settings:', error.message);
        });
    }

    function applySettings() {
        els.languageSelect.value = translations[settings.language] ? settings.language : 'fr';
        if (!FONT_STACKS[settings.previewFont]) settings.previewFont = defaultSettings.previewFont;
        applyPreviewFont();
        if (!VALID_THEMES.includes(settings.theme)) {
            settings.theme = defaultSettings.theme;
            saveSettings();
        }
        els.themeSelect.value = settings.theme;

        applyTheme();

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

    function applyTheme() {
        const themeToApply = settings.theme === 'system'
            ? (systemThemeQuery && systemThemeQuery.matches ? 'dark' : 'light')
            : settings.theme;
        document.documentElement.setAttribute('data-theme', themeToApply);
        document.documentElement.style.colorScheme = themeToApply;
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

    function updatePreviewFont(fontId) {
        settings.previewFont = FONT_STACKS[fontId] ? fontId : defaultSettings.previewFont;
        applyPreviewFont();
        renderFontOptions();
        closeFontPicker();
        saveSettings();
    }

    function applyPreviewFont() {
        const font = getSelectedFont();
        document.documentElement.style.setProperty('--preview-font', font.stack);
        els.previewFontLabel.textContent = font.name;
        els.previewFontTrigger.style.fontFamily = font.stack;
    }

    function getSelectedFont() {
        return FONT_OPTIONS.find((font) => font.id === settings.previewFont) || FONT_OPTIONS.find((font) => font.id === defaultSettings.previewFont);
    }

    function getSortedFonts() {
        return FONT_OPTIONS.slice().sort((a, b) => a.name.localeCompare(b.name));
    }

    function toggleFontPicker(event) {
        event.stopPropagation();
        if (els.fontPickerPanel.classList.contains('hidden')) {
            openFontPicker();
        } else {
            closeFontPicker();
        }
    }

    function openFontPicker() {
        els.fontPickerPanel.classList.remove('hidden');
        els.previewFontTrigger.setAttribute('aria-expanded', 'true');
        els.fontSearch.value = '';
        renderFontOptions();
        window.setTimeout(() => {
            els.fontSearch.focus();
            updateFontScrollbar();
        }, 0);
    }

    function closeFontPicker() {
        els.fontPickerPanel.classList.add('hidden');
        els.previewFontTrigger.setAttribute('aria-expanded', 'false');
    }

    function closeFontPickerFromOutside(event) {
        if (!els.fontControl.contains(event.target)) closeFontPicker();
    }

    function handleFontSearchKeydown(event) {
        if (event.key === 'Escape') {
            closeFontPicker();
            els.previewFontTrigger.focus();
            return;
        }
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            const options = Array.from(els.fontList.querySelectorAll('.font-option'));
            if (!options.length) return;
            event.preventDefault();
            const target = event.key === 'ArrowDown' ? options[0] : options[options.length - 1];
            target.focus();
        }
    }

    function handleFontOptionKeydown(event) {
        const options = Array.from(els.fontList.querySelectorAll('.font-option'));
        const index = options.indexOf(event.currentTarget);
        if (event.key === 'Escape') {
            event.preventDefault();
            closeFontPicker();
            els.previewFontTrigger.focus();
            return;
        }
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            updatePreviewFont(event.currentTarget.dataset.fontId);
            els.previewFontTrigger.focus();
            return;
        }
        if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        let nextIndex = index;
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = options.length - 1;
        if (event.key === 'ArrowDown') nextIndex = Math.min(options.length - 1, index + 1);
        if (event.key === 'ArrowUp') nextIndex = Math.max(0, index - 1);
        options[nextIndex].focus();
        options[nextIndex].scrollIntoView({ block: 'nearest' });
    }

    function renderFontOptions() {
        const query = (els.fontSearch.value || '').trim().toLowerCase();
        const fonts = getSortedFonts().filter((font) => {
            const haystack = `${font.name} ${font.category}`.toLowerCase();
            return haystack.includes(query);
        });

        els.fontList.innerHTML = '';
        if (!fonts.length) {
            const empty = document.createElement('p');
            empty.className = 'font-picker-empty';
            empty.textContent = t('noResults');
            els.fontList.appendChild(empty);
            updateFontScrollbar();
            return;
        }

        fonts.forEach((font) => {
            const option = document.createElement('button');
            option.type = 'button';
            option.className = 'font-option';
            option.dataset.fontId = font.id;
            option.setAttribute('role', 'option');
            option.setAttribute('aria-selected', String(font.id === settings.previewFont));
            option.style.fontFamily = font.stack;

            const name = document.createElement('span');
            name.className = 'font-option-name';
            name.textContent = font.name;

            const category = document.createElement('span');
            category.className = 'font-option-category';
            category.textContent = font.category;

            const check = document.createElement('span');
            check.className = 'font-option-check';
            check.textContent = font.id === settings.previewFont ? '✓' : '';

            option.append(name, category, check);
            option.addEventListener('click', () => updatePreviewFont(font.id));
            option.addEventListener('keydown', handleFontOptionKeydown);
            els.fontList.appendChild(option);
        });
        els.fontList.scrollTop = 0;
        updateFontScrollbar();
    }

    function updateFontScrollbar() {
        if (els.fontPickerPanel.classList.contains('hidden')) return;

        window.requestAnimationFrame(() => {
            const maxScroll = els.fontList.scrollHeight - els.fontList.clientHeight;
            if (maxScroll <= 1) {
                els.fontScrollbar.classList.add('hidden');
                return;
            }

            els.fontScrollbar.classList.remove('hidden');
            const trackHeight = els.fontList.clientHeight;
            const thumbHeight = Math.max(34, Math.round((els.fontList.clientHeight / els.fontList.scrollHeight) * trackHeight));
            const travel = trackHeight - thumbHeight;
            const progress = Math.min(1, Math.max(0, els.fontList.scrollTop / maxScroll));
            const thumbTop = Math.round(progress * travel);

            els.fontScrollbarThumb.style.height = `${thumbHeight}px`;
            els.fontScrollbarThumb.style.transform = `translateY(${thumbTop}px)`;
        });
    }

    function applyTranslations() {
        document.documentElement.lang = currentLanguage();
        document.title = t('pageTitle');

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

        document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
            element.setAttribute('aria-label', t(element.dataset.i18nAriaLabel));
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
            element.setAttribute('placeholder', t(element.dataset.i18nPlaceholder));
        });

        updateCollectionTitle();
        updateCollectionControl();
        updateCopyLabels();
        updateFavoriteControl();
        syncUsagePreview();
        refreshNewColorEditorLocalization();
    }

    function t(key) {
        const lang = currentLanguage();
        return translations[lang][key] || translations.fr[key] || translations.en[key] || key;
    }

    function currentLanguage() {
        return translations[settings.language] ? settings.language : 'fr';
    }

    function refreshLocalizedDynamicText() {
        updateCopyLabels();
        updateFavoriteControl();
        updateCollectionControl();
        syncUsagePreview();
        renderHistory();
        refreshNewColorEditorLocalization();
    }

    function refreshNewColorEditorLocalization() {
        els.newColorSv.setAttribute('aria-valuetext', `${t('saturation')} ${Math.round(newColorDraft.s)}%, ${t('lightness')} ${Math.round(newColorDraft.v)}%`);
        if (els.newColorSave.disabled) els.newColorStatus.textContent = t('invalidColor');
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

    function clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }

    function rgbToHex(r, g, b) {
        const channel = (value) => Math.round(clamp(value, 0, 255)).toString(16).padStart(2, '0');
        return `#${channel(r)}${channel(g)}${channel(b)}`.toUpperCase();
    }

    function hexToHsv(hex) {
        const { r, g, b } = hexToRgbObject(hex);
        const red = r / 255;
        const green = g / 255;
        const blue = b / 255;
        const max = Math.max(red, green, blue);
        const min = Math.min(red, green, blue);
        const delta = max - min;
        let hue = 0;

        if (delta !== 0) {
            if (max === red) hue = 60 * (((green - blue) / delta) % 6);
            if (max === green) hue = 60 * (((blue - red) / delta) + 2);
            if (max === blue) hue = 60 * (((red - green) / delta) + 4);
        }
        if (hue < 0) hue += 360;

        return {
            h: hue,
            s: (max === 0 ? 0 : delta / max) * 100,
            v: max * 100
        };
    }

    function hsvToHex({ h, s, v }) {
        const hue = ((h % 360) + 360) % 360;
        const saturation = clamp(s, 0, 100) / 100;
        const value = clamp(v, 0, 100) / 100;
        const chroma = value * saturation;
        const segment = hue / 60;
        const x = chroma * (1 - Math.abs((segment % 2) - 1));
        const match = value - chroma;
        let red = 0;
        let green = 0;
        let blue = 0;

        if (segment < 1) [red, green, blue] = [chroma, x, 0];
        else if (segment < 2) [red, green, blue] = [x, chroma, 0];
        else if (segment < 3) [red, green, blue] = [0, chroma, x];
        else if (segment < 4) [red, green, blue] = [0, x, chroma];
        else if (segment < 5) [red, green, blue] = [x, 0, chroma];
        else [red, green, blue] = [chroma, 0, x];

        return rgbToHex((red + match) * 255, (green + match) * 255, (blue + match) * 255);
    }

    function hslToHex(h, s, l) {
        const hue = ((h % 360) + 360) % 360;
        const saturation = clamp(s, 0, 100) / 100;
        const lightness = clamp(l, 0, 100) / 100;
        const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
        const segment = hue / 60;
        const x = chroma * (1 - Math.abs((segment % 2) - 1));
        const match = lightness - chroma / 2;
        let red = 0;
        let green = 0;
        let blue = 0;

        if (segment < 1) [red, green, blue] = [chroma, x, 0];
        else if (segment < 2) [red, green, blue] = [x, chroma, 0];
        else if (segment < 3) [red, green, blue] = [0, chroma, x];
        else if (segment < 4) [red, green, blue] = [0, x, chroma];
        else if (segment < 5) [red, green, blue] = [x, 0, chroma];
        else [red, green, blue] = [chroma, 0, x];

        return rgbToHex((red + match) * 255, (green + match) * 255, (blue + match) * 255);
    }

    function hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `${r}, ${g}, ${b}`;
    }

    function hexToRgbObject(hex) {
        return {
            r: parseInt(hex.slice(1, 3), 16),
            g: parseInt(hex.slice(3, 5), 16),
            b: parseInt(hex.slice(5, 7), 16)
        };
    }

    function hexToHslObject(hex) {
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

        return {
            h: Math.round(h * 360) % 360,
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }

    function hexToHsl(hex) {
        const { h, s, l } = hexToHslObject(hex);
        return `${h}°, ${s}%, ${l}%`;
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
        const normalized = hex.toUpperCase();
        return translations[currentLanguage()].colorNames?.[normalized]
            || translations.fr.colorNames?.[normalized]
            || translations.en.colorNames?.[normalized]
            || normalized;
    }
});
