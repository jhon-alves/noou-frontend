import { useTranslation } from "react-i18next"
import { useQuery } from "@tanstack/react-query"
import { noouAgentsServices } from "@/services/agents/noou-agents-services"
import { useHasBusiness } from "@/hooks/useHasBusiness"

export function useNoouAgents() {
  const { i18n } = useTranslation()
  const hasBusiness = useHasBusiness()
  const currentLanguage = i18n.language || "en"

  return useQuery({
    queryKey: ["noou-agents", currentLanguage],
    queryFn: () => noouAgentsServices.getNoouAgents({ lang: currentLanguage }),
    enabled: hasBusiness,
  })
}
