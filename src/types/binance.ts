/** Binance Spot REST: GET /api/v3/exchangeInfo (subset) */
export interface BinanceExchangeInfoSymbol {
  symbol: string
  status: string
  baseAsset: string
  quoteAsset: string
  /** Legacy; often empty — prefer {@link isSpotTradingAllowed} / {@link permissionSets} */
  permissions: string[]
  /** Current spot flag (see Binance Spot API changelog) */
  isSpotTradingAllowed?: boolean
  /** e.g. [["SPOT", "MARGIN", ...]] — SPOT may only appear here when `permissions` is empty */
  permissionSets?: string[][]
}

export interface BinanceExchangeInfoResponse {
  symbols: BinanceExchangeInfoSymbol[]
}

/** WebSocket combined stream: !miniTicker@arr */
export interface BinanceMiniTickerMessage {
  e: "24hrMiniTicker"
  E: number
  s: string
  c: string
  o: string
  h: string
  l: string
  v: string
  q: string
}

export function isMiniTickerMessage(
  value: unknown,
): value is BinanceMiniTickerMessage {
  if (!value || typeof value !== "object") return false
  const o = value as Record<string, unknown>
  return (
    o.e === "24hrMiniTicker" &&
    typeof o.s === "string" &&
    typeof o.c === "string" &&
    typeof o.o === "string"
  )
}

/** WebSocket stream: &lt;symbol&gt;@kline_&lt;interval&gt; */
export interface BinanceKlineWsMessage {
  e: "kline"
  E: number
  s: string
  k: {
    t: number
    T: number
    s: string
    i: string
    o: string
    c: string
    h: string
    l: string
    v: string
    x: boolean
  }
}

export function isKlineWsMessage(value: unknown): value is BinanceKlineWsMessage {
  if (!value || typeof value !== "object") return false
  const o = value as Record<string, unknown>
  if (o.e !== "kline" || !o.k || typeof o.k !== "object") return false
  const k = o.k as Record<string, unknown>
  return (
    typeof k.t === "number" &&
    typeof k.o === "string" &&
    typeof k.h === "string" &&
    typeof k.l === "string" &&
    typeof k.c === "string"
  )
}
