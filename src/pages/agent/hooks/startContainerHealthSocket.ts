import { containerPubSub } from "../utils/containerPubSub"
import { containerEvents } from "../utils/containerEvents"

let ws: WebSocket | null = null
let retryTimeoutId: ReturnType<typeof setTimeout> | null = null

const maxRetries: number = 20
const retryDelayMs: number = 2000

let opened: boolean = false
let isConnecting: boolean = false
let manuallyStopped: boolean = false

export function stopContainerHealthSocket() {
  manuallyStopped = true
  isConnecting = false
  opened = false

  if (retryTimeoutId) {
    clearTimeout(retryTimeoutId)
    retryTimeoutId = null
  }

  if (!ws) return

  ws.onopen = null
  ws.onclose = null
  ws.onerror = null
  ws.onmessage = null

  if (ws.readyState === WebSocket.CONNECTING || ws.readyState === WebSocket.OPEN) {
    ws.close(1000, "Container health socket stopped")
  }

  ws = null
}

export function startContainerHealthSocket(url: string, validateOnly: boolean = false) {
  let retryCount: number = 0

  stopContainerHealthSocket()

  manuallyStopped = false

  if (validateOnly) {
    retryCount = maxRetries
  }

  isConnecting = true

  const connect = () => {
    if (manuallyStopped) return

    try {
      ws = new WebSocket(url)

      ws.onopen = () => {
        containerPubSub.publish(containerEvents.READY)
        opened = true
        isConnecting = false
      }

      ws.onclose = () => {
        if (opened) {
          containerPubSub.publish(containerEvents.STOPPED)
          opened = false
          isConnecting = false
        } else {
          retry()
        }
      }

      ws.onerror = () => {
        ws?.close()
      }
    } catch (_error) {
      retry()
    }
  }

  const retry = () => {
    if (manuallyStopped) return

    if (isConnecting && retryCount < maxRetries) {
      retryCount++
      retryTimeoutId = setTimeout(connect, retryDelayMs)
    } else {
      containerPubSub.publish(containerEvents.ERROR)
    }
  }

  connect()
}
