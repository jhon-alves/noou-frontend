import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { ChevronRight } from "lucide-react"
import { ConversationCard } from "@/components/home/ConversationCard"
import { ResourceCard } from "@/components/home/ResourceCard"
import { PageWrapper } from "@/components/shared/PageWrapper"
import { HeroBanner } from "@/components/home/HeroBanner"
import { Button } from "@/components/ui/button"
import { ContentCard } from "@/components/contents/ContentCard"
import { useSortPrompts } from "./hooks/useSortPrompts"
import { useSortTrainings } from "./hooks/useSortTrainings"
import { useSortSessions } from "./hooks/useSortSessions"
import { PromptCard } from "@/components/prompts/PromptCard"
import { useEffect, useState } from "react"
import { HomeSkeleton } from "@/components/home/HomeSkeleton"
import { useHasBusiness } from "@/hooks/useHasBusiness"

export default function Dashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [visibleItems, setVisibleItems] = useState(3)
  const hasBusiness = useHasBusiness()

  const { data: sortPrompts, isPending: loadingPrompts } = useSortPrompts(hasBusiness)
  const hasPrompts = sortPrompts?.items?.length > 0

  const { data: sortTrainings, isPending: loadingTrainings } = useSortTrainings(hasBusiness)
  const hasTrainings = sortTrainings?.items?.length > 0

  const { data: sortSessions, isPending: loadingSessions } = useSortSessions(hasBusiness)
  const hasSessions = sortSessions?.items?.length > 0

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1800) {
        setVisibleItems(4)
      } else if (window.innerWidth >= 1024 && window.innerWidth < 1800) {
        setVisibleItems(3)
      } else {
        setVisibleItems(2)
      }
    }

    handleResize()

    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <PageWrapper>
      <header className="space-y-2">
        <h1 className="text-xl md:text-[36px] leading-7 md:leading-10 font-bold text-[#111827] dark:text-white">
          {t("dashboard.title")}
        </h1>
        <p className="text-[14px] md:text-[18px] leading-5 md:leading-7 text-[#111827] dark:text-[#9ca3af]">
          {t("dashboard.subtitle")}
        </p>
      </header>

      <HeroBanner />

      {/* Prompts */}
      {loadingPrompts && <HomeSkeleton />}

      {!loadingPrompts && hasPrompts && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-[18px] md:text-[20px] leading-6 md:leading-7 text-black dark:text-white">
              {t("dashboard.promptTitle")}
            </h1>
            <Button
              variant="text"
              className="text-sm font-normal text-black dark:text-white"
              onClick={() => navigate("/prompts")}
            >
              {t("dashboard.showMore")}
              <ChevronRight className="size-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 gap-4 md:gap-6">
            {sortPrompts?.items.slice(0, visibleItems).map((p) => (
              <PromptCard key={p.id} isDash prompt={p} />
            ))}
          </div>
        </div>
      )}

      {/* Sessions */}
      {loadingSessions && <HomeSkeleton />}

      {!loadingSessions && hasSessions && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-[18px] md:text-[20px] leading-6 md:leading-7 text-black dark:text-white">
              {t("dashboard.conversationTitle")}
            </h1>
            <Button
              variant="text"
              className="text-sm font-normal text-black dark:text-white"
              onClick={() => navigate("/agent")}
            >
              {t("dashboard.showMore")}
              <ChevronRight className="size-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 gap-4 md:gap-6">
            {sortSessions?.items
              .filter((session) => session?.summary !== null)
              .slice(0, visibleItems)
              .map((session) => (
                <ConversationCard key={session.session_id} session={session} />
              ))}
          </div>
        </div>
      )}

      {/* Contents */}
      {loadingTrainings && <HomeSkeleton />}

      {!loadingTrainings && hasTrainings && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-[18px] md:text-[20px] leading-6 md:leading-7 text-black dark:text-white">
              {t("dashboard.coursesTitle")}
            </h1>
            <Button
              variant="text"
              className="text-sm font-normal text-black dark:text-white"
              onClick={() => navigate("/contents")}
            >
              {t("dashboard.showMore")}
              <ChevronRight className="size-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 gap-4 md:gap-6">
            {sortTrainings?.items.slice(0, visibleItems).map((content) => (
              <ContentCard key={content.id} content={content} />
            ))}
          </div>
        </div>
      )}

      {/* Others */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-[18px] md:text-[20px] leading-6 md:leading-7 text-black dark:text-white">
            {t("dashboard.buildTitle")}
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-4 md:gap-6">
          <ResourceCard
            title={t("dashboard.helpTitle")}
            description={t("dashboard.helpDesc")}
            tag={t("dashboard.help")}
            category="help"
            onClick={() => navigate("/faq")}
          />
        </div>
      </div>
    </PageWrapper>
  )
}
