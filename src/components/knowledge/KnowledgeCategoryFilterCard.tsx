import { LucideIcon } from "lucide-react"

interface Category {
  id: string
  label: string
  count: number
  icon: LucideIcon
}

interface KnowledgeCategoryFilterCardProps {
  category: Category
  selected: string | null
  onChange: (selected: string) => void
}

export function KnowledgeCategoryFilterCard({
  category,
  selected,
  onChange,
}: KnowledgeCategoryFilterCardProps) {
  return (
    <button
      onClick={() => onChange(category.id)}
      className={`p-4 rounded-2xl text-left transition-all cursor-pointer ${
        selected === category.id
          ? "bg-[#111827] dark:bg-white text-white dark:text-[#111827]"
          : "bg-[#f5f5f5] dark:bg-[#262f45] text-[#111827] dark:text-white"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <category.icon className="size-6" />
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full ${
            selected === category.id
              ? "bg-white/20 text-white dark:bg-black/20 dark:text-[#111827]"
              : "bg-[#f9f9f9] dark:bg-[#2d2d38] text-[#666f8d] dark:text-[#9ca3af]"
          }`}
        >
          {category.count}
        </span>
      </div>
      <p
        className={`text-sm font-semibold ${
          selected === category.id
            ? "text-white dark:text-[#111827]"
            : "text-[#111827] dark:text-white"
        }`}
      >
        {category.label}
      </p>
    </button>
  )
}
