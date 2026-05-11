import { Navigate, Outlet, useLocation } from "react-router-dom"
import { AppPreferencesBootstrap } from "@/components/AppPreferencesBootstrap"
import { useSidebar } from "@/hooks/useSidebar"
import { Sidebar } from "@/components/global/Sidebar"
import { Header } from "@/components/global/Header"
import { useGetMe } from "@/hooks/useGetMe"
import { cn } from "@/lib/utils"

export function PrivateRoute() {
  const { pathname } = useLocation()
  const { isCollapsed, toggleSidebar } = useSidebar()
  const { isError, isLoading } = useGetMe()

  if (isLoading) return null

  if (isError) {
    return <Navigate to="/" replace />
  }

  return pathname !== "/agent/preview" ? (
    <div className="h-screen flex flex-col bg-background overflow-hidden relative">
      <AppPreferencesBootstrap />
      <Header />

      {/* Container principal que segura Sidebar e Main */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* 1. BACKDROP (Apenas Mobile) */}
        {!isCollapsed && (
          <div
            className="fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity"
            onClick={toggleSidebar}
          />
        )}

        {/* 2. SIDEBAR (Componente) */}
        <Sidebar />

        {/* 3. MAIN (Conteúdo) */}
        <main
          className={cn(
            "flex w-full h-full flex-col transition-all duration-300 bg-foreground overflow-hidden",
            "rounded-t-3xl ml-0",
            "md:rounded-tl-4xl md:flex-1",
          )}
        >
          <Outlet />
        </main>
      </div>
    </div>
  ) : (
    <Outlet />
  )
}
