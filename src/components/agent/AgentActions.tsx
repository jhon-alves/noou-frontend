import { useTranslation } from "react-i18next"
import { useMutation } from "@tanstack/react-query"
import { ContainerStatus, useAgentStore } from "@/stores/useAgentStore"
import { shutdownContainer } from "@/services/container/container-services"
import { containerPubSub } from "@/pages/agent/utils/containerPubSub"
import { containerEvents } from "@/pages/agent/utils/containerEvents"
import { Eye, History, MessagesSquare } from "lucide-react"
import { AgentSelectDropdown } from "./AgentSelectDropdown"
import { Message } from "@/pages/agent/types/agent-types"
import { NoouAgentData } from "@/services/agents/types"
import { ConfigModal } from "./ConfigModal"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"

interface AgentActionsProps {
  agents: NoouAgentData[]
  messages: Message[]
  onPreviewSession: () => void
  onStartContainer: () => void
  clearSession: () => void
}

export function AgentActions({
  agents,
  messages,
  onPreviewSession,
  onStartContainer,
  clearSession,
}: AgentActionsProps) {
  const { t } = useTranslation()
  const { containerId, containerToken, containerStatus, setHistoryOpen, resetContainer } =
    useAgentStore()

  const containerStatusColor: Partial<Record<ContainerStatus, string>> = {
    creating: "bg-red-500",
    "connecting-ws": "bg-yellow-400",
    active: "bg-green-500",
    stopped: "bg-red-600",
    error: "bg-red-600",
  }

  const containerStatusText: Partial<Record<ContainerStatus, string>> = {
    creating: t("agent.creating-container"),
    "connecting-ws": t("agent.connecting-ws"),
    active: t("agent.container-active"),
    stopped: t("agent.start-container"),
    error: t("agent.start-container"),
  }

  const { mutateAsync: stopContainer } = useMutation({
    mutationFn: () => {
      if (!containerId || !containerToken) return

      return shutdownContainer(containerId, containerToken)
    },
    onSuccess: () => {
      containerPubSub.publish(containerEvents.STOPPED)
      resetContainer()
    },
  })

  function handleStopContainer() {
    if (!containerId || !containerToken) return
    stopContainer()
  }

  return (
    <div className="flex items-center gap-2">
      {messages?.length > 0 && (
        <Button variant="filled" size="xs" onClick={onPreviewSession}>
          <Eye className="size-4" />
          {t("agent.preview-sesssion")}
        </Button>
      )}

      <Button
        variant="filled"
        size="xs"
        onClick={handleStopContainer}
        disabled={containerStatus !== "active"}
      >
        Stop Container
      </Button>

      <Button
        variant="filled"
        size="xs"
        disabled={["creating", "connecting-ws", "active"].includes(containerStatus)}
        onClick={onStartContainer}
      >
        {containerStatusText[containerStatus]}
        <span className="relative flex size-2.5">
          {["creating", "connecting-ws"].includes(containerStatus) && (
            <span
              className={cn(
                "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                containerStatusColor[containerStatus],
              )}
            />
          )}

          <span
            className={cn(
              "relative inline-flex size-2.5 rounded-full",
              containerStatusColor[containerStatus],
            )}
          />
        </span>
      </Button>

      <AgentSelectDropdown agents={agents} onClearSession={clearSession} />

      <Button variant="filled" size="xs" onClick={clearSession}>
        {t("agent.new-chat")}
        <MessagesSquare />
      </Button>

      <Button variant="filled" size="xs" onClick={() => setHistoryOpen(true)}>
        {t("common.history")}
        <History />
      </Button>

      <ConfigModal />
    </div>
  )
}
