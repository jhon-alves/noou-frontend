import { z } from "zod"
import i18n from "i18next"
import { cleanObject } from "@/utils/cleanObject"
import { PromptBody, PromptItem } from "@/services/prompt/types"

const stringArraySchema = z.array(z.string())

const inputBlockSchema = z.object({
  key: z.string(),
  label: z.string(),
  placeholder: z.string(),
  type: z.string(),
})

const outputStructureSchema = z.object({
  section: z.string(),
  items: stringArraySchema,
})

const promptDetailsSchema = z.object({
  context: z.string(),
  objective: z.string(),
  expected_outputs: stringArraySchema,
  instructions: stringArraySchema,
})

const commandPromptSchema = z.object({
  title: z.string(),
  command: z.string(),
  tasks: stringArraySchema,
  input_block: z.array(inputBlockSchema),
  output_structure: z.array(outputStructureSchema),
})

export const promptSchema = z.object({
  group_id: z.string(),
  title: z.string().min(1, i18n.t("admin.enter-title")),
  description: z.string().min(1, i18n.t("admin.enter-title")),
  prompt_template: z.string().min(1, i18n.t("admin.enter-title")),
  author: z.string().min(1, i18n.t("form.enter-author")),
  visibility: z.enum(["PUBLIC", "PRIVATE", "CORPORATION"]),
  business_id: z.string(),
  agent_identifier: z.string(),
  lang: z.string().optional(),
  sort_order: z.string().optional(),
  category_names: z.array(z.string()),
  tag_names: z.array(z.string()),
  details: promptDetailsSchema,
  command_prompt: commandPromptSchema,
})

export type PromptFormData = z.infer<typeof promptSchema>

export const getDefaultPromptValues = (): PromptFormData => ({
  group_id: "",
  title: "",
  description: "",
  prompt_template: "",
  author: "",
  visibility: "PRIVATE",
  business_id: "",
  agent_identifier: "",
  lang: "en",
  sort_order: "",
  category_names: [],
  tag_names: [],
  details: {
    context: "",
    objective: "",
    expected_outputs: [],
    instructions: [],
  },
  command_prompt: {
    title: "",
    command: "",
    output_structure: [],
    input_block: [],
    tasks: [],
  },
})

export const mapPromptToFormValues = (prompt?: PromptItem | null): PromptFormData => {
  if (!prompt) return getDefaultPromptValues()

  return {
    group_id: prompt.group_id || "",
    title: prompt.title || "",
    description: prompt.description || "",
    prompt_template: prompt.prompt_template || "",
    author: prompt.author_name || "",
    visibility: prompt.visibility || "PRIVATE",
    business_id: String(prompt.business_id) || "",
    agent_identifier: prompt.agent.identifier || "",
    lang: prompt.lang || "en",
    sort_order:
      prompt.sort_order !== null && prompt.sort_order !== undefined
        ? String(prompt.sort_order)
        : "",
    category_names: prompt.categories?.map((category) => category.name) || [],
    tag_names: prompt.tags?.map((tag) => tag.name) || [],
    details: {
      context: prompt.details?.context || "",
      objective: prompt.details?.objective || "",
      expected_outputs: prompt.details?.expected_outputs || [],
      instructions: prompt.details?.instructions || [],
    },
    command_prompt: {
      title: prompt.command_prompt?.title || "",
      command: prompt.command_prompt?.command || "",
      output_structure: prompt.command_prompt?.output_structure || [],
      input_block: prompt.command_prompt?.input_block || [],
      tasks: prompt.command_prompt?.tasks || [],
    },
  }
}

export const mapFormToPromptBody = (data: PromptFormData): PromptBody => {
  return {
    group_id: data.group_id,
    title: data.title,
    description: data.description,
    prompt_template: data.prompt_template,
    author_name: data.author,
    visibility: data.visibility,
    business_id: Number(data.business_id),
    agent_identifier: data.agent_identifier,
    lang: data.lang,
    details: {
      context: data.details.context?.trim() || "",
      objective: data.details.objective?.trim() || "",
      expected_outputs: data.details.expected_outputs,
      instructions: data.details.instructions,
    },
    command_prompt: {
      title: data.command_prompt.title?.trim() || "",
      command: data.command_prompt.command?.trim() || "",
      tasks: data.command_prompt.tasks,
      input_block: data.command_prompt.input_block,
      output_structure: data.command_prompt.output_structure,
    },
    ...cleanObject({
      lang: data.lang,
      sort_order: Number(data.sort_order),
      category_names: data.category_names,
      tag_names: data.tag_names,
    }),
  }
}
