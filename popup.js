document.addEventListener('DOMContentLoaded', () => {
    // --- State ---
    let currentColor = null;
    let colorHistory = [];
    const MAX_HISTORY = 18;

    // --- DOM Elements ---
    const colorPreview = document.getElementById('color-preview');
    const pickBtn = document.getElementById('pick-btn');
    const colorCodes = document.getElementById('color-codes');
    const hexValue = document.getElementById('hex-value');
    const rgbValue = document.getElementById('rgb-value');
    const hslValue = document.getElementById('hsl-value');
    const colorHistoryEl = document.getElementById('color-history');
    const clearHistoryBtn = document.getElementById('clear-history-btn');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');

    // --- Settings State ---
    const defaultSettings = {
        language: 'en',
        theme: 'system',
        customColors: {
            bgColor: '#ffffff',
            cardColor: '#f3f4f6',
            textColor: '#1f2937',
            accentColor: '#2563eb'
        }
    };
    let settings = { ...defaultSettings };

    // --- Translations ---
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
            buyCoffee: 'Buy me a coffee ☕️',
            pickColor: 'Pick Color',
            newColor: 'New Color',
            createColor: 'Create a Color',
            applyColor: 'Apply Color',
            noColor: 'No color selected',
            history: 'History',
            noHistory: 'No colors in history',
            clear: 'Clear',
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
            buyCoffee: 'Offrez-moi un café ☕️',
            pickColor: 'Choisir une couleur',
            newColor: 'Nouvelle couleur',
            createColor: 'Créer une couleur',
            applyColor: 'Appliquer',
            noColor: 'Aucune couleur sélectionnée',
            history: 'Historique',
            noHistory: 'Aucune couleur dans l\'historique',
            clear: 'Effacer',
            copied: 'Copié !',
            error: 'Erreur lors de la sélection'
        },
        es: {
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
            buyCoffee: 'Cómprame un café ☕️',
            pickColor: 'Seleccionar color',
            newColor: 'Nuevo color',
            createColor: 'Crear un color',
            applyColor: 'Aplicar color',
            noColor: 'Ningún color seleccionado',
            history: 'Historial',
            noHistory: 'No hay colores en el historial',
            clear: 'Borrar',
            copied: '¡Copiado!',
            error: 'Error al seleccionar color'
        },
        de: {
            title: 'Color Picker',
            promo: '✨ Mehr kostenlose Tools? Hier bei bitek.fr ✨',
            settings: 'Einstellungen',
            language: 'Sprache',
            theme: 'Thema',
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
            buyCoffee: 'Spendier mir einen Kaffee ☕️',
            pickColor: 'Farbe auswählen',
            newColor: 'Neue Farbe',
            createColor: 'Farbe erstellen',
            applyColor: 'Farbe anwenden',
            noColor: 'Keine Farbe ausgewählt',
            history: 'Verlauf',
            noHistory: 'Keine Farben im Verlauf',
            clear: 'Löschen',
            copied: 'Kopiert!',
            error: 'Fehler bei der Farbauswahl'
        },
        pt: {
            title: 'Color Picker',
            promo: '✨ Mais ferramentas grátis? Visite bitek.fr ✨',
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
            buyCoffee: 'Pague-me um café ☕️',
            pickColor: 'Escolher cor',
            newColor: 'Nova cor',
            createColor: 'Criar uma cor',
            applyColor: 'Aplicar cor',
            noColor: 'Nenhuma cor selecionada',
            history: 'Histórico',
            noHistory: 'Sem cores no histórico',
            clear: 'Limpar',
            copied: 'Copiado!',
            error: 'Erro ao selecionar cor'
        },
        zh: {
            title: 'Color Picker',
            promo: '✨ 更多免费工具？尽在 bitek.fr ✨',
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
            textColor: '文本',
            accentColor: '强调色',
            buyCoffee: '请我喝杯咖啡 ☕️',
            pickColor: '选取颜色',
            newColor: '新建颜色',
            createColor: '创建颜色',
            applyColor: '应用颜色',
            noColor: '未选择颜色',
            history: '历史记录',
            noHistory: '历史记录为空',
            clear: '清除',
            copied: '已复制！',
            error: '选取颜色时出错'
        },
        ja: {
            title: 'Color Picker',
            promo: '✨ 無料ツールをもっと見る？ bitek.fr ✨',
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
            buyCoffee: 'コーヒーを奢る ☕️',
            pickColor: '色を選択',
            newColor: '新しい色',
            createColor: '色を作成',
            applyColor: '色を適用',
            noColor: '色が選択されていません',
            history: '履歴',
            noHistory: '履歴がありません',
            clear: 'クリア',
            copied: 'コピーしました！',
            error: '色の選択エラー'
        },
        ru: {
            title: 'Color Picker',
            promo: '✨ Больше бесплатных инструментов? На bitek.fr ✨',
            settings: 'Настройки',
            language: 'Язык',
            theme: 'Тема',
            system: 'Система',
            light: 'Светлая',
            dark: 'Темная',
            midnight: 'Полночь',
            latte: 'Латте',
            forest: 'Лес',
            neon: 'Неон',
            rose: 'Роза',
            custom: 'Пользовательская',
            bgColor: 'Фон',
            cardColor: 'Карточка',
            textColor: 'Текст',
            accentColor: 'Акцент',
            buyCoffee: 'Купить мне кофе ☕️',
            pickColor: 'Выбрать цвет',
            newColor: 'Новый цвет',
            createColor: 'Создать цвет',
            applyColor: 'Применить цвет',
            noColor: 'Цвет не выбран',
            history: 'История',
            noHistory: 'История пуста',
            clear: 'Очистить',
            copied: 'Скопировано!',
            error: 'Ошибка выбора цвета'
        }
    };

    // --- Initialization ---
    loadSettings();
    loadColorHistory();

    // --- Event Listeners ---

    // Pick Color Button
    pickBtn.addEventListener('click', async () => {
        if (!window.EyeDropper) {
            showToast(translations[settings.language].error || 'EyeDropper not supported');
            return;
        }

        try {
            const eyeDropper = new EyeDropper();
            const result = await eyeDropper.open();
            const hex = result.sRGBHex;
            setColor(hex);
            addToHistory(hex);
        } catch (e) {
            // User cancelled or error
            console.log('EyeDropper cancelled or error:', e);
        }
    });

    // Copy Buttons
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.target;
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                copyToClipboard(targetEl.textContent);
            }
        });
    });

    // Clear History
    clearHistoryBtn.addEventListener('click', () => {
        colorHistory = [];
        saveColorHistory();
        renderHistory();
    });

    // Settings Modal
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeSettingsBtn = document.getElementById('close-settings');

    settingsBtn.addEventListener('click', () => {
        settingsModal.classList.remove('hidden');
    });

    closeSettingsBtn.addEventListener('click', () => {
        settingsModal.classList.add('hidden');
    });

    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.classList.add('hidden');
        }
    });

    // Settings Changes
    document.getElementById('language-select').addEventListener('change', (e) => {
        settings.language = e.target.value;
        saveSettings();
        applyTranslations();
    });

    document.getElementById('theme-select').addEventListener('change', (e) => {
        settings.theme = e.target.value;
        saveSettings();
        applySettings();
    });

    // Custom Theme Colors
    const colorInputs = ['custom-bg-color', 'custom-card-color', 'custom-text-color', 'custom-accent-color'];
    colorInputs.forEach(id => {
        document.getElementById(id).addEventListener('input', updateCustomColor);
    });

    // Coffee Button
    document.getElementById('coffee-btn').addEventListener('click', () => {
        window.open('https://buymeacoffee.com/bitek', '_blank', 'noopener,noreferrer');
    });

    // --- Color Creator (Visual Canvas Picker) ---
    const createBtn = document.getElementById('create-btn');
    const colorCreator = document.getElementById('color-creator');
    const closeCreatorBtn = document.getElementById('close-creator');
    const colorCanvas = document.getElementById('color-canvas');
    const canvasCursor = document.getElementById('canvas-cursor');
    const hueSlider = document.getElementById('hue-slider');
    const creatorPreview = document.getElementById('creator-preview');
    const creatorHex = document.getElementById('creator-hex');
    const applyColorBtn = document.getElementById('apply-color-btn');

    let currentHue = 0;
    let currentSat = 100;
    let currentBright = 50;
    let isDragging = false;

    // Toggle color creator
    createBtn.addEventListener('click', () => {
        colorCreator.classList.toggle('hidden');
        if (!colorCreator.classList.contains('hidden')) {
            drawColorCanvas();
            updateCreatorColor();
        }
    });

    closeCreatorBtn.addEventListener('click', () => {
        colorCreator.classList.add('hidden');
    });

    // Draw the saturation/brightness gradient canvas
    function drawColorCanvas() {
        const ctx = colorCanvas.getContext('2d', { willReadFrequently: true });
        const width = colorCanvas.width;
        const height = colorCanvas.height;

        // Create horizontal gradient (white to hue color)
        const gradientH = ctx.createLinearGradient(0, 0, width, 0);
        gradientH.addColorStop(0, '#ffffff');
        gradientH.addColorStop(1, `hsl(${currentHue}, 100%, 50%)`);
        ctx.fillStyle = gradientH;
        ctx.fillRect(0, 0, width, height);

        // Create vertical gradient (transparent to black)
        const gradientV = ctx.createLinearGradient(0, 0, 0, height);
        gradientV.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradientV.addColorStop(1, 'rgba(0, 0, 0, 1)');
        ctx.fillStyle = gradientV;
        ctx.fillRect(0, 0, width, height);
    }

    // Get color from canvas position
    function getColorFromPosition(x, y) {
        const ctx = colorCanvas.getContext('2d', { willReadFrequently: true });
        // Ensure coordinates are integers and within bounds
        const safeX = Math.min(Math.max(0, Math.floor(x)), colorCanvas.width - 1);
        const safeY = Math.min(Math.max(0, Math.floor(y)), colorCanvas.height - 1);

        try {
            const pixel = ctx.getImageData(safeX, safeY, 1, 1).data;
            return rgbToHex(pixel[0], pixel[1], pixel[2]);
        } catch (e) {
            console.error('Error getting color data:', e);
            return '#000000'; // Fallback
        }
    }

    // Update cursor position and color
    function updateCursorPosition(x, y) {
        const rect = colorCanvas.getBoundingClientRect();
        const scaleX = colorCanvas.width / rect.width;
        const scaleY = colorCanvas.height / rect.height;

        // Clamp values
        x = Math.max(0, Math.min(rect.width, x));
        y = Math.max(0, Math.min(rect.height, y));

        canvasCursor.style.left = x + 'px';
        canvasCursor.style.top = y + 'px';

        // Get color from actual canvas coordinates
        const canvasX = Math.floor(x * scaleX);
        const canvasY = Math.floor(y * scaleY);
        const hex = getColorFromPosition(
            Math.min(colorCanvas.width - 1, Math.max(0, canvasX)),
            Math.min(colorCanvas.height - 1, Math.max(0, canvasY))
        );

        creatorPreview.style.backgroundColor = hex;
        creatorHex.textContent = hex.toUpperCase();
    }

    // Canvas mouse events
    colorCanvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        const rect = colorCanvas.getBoundingClientRect();
        updateCursorPosition(e.clientX - rect.left, e.clientY - rect.top);
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const rect = colorCanvas.getBoundingClientRect();
            updateCursorPosition(e.clientX - rect.left, e.clientY - rect.top);
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Hue slider
    hueSlider.addEventListener('input', () => {
        currentHue = parseInt(hueSlider.value);
        drawColorCanvas();
        // Update color from current cursor position
        const cursorLeft = parseFloat(canvasCursor.style.left) || colorCanvas.getBoundingClientRect().width;
        const cursorTop = parseFloat(canvasCursor.style.top) || 0;
        updateCursorPosition(cursorLeft, cursorTop);
    });

    // Apply color button
    applyColorBtn.addEventListener('click', () => {
        const hex = creatorHex.textContent;
        if (isValidHex(hex)) {
            setColor(hex);
            addToHistory(hex);
            colorCreator.classList.add('hidden');
        }
    });

    // Update creator color display
    function updateCreatorColor() {
        const hex = `hsl(${currentHue}, 100%, 50%)`;
        creatorPreview.style.backgroundColor = '#ff0000';
        creatorHex.textContent = '#FF0000';
        // Position cursor at top-right (full saturation, full brightness)
        const rect = colorCanvas.getBoundingClientRect();
        canvasCursor.style.left = rect.width + 'px';
        canvasCursor.style.top = '0px';
    }

    // --- Functions ---

    function setColor(hex) {
        if (!isValidHex(hex)) return;
        currentColor = hex;
        colorPreview.style.backgroundColor = hex;
        colorPreview.classList.add('has-color');
        colorCodes.classList.remove('hidden');

        // Update color codes
        hexValue.textContent = hex.toUpperCase();
        rgbValue.textContent = hexToRgb(hex);
        hslValue.textContent = hexToHsl(hex);
    }

    function hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgb(${r}, ${g}, ${b})`;
    }

    function rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(x => {
            const hex = x.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }

    function isValidHex(hex) {
        return /^#[0-9A-Fa-f]{6}$/i.test(hex);
    }

    function hexToHsl(hex) {
        let r = parseInt(hex.slice(1, 3), 16) / 255;
        let g = parseInt(hex.slice(3, 5), 16) / 255;
        let b = parseInt(hex.slice(5, 7), 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }

        h = Math.round(h * 360);
        s = Math.round(s * 100);
        l = Math.round(l * 100);

        return `hsl(${h}, ${s}%, ${l}%)`;
    }

    function addToHistory(hex) {
        if (!isValidHex(hex)) return;
        // Remove if already exists
        colorHistory = colorHistory.filter(c => c.toLowerCase() !== hex.toLowerCase());
        // Add to front
        colorHistory.unshift(hex);
        // Limit size
        if (colorHistory.length > MAX_HISTORY) {
            colorHistory = colorHistory.slice(0, MAX_HISTORY);
        }
        saveColorHistory();
        renderHistory();
    }

    function renderHistory() {
        colorHistoryEl.textContent = ''; // Clear content safely

        if (colorHistory.length === 0) {
            const noHistoryDiv = document.createElement('div');
            noHistoryDiv.className = 'no-history';
            noHistoryDiv.dataset.i18n = 'noHistory';
            noHistoryDiv.textContent = translations[settings.language].noHistory;
            colorHistoryEl.appendChild(noHistoryDiv);
            return;
        }

        colorHistory.forEach(hex => {
            if (!isValidHex(hex)) return;
            const div = document.createElement('div');
            div.className = 'history-color';
            div.style.backgroundColor = hex;
            div.dataset.color = hex;
            div.title = hex.toUpperCase();
            div.addEventListener('click', () => {
                setColor(hex);
            });
            colorHistoryEl.appendChild(div);
        });
    }

    function loadColorHistory() {
        chrome.storage.local.get(['colorHistory'], (result) => {
            if (result.colorHistory) {
                colorHistory = result.colorHistory;
                renderHistory();
            }
        });
    }

    function saveColorHistory() {
        chrome.storage.local.set({ colorHistory });
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(translations[settings.language].copied || 'Copied!');
        }).catch(err => {
            console.error('Copy failed:', err);
        });
    }

    function showToast(message) {
        toastMessage.textContent = message;
        toast.classList.remove('hidden');
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.classList.add('hidden'), 300);
        }, 1500);
    }

    function loadSettings() {
        chrome.storage.local.get(['settings'], (result) => {
            if (result.settings && validateSettings(result.settings)) {
                settings = { ...defaultSettings, ...result.settings };
            } else {
                // Default to English
                settings.language = 'en';
            }
            applySettings();
            applyTranslations();
        });
    }

    function validateSettings(s) {
        if (!s || typeof s !== 'object') return false;

        // Validate Language
        if (s.language && !translations[s.language]) return false;

        // Validate Theme
        const validThemes = ['system', 'light', 'dark', 'midnight', 'latte', 'forest', 'neon', 'rose', 'custom'];
        if (s.theme && !validThemes.includes(s.theme)) return false;

        // Validate Custom Colors
        if (s.customColors) {
            if (typeof s.customColors !== 'object') return false;
            const requiredColors = ['bgColor', 'cardColor', 'textColor', 'accentColor'];
            for (const key of requiredColors) {
                if (s.customColors[key] && !isValidHex(s.customColors[key])) return false;
            }
        }

        return true;
    }

    function saveSettings() {
        chrome.storage.local.set({ settings });
    }

    function applySettings() {
        // Language
        document.getElementById('language-select').value = settings.language;

        // Theme
        document.getElementById('theme-select').value = settings.theme;

        let themeToApply = settings.theme;
        if (settings.theme === 'system') {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                themeToApply = 'dark';
            } else {
                themeToApply = 'light';
            }
        }
        document.documentElement.setAttribute('data-theme', themeToApply);

        // Custom Theme Visibility
        const customControls = document.getElementById('custom-theme-controls');
        if (settings.theme === 'custom') {
            customControls.classList.remove('hidden');
            // Apply custom colors
            const colors = settings.customColors;
            document.documentElement.style.setProperty('--bg-color', colors.bgColor);
            document.documentElement.style.setProperty('--card-bg', colors.cardColor);
            document.documentElement.style.setProperty('--text-primary', colors.textColor);
            document.documentElement.style.setProperty('--primary-color', colors.accentColor);

            // Update inputs
            document.getElementById('custom-bg-color').value = colors.bgColor;
            document.getElementById('custom-card-color').value = colors.cardColor;
            document.getElementById('custom-text-color').value = colors.textColor;
            document.getElementById('custom-accent-color').value = colors.accentColor;
        } else {
            customControls.classList.add('hidden');
            // Remove inline styles to revert to theme defaults
            document.documentElement.style.removeProperty('--bg-color');
            document.documentElement.style.removeProperty('--card-bg');
            document.documentElement.style.removeProperty('--text-primary');
            document.documentElement.style.removeProperty('--primary-color');
        }
    }

    function updateCustomColor(e) {
        const id = e.target.id;
        const value = e.target.value;

        // Map ID to settings key properly
        let settingsKey;
        if (id === 'custom-bg-color') settingsKey = 'bgColor';
        if (id === 'custom-card-color') settingsKey = 'cardColor';
        if (id === 'custom-text-color') settingsKey = 'textColor';
        if (id === 'custom-accent-color') settingsKey = 'accentColor';

        if (isValidHex(value)) {
            settings.customColors[settingsKey] = value;

            // Live update
            if (settingsKey === 'bgColor') document.documentElement.style.setProperty('--bg-color', value);
            if (settingsKey === 'cardColor') document.documentElement.style.setProperty('--card-bg', value);
            if (settingsKey === 'textColor') document.documentElement.style.setProperty('--text-primary', value);
            if (settingsKey === 'accentColor') document.documentElement.style.setProperty('--primary-color', value);

            // Debounce save
            clearTimeout(window.saveTimeout);
            window.saveTimeout = setTimeout(saveSettings, 500);
        }
    }

    function applyTranslations() {
        // Fallback to English if language not found
        const lang = translations[settings.language] ? settings.language : 'en';
        const t = (key) => translations[lang][key] || translations['en'][key] || key;

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            el.textContent = t(key);
        });

        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.dataset.i18nTitle;
            el.title = t(key);
        });
    }
});
