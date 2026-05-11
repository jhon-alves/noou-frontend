import { NoouAgentData } from "@/services/agents/types"
import { shouldRenderMessage } from "./message-utils"
import { AgentMessageItem } from "./AgentMessageItem"
import { AgentSelectInfo } from "../AgentSelectInfo"
import { Message } from "@/pages/agent/types/agent-types"

interface AgentMessageListProps {
  messages: Message[]
  isStreaming: boolean
  noouAgents?: NoouAgentData[]
  isPreview?: boolean
}

export function AgentMessageList({
  messages,
  isStreaming,
  noouAgents,
  isPreview,
}: AgentMessageListProps) {
  if (!noouAgents && !isPreview) return

  if (messages.length === 0 && !isPreview) return <AgentSelectInfo agents={noouAgents} />

  return (
    <div className="flex flex-col p-4 gap-4">
      {messages.map((message) => {
        if (!shouldRenderMessage(message, isStreaming)) return null

        return <AgentMessageItem key={message.id} message={message} isStreaming={isStreaming} />
      })}
    </div>
  )
}
