import { LucideIcon } from "lucide-react"

interface ContentProgressCardProps {
  training: {
    title: string
    category: string
    level: string
    duration: string
    modules: number
    students: number
    rating: number
    progress: number
    thumbnail: LucideIcon
    color: string
  }
}

export function ContentProgressCard({ training }: ContentProgressCardProps) {
  return (
    <div className="bg-[#f9fafb] dark:bg-[#262f45] rounded-3xl p-6 cursor-pointer">
      <div className="flex gap-4">
        <div
          className="w-16 h-16 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${training.color}15` }}
        >
          <training.thumbnail className="w-8 h-8" style={{ color: training.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[#111827] dark:text-white mb-1 truncate">
            {training.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-[#666f8d] dark:text-[#9ca3af] mb-3">
            <span>{training.modules} modules</span>
            <span>•</span>
            <span>{training.duration}</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#666f8d] dark:text-[#9ca3af]">Progress</span>
              <span className="font-semibold text-[#111827] dark:text-white">
                {training.progress}%
              </span>
            </div>
            <div className="w-full h-2 bg-[#e3e6ea] dark:bg-[#2d2d38] rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-[#4210b1] to-[#aa0057] transition-all"
                style={{ width: `${training.progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
