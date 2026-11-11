import type { TranslatorSettings } from "./types";

export const SETTINGS_KEY = "midrasj-nl-settings-v1";

export const DEFAULT_SETTINGS: TranslatorSettings = {
  engine: "auto",
  apiBase: "https://api.openai.com/v1",
  model: "gpt-4o-mini",
  apiKey: "",
};

export function loadSettings(): TranslatorSettings {
  if (typeof localStorage === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<TranslatorSettings>;
    return {
      engine: parsed.engine === "chat" ? "chat" : "auto",
      apiBase: parsed.apiBase || DEFAULT_SETTINGS.apiBase,
      model: parsed.model || DEFAULT_SETTINGS.model,
      apiKey: parsed.apiKey || "",
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: TranslatorSettings) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
