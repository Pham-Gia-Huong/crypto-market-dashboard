import { runInAction } from "mobx"

import { getSettingsStore, SETTINGS_STORAGE_KEY } from "@/store/settingsStore"

export function persistSettingsSnapshot(): void {
  if (typeof window === "undefined") return
  const s = getSettingsStore()
  try {
    window.localStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify({
        theme: s.theme,
        language: s.language,
        favorites: [...s.favorites],
        avatarDataUrl: s.avatarDataUrl,
      }),
    )
  } catch {
    /* quota */
  }
}

/** Cập nhật favorites + localStorage. Gọi trực tiếp từ UI — không phụ thuộc Satchel dispatch/subscriber id. */
export function toggleFavoriteForSymbol(symbol: string): void {
  runInAction(() => {
    const list = getSettingsStore().favorites
    const sym = symbol.toUpperCase()
    const i = list.indexOf(sym)
    if (i >= 0) list.splice(i, 1)
    else list.push(sym)
  })
  persistSettingsSnapshot()
}
