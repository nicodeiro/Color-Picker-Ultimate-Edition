import { createLucideIcon } from "./vendor/lucide-icons.js";

const HISTORY_KEY = "colorHistory";
const SETTINGS_KEY = "settings";
const MAX_HISTORY = 10;
const HEX_PATTERN = /^#[0-9A-F]{6}$/;
const SUPPORTED_LANGUAGES = Object.freeze(["en", "fr", "es", "de", "pt", "zh", "ja", "ru"]);
const SUPPORTED_THEMES = Object.freeze(["system", "light", "dark"]);

const MESSAGES = Object.freeze({
  en: {
    loading: "Loading…",
    emptyTitle: "Choose a color on screen.",
    pick: "Choose a color",
    pickAnother: "Choose another color",
    noRecent: "No recent color.",
    selectedSrgb: "Selected color · sRGB",
    formatListLabel: "Color formats",
    settings: "Settings",
    close: "Close",
    language: "Language",
    theme: "Theme",
    themeSystem: "System",
    themeLight: "Light",
    themeDark: "Dark",
    settingsNote: "History and preferences stay on this device.",
    done: "Done",
    recentOne: "Recent · 1",
    recentMany: "Recent · {count}",
    copyHex: "Copy {value}",
    copyRgb: "Copy RGB {value}",
    copyHsl: "Copy HSL {value}",
    useRecent: "Use recent color {value}",
    copied: "Copied",
    copyFailed: "Couldn’t copy",
    selecting: "Choose a point on screen.",
    cancelled: "Selection cancelled",
    historyUnavailable: "History unavailable",
    historyNotSaved: "History wasn’t saved",
    settingsNotSaved: "Settings weren’t saved",
    unavailableTitle: "Color picking unavailable",
    unavailableBody: "This version of Chrome cannot open the eyedropper here.",
    rejectedTitle: "Color picking refused",
    rejectedBody: "Chrome did not allow the eyedropper to open. No color was saved.",
    operationTitle: "Color picking failed",
    operationBody: "Chrome could not complete the selection. No color was saved.",
    retry: "Try again",
    closeAction: "Close"
  },
  fr: {
    loading: "Chargement…",
    emptyTitle: "Choisissez une couleur à l’écran.",
    pick: "Choisir une couleur",
    pickAnother: "Choisir une autre couleur",
    noRecent: "Aucune couleur récente.",
    selectedSrgb: "Couleur choisie · sRGB",
    formatListLabel: "Formats de couleur",
    settings: "Réglages",
    close: "Fermer",
    language: "Langue",
    theme: "Thème",
    themeSystem: "Système",
    themeLight: "Clair",
    themeDark: "Sombre",
    settingsNote: "L’historique et les préférences restent sur cet appareil.",
    done: "Terminé",
    recentOne: "Récente · 1",
    recentMany: "Récentes · {count}",
    copyHex: "Copier {value}",
    copyRgb: "Copier RGB {value}",
    copyHsl: "Copier HSL {value}",
    useRecent: "Utiliser la couleur récente {value}",
    copied: "Copié",
    copyFailed: "Copie impossible",
    selecting: "Choisissez un point à l’écran.",
    cancelled: "Sélection annulée",
    historyUnavailable: "Historique indisponible",
    historyNotSaved: "Historique non enregistré",
    settingsNotSaved: "Réglages non enregistrés",
    unavailableTitle: "Prélèvement indisponible",
    unavailableBody: "Cette version de Chrome ne peut pas ouvrir la pipette ici.",
    rejectedTitle: "Prélèvement refusé",
    rejectedBody: "Chrome n’a pas autorisé l’ouverture de la pipette. Aucune couleur n’a été enregistrée.",
    operationTitle: "Prélèvement impossible",
    operationBody: "Chrome n’a pas pu terminer la sélection. Aucune couleur n’a été enregistrée.",
    retry: "Réessayer",
    closeAction: "Fermer"
  },
  es: {
    loading: "Cargando…",
    emptyTitle: "Elige un color de la pantalla.",
    pick: "Elegir un color",
    pickAnother: "Elegir otro color",
    noRecent: "No hay colores recientes.",
    selectedSrgb: "Color elegido · sRGB",
    formatListLabel: "Formatos de color",
    settings: "Ajustes",
    close: "Cerrar",
    language: "Idioma",
    theme: "Tema",
    themeSystem: "Sistema",
    themeLight: "Claro",
    themeDark: "Oscuro",
    settingsNote: "El historial y las preferencias permanecen en este dispositivo.",
    done: "Listo",
    recentOne: "Reciente · 1",
    recentMany: "Recientes · {count}",
    copyHex: "Copiar {value}",
    copyRgb: "Copiar RGB {value}",
    copyHsl: "Copiar HSL {value}",
    useRecent: "Usar el color reciente {value}",
    copied: "Copiado",
    copyFailed: "No se pudo copiar",
    selecting: "Elige un punto de la pantalla.",
    cancelled: "Selección cancelada",
    historyUnavailable: "Historial no disponible",
    historyNotSaved: "El historial no se guardó",
    settingsNotSaved: "Los ajustes no se guardaron",
    unavailableTitle: "Selector de color no disponible",
    unavailableBody: "Esta versión de Chrome no puede abrir el cuentagotas aquí.",
    rejectedTitle: "Selección rechazada",
    rejectedBody: "Chrome no permitió abrir el cuentagotas. No se guardó ningún color.",
    operationTitle: "No se pudo elegir el color",
    operationBody: "Chrome no pudo completar la selección. No se guardó ningún color.",
    retry: "Reintentar",
    closeAction: "Cerrar"
  },
  de: {
    loading: "Wird geladen…",
    emptyTitle: "Wähle eine Farbe auf dem Bildschirm.",
    pick: "Farbe auswählen",
    pickAnother: "Andere Farbe auswählen",
    noRecent: "Keine zuletzt verwendete Farbe.",
    selectedSrgb: "Ausgewählte Farbe · sRGB",
    formatListLabel: "Farbformate",
    settings: "Einstellungen",
    close: "Schließen",
    language: "Sprache",
    theme: "Darstellung",
    themeSystem: "System",
    themeLight: "Hell",
    themeDark: "Dunkel",
    settingsNote: "Verlauf und Einstellungen bleiben auf diesem Gerät.",
    done: "Fertig",
    recentOne: "Zuletzt · 1",
    recentMany: "Zuletzt · {count}",
    copyHex: "{value} kopieren",
    copyRgb: "RGB {value} kopieren",
    copyHsl: "HSL {value} kopieren",
    useRecent: "Zuletzt verwendete Farbe {value} nutzen",
    copied: "Kopiert",
    copyFailed: "Kopieren fehlgeschlagen",
    selecting: "Wähle einen Punkt auf dem Bildschirm.",
    cancelled: "Auswahl abgebrochen",
    historyUnavailable: "Verlauf nicht verfügbar",
    historyNotSaved: "Verlauf wurde nicht gespeichert",
    settingsNotSaved: "Einstellungen wurden nicht gespeichert",
    unavailableTitle: "Farbauswahl nicht verfügbar",
    unavailableBody: "Diese Chrome-Version kann die Pipette hier nicht öffnen.",
    rejectedTitle: "Farbauswahl abgelehnt",
    rejectedBody: "Chrome hat die Pipette nicht geöffnet. Es wurde keine Farbe gespeichert.",
    operationTitle: "Farbauswahl fehlgeschlagen",
    operationBody: "Chrome konnte die Auswahl nicht abschließen. Es wurde keine Farbe gespeichert.",
    retry: "Erneut versuchen",
    closeAction: "Schließen"
  },
  pt: {
    loading: "A carregar…",
    emptyTitle: "Escolha uma cor no ecrã.",
    pick: "Escolher uma cor",
    pickAnother: "Escolher outra cor",
    noRecent: "Nenhuma cor recente.",
    selectedSrgb: "Cor escolhida · sRGB",
    formatListLabel: "Formatos de cor",
    settings: "Definições",
    close: "Fechar",
    language: "Idioma",
    theme: "Tema",
    themeSystem: "Sistema",
    themeLight: "Claro",
    themeDark: "Escuro",
    settingsNote: "O histórico e as preferências permanecem neste dispositivo.",
    done: "Concluído",
    recentOne: "Recente · 1",
    recentMany: "Recentes · {count}",
    copyHex: "Copiar {value}",
    copyRgb: "Copiar RGB {value}",
    copyHsl: "Copiar HSL {value}",
    useRecent: "Usar a cor recente {value}",
    copied: "Copiado",
    copyFailed: "Não foi possível copiar",
    selecting: "Escolha um ponto no ecrã.",
    cancelled: "Seleção cancelada",
    historyUnavailable: "Histórico indisponível",
    historyNotSaved: "O histórico não foi guardado",
    settingsNotSaved: "As definições não foram guardadas",
    unavailableTitle: "Seleção de cor indisponível",
    unavailableBody: "Esta versão do Chrome não consegue abrir a pipeta aqui.",
    rejectedTitle: "Seleção de cor recusada",
    rejectedBody: "O Chrome não permitiu abrir a pipeta. Nenhuma cor foi guardada.",
    operationTitle: "Não foi possível escolher a cor",
    operationBody: "O Chrome não concluiu a seleção. Nenhuma cor foi guardada.",
    retry: "Tentar novamente",
    closeAction: "Fechar"
  },
  zh: {
    loading: "正在加载…",
    emptyTitle: "从屏幕上选择一种颜色。",
    pick: "选择颜色",
    pickAnother: "选择其他颜色",
    noRecent: "暂无最近颜色。",
    selectedSrgb: "已选颜色 · sRGB",
    formatListLabel: "颜色格式",
    settings: "设置",
    close: "关闭",
    language: "语言",
    theme: "主题",
    themeSystem: "跟随系统",
    themeLight: "浅色",
    themeDark: "深色",
    settingsNote: "历史记录和偏好设置仅保留在此设备上。",
    done: "完成",
    recentOne: "最近 · 1",
    recentMany: "最近 · {count}",
    copyHex: "复制 {value}",
    copyRgb: "复制 RGB {value}",
    copyHsl: "复制 HSL {value}",
    useRecent: "使用最近颜色 {value}",
    copied: "已复制",
    copyFailed: "无法复制",
    selecting: "请选择屏幕上的一点。",
    cancelled: "已取消选择",
    historyUnavailable: "历史记录不可用",
    historyNotSaved: "历史记录未保存",
    settingsNotSaved: "设置未保存",
    unavailableTitle: "取色不可用",
    unavailableBody: "此版本的 Chrome 无法在此处打开取色器。",
    rejectedTitle: "取色被拒绝",
    rejectedBody: "Chrome 不允许打开取色器。没有保存任何颜色。",
    operationTitle: "取色失败",
    operationBody: "Chrome 无法完成选择。没有保存任何颜色。",
    retry: "重试",
    closeAction: "关闭"
  },
  ja: {
    loading: "読み込み中…",
    emptyTitle: "画面上の色を選択してください。",
    pick: "色を選択",
    pickAnother: "別の色を選択",
    noRecent: "最近の色はありません。",
    selectedSrgb: "選択した色 · sRGB",
    formatListLabel: "カラーフォーマット",
    settings: "設定",
    close: "閉じる",
    language: "言語",
    theme: "テーマ",
    themeSystem: "システム",
    themeLight: "ライト",
    themeDark: "ダーク",
    settingsNote: "履歴と設定はこの端末内に保存されます。",
    done: "完了",
    recentOne: "最近 · 1",
    recentMany: "最近 · {count}",
    copyHex: "{value} をコピー",
    copyRgb: "RGB {value} をコピー",
    copyHsl: "HSL {value} をコピー",
    useRecent: "最近の色 {value} を使用",
    copied: "コピー済み",
    copyFailed: "コピーできません",
    selecting: "画面上の点を選択してください。",
    cancelled: "選択をキャンセルしました",
    historyUnavailable: "履歴を利用できません",
    historyNotSaved: "履歴を保存できませんでした",
    settingsNotSaved: "設定を保存できませんでした",
    unavailableTitle: "スポイトを利用できません",
    unavailableBody: "このバージョンの Chrome ではここでスポイトを開けません。",
    rejectedTitle: "スポイトが拒否されました",
    rejectedBody: "Chrome がスポイトの起動を許可しませんでした。色は保存されていません。",
    operationTitle: "色を選択できません",
    operationBody: "Chrome が選択を完了できませんでした。色は保存されていません。",
    retry: "再試行",
    closeAction: "閉じる"
  },
  ru: {
    loading: "Загрузка…",
    emptyTitle: "Выберите цвет на экране.",
    pick: "Выбрать цвет",
    pickAnother: "Выбрать другой цвет",
    noRecent: "Недавних цветов нет.",
    selectedSrgb: "Выбранный цвет · sRGB",
    formatListLabel: "Форматы цвета",
    settings: "Настройки",
    close: "Закрыть",
    language: "Язык",
    theme: "Тема",
    themeSystem: "Системная",
    themeLight: "Светлая",
    themeDark: "Тёмная",
    settingsNote: "История и настройки остаются на этом устройстве.",
    done: "Готово",
    recentOne: "Недавний · 1",
    recentMany: "Недавние · {count}",
    copyHex: "Копировать {value}",
    copyRgb: "Копировать RGB {value}",
    copyHsl: "Копировать HSL {value}",
    useRecent: "Использовать недавний цвет {value}",
    copied: "Скопировано",
    copyFailed: "Не удалось скопировать",
    selecting: "Выберите точку на экране.",
    cancelled: "Выбор отменён",
    historyUnavailable: "История недоступна",
    historyNotSaved: "История не сохранена",
    settingsNotSaved: "Настройки не сохранены",
    unavailableTitle: "Пипетка недоступна",
    unavailableBody: "Эта версия Chrome не может открыть пипетку здесь.",
    rejectedTitle: "Выбор цвета отклонён",
    rejectedBody: "Chrome не разрешил открыть пипетку. Цвет не сохранён.",
    operationTitle: "Не удалось выбрать цвет",
    operationBody: "Chrome не смог завершить выбор. Цвет не сохранён.",
    retry: "Повторить",
    closeAction: "Закрыть"
  }
});

export function isValidHex(value) {
  return typeof value === "string" && HEX_PATTERN.test(value.toUpperCase());
}

export function normalizeHex(value) {
  return isValidHex(value) ? value.toUpperCase() : null;
}

export function normalizeHistory(value, limit = MAX_HISTORY) {
  if (!Array.isArray(value)) return [];
  const seen = new Set();
  const result = [];
  for (const candidate of value) {
    const hex = normalizeHex(candidate);
    if (!hex || seen.has(hex)) continue;
    seen.add(hex);
    result.push(hex);
    if (result.length >= limit) break;
  }
  return result;
}

export function hexToRgb(hex) {
  const normalized = normalizeHex(hex);
  if (!normalized) throw new TypeError("Invalid six-digit HEX value");
  return {
    r: Number.parseInt(normalized.slice(1, 3), 16),
    g: Number.parseInt(normalized.slice(3, 5), 16),
    b: Number.parseInt(normalized.slice(5, 7), 16)
  };
}

export function rgbToHsl(r, g, b) {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  const lightness = (max + min) / 2;
  let hue = 0;
  let saturation = 0;

  if (delta !== 0) {
    saturation = delta / (1 - Math.abs((2 * lightness) - 1));
    if (max === red) hue = 60 * (((green - blue) / delta) % 6);
    else if (max === green) hue = 60 * (((blue - red) / delta) + 2);
    else hue = 60 * (((red - green) / delta) + 4);
  }

  if (hue < 0) hue += 360;
  return {
    h: Math.round(hue),
    s: Math.round(saturation * 100),
    l: Math.round(lightness * 100)
  };
}

export function formatColor(hex) {
  const normalized = normalizeHex(hex);
  if (!normalized) throw new TypeError("Invalid six-digit HEX value");
  const rgb = hexToRgb(normalized);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  return {
    hex: normalized,
    rgb: String(rgb.r) + ", " + String(rgb.g) + ", " + String(rgb.b),
    hsl: String(hsl.h) + "°, " + String(hsl.s) + "%, " + String(hsl.l) + "%"
  };
}

export function resolveLanguage(value, fallback = "en") {
  const normalized = typeof value === "string"
    ? value.toLowerCase().replace("_", "-").split("-")[0]
    : "";
  return SUPPORTED_LANGUAGES.includes(normalized) ? normalized : fallback;
}

export function resolveTheme(value) {
  return SUPPORTED_THEMES.includes(value) ? value : "system";
}

export function classifyEyeDropperError(error) {
  if (error && error.name === "AbortError") return "cancel";
  if (error && (error.name === "NotAllowedError" || error.name === "InvalidStateError")) return "rejected";
  return "operation";
}

function interpolate(template, variables = {}) {
  return Object.entries(variables).reduce(
    (text, entry) => text.replaceAll("{" + entry[0] + "}", String(entry[1])),
    template
  );
}

function queryChromeLanguage() {
  try {
    return globalThis.chrome && chrome.i18n && chrome.i18n.getUILanguage
      ? chrome.i18n.getUILanguage()
      : navigator.language;
  } catch {
    return "en";
  }
}

function isLocalFixture() {
  if (typeof location === "undefined") return false;
  const localHost = location.hostname === "127.0.0.1" || location.hostname === "localhost";
  return localHost && (location.protocol === "http:" || location.protocol === "https:");
}

function fixtureName() {
  return isLocalFixture() ? new URLSearchParams(location.search).get("fixture") : null;
}

function createMemoryStorage(seed = {}) {
  const memory = structuredClone(seed);
  return {
    async get(keys) {
      const result = {};
      for (const key of keys) result[key] = structuredClone(memory[key]);
      return result;
    },
    async set(values) {
      Object.assign(memory, structuredClone(values));
    }
  };
}

function createChromeStorage() {
  const area = globalThis.chrome && chrome.storage && chrome.storage.local;
  if (!area) throw new Error("Chrome local storage is unavailable");
  return {
    get(keys) {
      return new Promise((resolve, reject) => {
        area.get(keys, (result) => {
          const failure = chrome.runtime && chrome.runtime.lastError;
          if (failure) reject(new Error(failure.message));
          else resolve(result);
        });
      });
    },
    set(values) {
      return new Promise((resolve, reject) => {
        area.set(values, () => {
          const failure = chrome.runtime && chrome.runtime.lastError;
          if (failure) reject(new Error(failure.message));
          else resolve();
        });
      });
    }
  };
}

if (typeof document !== "undefined") {
  const nodes = {};
  const state = {
    phase: "loading",
    currentColor: null,
    history: [],
    settings: {
      language: resolveLanguage(queryChromeLanguage()),
      theme: "system"
    },
    copyFeedback: null,
    settingsFeedback: "",
    noticeKey: null,
    errorCode: null,
    isPicking: false,
    isPersistingHistory: false,
    settingsSaving: false,
    storageHealthy: true
  };
  let storageAdapter;
  let settingsOpener = null;
  let copyRequestRevision = 0;
  let settingsSaveRevision = 0;
  let settingsSaveChain = Promise.resolve();
  const systemThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");

  function text(key, variables) {
    const language = resolveLanguage(state.settings.language);
    const dictionary = MESSAGES[language] || MESSAGES.en;
    const template = dictionary[key] || MESSAGES.en[key] || key;
    return interpolate(template, variables);
  }

  function cacheNodes() {
    for (const id of [
      "app", "loading-view", "empty-view", "result-view", "error-view",
      "main-content",
      "settings-button", "pick-button", "pick-another-button", "empty-notice",
      "result-title", "result-notice", "current-specimen", "hex-value",
      "rgb-value", "hsl-value", "copy-hex-button", "copy-rgb-button",
      "copy-hsl-button", "hex-feedback", "feedback-icon", "feedback-text",
      "rgb-feedback", "hsl-feedback", "settings-feedback",
      "recent-list", "error-title", "error-body", "error-action",
      "polite-status", "critical-alert", "settings-dialog",
      "settings-close-icon", "settings-done-button", "language-select",
      "theme-select"
    ]) {
      nodes[id] = document.getElementById(id);
    }
  }

  function setControlIcon(control, name) {
    control.replaceChildren(createLucideIcon(name));
  }

  function mountIcons() {
    document.querySelectorAll("[data-icon]").forEach((element) => {
      if (element === nodes["feedback-icon"]) return;
      setControlIcon(element, element.dataset.icon);
    });
  }

  function applyTheme() {
    const preferred = resolveTheme(state.settings.theme);
    const effective = preferred === "system"
      ? (systemThemeQuery.matches ? "dark" : "light")
      : preferred;
    document.documentElement.dataset.theme = effective;
    document.documentElement.style.colorScheme = effective;
  }

  function applyTranslations() {
    document.documentElement.lang = resolveLanguage(state.settings.language);
    document.querySelectorAll("[data-message]").forEach((element) => {
      element.textContent = text(element.dataset.message);
    });
    document.querySelectorAll("[data-message-aria]").forEach((element) => {
      element.setAttribute("aria-label", text(element.dataset.messageAria));
    });
    nodes["settings-button"].setAttribute("aria-label", text("settings"));
    nodes["settings-close-icon"].setAttribute("aria-label", text("close"));
  }

  function announce(message) {
    nodes["polite-status"].textContent = "";
    requestAnimationFrame(() => {
      nodes["polite-status"].textContent = message;
    });
  }

  function announceCritical(message) {
    nodes["critical-alert"].textContent = "";
    requestAnimationFrame(() => {
      nodes["critical-alert"].textContent = message;
    });
  }

  function showOnly(viewId) {
    for (const id of ["loading-view", "empty-view", "result-view", "error-view"]) {
      nodes[id].hidden = id !== viewId;
    }
  }

  function renderFeedback() {
    setControlIcon(nodes["copy-hex-button"], "Copy");
    setControlIcon(nodes["copy-rgb-button"], "Copy");
    setControlIcon(nodes["copy-hsl-button"], "Copy");
    nodes["hex-feedback"].hidden = true;
    nodes["hex-feedback"].removeAttribute("data-tone");
    nodes["feedback-text"].textContent = "";
    for (const id of ["rgb-feedback", "hsl-feedback"]) {
      nodes[id].hidden = true;
      nodes[id].textContent = "";
      nodes[id].removeAttribute("data-tone");
    }

    const feedback = state.copyFeedback;
    if (!feedback) return;
    const iconName = feedback.tone === "error" ? "X" : "CircleCheck";
    const feedbackMessage = text(feedback.messageKey);
    if (feedback.kind === "hex") {
      nodes["hex-feedback"].hidden = false;
      nodes["hex-feedback"].dataset.tone = feedback.tone;
      setControlIcon(nodes["feedback-icon"], iconName);
      nodes["feedback-text"].textContent = feedbackMessage;
      return;
    }
    const inlineFeedback = nodes[feedback.kind + "-feedback"];
    inlineFeedback.hidden = false;
    inlineFeedback.dataset.tone = feedback.tone;
    inlineFeedback.textContent = feedbackMessage;
  }

  function renderRecents() {
    nodes["recent-list"].replaceChildren();
    if (state.history.length === 0) return;

    const current = state.history[0];
    const primary = document.createElement("button");
    primary.type = "button";
    primary.className = "recent-item";
    primary.disabled = state.isPersistingHistory;
    primary.setAttribute("aria-label", text("useRecent", { value: current }));

    const label = document.createElement("span");
    label.className = "recent-item-label";
    label.textContent = text(state.history.length === 1 ? "recentOne" : "recentMany", {
      count: state.history.length
    });
    const swatch = document.createElement("span");
    swatch.className = "recent-swatch";
    swatch.setAttribute("aria-hidden", "true");
    swatch.style.backgroundColor = current;
    primary.append(label, swatch);
    primary.addEventListener("click", () => selectRecent(current));
    nodes["recent-list"].append(primary);

    if (state.history.length > 1) {
      const additional = document.createElement("div");
      additional.className = "additional-recents";
      for (const hex of state.history.slice(1)) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "additional-recent-button";
        button.disabled = state.isPersistingHistory;
        button.setAttribute("aria-label", text("useRecent", { value: hex }));
        const color = document.createElement("span");
        color.className = "recent-swatch";
        color.setAttribute("aria-hidden", "true");
        color.style.backgroundColor = hex;
        button.append(color);
        button.addEventListener("click", () => selectRecent(hex));
        additional.append(button);
      }
      nodes["recent-list"].append(additional);
    }
  }

  function renderResult() {
    const formatted = formatColor(state.currentColor);
    nodes["current-specimen"].style.backgroundColor = formatted.hex;
    nodes["hex-value"].textContent = formatted.hex;
    nodes["rgb-value"].textContent = formatted.rgb;
    nodes["hsl-value"].textContent = formatted.hsl;
    nodes["copy-hex-button"].setAttribute("aria-label", text("copyHex", { value: formatted.hex }));
    nodes["copy-rgb-button"].setAttribute("aria-label", text("copyRgb", { value: formatted.rgb }));
    nodes["copy-hsl-button"].setAttribute("aria-label", text("copyHsl", { value: formatted.hsl }));
    nodes["result-notice"].textContent = state.noticeKey ? text(state.noticeKey) : "";
    renderFeedback();
    renderRecents();
  }

  function errorPresentation(code) {
    if (code === "unavailable") {
      return {
        title: text("unavailableTitle"),
        body: text("unavailableBody"),
        action: text("closeAction"),
        actionName: "close"
      };
    }
    if (code === "rejected") {
      return {
        title: text("rejectedTitle"),
        body: text("rejectedBody"),
        action: text("retry"),
        actionName: "retry"
      };
    }
    return {
      title: text("operationTitle"),
      body: text("operationBody"),
      action: text("retry"),
      actionName: "retry"
    };
  }

  function renderError() {
    const presentation = errorPresentation(state.errorCode);
    nodes["error-title"].textContent = presentation.title;
    nodes["error-body"].textContent = presentation.body;
    nodes["error-action"].textContent = presentation.action;
    nodes["error-action"].dataset.action = presentation.actionName;
  }

  function render() {
    applyTranslations();
    applyTheme();
    nodes.app.setAttribute("aria-busy", String(state.phase === "loading"));
    nodes["language-select"].value = resolveLanguage(state.settings.language);
    nodes["theme-select"].value = resolveTheme(state.settings.theme);
    nodes["settings-button"].disabled = state.phase === "loading"
      || state.isPicking
      || state.isPersistingHistory;
    nodes["pick-button"].disabled = state.isPicking || state.isPersistingHistory;
    nodes["pick-another-button"].disabled = state.isPicking || state.isPersistingHistory;
    nodes["settings-feedback"].textContent = state.settingsFeedback;
    for (const id of ["settings-close-icon", "settings-done-button"]) {
      nodes[id].disabled = state.settingsSaving;
    }
    nodes["settings-dialog"].setAttribute("aria-busy", String(state.settingsSaving));

    if (state.phase === "loading") {
      showOnly("loading-view");
      return;
    }
    if (state.phase === "empty") {
      showOnly("empty-view");
      nodes["empty-notice"].textContent = state.noticeKey ? text(state.noticeKey) : "";
      return;
    }
    if (state.phase === "result") {
      showOnly("result-view");
      renderResult();
      return;
    }
    showOnly("error-view");
    renderError();
  }

  function focusResultHeading() {
    requestAnimationFrame(() => {
      nodes["main-content"].scrollTop = 0;
      nodes["result-title"].focus({ preventScroll: true });
    });
  }

  function selectRecent(hex) {
    const normalized = normalizeHex(hex);
    if (!normalized) return;
    state.currentColor = normalized;
    state.phase = "result";
    state.noticeKey = null;
    state.copyFeedback = null;
    copyRequestRevision += 1;
    render();
    requestAnimationFrame(() => nodes["copy-hex-button"].focus());
  }

  async function persistHistory() {
    await storageAdapter.set({ [HISTORY_KEY]: state.history });
  }

  function setPickingNotice() {
    state.noticeKey = "selecting";
    if (state.currentColor) state.phase = "result";
    else state.phase = "empty";
    render();
    announce(text(state.noticeKey));
  }

  async function pickColorFromGesture() {
    const returnPhase = state.currentColor ? "result" : "empty";
    state.copyFeedback = null;
    copyRequestRevision += 1;
    state.noticeKey = null;

    if (typeof globalThis.EyeDropper !== "function") {
      showError("unavailable");
      return;
    }

    let pendingSelection;
    try {
      pendingSelection = new globalThis.EyeDropper().open();
    } catch (error) {
      showError(classifyEyeDropperError(error));
      return;
    }

    state.isPicking = true;
    setPickingNotice();

    try {
      const result = await pendingSelection;
      const hex = normalizeHex(result && result.sRGBHex);
      if (!hex) throw new DOMException("Invalid EyeDropper result", "OperationError");
      state.currentColor = hex;
      state.history = normalizeHistory([hex, ...state.history]);
      state.phase = "result";
      state.noticeKey = null;
      state.errorCode = null;
      state.copyFeedback = null;
      state.isPicking = false;
      state.isPersistingHistory = true;
      render();
      focusResultHeading();
      let historySaved = true;
      try {
        await persistHistory();
        state.storageHealthy = true;
      } catch {
        historySaved = false;
        state.storageHealthy = false;
        state.noticeKey = "historyNotSaved";
      } finally {
        state.isPersistingHistory = false;
        render();
      }
      if (!historySaved) {
        announceCritical(text(state.noticeKey));
        requestAnimationFrame(() => nodes["copy-hex-button"].focus());
      }
    } catch (error) {
      const classification = classifyEyeDropperError(error);
      if (classification === "cancel") {
        state.phase = returnPhase;
        state.noticeKey = "cancelled";
        state.copyFeedback = null;
        render();
        announce(text(state.noticeKey));
        requestAnimationFrame(() => {
          const target = returnPhase === "result" ? nodes["pick-another-button"] : nodes["pick-button"];
          target.focus({ preventScroll: true });
        });
      } else {
        showError(classification);
      }
    } finally {
      state.isPicking = false;
      render();
    }
  }

  function showError(code) {
    state.phase = "error";
    state.errorCode = code;
    state.noticeKey = null;
    state.copyFeedback = null;
    state.isPicking = false;
    render();
    const presentation = errorPresentation(code);
    announceCritical(presentation.title + ". " + presentation.body);
    requestAnimationFrame(() => nodes["error-action"].focus());
  }

  async function copyColor(kind) {
    if (!state.currentColor) return;
    const requestRevision = ++copyRequestRevision;
    const formatted = formatColor(state.currentColor);
    const value = formatted[kind];
    state.copyFeedback = null;
    renderFeedback();
    try {
      await navigator.clipboard.writeText(value);
      if (requestRevision !== copyRequestRevision) return;
      state.copyFeedback = { kind, tone: "success", messageKey: "copied" };
      renderFeedback();
      announce(text("copied"));
    } catch {
      if (requestRevision !== copyRequestRevision) return;
      state.copyFeedback = { kind, tone: "error", messageKey: "copyFailed" };
      renderFeedback();
      announceCritical(text("copyFailed"));
    }
  }

  function openSettings() {
    settingsOpener = document.activeElement;
    state.settingsFeedback = "";
    nodes["settings-feedback"].textContent = "";
    nodes["language-select"].value = resolveLanguage(state.settings.language);
    nodes["theme-select"].value = resolveTheme(state.settings.theme);
    nodes["settings-dialog"].showModal();
    requestAnimationFrame(() => nodes["settings-close-icon"].focus({ preventScroll: true }));
  }

  function closeSettings() {
    if (nodes["settings-dialog"].open) nodes["settings-dialog"].close();
  }

  function restoreSettingsFocus() {
    const target = settingsOpener && settingsOpener.isConnected
      ? settingsOpener
      : nodes["settings-button"];
    settingsOpener = null;
    requestAnimationFrame(() => target.focus({ preventScroll: true }));
  }

  async function saveSettings() {
    const revision = ++settingsSaveRevision;
    const settingsSnapshot = { ...state.settings };
    state.settingsFeedback = "";
    nodes["settings-feedback"].textContent = "";
    state.settingsSaving = true;
    render();

    const operation = settingsSaveChain
      .catch(() => undefined)
      .then(() => storageAdapter.set({ [SETTINGS_KEY]: settingsSnapshot }));
    settingsSaveChain = operation;

    try {
      await operation;
      if (revision !== settingsSaveRevision) return;
      state.settingsFeedback = "";
      nodes["settings-feedback"].textContent = "";
    } catch {
      if (revision !== settingsSaveRevision) return;
      state.settingsFeedback = text("settingsNotSaved");
      nodes["settings-feedback"].textContent = state.settingsFeedback;
    } finally {
      if (revision === settingsSaveRevision) {
        state.settingsSaving = false;
        render();
      }
    }
  }

  function handleDialogKeyboard(event) {
    if (event.key !== "Tab") return;
    const controls = Array.from(
      nodes["settings-dialog"].querySelectorAll("button:not(:disabled), select:not(:disabled)")
    );
    if (controls.length === 0) return;
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function bindEvents() {
    nodes["settings-button"].addEventListener("click", openSettings);
    nodes["settings-close-icon"].addEventListener("click", closeSettings);
    nodes["settings-done-button"].addEventListener("click", closeSettings);
    nodes["settings-dialog"].addEventListener("close", restoreSettingsFocus);
    nodes["settings-dialog"].addEventListener("cancel", (event) => {
      if (state.settingsSaving) event.preventDefault();
    });
    nodes["settings-dialog"].addEventListener("keydown", handleDialogKeyboard);
    nodes["pick-button"].addEventListener("click", pickColorFromGesture);
    nodes["pick-another-button"].addEventListener("click", pickColorFromGesture);
    nodes["copy-hex-button"].addEventListener("click", () => copyColor("hex"));
    nodes["copy-rgb-button"].addEventListener("click", () => copyColor("rgb"));
    nodes["copy-hsl-button"].addEventListener("click", () => copyColor("hsl"));
    nodes["error-action"].addEventListener("click", () => {
      if (nodes["error-action"].dataset.action === "close") window.close();
      else pickColorFromGesture();
    });
    nodes["language-select"].addEventListener("change", async (event) => {
      state.settings = {
        ...state.settings,
        language: resolveLanguage(event.target.value)
      };
      render();
      await saveSettings();
    });
    nodes["theme-select"].addEventListener("change", async (event) => {
      state.settings = {
        ...state.settings,
        theme: resolveTheme(event.target.value)
      };
      applyTheme();
      await saveSettings();
    });
    systemThemeQuery.addEventListener("change", () => {
      if (resolveTheme(state.settings.theme) === "system") applyTheme();
    });
  }

  function fixtureSeed(name) {
    const language = resolveLanguage(new URLSearchParams(location.search).get("lang"), "fr");
    const themeParameter = new URLSearchParams(location.search).get("theme");
    const theme = resolveTheme(themeParameter || (name === "dark" ? "dark" : "light"));
    const hasColor = !["empty", "error", "unavailable"].includes(name);
    return {
      [HISTORY_KEY]: hasColor ? ["#F96B00"] : [],
      [SETTINGS_KEY]: { language, theme }
    };
  }

  async function applyFixture(name) {
    const seed = fixtureSeed(name);
    storageAdapter = createMemoryStorage(seed);
    state.settings = { ...state.settings, ...seed[SETTINGS_KEY] };
    state.history = normalizeHistory(seed[HISTORY_KEY]);
    state.currentColor = state.history[0] || null;
    state.phase = state.currentColor ? "result" : "empty";
    state.noticeKey = null;
    state.copyFeedback = null;

    if (name === "target" || name === "dark" || name === "settings" || name === "focus") {
      state.copyFeedback = { kind: "hex", tone: "success", messageKey: "copied" };
    } else if (name === "copy-failure") {
      state.copyFeedback = { kind: "hex", tone: "error", messageKey: "copyFailed" };
    } else if (name === "error") {
      state.phase = "error";
      state.errorCode = "operation";
    } else if (name === "unavailable") {
      state.phase = "error";
      state.errorCode = "unavailable";
    }

    render();
    if (name === "settings") requestAnimationFrame(openSettings);
    if (name === "focus") requestAnimationFrame(() => nodes["copy-hex-button"].focus());
  }

  async function loadRuntimeState() {
    storageAdapter = createChromeStorage();
    const preserveExistingFocus = () => {
      const active = document.activeElement;
      return Boolean(active && active !== document.body && active !== document.documentElement);
    };
    try {
      const stored = await storageAdapter.get([HISTORY_KEY, SETTINGS_KEY]);
      const storedSettings = stored[SETTINGS_KEY] && typeof stored[SETTINGS_KEY] === "object"
        ? stored[SETTINGS_KEY]
        : {};
      state.settings = {
        ...storedSettings,
        language: resolveLanguage(storedSettings.language || queryChromeLanguage()),
        theme: resolveTheme(storedSettings.theme)
      };
      state.history = normalizeHistory(stored[HISTORY_KEY]);
      state.currentColor = state.history[0] || null;
      state.phase = state.currentColor ? "result" : "empty";
      state.noticeKey = null;
      state.storageHealthy = true;
    } catch {
      state.history = [];
      state.currentColor = null;
      state.phase = "empty";
      state.noticeKey = "historyUnavailable";
      state.storageHealthy = false;
    }
    const shouldPreserveFocus = preserveExistingFocus();
    render();
    if (!state.storageHealthy) announceCritical(text(state.noticeKey));
    if (!shouldPreserveFocus && state.phase === "result") focusResultHeading();
    else if (!shouldPreserveFocus && state.phase === "empty") {
      requestAnimationFrame(() => nodes["pick-button"].focus());
    }
  }

  async function bootstrap() {
    cacheNodes();
    mountIcons();
    bindEvents();
    applyTranslations();
    applyTheme();
    const fixture = fixtureName();
    if (fixture) await applyFixture(fixture);
    else await loadRuntimeState();
  }

  bootstrap().catch(() => {
    if (nodes.app) {
      state.phase = "empty";
      state.noticeKey = "historyUnavailable";
      state.storageHealthy = false;
      render();
      announceCritical(text(state.noticeKey));
    }
  });
}
