import { useState, useEffect, useRef } from "react"
import { NoouAgentData } from "@/services/agents/types"
import { useAgentStore } from "@/stores/useAgentStore"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface AgentSelectDropdownProps {
  agents: NoouAgentData[]
  onClearSession: () => void
}

export function AgentSelectDropdown({ agents, onClearSession }: AgentSelectDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { selectedAgent, setSelectedAgent } = useAgentStore()

  const validateIdentifier = agents.filter(
    (item) => item.identifier === selectedAgent?.identifier,
  )[0]

  const agentFiltered = selectedAgent?.identifier
    ? validateIdentifier
    : agents.map((item) => item)[0]

  const sortedAgents = [...agents].sort((a, b) => {
    if (a.identifier === agentFiltered?.identifier) return -1
    if (b.identifier === agentFiltered?.identifier) return 1
    return 0
  })

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function handleChangeAgent(name: string, identifier: string) {
    setSelectedAgent({ name, identifier })
    setOpen(false)
    onClearSession()
  }

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 text-2xl font-medium text-black dark:text-white hover:opacity-80 transition cursor-pointer"
      >
        {agentFiltered?.name || "Selecionar agente"}
        <ChevronDown className="size-4 opacity-60" />
      </button>

      {open && (
        <div
          className={cn(
            "absolute z-50 mt-2 w-[320px] rounded-2xl p-2 bg-gray-100 dark:bg-background",
            "border border-gray-400/10 dark:border-white/10 overflow-hidden",
          )}
        >
          <div className="max-h-[min(420px,70vh)] overflow-y-auto [&::-webkit-scrollbar]:hidden">
            {sortedAgents.map((agent) => {
              const isSelected = agentFiltered?.identifier === agent.identifier

              return (
                <button
                  key={agent.id}
                  onClick={() => handleChangeAgent(agent.name, agent.identifier)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl transition-colors duration-300 ease-in-out cursor-pointer",
                    "flex justify-between items-center gap-2 hover:bg-black/5 dark:hover:bg-white/5",
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-black dark:text-white">{agent.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {agent.short_description}
                    </p>
                  </div>

                  {isSelected && (
                    <div className="ml-2 size-5 rounded-full bg-[#FD108F] flex items-center justify-center">
                      <Check className="size-4 text-white" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
