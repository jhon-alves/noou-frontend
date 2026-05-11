import { useQuery } from "@tanstack/react-query"
import { useHasBusiness } from "@/hooks/useHasBusiness"
import { promptServices } from "@/services"

export function useGetPromptTags() {
  const hasBusiness = useHasBusiness()

  return useQuery({
    queryKey: ["prompt-tags"],
    queryFn: () => promptServices.getPromptTags(),
    enabled: hasBusiness,
  })
}
