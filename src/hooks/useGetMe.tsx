import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { useMeStore } from "@/stores/meStore"
import { userServices } from "@/services"

export function useGetMe() {
  const { setMe } = useMeStore()

  const query = useQuery({
    queryKey: ["me"],
    queryFn: () => userServices.getMe(),
    retry: false,
    staleTime: 1000 * 60 * 5,
  })

  useEffect(() => {
    if (query.data) {
      setMe(query.data)
    }
  }, [query.data, setMe])

  return query
}
