export type PromptCategoriesData = {
  name: string
  description: string
  id: number
}

export type PromptCategoriesResponse = PromptCategoriesData[]

export type PromptTagsData = {
  name: string
  id: number
}

export type PromptTagsResponse = PromptTagsData[]

export type PromptDetails = {
  context: string
  objective: string
  expected_outputs: string[]
  instructions: string[]
}

type PromptInputBlock = {
  key: string
  label: string
  placeholder: string
  type: string
}

type PromptOutputStructure = {
  section: string
  items: string[]
}

export type PromptCommand = {
  title: string
  command: string
  tasks: string[]
  input_block: PromptInputBlock[]
  output_structure: PromptOutputStructure[]
}

export type AgentDetails = {
  id: string
  name: string
  identifier: string
}

export type PromptVisibilities = "PUBLIC" | "PRIVATE" | "CORPORATION"

export type PromptItem = {
  id: number
  group_id: string
  title: string
  description: string
  user_id: number
  business_id: number
  visibility: PromptVisibilities
  hearts: number
  messages: number
  sort_order: number
  lang: string
  categories: PromptCategoriesData[]
  tags: PromptTagsData[]
  has_hearted: boolean
  prompt_template: string
  prompt_template_front: string
  author_name: string
  details: PromptDetails
  command_prompt: PromptCommand
  agent: AgentDetails
}

export type PromptsData = {
  items: PromptItem[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export type PromptsResponse = PromptsData

export type GetPromptsFilters = {
  page?: number
  page_size?: number
  include_template?: boolean
  lang?: string
  sorted_only?: boolean
}

export type GeneratePromptResponse = {
  id: number
  prompt_template: string
}

export type PromptBody = {
  group_id: string
  title: string
  description: string
  prompt_template: string
  author_name: string
  visibility: PromptVisibilities
  business_id: number
  agent_identifier: string
  lang?: string
  sort_order?: number
  category_names?: string[]
  tag_names?: string[]
  details: PromptDetails
  command_prompt: PromptCommand
}
