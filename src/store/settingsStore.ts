import { observable, type IObservableArray } from "mobx"
import { createStore } from "satcheljs"

export type AppTheme = "light" | "dark"
export type AppLanguage = "en" | "vi"

export interface SettingsStoreState {
  theme: AppTheme
  language: AppLanguage
  /** Uppercase Binance symbols (e.g. BTCUSDT). Observable array — reliable MobX tracking vs Set in Satchel store. */
  favorites: IObservableArray<string>
  avatarDataUrl: string | null
}

export const SETTINGS_STORAGE_KEY = "crypto-dashboard-settings"

const initialState: SettingsStoreState = {
  theme: "light",
  language: "en",
  favorites: observable.array<string>([]),
  avatarDataUrl: null,
}

export const getSettingsStore = createStore<SettingsStoreState>(
  "settingsStore",
  initialState,
)
