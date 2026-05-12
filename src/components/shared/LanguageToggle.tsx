import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu"
import brFlag from "@/assets/images/flag-br.svg"
import euaFlag from "@/assets/images/flag-eua.svg"
import { useUpdatePreference } from "@/hooks/useUpdatePreference"

type LanguageToggleProps = {
  isLogged?: boolean
}

export function LanguageToggle({ isLogged = false }: LanguageToggleProps) {
  const { i18n, t } = useTranslation()
  const { mutate } = useUpdatePreference()
  const currentLanguage = i18n.language || "en"

  function toggleLanguage(lang: string) {
    if (lang === currentLanguage) return

    if (!isLogged) return i18n.changeLanguage(lang)

    return mutate({ key: "LANGUAGE", value: lang })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={cn(
            "relative flex items-center justify-center size-10 rounded-full transition-colors cursor-pointer",
            "bg-neutral-50 dark:bg-neutral-600",
          )}
          aria-label={t("common.switch-language")}
        >
          <img
            src={currentLanguage === "en" ? euaFlag : brFlag}
            alt={currentLanguage === "en" ? "EUA Flag" : "BR Flag"}
            className="w-4"
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-36 bg-foreground text-[#111827] dark:text-white border dark:border-[#2d2d38]"
      >
        <DropdownMenuItem onClick={() => toggleLanguage("en")} className="flex items-center gap-2">
          <img src={euaFlag} alt="EUA Flag" className="w-4" />
          <span>{t("common.english")}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => toggleLanguage("pt")} className="flex items-center gap-2">
          <img src={brFlag} alt="BR Flag" className="w-4" />
          <span>{t("common.portuguese")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
