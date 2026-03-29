import { observer } from "mobx-react-lite"
import { useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"
import { dispatch } from "satcheljs"

import {
  requestChartSession,
  requestChartTeardown,
} from "@/actions/chartActions"
import {
  requestTokenStreams,
  teardownTokenStreams,
} from "@/actions/tokenStreamsActions"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { FavoriteStar } from "@/components/FavoriteStar"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { OrderBook } from "@/components/OrderBook"
import { RecentTrades } from "@/components/RecentTrades"
import { ThemeToggle } from "@/components/ThemeToggle"
import { TokenChart } from "@/components/TokenChart"
import { UserAvatarMenu } from "@/components/UserAvatarMenu"
import { getChartStore } from "@/store/chartStore"
import type { KlineInterval } from "@/store/chartStore"
import { getMarketStore } from "@/store/marketStore"

const intervals: KlineInterval[] = ["15m", "1h", "4h"]

export const TokenDetailPage = observer(function TokenDetailPage() {
  const { t } = useTranslation()
  const { symbol: rawSymbol } = useParams<{ symbol: string }>()
  const navigate = useNavigate()
  const market = getMarketStore()
  const chart = getChartStore()

  const symbol = rawSymbol?.toUpperCase() ?? ""

  const label = useMemo(() => {
    const pair = market.pairs.find((p) => p.symbol === symbol)
    return pair?.label ?? symbol
  }, [market.pairs, symbol])

  const isUnknownPair =
    Boolean(symbol) &&
    !market.loadingSymbols &&
    !market.allowedSymbols.has(symbol)

  const isValid =
    Boolean(symbol) &&
    !market.loadingSymbols &&
    market.allowedSymbols.has(symbol)

  useEffect(() => {
    if (!isValid) return
    dispatch(
      requestChartSession({ symbol, interval: getChartStore().interval }),
    )
    return () => {
      dispatch(requestChartTeardown())
    }
  }, [symbol, isValid])

  useEffect(() => {
    if (!isValid) return
    dispatch(requestTokenStreams(symbol))
    return () => {
      dispatch(teardownTokenStreams())
    }
  }, [symbol, isValid])

  if (!symbol) {
    return null
  }

  if (market.loadingSymbols) {
    return (
      <div className="mx-auto w-full max-w-5xl p-3 sm:p-4 md:p-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="mt-4 h-[420px] w-full" />
      </div>
    )
  }

  if (isUnknownPair) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <p className="text-destructive">
          {t("token.unknownPair", { symbol })}
        </p>
        <Button className="mt-4" type="button" onClick={() => navigate("/")}>
          {t("token.backToMarkets")}
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 p-3 sm:gap-6 sm:p-4 md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="ghost" type="button" onClick={() => navigate("/")}>
              {t("token.back")}
            </Button>
            <FavoriteStar symbol={symbol} />
            <UserAvatarMenu />
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
          <h1 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
            {label}
          </h1>
          <p className="text-muted-foreground text-sm">{symbol}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {intervals.map((iv) => (
            <Button
              key={iv}
              type="button"
              size="sm"
              variant={chart.interval === iv ? "default" : "outline"}
              onClick={() => {
                dispatch(requestChartSession({ symbol, interval: iv }))
              }}
            >
              {iv}
            </Button>
          ))}
        </div>
      </div>

      {chart.error ? (
        <p className="text-destructive text-sm">{chart.error}</p>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>{t("token.candleTitle")}</CardTitle>
          <CardDescription>{t("token.candleDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto px-2 sm:px-6">
          {chart.loading && chart.candles.length === 0 ? (
            <Skeleton className="h-[min(420px,70vh)] w-full min-w-[280px]" />
          ) : (
            <TokenChart symbol={symbol} />
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <OrderBook />
        <RecentTrades />
      </div>
    </div>
  )
})
