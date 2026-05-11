import { useTranslation } from "react-i18next"
import { useLocation, useNavigate } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  Home,
  LogOut,
  FileText,
  BookOpen,
  Monitor,
  GraduationCap,
  Edit,
  Building2,
  Crown,
  X,
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog"
import avatarPhoto from "@/assets/images/knowledge-center-01.png"
import { useBusinessStore } from "@/stores/useBusinessStore"
import { useSidebar } from "@/hooks/useSidebar"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { useMeStore } from "@/stores/meStore"
import { CURRENT_VERSION } from "../../../version"
import { authServices } from "@/services"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

export const Sidebar = () => {
  const qc = useQueryClient()
  const { me, clearMe } = useMeStore()
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const { isCollapsed, toggleSidebar } = useSidebar()
  const { clearBusiness } = useBusinessStore()
  const isMobile = useIsMobile()

  const currentPath = location.pathname.replace(/\/+$/, "")

  const navigationItems = [
    { name: t("nav.home"), href: "/dashboard", icon: <Home size={18} /> },
    { name: t("nav.knowledge"), href: "/knowledge", icon: <BookOpen size={18} /> },
    { name: t("nav.prompts"), href: "/prompts", icon: <Edit size={18} /> },
    { name: t("nav.agent"), href: "/agent", icon: <Monitor size={18} /> },
    { name: t("nav.contents"), href: "/contents", icon: <GraduationCap size={18} /> },
    { name: t("nav.business"), href: "/business", icon: <Building2 size={18} /> },
    { name: "Admin", href: "/admin", icon: <Crown size={18} /> },
  ]

  const { isPending, mutateAsync } = useMutation({
    mutationFn: () => authServices.logout(),
  })

  function navigateToAccount() {
    if (isMobile) toggleSidebar()
    navigate("/account")
  }

  function navigateToPrivacy() {
    if (isMobile) toggleSidebar()
    navigate("/privacy-policy")
  }

  async function handleLogout() {
    await mutateAsync()
    clearBusiness()
    clearMe()
    qc.clear()
    navigate("/")
  }

  function formatName(name?: string) {
    if (!name) return ""

    const parts = name.trim().split(" ")

    if (parts.length === 1) return parts[0]

    const firstName = parts[0]
    const lastInitial = parts[parts.length - 1][0]

    return `${firstName} ${lastInitial}.`
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-50 transition-all duration-300 pb-5 md:relative md:translate-x-0 overflow-y-auto scrollbar-hide inset-y-0 bg-background",
        isCollapsed ? "-translate-x-full w-20" : "translate-x-0 w-60",
      )}
      aria-label="Menu principal de navegação"
    >
      {/* Botão de fechar exclusivo para Mobile (Fica fixo no topo) */}
      <div className="flex items-center justify-between p-4 md:hidden">
        <img
          src="/logo.webp"
          alt="Noou"
          className={cn("h-6 w-auto object-contain", isCollapsed ? "md:hidden" : "block")}
        />
        <button onClick={toggleSidebar} className="p-2 text-[#666f8d]">
          <X size={20} />
        </button>
      </div>

      <div className="flex flex-col h-full justify-between">
        <div className="flex-1 gap-4 overflow-y-auto min-h-0 flex flex-col">
          <button
            className={cn(
              "flex items-center gap-3 py-6 mx-4 px-2 overflow-hidden rounded-xl transition-all duration-300 cursor-pointer",
              isCollapsed ? "justify-center" : "hover:bg-[#f0f1f3] dark:hover:bg-[#1c1f29]",
            )}
            onClick={navigateToAccount}
          >
            <Avatar className="size-10 shrink-0">
              <AvatarFallback>
                <img src={avatarPhoto} alt="Avatar Image" />
              </AvatarFallback>
            </Avatar>
            <div className={cn("flex-col items-start min-w-0", isCollapsed ? "hidden" : "flex")}>
              <span className="font-semibold text-sm whitespace-nowrap text-[#111827] dark:text-white">
                {formatName(me?.name)}
              </span>
              <span className="font-semibold text-xs whitespace-nowrap truncate text-gray-500 dark:text-gray-400 w-full text-left">
                {me?.email}
              </span>
            </div>
          </button>

          {/* Navegação Principal */}
          <nav className="w-full px-4" aria-label="Itens de navegação">
            <ul className="flex flex-col gap-3">
              {navigationItems
                .filter((item) => {
                  const isAdmin = me?.roles?.some((role) => role.name === "admin")
                  if (item.href === "/admin" && !isAdmin) return false
                  if (!me?.is_superuser && item.href === "/business") return false
                  return true
                })
                .map((item, index) => {
                  const itemPath = item.href.replace(/\/+$/, "")
                  const isActive = currentPath === itemPath

                  return (
                    <li
                      key={index}
                      onClick={() => {
                        if (isMobile) toggleSidebar()
                        navigate(item.href)
                      }}
                      className={cn(
                        "flex items-center rounded-full h-10 py-2.5 cursor-pointer px-3 text-sm font-medium shrink-0",
                        isCollapsed ? "justify-center" : "justify-start gap-3 w-full",
                        isActive
                          ? "bg-[#e5e7eb] dark:bg-[#1c1f29] text-[#111827] dark:text-white"
                          : "bg-transparent hover:bg-[#f0f1f3] dark:hover:bg-[#1c1f29] text-[#666f8d] dark:text-[#9ca3af] hover:text-[#111827] hover:dark:text-white",
                      )}
                      aria-label={`Navegar para ${item.name}`}
                    >
                      <div className="shrink-0">{item.icon}</div>
                      {!isCollapsed && <span className="truncate">{item.name}</span>}
                    </li>
                  )
                })}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-3 w-full pt-4 px-4 border-t border-[#e5e7eb] dark:border-[#1c1f29] shrink-0 bg-background">
          <AlertDialog>
            <AlertDialogTrigger
              onClick={() => isMobile && toggleSidebar()}
              className={cn(
                "flex items-center transition-all duration-200 rounded-full h-10 py-2 cursor-pointer",
                "text-[#666f8d] dark:text-[#9ca3af] hover:text-[#111827] hover:dark:text-white",
                "bg-transparent hover:bg-[#f0f1f3] dark:hover:bg-[#1c1f29]",
                isCollapsed ? "justify-center px-3" : "justify-start gap-2.5 px-4 w-full delay-150",
              )}
            >
              <LogOut size={18} className="shrink-0" />
              {!isCollapsed && (
                <span className="text-sm font-medium whitespace-nowrap">{t("nav.logout")}</span>
              )}
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t("global.logout-confirm-title")}</AlertDialogTitle>
                <AlertDialogDescription>{t("global.logout-confirm-desc")}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
                <Button variant="destructive" onClick={handleLogout} isLoading={isPending}>
                  {t("common.confirm")}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <button
            className={cn(
              "flex items-center transition-all duration-200 rounded-full h-10 py-2 cursor-pointer",
              "text-[#666f8d] dark:text-[#9ca3af] hover:text-[#111827] hover:dark:text-white",
              "bg-transparent hover:bg-[#f0f1f3] dark:hover:bg-[#1c1f29]",
              isCollapsed ? "justify-center px-3" : "justify-start gap-2.5 px-4 w-full delay-150",
            )}
            onClick={navigateToPrivacy}
          >
            <FileText size={18} className="shrink-0" />
            {!isCollapsed && (
              <span className="text-sm font-medium whitespace-nowrap">{t("nav.privacy")}</span>
            )}
          </button>

          {!isCollapsed && (
            <div className="flex flex-col gap-1 shrink-0">
              <span className="text-center text-[#666f8d] dark:text-[#666f8d] text-[10px] leading-4 pt-2 whitespace-nowrap">
                © 2026 Noou - AI Ready, by design.
              </span>
              <span className="text-center text-[#666f8d] dark:text-[#666f8d] text-[9px] leading-3 whitespace-nowrap">
                {CURRENT_VERSION}
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
