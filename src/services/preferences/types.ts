export type PreferenceKeys = "DARK_MODE" | "LANGUAGE"

export type PreferencesData = {
  key: PreferenceKeys
  value: string
}

export type PreferencesResponse = {
  preferences: PreferencesData[]
}

export type UpdatePreferenceBody = {
  key: PreferenceKeys
  value: string
}
