import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useQuery } from "@tanstack/react-query"
import {
  mapContentsToSearch,
  mapNoouAgentsToSearch,
  mapPromptsToSearch,
} from "@/utils/searchMapper"
import { noouAgentsServices } from "@/services/agents/noou-agents-services"
import { contentsServices } from "@/services/contents/contents-services"
import { SearchResult } from "@/components/global/InputSearch"
import { useHasBusiness } from "./useHasBusiness"
import { promptServices } from "@/services"

const typeAliases: Record<SearchResult["type"], string[]> = {
  agent: ["agent", "agents", "agente", "agentes"],
  prompt: ["prompt", "prompts"],
  content: ["content", "contents", "conteudo", "conteudos", "conteúdo", "conteúdos"],
}

export const useGlobalSearch = (search: string) => {
  const { i18n } = useTranslation()
  const hasBusiness = useHasBusiness()

  const shouldFetch = hasBusiness && search.length > 0
  const currentLanguage = i18n.language || "en"
  const staleTime = 1000 * 60 * 5 // 5 min in cache

  const { data: prompts } = useQuery({
    queryKey: ["prompts", currentLanguage],
    queryFn: () => promptServices.getPrompts({ lang: currentLanguage }),
    staleTime,
    enabled: shouldFetch,
  })

  const { data: contents } = useQuery({
    queryKey: ["trainings", currentLanguage],
    queryFn: () => contentsServices.getTrainings({ is_active: true, lang: currentLanguage }),
    staleTime,
    enabled: shouldFetch,
  })

  const { data: noouAgents } = useQuery({
    queryKey: ["noou-agents", currentLanguage],
    queryFn: () => noouAgentsServices.getNoouAgents({ lang: currentLanguage }),
    staleTime,
    enabled: shouldFetch,
  })

  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
  }

  const normalizedData = useMemo(() => {
    return [
      ...mapPromptsToSearch(prompts),
      ...mapContentsToSearch(contents),
      ...mapNoouAgentsToSearch(noouAgents),
    ]
  }, [prompts, contents, noouAgents])

  return useMemo(() => {
    if (!search.trim()) return []

    const q = normalizeText(search).toLowerCase()

    return normalizedData.filter((item) => {
      const matchesText =
        normalizeText(item.title).toLowerCase().includes(q) ||
        normalizeText(item.description).toLowerCase().includes(q)

      const matchesType = typeAliases[item.type].some((alias) => alias.includes(q))

      return matchesText || matchesType
    })
  }, [search, normalizedData])
}
