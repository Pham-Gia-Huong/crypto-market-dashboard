import { mutator } from "satcheljs"

import {
  applyDepthSnapshot,
  prependTrades,
  requestTokenStreams,
  resetTokenStreamsStore,
  setTokenStreamFlags,
} from "@/actions/tokenStreamsActions"
import { getTokenStreamsStore } from "@/store/tokenStreamsStore"

const MAX_TRADES = 80

mutator(requestTokenStreams, (msg) => {
  const s = getTokenStreamsStore()
  s.symbol = msg.symbol.toUpperCase()
  s.depthBids = []
  s.depthAsks = []
  s.trades = []
  s.depthConnected = false
  s.tradesConnected = false
})

mutator(applyDepthSnapshot, (msg) => {
  getTokenStreamsStore().depthBids = msg.bids
  getTokenStreamsStore().depthAsks = msg.asks
})

mutator(prependTrades, (msg) => {
  const s = getTokenStreamsStore()
  const merged = [...msg.trades, ...s.trades]
  const seen = new Set<string>()
  const next: typeof s.trades = []
  for (const row of merged) {
    if (seen.has(row.id)) continue
    seen.add(row.id)
    next.push(row)
    if (next.length >= MAX_TRADES) break
  }
  s.trades = next
})

mutator(setTokenStreamFlags, (msg) => {
  const s = getTokenStreamsStore()
  if (msg.depthConnected !== undefined) s.depthConnected = msg.depthConnected
  if (msg.tradesConnected !== undefined) s.tradesConnected = msg.tradesConnected
})

mutator(resetTokenStreamsStore, () => {
  const s = getTokenStreamsStore()
  s.symbol = null
  s.depthBids = []
  s.depthAsks = []
  s.trades = []
  s.depthConnected = false
  s.tradesConnected = false
})
