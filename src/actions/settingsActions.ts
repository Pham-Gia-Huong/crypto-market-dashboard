import { action } from "satcheljs"

import type { AppLanguage, AppTheme } from "@/store/settingsStore"

export const hydrateSettings = action(
  "HYDRATE_SETTINGS",
  (payload: {
    theme: AppTheme
    language: AppLanguage
    favorites: string[]
    avatarDataUrl: string | null
  }) => payload,
)

export const loadPersistedSettings = action(
  "LOAD_PERSISTED_SETTINGS",
  () => ({}),
)

export const setTheme = action(
  "SET_THEME",
  (theme: AppTheme) => ({ theme }),
)

export const setLanguage = action(
  "SET_LANGUAGE",
  (language: AppLanguage) => ({ language }),
)

export const toggleFavoriteSymbol = action(
  "TOGGLE_FAVORITE_SYMBOL",
  (symbol: string) => ({ symbol }),
)

export const setAvatarDataUrl = action(
  "SET_AVATAR_DATA_URL",
  (url: string | null) => ({ url }),
)
