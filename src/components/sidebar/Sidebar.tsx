import { X } from "lucide-react"
import { useSidebar } from "@/hooks/useSidebar"
import { SidebarHeader } from "./SidebarHeader"
import { SidebarFooter } from "./SidebarFooter"
import { SidebarNav } from "./SidebarNav"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const { isCollapsed, toggleSidebar } = useSidebar()

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-50 md:relative md:translate-x-0 inset-y-0 bg-background",
        "transition-all duration-300 overflow-y-auto scrollbar-hide",
        isCollapsed ? "-translate-x-full w-20" : "translate-x-0 w-60",
      )}
      aria-label="Menu principal de navegação"
    >
      <div className="flex items-center justify-between p-4 md:hidden">
        <img src="/logo.webp" alt="Noou" className="h-6 w-auto object-contain" />
        <button onClick={toggleSidebar} className="p-2 text-[#666f8d]">
          <X size={20} />
        </button>
      </div>

      <div className="flex flex-col h-full justify-between bg-background">
        <div className="flex-1 overflow-y-auto min-h-0 flex flex-col gap-4">
          <SidebarHeader />
          <SidebarNav />
        </div>
        <SidebarFooter />
      </div>
    </aside>
  )
}
