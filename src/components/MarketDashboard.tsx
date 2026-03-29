import { observer } from "mobx-react-lite"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import { FavoriteStar } from "@/components/FavoriteStar"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { PairSearch } from "@/components/PairSearch"
import { ThemeToggle } from "@/components/ThemeToggle"
import { UserAvatarMenu } from "@/components/UserAvatarMenu"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getMarketStore } from "@/store/marketStore"
import { getSettingsStore } from "@/store/settingsStore"

const priceFmt = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 8,
})

const pctFmt = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function formatPrice(raw: string): string {
  const n = Number(raw)
  if (!Number.isFinite(n)) return raw
  return priceFmt.format(n)
}

export const MarketDashboard = observer(function MarketDashboard() {
  const { t } = useTranslation()
  const store = getMarketStore()
  const settings = getSettingsStore()
  const navigate = useNavigate()

  /** Favorites trước; observable.array + includes để MobX observer re-render khi đổi. */
  const sortedPairs = [...store.pairs].sort((a, b) => {
    const af = settings.favorites.includes(a.symbol.toUpperCase()) ? 1 : 0
    const bf = settings.favorites.includes(b.symbol.toUpperCase()) ? 1 : 0
    if (af !== bf) return bf - af
    return a.symbol.localeCompare(b.symbol)
  })

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 p-3 sm:gap-6 sm:p-4 md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
              {t("app.title")}
            </h1>
            <div className="ml-auto flex shrink-0 flex-wrap items-center gap-1.5 sm:ml-0">
              <UserAvatarMenu />
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            {t("market.subtitle")}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={store.wsConnected ? "default" : "secondary"}>
            {store.wsConnected ? t("market.live") : t("market.wsOffline")}
          </Badge>
          {store.wsError ? (
            <span className="text-destructive text-xs">{store.wsError}</span>
          ) : null}
        </div>
      </div>

      <PairSearch />

      <Card>
        <CardHeader>
          <CardTitle>{t("market.cardTitle")}</CardTitle>
          <CardDescription>{t("market.cardDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="px-2 sm:px-6">
          {store.symbolsError ? (
            <p className="text-destructive text-sm">{store.symbolsError}</p>
          ) : null}

          {store.loadingSymbols ? (
            <div className="space-y-2">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          ) : (
            <div className="-mx-2 overflow-x-auto sm:mx-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10" />
                    <TableHead>{t("market.pair")}</TableHead>
                    <TableHead className="text-right">{t("market.price")}</TableHead>
                    <TableHead className="text-right">{t("market.change24h")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedPairs.map((pair) => {
                    const row = store.tickers.get(pair.symbol)
                    const flash = row?.flash
                    return (
                      <TableRow
                        key={pair.symbol}
                        className={
                          (flash === "up"
                            ? "bg-emerald-500/15 transition-colors duration-300 "
                            : flash === "down"
                              ? "bg-red-500/15 transition-colors duration-300 "
                              : "") + "hover:bg-muted/50 cursor-pointer"
                        }
                        onClick={() => navigate(`/token/${pair.symbol}`)}
                      >
                        <TableCell
                          className="w-10 p-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FavoriteStar symbol={pair.symbol} />
                        </TableCell>
                        <TableCell className="font-medium">{pair.label}</TableCell>
                        <TableCell className="text-right tabular-nums">
                          {row ? formatPrice(row.price) : "—"}
                        </TableCell>
                        <TableCell
                          className={
                            row
                              ? row.priceChangePercent >= 0
                                ? "text-right tabular-nums text-emerald-600 dark:text-emerald-400"
                                : "text-right tabular-nums text-red-600 dark:text-red-400"
                              : "text-muted-foreground text-right"
                          }
                        >
                          {row ? `${pctFmt.format(row.priceChangePercent)}%` : "—"}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
})
