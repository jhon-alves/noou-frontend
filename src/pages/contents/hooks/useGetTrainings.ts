import { useHasBusiness } from "@/hooks/useHasBusiness"
import { contentsServices } from "@/services/contents/contents-services"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"

interface GetTrainingsParams {
  page?: number
  page_size?: number
}

export function useGetTrainings({ page = 1, page_size = 10 }: GetTrainingsParams) {
  const { i18n } = useTranslation()
  const hasBusiness = useHasBusiness()
  const currentLanguage = i18n.language || "en"

  return useQuery({
    queryKey: ["trainings", currentLanguage, page, page_size],
    queryFn: () => {
      return contentsServices.getTrainings({
        is_active: true,
        lang: currentLanguage,
        page,
        page_size,
      })
    },
    enabled: hasBusiness,
    placeholderData: keepPreviousData,
  })
}
