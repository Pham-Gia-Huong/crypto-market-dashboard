import type {
  BinanceExchangeInfoResponse,
  BinanceExchangeInfoSymbol,
} from "@/types/binance"
import type { MarketPair } from "@/store/marketStore"

function symbolSupportsSpot(s: BinanceExchangeInfoSymbol): boolean {
  if (s.isSpotTradingAllowed === true) return true
  if (s.permissions?.includes("SPOT")) return true
  return (
    Array.isArray(s.permissionSets) &&
    s.permissionSets.some(
      (set) => Array.isArray(set) && set.includes("SPOT"),
    )
  )
}

export function parseUsdtSpotPairs(data: BinanceExchangeInfoResponse): MarketPair[] {
  return data.symbols
    .filter(
      (s) =>
        s.status === "TRADING" &&
        s.quoteAsset === "USDT" &&
        symbolSupportsSpot(s),
    )
    .map((s) => ({
      symbol: s.symbol,
      label: `${s.baseAsset}/${s.quoteAsset}`,
    }))
    .sort((a, b) => a.symbol.localeCompare(b.symbol))
}

export function getBinanceRestBase(): string {
  return import.meta.env.DEV
    ? "/binance-rest/api/v3"
    : "https://api.binance.com/api/v3"
}
