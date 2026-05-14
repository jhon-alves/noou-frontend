import { memo } from "react"
import { AgentAssistantMessage } from "./AgentAssistantMessage"
import { AgentMessageAvatar } from "./AgentMessageAvatar"
import { AgentMessageFiles } from "./AgentMessageFiles"
import { AgentUserMessage } from "./AgentUserMessage"
import { Message } from "@/pages/agent/types/agent-types"
import { cn } from "@/lib/utils"

interface AgentMessageItemProps {
  message: Message
  isStreaming: boolean
}

function AgentMessageItemComponent({ message, isStreaming }: AgentMessageItemProps) {
  const isUser = message.role === "user"
  const isAssistant = message.role === "assistant"

  return (
    <div className={cn("flex gap-3 animate-slide-up", isUser ? "flex-row-reverse" : "flex-row")}>
      <AgentMessageAvatar role={message.role} />

      <div
        className={cn(
          "rounded-2xl px-4 py-3",
          isUser
            ? "bg-card text-primary-foreground max-w-full lg:max-w-200"
            : "max-w-full lg:max-w-[80%]",
        )}
      >
        {message.content ? (
          isAssistant ? (
            <AgentAssistantMessage content={message.content} />
          ) : (
            <AgentUserMessage content={message.content} />
          )
        ) : (
          isAssistant && isStreaming && <AgentStreamingIndicator />
        )}
        <AgentMessageFiles files={message.files} role={message.role} />
      </div>
    </div>
  )
}

function AgentStreamingIndicator() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-2 animate-pulse rounded-full bg-black dark:bg-white" />
      <div
        className="h-2 w-2 animate-pulse rounded-full bg-black dark:bg-white"
        style={{ animationDelay: "0.2s" }}
      />
      <div
        className="h-2 w-2 animate-pulse rounded-full bg-black dark:bg-white"
        style={{ animationDelay: "0.4s" }}
      />
    </div>
  )
}

export const AgentMessageItem = memo(AgentMessageItemComponent, (prev, next) => {
  return prev.message.content === next.message.content && prev.isStreaming === next.isStreaming
})
