import { Star } from "lucide-react"
import { observer } from "mobx-react-lite"

import { buttonVariants } from "@/components/ui/button"
import { toggleFavoriteForSymbol } from "@/lib/settingsPersistence"
import { getSettingsStore } from "@/store/settingsStore"
import { cn } from "@/lib/utils"

type Props = {
  symbol: string
  className?: string
}

export const FavoriteStar = observer(function FavoriteStar({
  symbol,
  className,
}: Props) {
  const settings = getSettingsStore()
  const sym = symbol.toUpperCase()
  const active = settings.favorites.includes(sym)

  return (
    <button
      type="button"
      className={cn(
        buttonVariants({ variant: "ghost", size: "icon" }),
        "size-8 shrink-0",
        className,
      )}
      onClick={(e) => {
        e.stopPropagation()
        toggleFavoriteForSymbol(sym)
      }}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={active}
    >
      <Star
        className={cn(
          "size-4",
          active
            ? "fill-amber-400 text-amber-400"
            : "text-muted-foreground",
        )}
      />
    </button>
  )
})
