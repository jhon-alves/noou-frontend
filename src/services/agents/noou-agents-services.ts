import { api } from "../api"
import { NoouAgentData } from "./types"

type GetAgentFilters = {
  lang?: string
}

export const noouAgentsServices = {
  getNoouAgents,
}

function getNoouAgents(filters: GetAgentFilters = {}): Promise<NoouAgentData[]> {
  const { lang = "en" } = filters
  const params: Record<string, any> = { lang }

  return api.get("/agents", { params })
}
