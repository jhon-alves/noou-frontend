import React from "react"
import { LucideIcon } from "lucide-react"

export interface NoouTab {
  id: string
  label?: string
  icon?: LucideIcon
  disabled?: boolean
}

export type NoouTabsVariant = "text-only" | "icon-text" | "icon-only"
export type NoouTabsSize = "small" | "medium" | "large"

interface TabsProps {
  tabs: NoouTab[]
  activeTab: string
  onTabChange: (tabId: string) => void
  variant?: NoouTabsVariant
  size?: NoouTabsSize
  className?: string
  fullWidth?: boolean
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  variant = "text-only",
  size = "medium",
  className = "",
  fullWidth = false,
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return {
          container: "gap-4",
          tab: "px-3 py-2",
          text: "text-sm",
          icon: "w-4 h-4",
          iconGap: "gap-1.5",
        }
      case "large":
        return {
          container: "gap-8",
          tab: "px-6 py-4",
          text: "text-lg",
          icon: "w-6 h-6",
          iconGap: "gap-3",
        }
      case "medium":
      default:
        return {
          container: "gap-6",
          tab: "px-4 py-3",
          text: "text-sm",
          icon: "w-4 h-4",
          iconGap: "gap-2",
        }
    }
  }

  const sizeClasses = getSizeClasses()

  const renderTabContent = (tab: NoouTab) => {
    const Icon = tab.icon

    if (variant === "icon-only" && Icon) {
      return <Icon className={sizeClasses.icon} />
    }

    if (variant === "icon-text" && Icon) {
      return (
        <>
          <Icon className={sizeClasses.icon} />
          {tab.label && <span>{tab.label}</span>}
        </>
      )
    }

    // text-only
    return <span>{tab.label}</span>
  }

  return (
    <div
      className={`flex items-center border-b border-gray-300 dark:border-gray-800 ${
        fullWidth ? "w-full" : ""
      } ${sizeClasses.container} ${className}`}
      role="tablist"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab
        const isDisabled = tab.disabled

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-disabled={isDisabled}
            disabled={isDisabled}
            onClick={() => !isDisabled && onTabChange(tab.id)}
            className={`
              flex items-center justify-center relative cursor-pointer
              ${sizeClasses.tab}
              ${variant === "icon-text" ? sizeClasses.iconGap : ""}
              ${sizeClasses.text}
              transition-all duration-200
              ${fullWidth ? "flex-1" : ""}
              ${
                isActive
                  ? "text-[#111827] dark:text-white font-medium"
                  : isDisabled
                    ? "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                    : "text-gray-600 dark:text-[#9ca3af] hover:text-[#111827] dark:hover:text-white"
              }
            `}
          >
            {renderTabContent(tab)}

            {/* Active Indicator - Underline */}
            <div
              className={`
                absolute bottom-0 left-0 right-0 h-0.5px
                transition-all duration-200
                ${isActive ? "bg-white scale-x-100" : "bg-transparent scale-x-0"}
              `}
            />
          </button>
        )
      })}
    </div>
  )
}
