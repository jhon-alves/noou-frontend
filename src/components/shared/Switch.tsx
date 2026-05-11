import React from "react"
import { Check, X, LucideIcon } from "lucide-react"

export type NoouSwitchVariant = "filled" | "secondary" | "outlined"
export type NoouSwitchSize = "small" | "medium" | "large"

interface NoouSwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  variant?: NoouSwitchVariant
  size?: NoouSwitchSize
  showIcon?: boolean
  checkedIcon?: LucideIcon
  uncheckedIcon?: LucideIcon
  disabled?: boolean
  className?: string
}

export const Switch: React.FC<NoouSwitchProps> = ({
  checked,
  onChange,
  variant = "filled",
  size = "medium",
  showIcon = false,
  checkedIcon: CheckedIcon,
  uncheckedIcon: UncheckedIcon,
  disabled = false,
  className = "",
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return {
          track: "w-[40px] h-[24px]",
          thumb: "w-[18px] h-[18px]",
          thumbTranslate: checked ? "translate-x-[16px]" : "translate-x-[3px]",
          icon: "w-3 h-3",
        }
      case "large":
        return {
          track: "w-[64px] h-[36px]",
          thumb: "w-[30px] h-[30px]",
          thumbTranslate: checked ? "translate-x-[28px]" : "translate-x-[3px]",
          icon: "w-5 h-5",
        }
      case "medium":
      default:
        return {
          track: "w-[52px] h-[28px]",
          thumb: "w-[22px] h-[22px]",
          thumbTranslate: checked ? "translate-x-[26px]" : "translate-x-[3px]",
          icon: "w-4 h-4",
        }
    }
  }

  const sizeClasses = getSizeClasses()

  const getTrackClasses = () => {
    if (disabled) {
      return checked
        ? "bg-gray-300 dark:bg-gray-600"
        : "bg-gray-200 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600"
    }

    if (variant === "filled") {
      return checked ? "bg-[#111827]" : "bg-gray-300 dark:bg-gray-600"
    } else if (variant === "secondary") {
      return checked ? "bg-[#B40064]" : "bg-gray-300 dark:bg-gray-600"
    }

    // outlined variant
    return checked
      ? "bg-transparent border-2 border-[#6B5B5B] dark:border-[#8B7B7B]"
      : "bg-transparent border-2 border-gray-400 dark:border-gray-500"
  }

  const getThumbClasses = () => {
    if (disabled) {
      return "bg-white dark:bg-gray-300"
    }

    if (variant === "filled") {
      return "bg-white shadow-md"
    } else if (variant === "secondary") {
      return "bg-white shadow-md"
    }

    // outlined variant
    return checked
      ? "bg-[#6B5B5B] dark:bg-[#8B7B7B] shadow-md"
      : "bg-gray-400 dark:bg-gray-500 shadow-md"
  }

  const renderIcon = () => {
    if (!showIcon) return null

    // Se ícones customizados forem fornecidos, use-os
    if (CheckedIcon && UncheckedIcon) {
      const IconComponent = checked ? CheckedIcon : UncheckedIcon
      const iconColor =
        variant === "filled" ? (checked ? "text-[#B40064]" : "text-gray-500") : "text-white"
      return <IconComponent className={`${sizeClasses.icon} ${iconColor} stroke-[2.5]`} />
    }

    // Comportamento padrão
    const iconColor = variant === "filled" ? "text-white" : "text-white"

    if (variant === "filled" && checked) {
      return <Check className={`${sizeClasses.icon} ${iconColor} stroke-3`} />
    }

    if (variant === "outlined" && !checked) {
      return <X className={`${sizeClasses.icon} ${iconColor} stroke-3`} />
    }

    return null
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`
        ${sizeClasses.track}
        relative
        inline-flex
        items-center
        rounded-full
        transition-all
        duration-300
        ease-in-out
        ${getTrackClasses()}
        ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
        focus:outline-none
        dark:focus:ring-offset-gray-900
        ${className}
      `}
    >
      {/* Thumb */}
      <span
        className={`
          ${sizeClasses.thumb}
          ${sizeClasses.thumbTranslate}
          inline-flex
          items-center
          justify-center
          rounded-full
          transition-all
          duration-300
          ease-in-out
          ${getThumbClasses()}
        `}
      >
        {renderIcon()}
      </span>
    </button>
  )
}
