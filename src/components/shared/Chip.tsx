import { X, LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export type ChipVariant = "default" | "filter" | "card"
export type ChipSize = "sm" | "md" | "xs"

interface ChipProps {
  label: string
  variant?: ChipVariant
  size?: ChipSize
  selected?: boolean
  disabled?: boolean
  leadingIcon?: LucideIcon
  trailingIcon?: LucideIcon
  avatar?: string
  avatarFallback?: string
  onRemove?: () => void
  onClick?: () => void
  className?: string
}

export function Chip({
  label,
  variant = "filter",
  size = "md",
  selected = false,
  disabled = false,
  leadingIcon: LeadingIcon,
  trailingIcon: TrailingIcon,
  avatar,
  avatarFallback,
  onRemove,
  onClick,
  className,
}: ChipProps) {
  const isClickable = !!onClick
  const isRemovable = !!onRemove

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!disabled && onRemove) {
      onRemove()
    }
  }

  // Tamanho do ícone baseado no size
  const iconSize = size === "xs" ? "w-3 h-3" : size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"

  // Cor do ícone leading (rosa quando selecionado ou para variantes específicas)
  const leadingIconColor =
    selected || variant === "filter"
      ? "text-[#B40064] dark:text-[#FF66B2]"
      : "text-gray-600 dark:text-[#808080]"

  return (
    <div
      onClick={() => !disabled && onClick?.()}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable && !disabled ? 0 : undefined}
      aria-disabled={disabled}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border transition-all duration-200 select-none",
        size === "xs" && "px-2 py-0.5 text-[11px]",
        size === "sm" && "px-3 py-1 text-xs",
        size === "md" && "px-4 py-2 text-xs h-8.25",
        disabled && "opacity-50 cursor-not-allowed",
        className,
        variant === "filter" &&
          (selected
            ? `bg-[#111827] dark:bg-white border-[#111827] dark:border-white text-white  dark:text-[#111827] ${!disabled ? "cursor-pointer" : ""}`
            : `bg-transparent border-[#111827] dark:border-white text-[#111827] dark:text-white ${!disabled ? "hover:bg-gray-50 dark:hover:bg-[#333333] cursor-pointer" : ""}`),
        variant === "card" &&
          "bg-transparent border-[#666f8d] dark:border-gray-500 text-[#666f8d] dark:text-gray-300",
      )}
    >
      {avatar && (
        <div
          className={cn(
            size === "sm" ? "w-5 h-5" : "w-6 h-6",
            "rounded-full overflow-hidden shrink-0",
          )}
        >
          <img
            src={avatar}
            alt={label}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback se imagem não carregar
              e.currentTarget.style.display = "none"
            }}
          />
        </div>
      )}

      {!avatar && avatarFallback && (
        <div
          className={cn(
            size === "sm" ? "w-5 h-5 text-[10px]" : "w-6 h-6 text-xs",
            "rounded-full bg-gray-300 dark:bg-[#404040] flex items-center justify-center",
            "text-gray-700 dark:text-[#E5E5E5] shrink-0 font-medium",
          )}
        >
          {avatarFallback}
        </div>
      )}

      {LeadingIcon && !avatar && !avatarFallback && (
        <LeadingIcon className={cn(iconSize, leadingIconColor, "shrink-0")} />
      )}

      <span className="whitespace-nowrap">{label}</span>

      {TrailingIcon && !isRemovable && (
        <TrailingIcon className={cn(iconSize, "text-gray-600 dark:text-[#808080] shrink-0")} />
      )}

      {isRemovable && (
        <button
          onClick={handleRemoveClick}
          disabled={disabled}
          className={cn(
            iconSize,
            "shrink-0 text-gray-600 dark:text-[#808080] hover:text-gray-900",
            "dark:hover:text-[#E5E5E5] transition-colors",
            disabled ? "cursor-not-allowed" : "cursor-pointer",
          )}
          aria-label="Remover"
          tabIndex={-1}
        >
          <X className={iconSize} />
        </button>
      )}
    </div>
  )
}
