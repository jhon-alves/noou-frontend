import { Navigate, Outlet } from "react-router-dom"
import { Loader2 } from "lucide-react"
import { useGetMe } from "@/hooks/useGetMe"

export function PublicRoute() {
  const { isLoading, isSuccess } = useGetMe()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (isSuccess) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
