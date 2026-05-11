import { BusinessData } from "@/services/business/types"
import { create } from "zustand"

interface BusinessStoreProps {
  isEditBusiness: boolean
  selectedBusiness: Omit<BusinessData, "users">
  openCreateBusinessModal: boolean
  forceSelectBusinessOpen: boolean
  menuOpen: boolean
  setIsEditBusiness: (edit: boolean) => void
  setSelectedBusiness: (business: Omit<BusinessData, "users">) => void
  setCreateBusinessModal: (modal: boolean) => void
  setForceSelectBusinessOpen: (dialog: boolean) => void
  setMenuOpen: (menu: boolean) => void
  clearBusiness: () => void
}

export const useBusinessStore = create<BusinessStoreProps>((set) => ({
  isEditBusiness: false,
  selectedBusiness: null,
  openCreateBusinessModal: false,
  forceSelectBusinessOpen: false,
  menuOpen: false,
  setIsEditBusiness: (newValue) => set({ isEditBusiness: newValue }),
  setSelectedBusiness: (newValue) => set({ selectedBusiness: newValue }),
  setCreateBusinessModal: (newValue) => set({ openCreateBusinessModal: newValue }),
  setForceSelectBusinessOpen: (newValue) => set({ forceSelectBusinessOpen: newValue }),
  setMenuOpen: (newValue) => set({ menuOpen: newValue }),
  clearBusiness: () =>
    set({
      openCreateBusinessModal: false,
      selectedBusiness: null,
      isEditBusiness: false,
      forceSelectBusinessOpen: false,
      menuOpen: false,
    }),
}))
