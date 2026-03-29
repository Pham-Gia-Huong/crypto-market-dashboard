import { createStore } from "satcheljs"

export type DepthLevel = [price: string, qty: string]

export interface RecentTradeRow {
  id: string
  price: string
  qty: string
  time: number
  buyerIsMaker: boolean
}

export interface TokenStreamsStoreState {
  symbol: string | null
  depthBids: DepthLevel[]
  depthAsks: DepthLevel[]
  trades: RecentTradeRow[]
  depthConnected: boolean
  tradesConnected: boolean
}

const initialState: TokenStreamsStoreState = {
  symbol: null,
  depthBids: [],
  depthAsks: [],
  trades: [],
  depthConnected: false,
  tradesConnected: false,
}

export const getTokenStreamsStore = createStore<TokenStreamsStoreState>(
  "tokenStreamsStore",
  initialState,
)
