import { api } from "../api"
import {
  PromptCategoriesResponse,
  GetPromptsFilters,
  PromptsResponse,
  PromptItem,
  GeneratePromptResponse,
  PromptBody,
} from "./types"

export const promptServices = {
  getPromptCategories,
  getPromptTags,
  getPrompts,
  getPromptById,
  getPromptByGroup,
  getSortPrompts,
  addLike,
  removeLike,
  generatePrompt,
  createPrompt,
  updatePrompt,
  deletePrompt,
}

function getPromptCategories(): Promise<PromptCategoriesResponse> {
  return api.get("/prompts/categories")
}

function getPromptTags(): Promise<PromptCategoriesResponse> {
  return api.get("/prompts/tags")
}

function getPrompts(filters: GetPromptsFilters = {}): Promise<PromptsResponse> {
  const { page = 1, page_size = 10, include_template = true, lang = "en", sorted_only } = filters

  const params: Record<string, any> = {
    page,
    page_size,
    include_template,
    lang,
  }

  if (include_template !== undefined) {
    params.include_template = include_template
  }

  if (sorted_only !== undefined) {
    params.sorted_only = sorted_only
  }

  return api.get("/prompts/", { params })
}

function getPromptByGroup(promptGroup: string, lang: string = "en"): Promise<PromptItem> {
  return api.get(`/prompts/by-group/${promptGroup}?lang=${lang}`)
}

function getPromptById(promptId: number, lang: string = "en"): Promise<PromptItem> {
  return api.get(`/prompts/${promptId}?lang=${lang}`)
}

function getSortPrompts(limit: number): Promise<PromptItem[]> {
  return api.get(`/prompts/sort_order?limit=${limit}&include_template=true`)
}

function addLike(promptId: number): Promise<PromptItem> {
  return api.post(`/prompts/${promptId}/heart`)
}

function removeLike(promptId: number): Promise<PromptItem> {
  return api.delete(`/prompts/${promptId}/heart`)
}

function generatePrompt(
  promptId: number,
  body?: Record<string, string>,
): Promise<GeneratePromptResponse> {
  return api.post(`/prompts/${promptId}/generate`, body)
}

function createPrompt(body: PromptBody) {
  return api.post("/prompts/", body)
}

function updatePrompt(promptId: number, body: PromptBody) {
  return api.put(`/prompts/${promptId}`, body)
}

function deletePrompt(promptId: number) {
  return api.delete(`/prompts/${promptId}`)
}
