import { create } from "zustand"

interface ChatStoreProps {
  value: string
  setValue: (v: string) => void
  clearAllChat: () => void
}

export const useChatStore = create<ChatStoreProps>((set) => ({
  value: "",
  setValue: (v) => set({ value: v }),
  clearAllChat: () => set({ value: "" }),
}))
