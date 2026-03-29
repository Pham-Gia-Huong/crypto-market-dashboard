import type { DepthLevel, RecentTradeRow } from "@/store/tokenStreamsStore"

/** Partial book depth `depth20@100ms` — snapshot style */
export function parsePartialDepthPayload(
  value: unknown,
): { bids: DepthLevel[]; asks: DepthLevel[] } | null {
  if (!value || typeof value !== "object") return null
  const o = value as Record<string, unknown>

  let bidsRaw: unknown
  let asksRaw: unknown

  if (Array.isArray(o.bids) && Array.isArray(o.asks)) {
    bidsRaw = o.bids
    asksRaw = o.asks
  } else if (Array.isArray(o.b) && Array.isArray(o.a)) {
    bidsRaw = o.b
    asksRaw = o.a
  } else {
    return null
  }

  const mapRow = (row: unknown): DepthLevel | null => {
    if (!Array.isArray(row) || row.length < 2) return null
    const p = row[0]
    const q = row[1]
    if (typeof p !== "string" || typeof q !== "string") return null
    return [p, q]
  }

  const bids = (bidsRaw as unknown[])
    .map(mapRow)
    .filter((x): x is DepthLevel => x !== null)
  const asks = (asksRaw as unknown[])
    .map(mapRow)
    .filter((x): x is DepthLevel => x !== null)

  return { bids, asks }
}

export function parseTradeMessage(value: unknown): RecentTradeRow | null {
  if (!value || typeof value !== "object") return null
  const o = value as Record<string, unknown>
  if (o.e !== "trade") return null
  const t = o.t
  const p = o.p
  const q = o.q
  const T = o.T
  const m = o.m
  if (typeof t !== "number" || typeof p !== "string" || typeof q !== "string")
    return null
  return {
    id: String(t),
    price: p,
    qty: q,
    time: typeof T === "number" ? T : Date.now(),
    buyerIsMaker: m === true,
  }
}
