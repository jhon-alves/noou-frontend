import { ChevronLeft, ChevronRight, Menu, X } from "lucide-react"
import { LanguageToggle } from "../shared/LanguageToggle"
import { BusinessMenu } from "../business/BusinessMenu"
import { useSidebar } from "@/hooks/useSidebar"
import { ThemeToggle } from "../shared/ThemeToggle"
import { InputSeach } from "./InputSearch"
import { cn } from "@/lib/utils"

export function Header() {
  const { isCollapsed, toggleSidebar } = useSidebar()

  return (
    <div className="relative z-50 h-18">
      <div className="h-full flex items-center justify-between gap-2 md:gap-9 px-4 md:px-0">
        {/* ESQUERDA: Hambúrguer e Logo */}
        <div className="flex flex-1 items-center gap-2  md:flex-none md:gap-9">
          {/* BOTÃO HAMBÚRGUER (Apenas Mobile: md:hidden) */}
          <button
            onClick={toggleSidebar}
            className="p-2 mr-2 rounded-xl bg-accent/50 text-[#666f8d] md:hidden"
          >
            {isCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>

          {/* Logo */}
          <div
            className={cn(
              "flex items-center transition-all duration-300 md:pr-2",
              isCollapsed ? "md:w-20 md:pl-7" : "md:w-60 md:pl-7",
            )}
          >
            <div className="flex items-center w-full justify-between">
              <div className="flex items-center shrink-0 min-w-8 h-6">
                <img
                  src={isCollapsed ? "/noou-mini.png" : "/logo.webp"}
                  alt="Noou"
                  className="h-6 w-auto object-contain transition-all duration-300"
                />
              </div>

              <button
                onClick={toggleSidebar}
                className={cn(
                  "p-1.5 rounded-full cursor-pointer hidden md:block text-[#666f8d] dark:text-[#9ca3af]",
                  "hover:text-[#111827] dark:hover:text-white hover:bg-accent transition-all duration-300",
                  isCollapsed ? "ml-2" : "ml-auto",
                )}
                aria-label="Recolher sidebar"
              >
                {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={19} />}
              </button>
            </div>
          </div>
        </div>

        {/* MEIO: SEARCH (Escondido no mobile muito pequeno) */}
        <div className="hidden sm:block flex-1 max-w-full">
          <InputSeach />
        </div>

        {/* DIREITA: Menus */}
        <div className="flex items-center gap-2 md:gap-5 pr-6 ml-auto">
          <BusinessMenu />
          <div className="flex items-center gap-2">
            <LanguageToggle isLogged />
            <ThemeToggle isLogged />
          </div>
        </div>
      </div>
    </div>
  )
}
