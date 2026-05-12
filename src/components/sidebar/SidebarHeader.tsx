import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { useMeStore } from "@/stores/meStore"
import { useSidebar } from "@/hooks/useSidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import avatarBg from "@/assets/images/avatar-bg.png"

export function SidebarHeader() {
  const { me } = useMeStore()
  const { t } = useTranslation()
  const { isCollapsed, toggleSidebar } = useSidebar()
  const isMobile = useIsMobile()
  const navigate = useNavigate()

  const navigateToAccount = () => {
    if (isMobile) toggleSidebar()
    navigate("/account")
  }

  const getInitials = (name?: string) => {
    if (!name) return ""
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) return parts[0][0].toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  const formatDisplayName = (name?: string) => {
    if (!name) return ""
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) return parts[0]
    return `${parts[0]} ${parts[parts.length - 1][0]}.`
  }

  return (
    <button
      className={cn(
        "flex items-center gap-3 py-6 mx-4 px-2 overflow-hidden rounded-xl transition-all duration-300 cursor-pointer",
        isCollapsed ? "justify-center" : "hover:bg-state-hover-light dark:hover:bg-[#1c1f29]",
      )}
      onClick={navigateToAccount}
    >
      <Avatar className="relative flex items-center justify-center size-10 shrink-0">
        <AvatarImage
          src={avatarBg}
          alt="Avatar background"
          fetchPriority="high"
          loading="eager"
          decoding="async"
        />
        <span className="absolute text-white text-[13px] font-bold">{getInitials(me?.name)}</span>
      </Avatar>
      <div
        className={cn("flex-col items-start min-w-0 text-left", isCollapsed ? "hidden" : "flex")}
      >
        <span className="font-semibold text-sm whitespace-nowrap text-neutral-700 dark:text-neutral-50">
          {formatDisplayName(me?.name)}
        </span>
        <span className="font-semibold text-xs whitespace-nowrap truncate text-neutral-400 w-full text-left">
          {t("nav.account")}
        </span>
      </div>
    </button>
  )
}
