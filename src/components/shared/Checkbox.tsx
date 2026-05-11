import React from "react"
import { Check, Minus } from "lucide-react"

export type NoouCheckboxVariant = "filled" | "outlined"
export type NoouCheckboxSize = "small" | "medium" | "large"
export type NoouCheckboxShape = "square" | "rounded"
export type NoouCheckboxState = "unchecked" | "checked" | "indeterminate"

interface NoouCheckboxProps {
  checked?: boolean
  indeterminate?: boolean
  onChange?: (checked: boolean) => void
  variant?: NoouCheckboxVariant
  size?: NoouCheckboxSize
  shape?: NoouCheckboxShape
  disabled?: boolean
  className?: string
  id?: string
  name?: string
  value?: string
}

export const Checkbox: React.FC<NoouCheckboxProps> = ({
  checked = false,
  indeterminate = false,
  onChange,
  variant = "filled",
  size = "medium",
  shape = "rounded",
  disabled = false,
  className = "",
  id,
  name,
  value,
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return {
          container: "w-[18px] h-[18px]",
          icon: "w-3 h-3",
        }
      case "large":
        return {
          container: "w-[28px] h-[28px]",
          icon: "w-5 h-5",
        }
      case "medium":
      default:
        return {
          container: "w-[24px] h-[24px]",
          icon: "w-4 h-4",
        }
    }
  }

  const sizeClasses = getSizeClasses()

  const getShapeClasses = () => {
    switch (shape) {
      case "square":
        return "rounded-[4px]"
      case "rounded":
      default:
        return "rounded-[6px]"
    }
  }

  const getCheckboxClasses = () => {
    if (disabled) {
      // Estado disabled
      if (checked || indeterminate) {
        return variant === "filled"
          ? "bg-gray-300 dark:bg-gray-600 border-none"
          : "bg-transparent border-2 border-gray-300 dark:border-gray-600"
      }
      return "bg-transparent border-2 border-gray-300 dark:border-gray-600"
    }

    if (variant === "filled") {
      // Variante filled
      if (checked || indeterminate) {
        return "bg-brand-primary-200 border-none hover:bg-brand-primary-200/80"
      }
      return "bg-transparent border-2 border-gray-400 dark:border-gray-500 hover:border-gray-500 dark:hover:border-gray-400"
    }

    // Variante outlined
    if (checked || indeterminate) {
      return "bg-transparent border-2 border-brand-primary-200 hover:border-brand-primary-200/80"
    }
    return "bg-transparent border-2 border-gray-400 dark:border-gray-500 hover:border-gray-500 dark:hover:border-gray-400"
  }

  const getIconColor = () => {
    if (disabled) {
      return "text-gray-400 dark:text-gray-500"
    }

    if (variant === "filled") {
      return "text-white"
    }

    // outlined variant
    return "text-brand-primary-200"
  }

  const handleClick = () => {
    if (!disabled && onChange) {
      onChange(!checked)
    }
  }

  const renderIcon = () => {
    if (!checked && !indeterminate) return null

    if (indeterminate) {
      return <Minus className={`${sizeClasses.icon} ${getIconColor()} stroke-3`} strokeWidth={3} />
    }

    if (checked) {
      return <Check className={`${sizeClasses.icon} ${getIconColor()} stroke-3`} strokeWidth={3} />
    }

    return null
  }

  return (
    <div className="inline-flex items-center">
      <button
        type="button"
        role="checkbox"
        aria-checked={indeterminate ? "mixed" : checked}
        disabled={disabled}
        onClick={handleClick}
        id={id}
        data-name={name}
        data-value={value}
        className={`
          noou-checkbox
          ${sizeClasses.container}
          ${getShapeClasses()}
          relative
          inline-flex
          items-center
          justify-center
          transition-all
          duration-200
          ease-in-out
          ${getCheckboxClasses()}
          ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
          dark:focus:ring-offset-gray-900
          ${className}
        `}
      >
        {renderIcon()}
      </button>
    </div>
  )
}
