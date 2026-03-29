import { dispatch, orchestrator } from "satcheljs"

import {
  applyDepthSnapshot,
  prependTrades,
  requestTokenStreams,
  resetTokenStreamsStore,
  setTokenStreamFlags,
  teardownTokenStreams,
} from "@/actions/tokenStreamsActions"
import { parsePartialDepthPayload, parseTradeMessage } from "@/lib/binance/wsParsers"
import { connectReconnectingWebSocket } from "@/lib/ws/reconnectingWebSocket"

const DEPTH_FLUSH_MS = 100

let disconnectDepth: (() => void) | null = null
let disconnectTrades: (() => void) | null = null
let depthFlushTimer: ReturnType<typeof setTimeout> | null = null
let depthPending: { bids: [string, string][]; asks: [string, string][] } | null =
  null

function clearDepthFlush(): void {
  if (depthFlushTimer) {
    clearTimeout(depthFlushTimer)
    depthFlushTimer = null
  }
  depthPending = null
}

function stopStreams(): void {
  clearDepthFlush()
  disconnectDepth?.()
  disconnectTrades?.()
  disconnectDepth = null
  disconnectTrades = null
}

orchestrator(requestTokenStreams, (msg) => {
  stopStreams()
  const sym = msg.symbol.toUpperCase()
  const low = sym.toLowerCase()
  const depthUrl = `wss://stream.binance.com:9443/ws/${low}@depth20@100ms`
  const tradeUrl = `wss://stream.binance.com:9443/ws/${low}@trade`

  disconnectDepth = connectReconnectingWebSocket(
    depthUrl,
    {
      onOpen: () => {
        dispatch(setTokenStreamFlags({ depthConnected: true }))
      },
      onMessage: (ev: MessageEvent) => {
        try {
          const parsed: unknown = JSON.parse(String(ev.data))
          const snap = parsePartialDepthPayload(parsed)
          if (!snap) return
          depthPending = snap
          if (depthFlushTimer) return
          depthFlushTimer = window.setTimeout(() => {
            depthFlushTimer = null
            if (depthPending) {
              dispatch(applyDepthSnapshot(depthPending))
              depthPending = null
            }
          }, DEPTH_FLUSH_MS)
        } catch {
          /* ignore */
        }
      },
      onClose: () => {
        dispatch(setTokenStreamFlags({ depthConnected: false }))
      },
    },
    { minDelayMs: 1_000, maxDelayMs: 60_000 },
  )

  disconnectTrades = connectReconnectingWebSocket(
    tradeUrl,
    {
      onOpen: () => {
        dispatch(setTokenStreamFlags({ tradesConnected: true }))
      },
      onMessage: (ev: MessageEvent) => {
        try {
          const parsed: unknown = JSON.parse(String(ev.data))
          const trade = parseTradeMessage(parsed)
          if (trade) {
            dispatch(prependTrades({ trades: [trade] }))
          }
        } catch {
          /* ignore */
        }
      },
      onClose: () => {
        dispatch(setTokenStreamFlags({ tradesConnected: false }))
      },
    },
    { minDelayMs: 1_000, maxDelayMs: 60_000 },
  )
})

orchestrator(teardownTokenStreams, () => {
  stopStreams()
  dispatch(resetTokenStreamsStore())
})
