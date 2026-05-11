import { LucideIcon } from "lucide-react"

interface KnowledgeStatsCardProps {
  stat: {
    id: number
    icon: LucideIcon
    title: string
    value: number | string
  }
}

export function KnowledgeStatsCard({ stat }: KnowledgeStatsCardProps) {
  return (
    <div className="p-6 bg-[#f5f5f5] dark:bg-[#262f45] rounded-2xl">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-white dark:bg-[#2d2d38] rounded-full flex items-center justify-center">
          <stat.icon className="size-5 text-[#111827] dark:text-white" />
        </div>
        <div>
          <p className="text-sm text-[#666f8d] dark:text-[#9ca3af]">{stat.title}</p>
          <p className="text-2xl font-bold text-[#111827] dark:text-white">{stat.value}</p>
        </div>
      </div>
    </div>
  )
}
