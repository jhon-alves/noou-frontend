import { config } from "@/config"

const PROXY = "agents-proxy"

export function getContainerHealthWsUrl(containerId: string) {
  const url = new URL(config.API_BASE_URL)
  return `wss://${url.host}/${PROXY}/${containerId}/health/ws`
}
