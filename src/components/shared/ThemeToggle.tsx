import { useEffect } from "react"
import { cn } from "@/lib/utils"
import { useThemeStore } from "@/stores/useThemeStore"
import { Moon, Sun } from "lucide-react"
import { useUpdatePreference } from "@/hooks/useUpdatePreference"

type ThemeToggleProps = {
  isLogged?: boolean
}

export function ThemeToggle({ isLogged }: ThemeToggleProps) {
  const { theme, setTheme } = useThemeStore()
  const isDarkMode = theme === "dark"
  const { mutate } = useUpdatePreference()

  useEffect(() => {
    const root = document.documentElement

    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [theme])

  function toggleTheme() {
    if (!isLogged) return setTheme(isDarkMode ? "light" : "dark")

    mutate({ key: "DARK_MODE", value: isDarkMode ? "false" : "true" })
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative flex items-center justify-center size-10 rounded-full transition-colors cursor-pointer",
        !isDarkMode ? "bg-neutral-50" : "bg-neutral-600",
      )}
      aria-label="Toggle Theme"
    >
      {!isDarkMode ? (
        <Moon size={19} className="text-neutral-500" />
      ) : (
        <Sun size={19} className="text-neutral-300" />
      )}
    </button>
  )
}
