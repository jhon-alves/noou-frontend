import { useQuery } from "@tanstack/react-query"
import { agentsServices } from "@/services/agents/agents-services"
import type { AgentData } from "@/services/agents/types"

export function useAgents(containerId: string, containerToken: string) {
  return useQuery<AgentData[]>({
    queryKey: ["agents", containerId],
    queryFn: () => {
      if (!containerId) {
        throw new Error("NO_CONTAINER")
      }
      return agentsServices.getAgents(containerId, containerToken)
    },
    enabled: !!containerId,
    staleTime: 30 * 1000,
  })
}
