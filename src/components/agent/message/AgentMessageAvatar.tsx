import { User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Message } from "@/pages/agent/types/agent-types"

interface AgentMessageAvatarProps {
  role: Message["role"]
}

export function AgentMessageAvatar({ role }: AgentMessageAvatarProps) {
  const isUser = role === "user"

  return (
    <div
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
        isUser ? "bg-muted text-primary-foreground" : "bg-muted text-muted-foreground",
      )}
    >
      {isUser ? (
        <User className="h-4 w-4 text-black dark:text-white" />
      ) : (
        <span className="text-sm font-bold text-brand-primary-200">N.</span>
      )}
    </div>
  )
}
