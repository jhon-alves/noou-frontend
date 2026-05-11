import { api } from "../api"
import { PreferencesResponse, PreferencesData, UpdatePreferenceBody } from "./types"

export const preferencesServices = {
  getPreferences,
  updatePreferences,
}

function getPreferences(): Promise<PreferencesResponse> {
  return api.get("/preferences/")
}

function updatePreferences(body: UpdatePreferenceBody): Promise<PreferencesData> {
  return api.post("/preferences/", body)
}
