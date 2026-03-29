import { useEffect, useState } from "react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const [theme, setTheme] = useState<"light" | "dark">(() =>
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark")
      ? "dark"
      : "light",
  )

  useEffect(() => {
    const el = document.documentElement
    const sync = () => {
      setTheme(el.classList.contains("dark") ? "dark" : "light")
    }
    const obs = new MutationObserver(sync)
    obs.observe(el, { attributes: true, attributeFilter: ["class"] })
    return () => obs.disconnect()
  }, [])

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      {...props}
    />
  )
}

export { Toaster }
