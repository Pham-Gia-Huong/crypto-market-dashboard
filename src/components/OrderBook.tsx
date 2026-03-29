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

export const OrderBook = observer(function OrderBook() {
  const { t } = useTranslation()
  const ts = getTokenStreamsStore()

  return (
    <Card className="min-w-0">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base">{t("orderBook.title")}</CardTitle>
          <Badge variant={ts.depthConnected ? "default" : "secondary"}>
            {ts.depthConnected ? t("market.live") : t("orderBook.connecting")}
          </Badge>
        </div>
        <CardDescription>{t("orderBook.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 text-[11px] sm:text-xs">
          <div>
            <p className="text-muted-foreground mb-1 font-medium">
              {t("orderBook.bids")}
            </p>
            <div className="max-h-48 space-y-0.5 overflow-y-auto pr-1">
              {ts.depthBids.slice(0, 20).map((b, i) => (
                <div
                  key={`b-${i}-${b[0]}`}
                  className="flex justify-between gap-2 text-xs tabular-nums text-emerald-600 dark:text-emerald-400"
                >
                  <span className="min-w-0 truncate">{b[0]}</span>
                  <span className="text-muted-foreground shrink-0">{b[1]}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-muted-foreground mb-1 font-medium">
              {t("orderBook.asks")}
            </p>
            <div className="max-h-48 space-y-0.5 overflow-y-auto pr-1">
              {ts.depthAsks.slice(0, 20).map((a, i) => (
                <div
                  key={`a-${i}-${a[0]}`}
                  className="flex justify-between gap-2 text-xs tabular-nums text-red-600 dark:text-red-400"
                >
                  <span className="min-w-0 truncate">{a[0]}</span>
                  <span className="text-muted-foreground shrink-0">{a[1]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})
