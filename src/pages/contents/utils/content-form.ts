import { z } from "zod"
import i18n from "i18next"
import { TrainingBody, TrainingItem } from "@/services/contents/types"
import { cleanObject } from "@/utils/cleanObject"

export const contentSchema = z.object({
  group_id: z.string().optional(),
  title: z.string().min(1, i18n.t("admin.enter-title")),
  author: z.string().min(1, i18n.t("form.enter-author")),
  short_description: z.string().min(1, i18n.t("form.enter-short-description")),
  video_url: z.string().min(1, i18n.t("form.enter-url")),
  long_description: z.string().optional(),
  lang: z.string().optional(),
  sort_order: z.string().optional(),
  is_active: z.boolean().optional(),
  skill_ids: z.array(z.string()).min(1, i18n.t("form.enter-categories")),
})

export type ContentFormData = z.infer<typeof contentSchema>

export const getDefaultContentValues = (): ContentFormData => ({
  group_id: "",
  title: "",
  author: "",
  short_description: "",
  long_description: "",
  lang: "",
  video_url: "",
  sort_order: "",
  is_active: true,
  skill_ids: [],
})

export const mapContentToFormValues = (content?: TrainingItem | null): ContentFormData => {
  if (!content) return getDefaultContentValues()

  return {
    group_id: content.group_id || "",
    title: content.title || "",
    author: content.author || "",
    short_description: content.short_description || "",
    long_description: content.long_description || "",
    lang: content.lang || "",
    video_url: content.video_url || "",
    sort_order:
      content.sort_order !== null && content.sort_order !== undefined
        ? String(content.sort_order)
        : "",
    is_active: content.is_active ?? true,
    skill_ids: content.skills?.map((skill) => skill.id) || [],
  }
}

export const mapFormToTrainingBody = (data: ContentFormData): TrainingBody => {
  return {
    title: data.title,
    author: data.author,
    short_description: data.short_description,
    video_url: data.video_url,
    is_active: data.is_active,
    skill_ids: data.skill_ids,
    ...cleanObject({
      group_id: data.group_id,
      long_description: data.long_description,
      lang: data.lang,
      sort_order: Number(data.sort_order),
    }),
  }
}
