export type SkillData = {
  id: string
  name: string
  description: string
}

export type TrainingProgressStatus = "ALL" | "IN_PROGRESS" | "FINISHED"

export type TrainingItem = {
  id: string
  group_id: string
  title: string
  author: string
  short_description: string
  long_description: string
  lang: string
  video_url: string
  sort_order: number
  is_active: boolean
  skills: SkillData[]
  created: string
  updated: string
}

export type TrainingData = {
  items: TrainingItem[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export type TrainingBody = {
  group_id?: string
  title: string
  skill_ids: string[]
  video_url: string
  author: string
  short_description: string
  long_description?: string | null
  lang?: string
  sort_order?: number
  is_active?: boolean
}

export type GetTrainingsFilters = {
  page?: number
  page_size?: number
  is_active?: boolean
  skill_ids?: string
  sorted_only?: boolean
  progress_status?: TrainingProgressStatus
  lang?: string
}
