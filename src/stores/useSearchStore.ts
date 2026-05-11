import { create } from "zustand"

type SearchStoreProps = {
  search: string
  showResults: boolean
  setSearch: (search: string) => void
  setShowResults: (showResults: boolean) => void
  resetSearch: () => void
}

export const useSearchStore = create<SearchStoreProps>((set) => ({
  search: "",
  showResults: false,
  setSearch: (search) => set({ search }),
  setShowResults: (showResults) => set({ showResults }),
  resetSearch: () =>
    set({
      search: "",
      showResults: false,
    }),
}))
