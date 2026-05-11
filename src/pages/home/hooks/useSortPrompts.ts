import { useQuery } from "@tanstack/react-query"
import { promptServices } from "@/services"
import { useTranslation } from "react-i18next"

export function useSortPrompts(enabled: boolean) {
  const { i18n } = useTranslation()
  const currentLanguage = i18n.language || "en"

  return useQuery({
    queryKey: ["sort-prompts", currentLanguage],
    queryFn: () => promptServices.getPrompts({ sorted_only: true, lang: currentLanguage }),
    enabled: !!enabled,
  })
}
