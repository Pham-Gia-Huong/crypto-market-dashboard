import { observable, type ObservableMap, type ObservableSet } from "mobx"
import { createStore } from "satcheljs"

export interface MarketPair {
  symbol: string
  /** Display e.g. BTC/USDT */
  label: string
}

export type PriceFlash = "up" | "down" | null

export interface TickerRow {
  price: string
  /** 24h change % vs open price */
  priceChangePercent: number
  openPrice: string
  flash: PriceFlash
}

export interface MarketStoreState {
  loadingSymbols: boolean
  symbolsError: string | null
  pairs: MarketPair[]
  /** Uppercase Binance symbols (e.g. BTCUSDT) we display */
  allowedSymbols: ObservableSet<string>
  tickers: ObservableMap<string, TickerRow>
  wsConnected: boolean
  wsError: string | null
}

const initialState: MarketStoreState = {
  loadingSymbols: false,
  symbolsError: null,
  pairs: [],
  allowedSymbols: observable.set<string>(),
  tickers: observable.map<string, TickerRow>(),
  wsConnected: false,
  wsError: null,
}

export const getMarketStore = createStore<MarketStoreState>(
  "marketStore",
  initialState,
)
