import { useState, useRef, useEffect } from "react"
import { ChevronDown, Filter, X } from "lucide-react"
import i18n from "@/i18n"

export interface SelectOption {
  id: string
  label: string
  count?: number
}

interface PromptFilterMenuProps {
  options?: SelectOption[]
  selectedId?: string
  onChange: (selectedIds: string) => void
  onBlur?: () => void
  placeholder?: string
  className?: string
}

export function PromptFilterMenu({
  options = [],
  selectedId,
  onChange,
  onBlur,
  placeholder = i18n.t("common.select"),
  className = "",
}: PromptFilterMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

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

  const selectOption = (optionId: string) => {
    onChange(optionId)
    setIsOpen(false)
    onBlur?.()
  }

  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(undefined)
    onBlur?.()
  }

  const selectedOption = options.find((opt) => opt.id === selectedId)
  const hasSelection = !!selectedId

  const getDisplayText = () => {
    if (!hasSelection) return placeholder
    return selectedOption?.label ?? placeholder
  }

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => {
          setIsOpen((prev) => {
            const next = !prev
            if (!next) onBlur?.()
            return next
          })
        }}
        className={`
          flex items-center justify-between gap-2 w-full h-10 px-4 rounded-full 
          border border-[#111827] dark:border-white bg-transparent
          text-sm dark:text-[#E5E5E5] text-gray-900
          transition-all duration-200 cursor-pointer
        `}
      >
        <Filter className="text-black dark:text-white size-4" />
        <span className="flex-1 text-left truncate text-[#2d2d38] dark:text-white">
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

      {isOpen && (
        <div
          className={`
            absolute z-50 mt-2 rounded-2xl border shadow-xl w-70
            overflow-hidden bg-foreground dark:border-[#404040] border-[#e7e7e7]
          `}
          style={{
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          <div className="min-h-70 max-h-80 overflow-y-auto py-2">
            {options.map((option) => {
              const isSelected = selectedId === option.id

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => selectOption(option.id)}
                  className={`
                    w-full px-4 py-3 flex items-center gap-3
                    transition-colors duration-150  text-[14px] cursor-pointer
                    dark:hover:bg-white/15 dark:text-[#E5E5E5] hover:bg-black/15 text-gray-900
                    ${isSelected ? "dark:bg-white/15 bg-black/15" : ""}
                  `}
                >
                  <span className="flex-1 text-left">{option.label}</span>

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
