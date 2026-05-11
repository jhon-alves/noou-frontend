import { cn } from "@/lib/utils"
import { useAgentStore } from "@/stores/useAgentStore"
import { NoouAgentData } from "@/services/agents/types"
import { useTranslation } from "react-i18next"

interface AgentSelectInfoProps {
  agents: NoouAgentData[]
}

export function AgentSelectInfo({ agents }: AgentSelectInfoProps) {
  const { t } = useTranslation()
  const { selectedAgent } = useAgentStore()

  const validateIdentifier = agents.filter(
    (item) => item.identifier === selectedAgent?.identifier,
  )[0]

  const agentFiltered = selectedAgent?.identifier
    ? validateIdentifier
    : agents.map((item) => item)[0]

  return (
    <div className="flex flex-col items-center space-y-8 pt-2">
      <div
        className={cn(
          "size-18 rounded-full flex items-center justify-center mx-auto shadow-lg",
          "bg-linear-to-br from-indigo-400 via-purple-600 to-fuchsia-800 animate-gradient",
        )}
      />
      <div className="flex flex-col gap-4">
        <h1 className="font-medium leading-7 text-[#111827] dark:text-white text-[18px] text-center">
          {agentFiltered.name}
        </h1>

        <div className="flex justify-center text-center">
          <p className="font-normal leading-[24.375px] text-[#666f8d] dark:text-[#9ca3af] text-[15px] whitespace-pre-line max-w-160">
            {agentFiltered.long_description}
          </p>
        </div>
        <div className="text-center mt-2">
          <p className="font-normal text-[#666f8d] dark:text-[#9ca3af] text-[12px] tracking-[1.2px] uppercase mb-1">
            {t("agent.created-by")}
          </p>
          <p className="font-medium text-[#111827] dark:text-white text-[18px] uppercase">NOOU</p>
        </div>
      </div>
    </div>
  )
}
