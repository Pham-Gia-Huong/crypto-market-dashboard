import { observer } from "mobx-react-lite"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import { Input } from "@/components/ui/input"
import { getMarketStore } from "@/store/marketStore"
import { cn } from "@/lib/utils"

export const PairSearch = observer(function PairSearch() {
  const { t } = useTranslation()
  const store = getMarketStore()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState("")

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (!t) return store.pairs.slice(0, 24)
    return store.pairs
      .filter(
        (p) =>
          p.label.toLowerCase().includes(t) ||
          p.symbol.toLowerCase().includes(t),
      )
      .slice(0, 50)
  }, [store.pairs, q])

  return (
    <div className="relative w-full max-w-md">
      <Input
        type="search"
        placeholder={t("search.placeholder")}
        value={q}
        onChange={(e) => {
          setQ(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          window.setTimeout(() => setOpen(false), 150)
        }}
        className="w-full"
        autoComplete="off"
      />
      {open && filtered.length > 0 ? (
        <ul
          className={cn(
            "border-border bg-popover text-popover-foreground absolute top-full z-50 mt-1 max-h-72 w-full overflow-auto rounded-lg border py-1 shadow-md",
          )}
          role="listbox"
        >
          {filtered.map((p) => (
            <li key={p.symbol}>
              <button
                type="button"
                className="hover:bg-muted focus:bg-muted w-full px-3 py-2 text-left text-sm"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  navigate(`/token/${p.symbol}`)
                  setQ("")
                  setOpen(false)
                }}
              >
                <span className="font-medium">{p.label}</span>
                <span className="text-muted-foreground ml-2 text-xs">
                  {p.symbol}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
})
