import { useQuery } from "@tanstack/react-query"
import { useHasBusiness } from "@/hooks/useHasBusiness"
import { promptServices } from "@/services"

export function useGetPromptCategories() {
  const hasBusiness = useHasBusiness()

  return useQuery({
    queryKey: ["prompt-categories"],
    queryFn: () => promptServices.getPromptCategories(),
    enabled: hasBusiness,
  })
}
