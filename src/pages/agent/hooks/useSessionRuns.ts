import { agentsServices } from "@/services/agents/agents-services"
import { useQuery } from "@tanstack/react-query"

export function useSessionRuns(containerId: string, containerToken: string, sessionId: string) {
  return useQuery({
    queryKey: ["session-runs", sessionId],
    queryFn: () => {
      if (!sessionId) {
        throw new Error("NO_CONTAINER")
      }
      return agentsServices.getSessionRun(containerId, containerToken, sessionId)
    },
    enabled: !!sessionId && !!containerId,
    staleTime: 30 * 1000,
  })
}
