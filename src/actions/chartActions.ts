import { action } from "satcheljs"

import type { KlineInterval } from "@/store/chartStore"
import type { CandlestickData, Time } from "lightweight-charts"

export const setChartContext = action(
  "SET_CHART_CONTEXT",
  (payload: { symbol: string; interval: KlineInterval }) => payload,
)

export const resetChartStoreAction = action("RESET_CHART_STORE", () => ({}))

export const requestChartSession = action(
  "REQUEST_CHART_SESSION",
  (payload: { symbol: string; interval: KlineInterval }) => payload,
)

export const requestChartTeardown = action(
  "REQUEST_CHART_TEARDOWN",
  () => ({}),
)

export const setChartLoading = action(
  "SET_CHART_LOADING",
  (loading: boolean) => ({ loading }),
)

export const setChartError = action(
  "SET_CHART_ERROR",
  (message: string | null) => ({ message }),
)

export const setChartCandlesReplace = action(
  "SET_CHART_CANDLES_REPLACE",
  (payload: { candles: CandlestickData<Time>[] }) => payload,
)

export const applyChartKline = action(
  "APPLY_CHART_KLINE",
  (payload: { candle: CandlestickData<Time> }) => payload,
)
