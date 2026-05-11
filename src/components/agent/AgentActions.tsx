import { useTranslation } from "react-i18next"
import { useAgentStore } from "@/stores/useAgentStore"
import { Eye, History } from "lucide-react"
import { ConfigModal } from "./ConfigModal"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"
import { Message } from "@/pages/agent/types/agent-types"

interface AgentActionsProps {
  messages: Message[]
  onPreviewSession: () => void
  onStopContainer: () => void
  onStartContainer: () => void
  clearSession: () => void
}

export function AgentActions({
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
    <div className="absolute right-10 top-7 flex items-center gap-2">
      {messages?.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          className="p-3 bg-[#f5f5f5] dark:bg-[#262f45] hover:bg-[#ebebed] dark:hover:bg-[#3d3d48] gap-2"
          onClick={onPreviewSession}
        >
          <Eye className="size-4" />
          {t("agent.preview-sesssion")}
        </Button>
      )}

      <Button
        variant="ghost"
        size="sm"
        className="p-3 bg-[#f5f5f5] dark:bg-[#262f45] hover:bg-[#ebebed] dark:hover:bg-[#3d3d48] gap-2"
        onClick={onStopContainer}
        disabled={containerStatus !== "active"}
      >
        Stop Container
      </Button>

      <Button
        variant="ghost"
        size="sm"
        disabled={["creating", "connecting-ws", "active"].includes(containerStatus)}
        className="p-3 bg-[#f5f5f5] dark:bg-[#262f45] hover:bg-[#ebebed] dark:hover:bg-[#3d3d48] gap-3"
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

      <Button
        variant="ghost"
        size="sm"
        className="p-3 bg-[#f5f5f5] dark:bg-[#262f45] hover:bg-[#ebebed] dark:hover:bg-[#3d3d48] gap-2"
        onClick={clearSession}
      >
        <span className="text-sm font-bold text-[#ff00d7]">N.</span>
        {t("agent.new-chat")}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="p-3 bg-[#f5f5f5] dark:bg-[#262f45] hover:bg-[#ebebed] dark:hover:bg-[#3d3d48]"
        onClick={() => setHistoryOpen(true)}
      >
        <History className="w-5 h-5" />
      </Button>

      <ConfigModal />
    </div>
  )
}
