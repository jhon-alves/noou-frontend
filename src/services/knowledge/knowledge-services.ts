import { api } from "../api"
import { KnowledgeData } from "./types"

export const knowledgeServices = {
  getKnowledges,
  createKnowledge,
  deleteKnowledge,
}

function getKnowledges(
  businessId: number,
  skip: number = 0,
  limit: number = 20,
): Promise<KnowledgeData[]> {
  return api.get(`/knowledge/business/${businessId}?skip=${skip}&limit=${limit}`)
}

function createKnowledge(businessId: number, name: string, file: File): Promise<KnowledgeData[]> {
  const formData = new FormData()

  formData.append("business_id", String(businessId))
  formData.append("name", name)
  formData.append("file", file)

  return api.post("/knowledge/", formData)
}

function deleteKnowledge(knowledgeId: number) {
  return api.delete(`/knowledge/${knowledgeId}`)
}
