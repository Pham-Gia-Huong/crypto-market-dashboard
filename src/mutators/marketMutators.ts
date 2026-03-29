import { mutator } from "satcheljs"

import {
  applyMiniTickerBatch,
  clearTickerFlash,
  setMarketPairs,
  setSymbolsError,
  setSymbolsLoading,
  setWsStatus,
} from "@/actions/marketActions"
import { getMarketStore } from "@/store/marketStore"

mutator(setSymbolsLoading, (msg) => {
  getMarketStore().loadingSymbols = msg.loading
})

mutator(setSymbolsError, (msg) => {
  getMarketStore().symbolsError = msg.message
})

mutator(setMarketPairs, (msg) => {
  const store = getMarketStore()
  store.pairs = msg.pairs
  store.allowedSymbols.replace(msg.pairs.map((p) => p.symbol))
})

mutator(applyMiniTickerBatch, (msg) => {
  const store = getMarketStore()
  for (const raw of msg.items) {
    const symbol = raw.s
    if (!store.allowedSymbols.has(symbol)) continue

    const close = raw.c
    const open = raw.o
    const openNum = Number(open)
    const closeNum = Number(close)
    const priceChangePercent =
      openNum > 0 ? ((closeNum - openNum) / openNum) * 100 : 0

    const prev = store.tickers.get(symbol)
    let flash: "up" | "down" | null = null
    if (prev) {
      const prevNum = Number(prev.price)
      if (closeNum > prevNum) flash = "up"
      else if (closeNum < prevNum) flash = "down"
    }

    store.tickers.set(symbol, {
      price: close,
      priceChangePercent,
      openPrice: open,
      flash,
    })
  }
})

mutator(clearTickerFlash, (msg) => {
  const store = getMarketStore()
  const row = store.tickers.get(msg.symbol)
  if (!row?.flash) return
  store.tickers.set(msg.symbol, { ...row, flash: null })
})

mutator(setWsStatus, (msg) => {
  const store = getMarketStore()
  store.wsConnected = msg.connected
  store.wsError = msg.error
})
