import { action } from "satcheljs"

import type { DepthLevel, RecentTradeRow } from "@/store/tokenStreamsStore"

export const requestTokenStreams = action(
  "REQUEST_TOKEN_STREAMS",
  (symbol: string) => ({ symbol }),
)

export const teardownTokenStreams = action("TEARDOWN_TOKEN_STREAMS", () => ({}))

export const applyDepthSnapshot = action(
  "APPLY_DEPTH_SNAPSHOT",
  (payload: { bids: DepthLevel[]; asks: DepthLevel[] }) => payload,
)

export const prependTrades = action(
  "PREPEND_TRADES",
  (payload: { trades: RecentTradeRow[] }) => payload,
)

export const setTokenStreamFlags = action(
  "SET_TOKEN_STREAM_FLAGS",
  (payload: { depthConnected?: boolean; tradesConnected?: boolean }) => payload,
)

export const resetTokenStreamsStore = action(
  "RESET_TOKEN_STREAMS_STORE",
  () => ({}),
)
