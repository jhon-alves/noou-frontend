import i18n from "@/i18n"
import React, { useState, InputHTMLAttributes } from "react"
import { Search } from "lucide-react"
import { useThemeStore } from "@/stores/useThemeStore"

export interface NoouSearchBarProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** Texto do placeholder */
  placeholder?: string
  /** Valor do input */
  value?: string
  /** Callback quando o valor muda */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  /** Mostra avatar com inicial */
  showAvatar?: boolean
  /** Inicial do avatar (1 letra) */
  avatarInitial?: string
  /** ClassName adicional */
  className?: string
}

/**
 * NoouSearchBar - Componente de barra de busca do Design System Noou
 *
 * @example
 * // Busca simples
 * <NoouSearchBar
 *   placeholder="Buscar métodos..."
 *   value={query}
 *   onChange={(e) => setQuery(e.target.value)}
 * />
 *
 * @example
 * // Com avatar
 * <NoouSearchBar
 *   placeholder="Buscar prompts..."
 *   showAvatar
 *   avatarInitial="A"
 *   onMenuClick={() => console.log('Menu clicked')}
 * />
 */
export const SearchBar = React.forwardRef<HTMLInputElement, NoouSearchBarProps>(
  (
    {
      placeholder = i18n.t("common.search"),
      value,
      onChange,
      showAvatar = false,
      avatarInitial = "A",
      className = "",
      ...props
    },
    ref,
  ) => {
    const { theme } = useThemeStore()
    const [isHovered, setIsHovered] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const isDarkMode = theme === "dark"

    return (
      <div
        className={`relative flex items-center gap-3 pl-4 pr-2 h-12 rounded-full transition-all ${
          isDarkMode
            ? `${
                isFocused ? "bg-[#3A3A3A] shadow-lg" : isHovered ? "bg-[#333333]" : "bg-[#2A2A2A]"
              }`
            : `${
                isFocused ? "bg-[#D5D5D5] shadow-md" : isHovered ? "bg-[#E0E0E0]" : "bg-[#EBEBEB]"
              }`
        } ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Input */}
        <input
          ref={ref}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`flex-1 bg-transparent border-none outline-none text-[14px] ${
            isDarkMode
              ? "text-[#E5E5E5] placeholder:text-[#666666]"
              : "text-[#1A1A1A] placeholder:text-[#999999]"
          }`}
          {...props}
        />

        {/* Search Button - Padrão Noou */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            // Trigger search functionality
            if (props.onKeyDown) {
              const enterEvent = new KeyboardEvent("keydown", { key: "Enter" })
              props.onKeyDown(enterEvent as any)
            }
          }}
          className="shrink-0 w-9 h-9 min-w-9 rounded-full bg-black dark:bg-white hover:bg-[#9A0054] active:bg-[#800045] flex items-center justify-center transition-all duration-200 hover:scale-[1.05] active:scale-95"
        >
          <Search className="w-4 h-4 min-w-4 text-white dark:text-black" />
        </button>

        {/* Avatar (opcional) */}
        {showAvatar && (
          <div className="shrink-0 w-8 h-8 rounded-full bg-foreground dark:bg-white flex items-center justify-center">
            <span className="text-white font-semibold text-[14px]">
              {avatarInitial.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
    )
  },
)

SearchBar.displayName = "SearchBar"
