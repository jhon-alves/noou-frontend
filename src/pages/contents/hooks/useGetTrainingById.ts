import { contentsServices } from "@/services/contents/contents-services"
import { useSuspenseQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"

export function useGetTrainingById(trainingId: string) {
  const { i18n } = useTranslation()
  const currentLanguage = i18n.language || "en"

  return useSuspenseQuery({
    queryKey: ["training-by-id", trainingId, currentLanguage],
    queryFn: () => contentsServices.getTrainingByGroup(trainingId, currentLanguage),
  })
}
