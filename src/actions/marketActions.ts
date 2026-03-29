import { action } from "satcheljs"

import type { MarketPair } from "@/store/marketStore"
import type { BinanceMiniTickerMessage } from "@/types/binance"

export const setSymbolsLoading = action(
  "SET_SYMBOLS_LOADING",
  (loading: boolean) => ({ loading }),
)

export const setSymbolsError = action(
  "SET_SYMBOLS_ERROR",
  (message: string | null) => ({ message }),
)

export const setMarketPairs = action(
  "SET_MARKET_PAIRS",
  (payload: { pairs: MarketPair[] }) => payload,
)

export const applyMiniTickerBatch = action(
  "APPLY_MINI_TICKER_BATCH",
  (payload: { items: BinanceMiniTickerMessage[] }) => payload,
)

export const clearTickerFlash = action(
  "CLEAR_TICKER_FLASH",
  (symbol: string) => ({ symbol }),
)

export const setWsStatus = action(
  "SET_WS_STATUS",
  (payload: { connected: boolean; error: string | null }) => payload,
)

/** Side-effect entry: fetch REST + start WebSocket */
export const loadMarketSymbols = action(
  "LOAD_MARKET_SYMBOLS",
  () => ({}),
)
