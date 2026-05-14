import { useTranslation } from "react-i18next"
import { useAgentStore } from "@/stores/useAgentStore"
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
  onStopContainer: () => void
  onStartContainer: () => void
  clearSession: () => void
}

export function AgentActions({
  agents,
  messages,
  onPreviewSession,
  onStopContainer,
  onStartContainer,
  clearSession,
}: AgentActionsProps) {
  const { t } = useTranslation()
  const { containerStatus, setHistoryOpen } = useAgentStore()

  function getContainerStatusColor() {
    switch (containerStatus) {
      case "creating":
        return "bg-red-500"
      case "connecting-ws":
        return "bg-yellow-400"
      case "active":
        return "bg-green-500"
      case "stopped":
        return "bg-red-600"
      default:
        return "bg-red-600"
    }
  }

  function getContainerStatusText() {
    switch (containerStatus) {
      case "creating":
        return t("agent.creating-container")
      case "connecting-ws":
        return t("agent.connecting-ws")
      case "active":
        return t("agent.container-active")
      case "stopped":
      default:
        return t("agent.start-container")
    }
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
        onClick={onStopContainer}
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
        {getContainerStatusText()}
        <span className="relative flex size-2.5">
          {["creating", "connecting-ws"].includes(containerStatus) && (
            <span
              className={cn(
                "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                getContainerStatusColor(),
              )}
            />
          )}

          <span
            className={cn("relative inline-flex size-2.5 rounded-full", getContainerStatusColor())}
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
