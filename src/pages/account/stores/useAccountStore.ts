import { create } from "zustand"

type AccountTabs = "profile" | "security" | "preferences" | "integrations"

type AccountStoreProps = {
  activeTab: AccountTabs
  setActiveTab: (tab: AccountTabs) => void
  openChangeUserPasswordModal: boolean
  setOpenChangeUserPasswordModal: (modal: boolean) => void
}

export const useAccountStore = create<AccountStoreProps>((set) => ({
  activeTab: "profile",
  openChangeUserPasswordModal: false,
  setActiveTab: (tab) => set({ activeTab: tab }),
  setOpenChangeUserPasswordModal: (value) => set({ openChangeUserPasswordModal: value }),
}))
