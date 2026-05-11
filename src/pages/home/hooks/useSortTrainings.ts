import { useQuery } from "@tanstack/react-query"
import { contentsServices } from "@/services/contents/contents-services"
import { useTranslation } from "react-i18next"

export function useSortTrainings(enabled: boolean) {
  const { i18n } = useTranslation()
  const currentLanguage = i18n.language || "en"

  return useQuery({
    queryKey: ["sort-trainings", currentLanguage],
    queryFn: () => {
      return contentsServices.getTrainings({
        is_active: true,
        sorted_only: true,
        lang: currentLanguage,
      })
    },
    enabled: !!enabled,
  })
}
