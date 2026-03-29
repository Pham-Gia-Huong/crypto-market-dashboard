import { UserRound } from "lucide-react"
import { observer } from "mobx-react-lite"
import { useId, useRef } from "react"
import { useTranslation } from "react-i18next"
import { dispatch } from "satcheljs"

import { Button } from "@/components/ui/button"
import { setAvatarDataUrl } from "@/actions/settingsActions"
import { getSettingsStore } from "@/store/settingsStore"

const MAX_BYTES = 400 * 1024

export const UserAvatarMenu = observer(function UserAvatarMenu() {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const id = useId()
  const settings = getSettingsStore()

  return (
    <div className="flex items-center gap-2">
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0]
          e.target.value = ""
          if (!file || file.size > MAX_BYTES) return
          const reader = new FileReader()
          reader.onload = () => {
            const r = reader.result
            if (typeof r === "string") {
              dispatch(setAvatarDataUrl(r))
            }
          }
          reader.readAsDataURL(file)
        }}
      />
      <button
        type="button"
        className="border-border bg-muted relative size-9 shrink-0 overflow-hidden rounded-full border"
        onClick={() => inputRef.current?.click()}
        title={t("settings.avatarHint")}
        aria-label={t("settings.avatarHint")}
      >
        {settings.avatarDataUrl ? (
          <img
            src={settings.avatarDataUrl}
            alt=""
            className="size-full object-cover"
          />
        ) : (
          <UserRound className="text-muted-foreground m-auto size-5" />
        )}
      </button>
      {settings.avatarDataUrl ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="hidden sm:inline-flex"
          onClick={() => dispatch(setAvatarDataUrl(null))}
        >
          {t("settings.clearAvatar")}
        </Button>
      ) : null}
    </div>
  )
})
