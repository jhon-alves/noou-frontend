import { useBusinessStore } from "@/stores/useBusinessStore"

export function useHasBusiness() {
  const { selectedBusiness } = useBusinessStore()
  return !!selectedBusiness
}
