import { useHasBusiness } from "@/hooks/useHasBusiness"
import { contentsServices } from "@/services/contents/contents-services"
import { useQuery } from "@tanstack/react-query"

export function useGetTrainingSkills() {
  const hasBusiness = useHasBusiness()

  return useQuery({
    queryKey: ["training-skills"],
    queryFn: () => contentsServices.getTrainingSkills(),
    enabled: hasBusiness,
  })
}
