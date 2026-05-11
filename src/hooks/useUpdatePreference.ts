import { useMutation } from "@tanstack/react-query"
import { preferencesServices } from "@/services/preferences/preferences-services"
import { UpdatePreferenceBody } from "@/services/preferences/types"
import { useThemeStore } from "@/stores/useThemeStore"
import i18n from "@/i18n"

export function useUpdatePreference() {
  const setTheme = useThemeStore((state) => state.setTheme)
  const currentTheme = useThemeStore((state) => state.theme)

  return useMutation({
    mutationKey: ["update-preference"],
    mutationFn: (body: UpdatePreferenceBody) => preferencesServices.updatePreferences(body),
    onMutate: async (body) => {
      const previousLanguage = i18n.language || "en"
      const previousTheme = currentTheme

      if (body.key === "DARK_MODE") {
        setTheme(body.value === "true" ? "dark" : "light")
      }

      if (body.key === "LANGUAGE" && (body.value === "pt" || body.value === "en")) {
        i18n.changeLanguage(body.value)
      }

      return {
        previousLanguage,
        previousTheme,
      }
    },
    onError: (_error, _body, context) => {
      if (!context) return

      setTheme(context.previousTheme)
      i18n.changeLanguage(context.previousLanguage)
    },
  })
}
