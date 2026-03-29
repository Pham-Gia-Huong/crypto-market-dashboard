import { getBinanceRestBase } from "@/lib/binance/exchangeInfo"
import type { KlineInterval } from "@/store/chartStore"
import type { CandlestickData, Time, UTCTimestamp } from "lightweight-charts"

function parseKlineRestRow(row: unknown): CandlestickData<Time> {
  if (!Array.isArray(row) || row.length < 5) {
    throw new Error("Invalid kline row")
  }
  return {
    time: (Number(row[0]) / 1000) as UTCTimestamp,
    open: Number(row[1]),
    high: Number(row[2]),
    low: Number(row[3]),
    close: Number(row[4]),
  }
}

export async function fetchKlines(
  symbol: string,
  interval: KlineInterval,
): Promise<CandlestickData<Time>[]> {
  const base = getBinanceRestBase()
  const qs = new URLSearchParams({
    symbol,
    interval,
    limit: "500",
  })
  const res = await fetch(`${base}/klines?${qs}`)
  if (!res.ok) {
    throw new Error(`klines failed: ${res.status}`)
  }
  const raw = (await res.json()) as unknown
  if (!Array.isArray(raw)) {
    throw new Error("Invalid klines response")
  }
  return raw.map(parseKlineRestRow)
}
