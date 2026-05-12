import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { LogOut } from "lucide-react"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { authServices } from "@/services"
import { useMeStore } from "@/stores/meStore"
import { useBusinessStore } from "@/stores/useBusinessStore"
import { useSidebar } from "@/hooks/useSidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import { CURRENT_VERSION } from "../../../version"
import { cn } from "@/lib/utils"

export function SidebarFooter() {
  const { t } = useTranslation()
  const qc = useQueryClient()
  const navigate = useNavigate()
  const { clearMe } = useMeStore()
  const { clearBusiness } = useBusinessStore()
  const { isCollapsed, toggleSidebar } = useSidebar()
  const isMobile = useIsMobile()

  const { isPending, mutateAsync } = useMutation({
    mutationFn: () => authServices.logout(),
  })

  const handleLogout = async () => {
    await mutateAsync()
    clearBusiness()
    clearMe()
    qc.clear()
    navigate("/")
  }

  const navigateToPrivacy = () => {
    if (isMobile) toggleSidebar()
    navigate("/privacy-policy")
  }

  return (
    <div className="flex flex-col gap-3 w-full py-4 px-4 border-t border-state-pressed-light dark:border-[#1c1f29] shrink-0">
      <AlertDialog>
        <AlertDialogTrigger
          onClick={() => isMobile && toggleSidebar()}
          className={cn(
            "flex items-center rounded-full h-10 py-2.5 cursor-pointer px-3 text-sm font-medium shrink-0",
            "text-neutral-700 dark:text-neutral-50 transition-colors duration-300",
            "bg-transparent hover:bg-state-hover-light dark:hover:bg-[#1c1f29]",
            isCollapsed ? "justify-center" : "justify-start gap-3 w-full",
          )}
        >
          <LogOut size={18} className="shrink-0" />
          {!isCollapsed && <span className="text-sm font-medium">{t("nav.logout")}</span>}
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

      {!isCollapsed && (
        <div className="flex flex-col gap-1 pb-2">
          <button
            className={cn(
              "w-fit h-10 py-2 text-left text-neutral-700 dark:text-neutral-400 underline cursor-pointer",
            )}
            onClick={navigateToPrivacy}
          >
            <span className="text-sm font-medium truncate whitespace-pre-wrap">
              {t("nav.privacy")}
            </span>
          </button>
          <span className="text-neutral-400 text-[10px]">© 2026 Noou - AI Ready, by design.</span>
          <span className="text-neutral-400 text-[9px]">{CURRENT_VERSION}</span>
        </div>
      )}
    </div>
  )
}
