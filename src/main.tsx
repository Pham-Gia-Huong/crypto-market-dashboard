import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { dispatch } from "satcheljs"

import { loadPersistedSettings } from "@/actions/settingsActions"
import { AppErrorBoundary } from "@/components/AppErrorBoundary"
import { Toaster } from "@/components/ui/sonner"
import "./i18n"
import "./market/bootstrap"
import "./index.css"
import App from "./App.tsx"

dispatch(loadPersistedSettings())

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppErrorBoundary>
      <App />
      <Toaster richColors position="top-center" />
    </AppErrorBoundary>
  </StrictMode>,
)
