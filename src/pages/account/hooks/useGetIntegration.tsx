import { integrationServices } from "@/services/integrations/integration-services"
import { useBusinessStore } from "@/stores/useBusinessStore"
import { useQuery } from "@tanstack/react-query"

export function useGetIntegration(activeTab: string) {
  const { selectedBusiness } = useBusinessStore()
  const businessId = selectedBusiness?.id

  return useQuery({
    queryKey: ["integration", businessId],
    queryFn: () => integrationServices.getIntegrationStatus("google", businessId),
    enabled: !!businessId && activeTab === "integrations",
  })
}
