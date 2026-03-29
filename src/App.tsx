import { useEffect } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { dispatch } from "satcheljs"

import { loadMarketSymbols } from "@/actions/marketActions"
import { MarketDashboard } from "@/components/MarketDashboard"
import { TokenDetailPage } from "@/pages/TokenDetailPage"

function App() {
  useEffect(() => {
    dispatch(loadMarketSymbols())
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MarketDashboard />} />
        <Route path="/token/:symbol" element={<TokenDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
