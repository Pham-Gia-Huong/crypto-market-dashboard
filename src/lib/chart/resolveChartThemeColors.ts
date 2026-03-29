/**
 * lightweight-charts chỉ parse được hex / rgb(a). Không hỗ trợ `var()`, `oklch()`, v.v.
 * Dùng Canvas để chuẩn hóa bất kỳ chuỗi màu CSS nào trình duyệt hiểu được.
 */
function isChartSafeColor(s: string): boolean {
  const t = s.trim()
  return /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(t) || /^rgba?\(/i.test(t)
}

/** Biến màu CSS (kể cả oklch từ getComputedStyle) thành hex hoặc rgb. */
export function normalizeCssColorForChart(
  cssColor: string,
  fallback: string,
): string {
  if (!cssColor || cssColor === "rgba(0, 0, 0, 0)") return fallback
  if (isChartSafeColor(cssColor)) return cssColor.trim()

  const ctx = document.createElement("canvas").getContext("2d")
  if (!ctx) return fallback
  try {
    ctx.fillStyle = cssColor
    const out = String(ctx.fillStyle)
    if (isChartSafeColor(out)) return out.trim()
  } catch {
    /* invalid color string */
  }
  return fallback
}

export function resolveCssColorVar(
  cssVarName: string,
  fallback: string,
): string {
  if (typeof document === "undefined") return fallback
  const probe = document.createElement("div")
  probe.style.cssText = `position:fixed;left:-9999px;top:0;color:var(${cssVarName});`
  document.body.appendChild(probe)
  const computed = getComputedStyle(probe).color
  probe.remove()
  return normalizeCssColorForChart(computed, fallback)
}

export function rgbToRgba(color: string, alpha: number): string {
  const m = color.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/)
  if (m) return `rgba(${m[1]},${m[2]},${m[3]},${alpha})`

  const longHex = color.trim().match(/^#([0-9a-f]{6})$/i)
  if (longHex) {
    const n = parseInt(longHex[1], 16)
    return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`
  }

  const shortHex = color.trim().match(/^#([0-9a-f]{3})$/i)
  if (shortHex) {
    const h = shortHex[1]
    const r = parseInt(h[0] + h[0], 16)
    const g = parseInt(h[1] + h[1], 16)
    const b = parseInt(h[2] + h[2], 16)
    return `rgba(${r},${g},${b},${alpha})`
  }

  return `rgba(128,128,128,${alpha})`
}
