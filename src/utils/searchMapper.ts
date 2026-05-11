import { SearchResult } from "@/components/global/InputSearch"
import { NoouAgentData } from "@/services/agents/types"
import { TrainingData } from "@/services/contents/types"
import { PromptsResponse } from "@/services/prompt/types"

export const mapPromptsToSearch = (prompts?: PromptsResponse): SearchResult[] => {
  return (
    prompts?.items?.map((p) => ({
      id: p.group_id,
      title: p.title,
      description: p.description || "",
      type: "prompt",
    })) ?? []
  )
}

export const mapContentsToSearch = (contents?: TrainingData): SearchResult[] => {
  return (
    contents?.items?.map((c) => ({
      id: c.group_id,
      title: c.title,
      description: c.short_description || "",
      type: "content",
    })) ?? []
  )
}

export const mapNoouAgentsToSearch = (noouAgents?: NoouAgentData[]): SearchResult[] => {
  return (
    noouAgents?.map((c) => ({
      id: c.identifier,
      title: c.name,
      description: c.short_description || "",
      type: "agent",
    })) ?? []
  )
}
