import { observer } from "mobx-react-lite"
import { useTranslation } from "react-i18next"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getTokenStreamsStore } from "@/store/tokenStreamsStore"

export const RecentTrades = observer(function RecentTrades() {
  const { t } = useTranslation()
  const ts = getTokenStreamsStore()

  const timeFmt = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })

  return (
    <Card className="min-w-0">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">{t("trades.title")}</CardTitle>
          <Badge variant={ts.tradesConnected ? "default" : "secondary"}>
            {ts.tradesConnected ? t("market.live") : t("orderBook.connecting")}
          </Badge>
        </div>
        <CardDescription>{t("trades.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-muted-foreground mb-1 grid grid-cols-[1fr_1fr_1fr_auto] gap-2 text-[10px] font-medium uppercase sm:text-xs">
          <span>{t("trades.price")}</span>
          <span className="text-right">{t("trades.qty")}</span>
          <span className="text-right">{t("trades.time")}</span>
          <span className="w-6" />
        </div>
        <div className="max-h-56 overflow-y-auto">
          {ts.trades.map((tr) => (
            <div
              key={tr.id}
              className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 border-b border-border/50 py-1 text-[11px] tabular-nums sm:text-xs"
            >
              <span
                className={
                  tr.buyerIsMaker
                    ? "text-red-600 dark:text-red-400"
                    : "text-emerald-600 dark:text-emerald-400"
                }
              >
                {tr.price}
              </span>
              <span className="text-right">{tr.qty}</span>
              <span className="text-muted-foreground text-right">
                {timeFmt.format(tr.time)}
              </span>
              <span className="w-6 text-[10px]">
                {tr.buyerIsMaker ? "S" : "B"}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
})
