import { create } from "zustand"

interface PromptsStoreProps {
  selectedTag: string
  selectedCategory: string
  setSelectedTag: (selected: string) => void
  setSelectedCategory: (selected: string) => void
}

export const usePromptsStore = create<PromptsStoreProps>((set) => ({
  selectedTag: "all",
  selectedCategory: "all",
  setSelectedTag: (v) => set({ selectedTag: v }),
  setSelectedCategory: (v) => set({ selectedCategory: v }),
}))
