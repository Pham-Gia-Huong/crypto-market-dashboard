import { dispatch, orchestrator } from "satcheljs"

import { hydrateSettings, loadPersistedSettings } from "@/actions/settingsActions"
import type { AppLanguage, AppTheme } from "@/store/settingsStore"
import { SETTINGS_STORAGE_KEY } from "@/store/settingsStore"

orchestrator(loadPersistedSettings, () => {
  if (typeof window === "undefined") return
  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY)
    if (!raw) return
    const data = JSON.parse(raw) as {
      theme?: string
      language?: string
      favorites?: string[]
      avatarDataUrl?: string | null
    }
    const theme: AppTheme = data.theme === "dark" ? "dark" : "light"
    const language: AppLanguage =
      data.language === "vi" ? "vi" : "en"
    dispatch(
      hydrateSettings({
        theme,
        language,
        favorites: Array.isArray(data.favorites)
          ? data.favorites.map((s) => String(s).toUpperCase())
          : [],
        avatarDataUrl:
          typeof data.avatarDataUrl === "string" ? data.avatarDataUrl : null,
      }),
    )
  } catch {
    /* ignore corrupt storage */
  }
})

