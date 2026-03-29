import { reaction } from "mobx"
import { observer } from "mobx-react-lite"
import { useEffect, useRef } from "react"
import {
  CandlestickSeries,
  ColorType,
  createChart,
  type IChartApi,
  type ISeriesApi,
} from "lightweight-charts"

import { rgbToRgba, resolveCssColorVar } from "@/lib/chart/resolveChartThemeColors"
import { getChartStore } from "@/store/chartStore"

type Props = {
  symbol: string
}

export const TokenChart = observer(function TokenChart({ symbol }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const textColor = resolveCssColorVar("--color-foreground", "#262626")
    const borderRgb = resolveCssColorVar("--color-border", "#e5e5e5")
    const gridColor = rgbToRgba(borderRgb, 0.45)

    const chartHeight = () =>
      Math.min(420, Math.max(260, Math.round(window.innerHeight * 0.48)))

    const chart = createChart(el, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor,
      },
      grid: {
        vertLines: { color: gridColor },
        horzLines: { color: gridColor },
      },
      width: el.clientWidth,
      height: chartHeight(),
      timeScale: { timeVisible: true, secondsVisible: false },
    })

    const series = chart.addSeries(CandlestickSeries, {
      upColor: "#16a34a",
      downColor: "#dc2626",
      borderVisible: false,
      wickUpColor: "#16a34a",
      wickDownColor: "#dc2626",
    })

    chartRef.current = chart
    seriesRef.current = series

    const ro = new ResizeObserver(() => {
      if (!containerRef.current) return
      chart.applyOptions({
        width: containerRef.current.clientWidth,
        height: chartHeight(),
      })
    })
    ro.observe(el)

    const disposeReaction = reaction(
      () =>
        getChartStore().candles.map((c) =>
          [c.time, c.open, c.high, c.low, c.close].join(","),
        ),
      () => {
        const data = getChartStore().candles.slice()
        if (data.length > 0) {
          series.setData(data)
        }
      },
      { fireImmediately: true },
    )

    return () => {
      disposeReaction()
      ro.disconnect()
      chart.remove()
      chartRef.current = null
      seriesRef.current = null
    }
  }, [symbol])

  return (
    <div
      ref={containerRef}
      className="border-border bg-card/30 min-h-[min(420px,65vh)] w-full min-w-0 rounded-lg border"
    />
  )
})
