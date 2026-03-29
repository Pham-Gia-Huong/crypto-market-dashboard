import { useTranslation } from "react-i18next"
import { dispatch } from "satcheljs"

import { setLanguage } from "@/actions/settingsActions"
import type { AppLanguage } from "@/store/settingsStore"

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation()

  const next: AppLanguage = i18n.language === "vi" ? "en" : "vi"

  return (
    <button
      type="button"
      className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs underline-offset-4 hover:underline"
      onClick={() => {
        dispatch(setLanguage(next))
      }}
      title={t("lang.label")}
    >
      {t(`lang.${next}`)}
    </button>
  )
}
