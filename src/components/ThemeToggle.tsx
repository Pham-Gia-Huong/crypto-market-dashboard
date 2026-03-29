import { Moon, Sun } from "lucide-react"
import { observer } from "mobx-react-lite"
import { useTranslation } from "react-i18next"
import { dispatch } from "satcheljs"

import { Button } from "@/components/ui/button"
import { setTheme } from "@/actions/settingsActions"
import { getSettingsStore } from "@/store/settingsStore"

export const ThemeToggle = observer(function ThemeToggle() {
  const { t } = useTranslation()
  const settings = getSettingsStore()
  const isDark = settings.theme === "dark"

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="shrink-0"
      onClick={() => {
        dispatch(setTheme(isDark ? "light" : "dark"))
      }}
      title={isDark ? t("theme.useLight") : t("theme.useDark")}
      aria-label={isDark ? t("theme.useLight") : t("theme.useDark")}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  )
})
