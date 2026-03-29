export type ReconnectingWsOptions = {
  minDelayMs?: number
  maxDelayMs?: number
}

/**
 * WebSocket với reconnect exponential backoff. Gọi `disconnect()` khi unmount / đổi URL.
 */
export function connectReconnectingWebSocket(
  url: string,
  handlers: {
    onMessage: (ev: MessageEvent) => void
    onOpen?: () => void
    onClose?: () => void
  },
  options?: ReconnectingWsOptions,
): () => void {
  const minDelay = options?.minDelayMs ?? 1_000
  const maxDelay = options?.maxDelayMs ?? 60_000

  let ws: WebSocket | null = null
  let attempt = 0
  let timer: ReturnType<typeof setTimeout> | null = null
  let disposed = false

  function clearTimer(): void {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  function open(): void {
    if (disposed) return
    if (ws) {
      ws.onclose = null
      ws.close()
      ws = null
    }
    try {
      ws = new WebSocket(url)
    } catch {
      scheduleReconnect()
      return
    }

    ws.onopen = () => {
      attempt = 0
      handlers.onOpen?.()
    }
    ws.onmessage = handlers.onMessage
    ws.onerror = () => {
      ws?.close()
    }
    ws.onclose = () => {
      ws = null
      handlers.onClose?.()
      if (!disposed) scheduleReconnect()
    }
  }

  function scheduleReconnect(): void {
    clearTimer()
    const delay = Math.min(maxDelay, minDelay * Math.pow(2, attempt))
    attempt += 1
    timer = window.setTimeout(() => {
      timer = null
      open()
    }, delay)
  }

  open()

  return () => {
    disposed = true
    clearTimer()
    if (ws) {
      ws.onclose = null
      ws.close()
      ws = null
    }
  }
}
