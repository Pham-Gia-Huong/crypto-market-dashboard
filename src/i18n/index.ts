import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import en from "./locales/en.json"
import vi from "./locales/vi.json"

import { SETTINGS_STORAGE_KEY } from "@/store/settingsStore"

function getInitialLng(): string {
  if (typeof window === "undefined") return "en"
  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY)
    if (raw) {
      const s = JSON.parse(raw) as { language?: string }
      if (s.language === "en" || s.language === "vi") return s.language
    }
  } catch {
    /* ignore */
  }
  const nav = window.navigator.language?.toLowerCase() ?? "en"
  return nav.startsWith("vi") ? "vi" : "en"
}

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    vi: { translation: vi },
  },
  lng: getInitialLng(),
  fallbackLng: "en",
  interpolation: { escapeValue: false },
})

export default i18n
