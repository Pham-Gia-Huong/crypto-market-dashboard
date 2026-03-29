import { observable, type IObservableArray } from "mobx"
import { createStore } from "satcheljs"
import type { CandlestickData, Time } from "lightweight-charts"

export type KlineInterval = "15m" | "1h" | "4h"

export interface ChartStoreState {
  symbol: string | null
  interval: KlineInterval
  loading: boolean
  error: string | null
  candles: IObservableArray<CandlestickData<Time>>
}

const initialState: ChartStoreState = {
  symbol: null,
  interval: "15m",
  loading: false,
  error: null,
  candles: observable.array<CandlestickData<Time>>([]),
}

export const getChartStore = createStore<ChartStoreState>("chartStore", initialState)
