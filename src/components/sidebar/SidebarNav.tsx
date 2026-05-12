import { useLocation, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {
  Home,
  Monitor,
  GraduationCap,
  Building2,
  Settings,
  Folders,
  SquareTerminal,
} from "lucide-react"
import { useMeStore } from "@/stores/meStore"
import { useSidebar } from "@/hooks/useSidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"

export function SidebarNav() {
  const { t } = useTranslation()
  const { me } = useMeStore()
  const { isCollapsed, toggleSidebar } = useSidebar()
  const isMobile = useIsMobile()
  const location = useLocation()
  const navigate = useNavigate()

  const currentPath = location.pathname.replace(/\/+$/, "")

  const navigationItems = [
    { name: t("nav.home"), href: "/dashboard", icon: <Home size={18} /> },
    { name: t("nav.knowledge"), href: "/knowledge", icon: <Folders size={18} /> },
    { name: t("nav.prompts"), href: "/prompts", icon: <SquareTerminal size={18} /> },
    { name: t("nav.agent"), href: "/agent", icon: <Monitor size={18} /> },
    { name: t("nav.contents"), href: "/contents", icon: <GraduationCap size={18} /> },
    { name: t("nav.business"), href: "/business", icon: <Building2 size={18} /> },
    { name: "Admin", href: "/admin", icon: <Settings size={18} /> },
  ]

  const filteredItems = navigationItems.filter((item) => {
    const isAdmin = me?.roles?.some((role) => role.name === "admin")
    if (item.href === "/admin" && !isAdmin) return false
    if (!me?.is_superuser && item.href === "/business") return false
    return true
  })

  return (
    <nav className="w-full px-4" aria-label="Itens de navegação">
      <ul className="flex flex-col gap-3">
        {filteredItems.map((item, index) => {
          const isActive = currentPath === item.href.replace(/\/+$/, "")
          return (
            <li
              key={index}
              onClick={() => {
                if (isMobile) toggleSidebar()
                navigate(item.href)
              }}
              className={cn(
                "flex items-center rounded-full h-10 py-2.5 cursor-pointer px-3 text-sm font-medium shrink-0",
                "text-neutral-700 dark:text-neutral-50 transition-colors duration-300",
                isCollapsed ? "justify-center" : "justify-start gap-3 w-full",
                isActive
                  ? "bg-neutral-50 dark:bg-neutral-600"
                  : "bg-transparent hover:bg-state-hover-light dark:hover:bg-[#1c1f29]",
              )}
            >
              <div className="shrink-0">{item.icon}</div>
              {!isCollapsed && <span className="truncate">{item.name}</span>}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
