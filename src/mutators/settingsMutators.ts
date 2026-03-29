import { mutator } from "satcheljs"
import i18n from "i18next"

import {
  hydrateSettings,
  setAvatarDataUrl,
  setLanguage,
  setTheme,
  toggleFavoriteSymbol,
} from "@/actions/settingsActions"
import {
  persistSettingsSnapshot,
  toggleFavoriteForSymbol,
} from "@/lib/settingsPersistence"
import { getSettingsStore } from "@/store/settingsStore"

function applyDomTheme(theme: "light" | "dark"): void {
  if (typeof document === "undefined") return
  document.documentElement.classList.toggle("dark", theme === "dark")
}

mutator(hydrateSettings, (msg) => {
  const s = getSettingsStore()
  s.theme = msg.theme
  s.language = msg.language
  s.favorites.replace(msg.favorites.map((x) => String(x).toUpperCase()))
  s.avatarDataUrl = msg.avatarDataUrl
  applyDomTheme(msg.theme)
  void i18n.changeLanguage(msg.language)
})

mutator(setTheme, (msg) => {
  getSettingsStore().theme = msg.theme
  applyDomTheme(msg.theme)
  persistSettingsSnapshot()
})

mutator(setLanguage, (msg) => {
  getSettingsStore().language = msg.language
  void i18n.changeLanguage(msg.language)
  persistSettingsSnapshot()
})

mutator(toggleFavoriteSymbol, (msg) => {
  toggleFavoriteForSymbol(msg.symbol)
})

mutator(setAvatarDataUrl, (msg) => {
  getSettingsStore().avatarDataUrl = msg.url
  persistSettingsSnapshot()
})
