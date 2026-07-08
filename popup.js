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
        theme: 'system',
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
    let settings = { ...defaultSettings };
    let isPicking = false;
    let isDeleteMode = false;

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
        colorHistory: document.getElementById('color-history'),
        collectionTrigger: document.getElementById('collection-trigger'),
        collectionLabel: document.getElementById('collection-label'),
        collectionPanel: document.getElementById('collection-panel'),
        clearCollectionBtn: document.getElementById('clear-collection-btn')
    };

    const translations = {
        en: {
            pageTitle: 'Color Picker : Ultimate Edition',
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
            pageTitle: 'Color Picker : Ultimate Edition',
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
            fontSearch: 'Rechercher une font',
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
            pageTitle: 'Color Picker : Ultimate Edition',
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
            pageTitle: 'Color Picker : Ultimate Edition',
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
            pageTitle: 'Color Picker : Ultimate Edition',
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
            pageTitle: 'Color Picker : Ultimate Edition',
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
            pageTitle: 'Color Picker : Ultimate Edition',
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
            pageTitle: 'Color Picker : Ultimate Edition',
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
            detailsTitle: 'Инспектор цвета',
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
        els.heroSwatch.addEventListener('click', pickColor);
        els.historyOpenBtn.addEventListener('click', () => showView('details'));
        els.backBtn.addEventListener('click', () => showView('capture'));
        els.usageInput.addEventListener('input', syncUsagePreview);
        els.previewFontTrigger.addEventListener('click', toggleFontPicker);
        els.fontSearch.addEventListener('input', renderFontOptions);
        els.fontSearch.addEventListener('keydown', handleFontSearchKeydown);
        els.fontList.addEventListener('scroll', updateFontScrollbar);
        window.addEventListener('resize', updateFontScrollbar);
        document.addEventListener('click', closeFontPickerFromOutside);
        document.addEventListener('click', closeCollectionDropdownFromOutside);

        els.collectionTrigger.addEventListener('click', toggleCollectionDropdown);
        document.querySelectorAll('.history-selector-option').forEach((button) => {
            button.addEventListener('click', () => {
                setCollection(button.dataset.collection);
                closeCollectionDropdown();
            });
        });
        els.clearCollectionBtn.addEventListener('click', toggleDeleteMode);

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
        els.heroSwatch.classList.remove('picked-success');
        els.pickBtn.classList.add('is-picking');
        els.heroSwatch.classList.add('is-picking');
        els.captureTitle.textContent = t('pickingCta');
        els.captureFeedback.classList.add('hidden');
    }

    function exitPickingState() {
        isPicking = false;
        els.pickBtn.classList.remove('is-picking');
        els.heroSwatch.classList.remove('is-picking');
        els.captureTitle.textContent = t('captureCta');
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

        const rgb = hexToRgb(currentColor);
        const hsl = hexToHsl(currentColor);
        const oklch = currentColor === DEFAULT_COLOR ? '0.62, 0.16, 250' : hexToOklch(currentColor);

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
        const value = els.usageInput.value.trim() || 'Texte';
        els.usageButton.textContent = 'Bouton';
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

        if (!colors.length) {
            const empty = document.createElement('p');
            empty.className = 'history-empty';
            empty.textContent = currentCollection === 'favorites' ? t('noFavorites') : t('noHistory');
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

            const actionButton = document.createElement('button');
            actionButton.type = 'button';

            if (isDeleteMode) {
                actionButton.className = 'history-delete-toggle';
                actionButton.setAttribute('aria-label', `${t('removeColor')} ${hex.toUpperCase()}`);
                actionButton.innerHTML = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path></svg>';
                actionButton.addEventListener('click', () => removeColorFromCurrentCollection(hex));
            } else {
                actionButton.className = `favorite-toggle${isFavorite ? ' active' : ''}`;
                actionButton.setAttribute('aria-label', isFavorite ? t('removeFavorite') : t('addFavorite'));
                actionButton.innerHTML = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15 8.8 22 9.3 16.7 13.9 18.4 21 12 17.2 5.6 21 7.3 13.9 2 9.3 9 8.8 12 2"></polygon></svg>';
                actionButton.addEventListener('click', () => toggleFavorite(hex));
            }

            colorButton.append(swatch, label);
            colorButton.addEventListener('click', () => setColor(hex, { save: false }));
            card.append(colorButton, actionButton);
            els.colorHistory.appendChild(card);
        });
    }

    function setCollection(collection) {
        currentCollection = collection === 'favorites' ? 'favorites' : 'history';
        isDeleteMode = false;
        updateCollectionControl();
        updateCollectionControl();
        updateCollectionTitle();
        renderHistory();
    }

    function updateCollectionControl() {
        const labelKey = currentCollection === 'favorites' ? 'favorites' : 'history';
        els.collectionLabel.textContent = t(labelKey);
        document.querySelectorAll('.history-selector-option').forEach((button) => {
            const isSelected = button.dataset.collection === currentCollection;
            button.setAttribute('aria-selected', String(isSelected));
        });
    }

    function updateCollectionTitle() {
        const labelKey = isDeleteMode ? 'exitDeleteMode' : 'enterDeleteMode';
        els.clearCollectionBtn.classList.toggle('active', isDeleteMode);
        els.clearCollectionBtn.setAttribute('aria-label', t(labelKey));
        els.clearCollectionBtn.title = t(labelKey);
    }

    function toggleDeleteMode() {
        isDeleteMode = !isDeleteMode;
        updateCollectionTitle();
        renderHistory();
    }

    function toggleCollectionDropdown(event) {
        event.stopPropagation();
        const willOpen = els.collectionPanel.classList.contains('hidden');
        els.collectionPanel.classList.toggle('hidden', !willOpen);
        els.collectionTrigger.setAttribute('aria-expanded', String(willOpen));
    }

    function closeCollectionDropdown() {
        els.collectionPanel.classList.add('hidden');
        els.collectionTrigger.setAttribute('aria-expanded', 'false');
    }

    function closeCollectionDropdownFromOutside(event) {
        if (els.collectionPanel.classList.contains('hidden')) return;
        if (els.collectionPanel.contains(event.target) || els.collectionTrigger.contains(event.target)) return;
        closeCollectionDropdown();
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
        if (candidate.theme && !VALID_THEMES.includes(candidate.theme)) return false;
        if (candidate.previewFont && !FONT_STACKS[candidate.previewFont]) return false;
        return true;
    }

    function saveSettings() {
        storage.set({ settings });
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
        }
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
    }

    function t(key) {
        const lang = currentLanguage();
        return translations[lang][key] || translations.fr[key] || translations.en[key] || key;
    }

    function currentLanguage() {
        return translations[settings.language] ? settings.language : 'fr';
    }

    function refreshLocalizedDynamicText() {
        if (isPicking) {
            els.captureTitle.textContent = t('pickingCta');
        } else {
            els.captureTitle.textContent = t('captureCta');
        }
        renderHistory();
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
        const normalized = hex.toUpperCase();
        return translations[currentLanguage()].colorNames?.[normalized]
            || translations.fr.colorNames?.[normalized]
            || translations.en.colorNames?.[normalized]
            || normalized;
    }
});
