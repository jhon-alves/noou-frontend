import { tokens } from "@/config/tokens"
import { create } from "zustand"
import { persist } from "zustand/middleware"

export type ThemeValues = "dark" | "light"

interface ThemeStoreProps {
  theme: ThemeValues
  setTheme: (theme: ThemeValues) => void
}

export const useThemeStore = create<ThemeStoreProps>()(
  persist(
    (set) => ({
      theme: "light",
      setTheme: (theme) => set({ theme }),
    }),
    { name: tokens.theme },
  ),
)
