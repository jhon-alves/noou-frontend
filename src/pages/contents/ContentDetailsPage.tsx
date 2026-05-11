import dayjs from "dayjs"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { PageHeader } from "@/components/shared/PageHeader"
import { PageWrapper } from "@/components/shared/PageWrapper"
import { useGetTrainingById } from "./hooks/useGetTrainingById"
import { Play } from "lucide-react"
import { Chip } from "@/components/shared/Chip"
import { useTranslation } from "react-i18next"
import { PageLoader } from "@/components/shared/PageLoader"

export default function ContentDetailsPage() {
  const { t } = useTranslation()
  const { contentId } = useParams()
  const [playVideo, setPlayVideo] = useState(false)

  const { data: training, isPending: loadingTrainingDetails } = useGetTrainingById(contentId)

  if (!training || loadingTrainingDetails) return <PageLoader />

  // Extrai ID do YouTube
  const getYoutubeId = (url: string) => {
    const regExp = /(?:youtube\.com\/.*v=|youtu\.be\/)([^&]+)/
    const match = url.match(regExp)
    return match?.[1]
  }

  const videoId = training.video_url ? getYoutubeId(training.video_url) : null

  const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null

  return (
    <PageWrapper>
      <PageHeader
        title={t("contents.content-details")}
        breadcrumbs={[
          { label: t("nav.home"), href: "/dashboard" },
          { label: t("contents.title"), href: "/contents" },
          { label: t("contents.content-details") },
        ]}
      />

      <div className="max-w-6xl mx-auto px-6 md:px-10 space-y-8 pb-8 pt-0">
        {videoId && (
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-lg">
            {!playVideo ? (
              <button
                onClick={() => setPlayVideo(true)}
                className="group relative w-full h-full cursor-pointer"
              >
                {/* Thumbnail */}
                <img src={thumbnail!} alt={training.title} className="w-full h-full object-cover" />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition group-hover:bg-black/50">
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-xl group-hover:scale-110 transition">
                    <Play size={28} className="text-black ml-1" fill="black" />
                  </div>
                </div>
              </button>
            ) : (
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title={training.title}
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="w-full h-full"
              />
            )}
          </div>
        )}

        {/* Título */}
        <div className="space-y-4">
          <h1 className="font-bold text-[24px] md:text-[28px] text-[#111827] dark:text-white leading-[1.2]">
            {training.title}
          </h1>

          {/* Tags */}
          {training.skills && training.skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {training.skills.map((tag) => (
                <Chip key={tag.id} label={tag.name} variant="card" size="sm" />
              ))}
            </div>
          )}
        </div>

        {/* Detalhes */}
        <div className="space-y-8">
          <div className="space-y-3">
            <h2 className="font-bold text-[14px] text-[#111827] dark:text-white tracking-wide">
              {t("common.description")}
            </h2>
            <p className="text-[15px] text-[#666f8d] dark:text-[#9ca3af] leading-[1.7]">
              {training.long_description}
            </p>
          </div>
        </div>

        {/* Autor */}
        {training?.author && (
          <div className="pt-6 border-t border-[#e5e7eb] dark:border-[#374151]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#f5f5f5] dark:bg-[#262f45] flex items-center justify-center">
                <span className="font-semibold text-[14px] text-[#111827] dark:text-white">
                  {training.author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </span>
              </div>
              <div>
                <p className="text-[13px] text-[#666f8d] dark:text-[#9ca3af]">
                  {dayjs(training.created).format("DD/MM/YYYY")}
                </p>
                <p className="font-semibold text-[14px] text-[#111827] dark:text-white">
                  {training.author}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
