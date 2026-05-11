import { create } from "zustand"
import { MeData } from "@/services/user/types"

interface MeStoreProps {
  me: MeData | null
  setMe: (user: MeData) => void
  clearMe: () => void
}

export const useMeStore = create<MeStoreProps>((set) => ({
  me: null,
  setMe: (me) => set({ me }),
  clearMe: () => set({ me: null }),
}))
