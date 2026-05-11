import { useQuery } from "@tanstack/react-query"
import { sessionsServices } from "@/services/sessions/sessions-services"

export function useSortSessions(enabled: boolean) {
  return useQuery({
    queryKey: ["sort-sessions"],
    queryFn: () => sessionsServices.getSessions(),
    enabled: !!enabled,
  })
}
