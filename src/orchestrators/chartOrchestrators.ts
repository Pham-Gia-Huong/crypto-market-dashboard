import { dispatch, orchestrator } from "satcheljs"
import { toast } from "sonner"

import {
  applyChartKline,
  requestChartSession,
  requestChartTeardown,
  resetChartStoreAction,
  setChartCandlesReplace,
  setChartContext,
  setChartError,
  setChartLoading,
} from "@/actions/chartActions"
import { fetchKlines } from "@/lib/binance/klines"
import { connectReconnectingWebSocket } from "@/lib/ws/reconnectingWebSocket"
import type { KlineInterval } from "@/store/chartStore"
import { isKlineWsMessage } from "@/types/binance"
import type { CandlestickData, Time, UTCTimestamp } from "lightweight-charts"

let disconnectKline: (() => void) | null = null

function closeKlineWs(): void {
  disconnectKline?.()
  disconnectKline = null
}

function klineStreamPath(symbol: string, interval: KlineInterval): string {
  return `${symbol.toLowerCase()}@kline_${interval}`
}

function connectKlineSocket(symbol: string, interval: KlineInterval): void {
  closeKlineWs()
  const path = klineStreamPath(symbol, interval)
  const url = `wss://stream.binance.com:9443/ws/${path}`

  disconnectKline = connectReconnectingWebSocket(
    url,
    {
      onMessage: (ev: MessageEvent) => {
        try {
          const parsed: unknown = JSON.parse(String(ev.data))
          if (!isKlineWsMessage(parsed)) return
          const k = parsed.k
          const candle: CandlestickData<Time> = {
            time: Math.floor(k.t / 1000) as UTCTimestamp,
            open: Number(k.o),
            high: Number(k.h),
            low: Number(k.l),
            close: Number(k.c),
          }
          dispatch(applyChartKline({ candle }))
        } catch {
          /* ignore */
        }
      },
    },
    { minDelayMs: 1_000, maxDelayMs: 60_000 },
  )
}

orchestrator(requestChartSession, async (msg) => {
  closeKlineWs()
  dispatch(setChartContext({ symbol: msg.symbol, interval: msg.interval }))
  dispatch(setChartCandlesReplace({ candles: [] }))
  dispatch(setChartLoading(true))
  dispatch(setChartError(null))
  try {
    const candles = await fetchKlines(msg.symbol, msg.interval)
    dispatch(setChartCandlesReplace({ candles }))
    connectKlineSocket(msg.symbol, msg.interval)
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load chart"
    dispatch(setChartError(message))
    toast.error(message)
  } finally {
    dispatch(setChartLoading(false))
  }
})

orchestrator(requestChartTeardown, () => {
  closeKlineWs()
  dispatch(resetChartStoreAction())
})
