import { Globe, Moon, Palette, Sun } from "lucide-react"
import { useThemeStore } from "@/stores/useThemeStore"
import { Switch } from "../shared/Switch"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { useTranslation } from "react-i18next"
import { useUpdatePreference } from "@/hooks/useUpdatePreference"

export function PreferencesTab() {
  const { i18n, t } = useTranslation()
  const { theme } = useThemeStore()
  const isDarkMode = theme === "dark"
  const currentLanguage = i18n.language || "en"
  const { mutate } = useUpdatePreference()

  function toggleLanguage(lang: string) {
    mutate({ key: "LANGUAGE", value: lang })
  }

  function toggleTheme() {
    mutate({ key: "DARK_MODE", value: isDarkMode ? "false" : "true" })
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl p-6 border border-gray-300 dark:border-white/15 space-y-6">
        <h1 className="flex items-center gap-2 font-medium text-black dark:text-white">
          <Palette size={20} />
          {t("settings.preferences.appearance")}
        </h1>
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {isDarkMode ? (
                <Moon className="size-5 text-gray-900 dark:text-white" />
              ) : (
                <Sun className="size-5 text-gray-900 dark:text-white" />
              )}
              <p className="text-gray-900 dark:text-white font-medium">
                {isDarkMode ? t("common.dark-mode") : t("common.light-mode")}
              </p>
            </div>

            <Switch checked={isDarkMode} onChange={toggleTheme} />
          </div>

          <hr className="border-0 bg-gray-200 dark:bg-[#2d2d38] w-full h-[0.5px]" />

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <Globe className="size-5 text-gray-900 dark:text-white" />
              <p className="text-gray-900 dark:text-white font-medium">{t("common.language")}</p>
            </div>
            <Select value={currentLanguage} onValueChange={(value) => toggleLanguage(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="en">{t("common.english")}</SelectItem>
                  <SelectItem value="pt">{t("common.portuguese")}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}
