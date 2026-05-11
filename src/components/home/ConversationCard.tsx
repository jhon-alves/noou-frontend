import { SessionData } from "@/services/sessions/types"
import { Card, CardTitle } from "../ui/card"
import { Command } from "lucide-react"
import { useAgentStore } from "@/stores/useAgentStore"
import { useNavigate } from "react-router-dom"

interface ConversationCardProps {
  session: SessionData
}

export function ConversationCard({ session }: ConversationCardProps) {
  const navigate = useNavigate()
  const {
    selectedAgent,
    containerStatus,
    noouAgents,
    setSelectedAgent,
    setSessionId,
    setPendingSessionId,
    setStartContainerModal,
  } = useAgentStore()

  function handleSession() {
    if (containerStatus === "active") {
      setSessionId(session.session_id)
    }

    if (containerStatus !== "active") {
      setPendingSessionId(session.session_id)
      setStartContainerModal(true)
    }

    navigate("/agent")

    const agentIdentifier = session?.agent_id
    const filteredAgent = noouAgents.filter((item) => item.identifier === agentIdentifier)[0]

    if (agentIdentifier !== selectedAgent.identifier) {
      setSelectedAgent({ name: filteredAgent?.name, identifier: filteredAgent?.identifier })
    }
  }

  return (
    <Card className="cursor-pointer bg-transparent border border-card" onClick={handleSession}>
      <div className="p-6 space-y-1.5 min-h-35 flex flex-col">
        <Command className="text-black dark:text-white size-5" />
        <CardTitle className="mt-3">{session?.summary?.summary}</CardTitle>
        <div className="self-end">
          <svg
            className="size-4 mt-auto text-[#111827] dark:text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 16 16"
            strokeWidth="1.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10m0 0l-3-3m3 3l-3 3" />
          </svg>
        </div>
      </div>
    </Card>
  )
}
