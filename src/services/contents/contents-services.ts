import { api } from "../api"
import { TrainingData, SkillData, TrainingBody, GetTrainingsFilters, TrainingItem } from "./types"

export const contentsServices = {
  getTrainings,
  getTrainingById,
  getTrainingByGroup,
  getTrainingSkills,
  createTraining,
  deleteTraining,
  updateTraining,
}

function getTrainings(filters: GetTrainingsFilters = {}): Promise<TrainingData> {
  const {
    is_active,
    skill_ids,
    sorted_only,
    progress_status = "ALL",
    lang = "en",
    page,
    page_size,
  } = filters

  const params: Record<string, any> = {
    page,
    page_size,
    lang,
  }

  if (is_active !== undefined) {
    params.is_active = is_active
  }

  if (sorted_only !== undefined) {
    params.sorted_only = sorted_only
  }

  if (skill_ids?.length > 0) {
    params.skill_ids = skill_ids
  }

  if (progress_status) {
    params.progress_status = progress_status
  }

  return api.get("/trainings", { params })
}

function getTrainingByGroup(training_group: string, lang: string = "en"): Promise<TrainingItem> {
  return api.get(`/trainings/by-group/${training_group}?lang=${lang}`)
}

function getTrainingById(training_id: string): Promise<TrainingItem> {
  return api.get(`/trainings/${training_id}`)
}

function getTrainingSkills(): Promise<SkillData[]> {
  return api.get("/skills")
}

function createTraining(body: TrainingBody): Promise<TrainingItem> {
  return api.post("/trainings", body)
}

function deleteTraining(training_id: string) {
  return api.delete(`/trainings/${training_id}`)
}

function updateTraining(training_id: string, body: TrainingBody): Promise<TrainingItem> {
  return api.put(`/trainings/${training_id}`, body)
}
