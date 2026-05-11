import { useGetPreferences } from "@/hooks/useGetPreferences"

export function AppPreferencesBootstrap() {
  useGetPreferences(true)

  return null
}
