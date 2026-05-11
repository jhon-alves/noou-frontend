import { useTranslation } from "react-i18next"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useHasBusiness } from "@/hooks/useHasBusiness"
import { promptServices } from "@/services"

interface GetPromptsParams {
  page?: number
  page_size?: number
}

export function useGetPrompts({ page = 1, page_size = 10 }: GetPromptsParams) {
  const { i18n } = useTranslation()
  const hasBusiness = useHasBusiness()
  const currentLanguage = i18n.language || "en"

  return useQuery({
    queryKey: ["prompts", currentLanguage, page, page_size],
    queryFn: () => promptServices.getPrompts({ lang: currentLanguage, page, page_size }),
    enabled: hasBusiness,
    placeholderData: keepPreviousData,
  })
}
