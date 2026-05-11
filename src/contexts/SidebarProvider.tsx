import React, { useState } from "react"
import { SidebarContext } from "./sidebar-context"

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768
    }
    return false
  })

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  )
}
