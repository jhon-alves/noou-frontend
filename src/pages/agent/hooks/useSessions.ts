import { useQuery } from "@tanstack/react-query"
import { sessionsServices } from "@/services/sessions/sessions-services"
import { useHasBusiness } from "@/hooks/useHasBusiness"

export function useSessions() {
  const hasBusiness = useHasBusiness()

  return useQuery({
    queryKey: ["sessions"],
    queryFn: () => sessionsServices.getSessions(),
    staleTime: 30 * 1000,
    enabled: hasBusiness,
  })
}
