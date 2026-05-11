import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { ArrowRight } from "lucide-react"
import { Card, CardDescription, CardTitle } from "../ui/card"
import img from "@/assets/images/knowledge-center-01.png"
import { TrainingItem } from "@/services/contents/types"
import { Chip } from "../shared/Chip"

interface ContentCardProps {
  content: TrainingItem
}

export function ContentCard({ content }: ContentCardProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <Card className="cursor-pointer" onClick={() => navigate(`/contents/${content.group_id}`)}>
      <div className="relative h-29.5">
        <img
          src={img}
          alt="content-background"
          className="absolute inset-0 z-0 w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col flex-1 gap-4 p-6">
        <div className="flex flex-wrap items-center gap-2">
          {content.skills.slice(0, 2).map((skill) => (
            <Chip key={skill.id} label={skill.name} variant="card" size="xs" />
          ))}
          {content.skills.length > 2 && (
            <span className={`text-[11px] dark:text-gray-300 text-[#666f8d]`}>
              +{content.skills.length - 2}
            </span>
          )}
        </div>
        <div className="space-y-2 flex-1">
          <CardTitle>{content.title}</CardTitle>
          <CardDescription className="min-h-10">{content.short_description}</CardDescription>
        </div>

        <button className="flex items-center gap-1.5 self-start bg-black dark:bg-white rounded-full px-3 py-1 cursor-pointer">
          <span className="text-xs text-white dark:text-black leading-5 font-medium">
            {t("contents.start-learning")}
          </span>
          <ArrowRight className="size-4" />
        </button>
      </div>
    </Card>
  )
}
