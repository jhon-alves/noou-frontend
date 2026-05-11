import { useTranslation } from "react-i18next"
import { useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Bot, File, FileText, Lightbulb, Search } from "lucide-react"
import { useAgentStore } from "@/stores/useAgentStore"
import { useGlobalSearch } from "@/hooks/useGlobalSearch"
import { useSearchStore } from "@/stores/useSearchStore"
import { cn } from "@/lib/utils"

export type SearchResult = {
  id: string
  title: string
  description: string
  type: "agent" | "prompt" | "content"
}

export function InputSeach() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const searchRef = useRef<HTMLDivElement>(null)
  const { setSelectedAgent } = useAgentStore()
  const { search, showResults, setSearch, setShowResults, resetSearch } = useSearchStore()
  const searchResults = useGlobalSearch(search)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "agent":
        return <Bot className="size-5 text-black dark:text-gray-100" />
      case "prompt":
        return <Lightbulb className="size-5 text-black dark:text-gray-100" />
      case "content":
        return <FileText className="size-5 text-black dark:text-gray-100" />
      default:
        return <File className="size-5 text-black dark:text-gray-100" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "agent":
        return t("nav.agent")
      case "prompt":
        return t("prompts.title")
      case "content":
        return t("contents.title")
      default:
        return t("common.other")
    }
  }

  // Expands and collapses the search results
  useEffect(() => {
    setShowResults(search.trim().length > 0)
  }, [search])

  // Clear search store when leaving the current page
  useEffect(() => {
    resetSearch()
  }, [pathname])

  // Clicking outside the search component clears the search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        resetSearch()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Clears states when you press Esc
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") resetSearch()
    }

    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const handleResultClick = (result: SearchResult) => {
    resetSearch()

    if (result.type === "prompt") {
      return navigate(`/prompts/${result.id}`)
    } else if (result.type === "content") {
      return navigate(`/contents/${result.id}`)
    } else if (result.type === "agent") {
      setSelectedAgent({ name: result.title, identifier: result.id })
      navigate("/agent")
      return
    }
  }

  return (
    <div ref={searchRef} className="flex-1 max-w-xl relative">
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666f8d] dark:text-[#9ca3af]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 20 20"
          strokeWidth="1.66667"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.5 3a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM17 17l-3.5-3.5"
          />
        </svg>

        <input
          type="text"
          placeholder={t("global.search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => search && setShowResults(true)}
          className={cn(
            "w-full h-11 pl-12 pr-4 rounded-full",
            "bg-white dark:bg-[#181f2f] text-sm text-[#111827] dark:text-white",
            "placeholder-[#666f8d] dark:placeholder-gray-400 focus:outline-none transition-all",
          )}
          aria-expanded={showResults}
          role="searchbox"
        />
      </div>

      {showResults && searchResults.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-2xl shadow-lg max-h-80 overflow-y-auto z-50 scrollbar"
          role="listbox"
        >
          <div className="p-3 border-b border-border">
            <p className="text-xs text-muted-foreground font-medium">
              {searchResults.length} {t("common.result")}
              {searchResults.length > 1 ? "s" : ""}
            </p>
          </div>
          {searchResults.map((result) => (
            <div
              key={`${result.type}-${result.id}`}
              onClick={() => handleResultClick(result)}
              className="flex items-center gap-3 p-4 hover:bg-muted/50 cursor-pointer transition-colors border-b border-border/50 last:border-b-0"
              role="option"
              tabIndex={0}
              aria-label={`${getTypeLabel(result.type)}: ${result.title} - ${result.description}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  handleResultClick(result)
                }
              }}
            >
              <div className="text-2xl shrink-0">{getTypeIcon(result.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm text-black dark:text-gray-300 truncate">
                    {result.title}
                  </h4>
                  <span className="text-[10px] bg-muted text-muted-foreground font-semibold px-2 py-1 rounded-full shrink-0">
                    {getTypeLabel(result.type)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{result.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {showResults && searchResults.length === 0 && search.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-2xl shadow-lg z-50">
          <div className="p-6 text-center">
            <div className="flex justify-center mb-3">
              <Search className="size-7 text-black dark:text-gray-400" />
            </div>
            <p className="text-sm text-muted-foreground">
              {t("common.no-results")} "{search}"
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
