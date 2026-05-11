import i18n from "@/i18n"
import { useState, useRef, useEffect } from "react"
import { Check, ChevronDown, X } from "lucide-react"
import { useThemeStore } from "@/stores/useThemeStore"

export interface SelectOption {
  id: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
  count?: number
}

interface MultiSelectProps {
  label?: string
  options?: SelectOption[]
  selectedIds?: string[]
  onChange: (selectedIds: string[]) => void
  onBlur?: () => void
  placeholder?: string
  className?: string
}

export function MultiSelect({
  label,
  options,
  selectedIds,
  onChange,
  onBlur,
  placeholder = i18n.t("common.select"),
  className = "",
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme } = useThemeStore()
  const isDarkMode = theme === "dark"

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        onBlur?.()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const toggleOption = (optionId: string) => {
    if (selectedIds.includes(optionId)) {
      onChange(selectedIds.filter((id) => id !== optionId))
    } else {
      onChange([...selectedIds, optionId])
    }
  }

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange([])
    onBlur?.()
  }

  const selectedOptions = options.filter((opt) => selectedIds.includes(opt.id))
  const hasSelection = selectedIds.length > 0

  const getDisplayText = () => {
    if (selectedIds.length === 0) return placeholder
    // If only "all" is selected, show placeholder
    if (selectedIds.length === 1 && selectedIds[0] === "all") return placeholder
    if (selectedIds.length === 1) return selectedOptions[0].label
    if (selectedIds.length === options.length) return i18n.t("common.all")
    return `${selectedIds.length} ${i18n.t("common.selected")}`
  }

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Label */}
      {label && (
        <label className="block mb-2 font-semibold text-[14px] dark:text-[#E5E5E5] text-gray-900">
          {label}
        </label>
      )}

      {/* Select Trigger */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen)
          if (isOpen) onBlur?.()
        }}
        className={`
          w-full h-12 px-4 rounded-full 
          flex items-center justify-between gap-2
          transition-all duration-200
          text-[14px] border border-[#9ca3af]/20 bg-background
          dark:text-[#E5E5E5] text-gray-900 cursor-pointer
          ${isOpen ? "border-[#B40064] shadow-[0_0_0_2px_rgba(180,0,100,0.1)]" : ""}
        `}
      >
        <span
          className={`flex-1 text-left truncate " ${
            hasSelection ? "text-[#2d2d38] dark:text-white" : "text-[#9ca3af]"
          }`}
        >
          {getDisplayText()}
        </span>

        <div className="flex items-center gap-1">
          {hasSelection && (
            <div
              onClick={clearSelection}
              className={`p-1 rounded-md transition-colors cursor-pointer dark:hover:bg-[#404040] hover:bg-gray-1`}
              aria-label="Limpar seleção"
            >
              <X className="w-3.5 h-3.5" />
            </div>
          )}
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`
            absolute z-50 mt-2 w-full rounded-2xl border shadow-xl
            overflow-hidden dark:bg-[#2A2A2A] dark:border-[#404040] bg-white border-[#e7e7e7]
          `}
          style={{
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          <div className="max-h-70 overflow-y-auto py-2">
            {options.map((option) => {
              const isSelected = selectedIds.includes(option.id)
              const Icon = option.icon

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => toggleOption(option.id)}
                  className={`
                    w-full px-4 py-3 flex items-center gap-3
                    transition-colors duration-150  text-[14px] cursor-pointer
                    dark:hover:bg-[#333333] dark:text-[#E5E5E5] hover:bg-gray-50 text-gray-900
                    ${isSelected ? (isDarkMode ? "bg-[#B40064]/10" : "bg-[#B40064]/5") : ""}
                  `}
                >
                  {/* Checkbox */}
                  <div
                    className={`
                    w-5 h-5 rounded-md border-2 flex items-center justify-center
                    transition-all duration-150
                    ${
                      isSelected
                        ? "bg-[#B40064] border-[#B40064]"
                        : isDarkMode
                          ? "border-[#404040] bg-transparent"
                          : "border-[#e7e7e7] bg-transparent"
                    }
                  `}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                  </div>

                  {/* Icon (if provided) */}
                  {Icon && <Icon className="w-4 h-4 dark:text-[#B3B3B3] text-[#666f8d]" />}

                  {/* Label */}
                  <span className="flex-1 text-left">{option.label}</span>

                  {/* Count (if provided) */}
                  {option.count !== undefined && (
                    <span className="text-[12px] dark:text-[#808080] text-[#666f8d]">
                      {option.count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
