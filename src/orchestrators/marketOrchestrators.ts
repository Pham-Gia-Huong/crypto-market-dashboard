import { dispatch, orchestrator } from "satcheljs"
import { toast } from "sonner"

import {
  applyMiniTickerBatch,
  clearTickerFlash,
  loadMarketSymbols,
  setMarketPairs,
  setSymbolsError,
  setSymbolsLoading,
  setWsStatus,
} from "@/actions/marketActions"
import { getBinanceRestBase, parseUsdtSpotPairs } from "@/lib/binance/exchangeInfo"
import { connectReconnectingWebSocket } from "@/lib/ws/reconnectingWebSocket"
import { getMarketStore } from "@/store/marketStore"
import type {
  BinanceExchangeInfoResponse,
  BinanceMiniTickerMessage,
} from "@/types/binance"
import { isMiniTickerMessage } from "@/types/binance"

const MINI_TICKER_WS = "wss://stream.binance.com:9443/ws/!miniTicker@arr"
const FLUSH_MS = 100
const FLASH_CLEAR_MS = 350

let disconnectMiniTicker: (() => void) | null = null
const pending = new Map<string, BinanceMiniTickerMessage>()
let flushTimer: ReturnType<typeof setTimeout> | null = null

function scheduleFlush(): void {
  if (flushTimer) return
  flushTimer = setTimeout(() => {
    flushTimer = null
    const items = [...pending.values()]
    pending.clear()
    if (items.length) {
      dispatch(applyMiniTickerBatch({ items }))
    }
  }, FLUSH_MS)
}

function connectMiniTickerWebSocket(): void {
  disconnectMiniTicker?.()
  disconnectMiniTicker = null

  disconnectMiniTicker = connectReconnectingWebSocket(
    MINI_TICKER_WS,
    {
      onOpen: () => {
        dispatch(setWsStatus({ connected: true, error: null }))
      },
      onMessage: (ev: MessageEvent) => {
        try {
          const parsed: unknown = JSON.parse(String(ev.data))
          const list = Array.isArray(parsed) ? parsed : [parsed]
          for (const raw of list) {
            if (!isMiniTickerMessage(raw)) continue
            pending.set(raw.s, raw)
          }
          scheduleFlush()
        } catch {
          /* ignore */
        }
      },
      onClose: () => {
        dispatch(setWsStatus({ connected: false, error: null }))
      },
    },
    { minDelayMs: 1_000, maxDelayMs: 60_000 },
  )
}

orchestrator(loadMarketSymbols, async () => {
  dispatch(setSymbolsLoading(true))
  dispatch(setSymbolsError(null))
  try {
    const base = getBinanceRestBase()
    const res = await fetch(`${base}/exchangeInfo`)
    if (!res.ok) {
      throw new Error(`exchangeInfo failed: ${res.status}`)
    }
    const data = (await res.json()) as BinanceExchangeInfoResponse
    const pairs = parseUsdtSpotPairs(data)
    dispatch(setMarketPairs({ pairs }))
    connectMiniTickerWebSocket()
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to load markets"
    dispatch(setSymbolsError(message))
    toast.error(message)
  } finally {
    dispatch(setSymbolsLoading(false))
  }
})

orchestrator(applyMiniTickerBatch, (msg) => {
  const store = getMarketStore()
  const seen = new Set<string>()
  for (const item of msg.items) {
    if (!store.allowedSymbols.has(item.s)) continue
    const row = store.tickers.get(item.s)
    if (row?.flash) seen.add(item.s)
  }
  if (seen.size === 0) return
  window.setTimeout(() => {
    for (const symbol of seen) {
      dispatch(clearTickerFlash(symbol))
    }
  }, FLASH_CLEAR_MS)
})
