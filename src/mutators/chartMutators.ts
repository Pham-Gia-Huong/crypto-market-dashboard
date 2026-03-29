import { mutator } from "satcheljs"

import {
  applyChartKline,
  resetChartStoreAction,
  setChartCandlesReplace,
  setChartContext,
  setChartError,
  setChartLoading,
} from "@/actions/chartActions"
import { getChartStore } from "@/store/chartStore"

mutator(setChartContext, (msg) => {
  const s = getChartStore()
  s.symbol = msg.symbol
  s.interval = msg.interval
})

mutator(resetChartStoreAction, () => {
  const s = getChartStore()
  s.symbol = null
  s.interval = "15m"
  s.loading = false
  s.error = null
  s.candles.replace([])
})

mutator(setChartLoading, (msg) => {
  getChartStore().loading = msg.loading
})

mutator(setChartError, (msg) => {
  getChartStore().error = msg.message
})

mutator(setChartCandlesReplace, (msg) => {
  getChartStore().candles.replace(msg.candles)
})

mutator(applyChartKline, (msg) => {
  const store = getChartStore()
  const arr = store.candles
  const t = msg.candle.time as number
  const last = arr.length > 0 ? arr[arr.length - 1] : undefined
  const lastT = last ? (last.time as number) : null

  if (lastT !== null && t === lastT) {
    arr[arr.length - 1] = msg.candle
    return
  }

  if (lastT !== null && t > lastT) {
    arr.push(msg.candle)
    return
  }

  const idx = arr.findIndex((c) => (c.time as number) === t)
  if (idx >= 0) {
    arr[idx] = msg.candle
  } else {
    arr.push(msg.candle)
    arr.replace(
      arr.slice().sort((a, b) => (a.time as number) - (b.time as number)),
    )
  }
})
