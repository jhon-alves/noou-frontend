import { useEffect } from "react"
import { startContainerHealthSocket } from "./startContainerHealthSocket"
import { getContainerHealthWsUrl } from "../utils/containerHealth"
import { containerEvents } from "../utils/containerEvents"
import { containerPubSub } from "../utils/containerPubSub"
import { useAgentStore } from "@/stores/useAgentStore"
import { tokens } from "@/config/tokens"

export function useContainerLifecycle() {
  const {
    containerId,
    containerToken,
    pendingSessionId,
    setContainerStatus,
    setSessionId,
    resetContainer,
  } = useAgentStore()

  // 1. Inicia o Socket (Health Check)
  useEffect(() => {
    if (!containerId || !containerToken) return
    const wsUrl = getContainerHealthWsUrl(containerId)
    startContainerHealthSocket(wsUrl, true)
  }, [])

  // 2. Ouve os eventos do Pub/Sub
  useEffect(() => {
    const unsubReady = containerPubSub.subscribe(containerEvents.READY, () => {
      setContainerStatus("active")
      if (pendingSessionId) setSessionId(pendingSessionId)
    })

    const unsubConnecting = containerPubSub.subscribe(containerEvents.CONNECTING, () => {
      setContainerStatus("connecting-ws")
    })

    const unsubStopped = containerPubSub.subscribe(containerEvents.STOPPED, () => {
      setContainerStatus("stopped")
    })

    const unsubError = containerPubSub.subscribe(containerEvents.ERROR, () => {
      setContainerStatus("error")
      resetContainer()
    })

    return () => {
      unsubReady()
      unsubConnecting()
      unsubStopped()
      unsubError()
    }
  }, [])

  // 3. Persiste @containerId no LocalStorage
  useEffect(() => {
    if (containerId) {
      localStorage.setItem(tokens.containerId, containerId)
    } else {
      localStorage.removeItem(tokens.containerId)
    }
  }, [containerId])

  // 4. Persiste @containerToken no LocalStorage
  useEffect(() => {
    if (containerToken) {
      localStorage.setItem(tokens.containerToken, containerToken)
    } else {
      localStorage.removeItem(tokens.containerToken)
    }
  }, [containerToken])
}
