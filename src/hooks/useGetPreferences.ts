import { useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { useQuery } from "@tanstack/react-query"
import { preferencesServices } from "@/services/preferences/preferences-services"
import { ThemeValues, useThemeStore } from "@/stores/useThemeStore"
import { PreferencesResponse } from "@/services/preferences/types"

type PreferencesMap = {
  theme?: ThemeValues
  language?: "pt" | "en"
}

function mapPreferences(data?: PreferencesResponse): PreferencesMap {
  if (!data?.preferences?.length) {
    return {}
  }

  return data.preferences.reduce<PreferencesMap>((acc, item) => {
    if (item.key === "DARK_MODE") {
      if (item.value === "true") {
        acc.theme = "dark"
      }

      if (item.value === "false") {
        acc.theme = "light"
      }
    }

    if (item.key === "LANGUAGE") {
      if (item.value === "pt" || item.value === "en") {
        acc.language = item.value
      }
    }

    return acc
  }, {})
}

export function useGetPreferences(enabled = false) {
  const { i18n } = useTranslation()
  const setTheme = useThemeStore((state) => state.setTheme)
  const hasHydratedRef = useRef(false)

  const query = useQuery({
    queryKey: ["preferences"],
    queryFn: () => preferencesServices.getPreferences(),
    enabled,
    retry: false,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  useEffect(() => {
    if (!query.data) return

    const { theme: serverTheme, language: serverLanguage } = mapPreferences(query.data)

    if (serverTheme) {
      setTheme(serverTheme)
    }

    if (serverLanguage) {
      const normalizedLanguage = i18n.language.startsWith("pt") ? "pt" : "en"

      if (serverLanguage !== normalizedLanguage) {
        i18n.changeLanguage(serverLanguage)
      }
    }

    hasHydratedRef.current = true
  }, [query.data])

  return query
}
