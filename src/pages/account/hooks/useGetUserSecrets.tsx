import { secretServices } from "@/services/secrets/secret-services"
import { useBusinessStore } from "@/stores/useBusinessStore"
import { useQuery } from "@tanstack/react-query"

export function useGetUserSecrets(activeTab: string) {
  const { selectedBusiness } = useBusinessStore()
  const businessId = selectedBusiness?.id

  return useQuery({
    queryKey: ["user-secrets", businessId],
    queryFn: () => secretServices.getUserSecrets(businessId),
    enabled: !!businessId && activeTab === "security",
  })
}
