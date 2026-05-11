import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Inbox } from "lucide-react"
// import { ContentProgressCard } from "@/components/contents/ContentProgressCard"
import { ContentSkeleton } from "@/components/contents/ContentSkeleton"
import { useGetTrainingSkills } from "./hooks/useGetTrainingSkills"
import { ContentCard } from "@/components/contents/ContentCard"
import { PageWrapper } from "@/components/shared/PageWrapper"
import { PageHeader } from "@/components/shared/PageHeader"
import { useGetTrainings } from "./hooks/useGetTrainings"
import { Chip } from "@/components/shared/Chip"
import { DataPagination } from "@/components/shared/DataPagination"

export default function ContentsPage() {
  const { t } = useTranslation()
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const { data: skills } = useGetTrainingSkills()
  const { data: trainings, isPending: loadingTrainings } = useGetTrainings({
    page,
    page_size: rowsPerPage,
  })

  if (!skills || !trainings || loadingTrainings) return <ContentSkeleton />

  const categories = [
    { id: "all", name: "All" },
    ...skills.map((item) => ({ id: item.id, name: item.name })),
  ]

  // const ongoingTrainings = [
  //   {
  //     title: "UX Design Fundamentals",
  //     category: "design",
  //     level: "Beginner",
  //     duration: "4h 30min",
  //     modules: 12,
  //     students: 1234,
  //     rating: 4.8,
  //     progress: 0,
  //     thumbnail: Palette,
  //     color: "#8B5CF6",
  //   },
  //   {
  //     title: "Advanced React",
  //     category: "development",
  //     level: "Advanced",
  //     duration: "8h 15min",
  //     modules: 24,
  //     students: 2341,
  //     rating: 4.9,
  //     progress: 45,
  //     thumbnail: Atom,
  //     color: "#3B82F6",
  //   },
  //   {
  //     title: "TypeScript from Zero",
  //     category: "development",
  //     level: "Beginner",
  //     duration: "7h 20min",
  //     modules: 20,
  //     students: 2890,
  //     rating: 4.8,
  //     progress: 78,
  //     thumbnail: BookOpen,
  //     color: "#06B6D4",
  //   },
  // ]

  const filteredTrainings = (trainings?.items ?? []).filter((training) => {
    const matchesCategory =
      selectedCategory === "All" ||
      (training?.skills ?? []).some((skill) => skill.name === selectedCategory)
    return matchesCategory
  })
  const hasTrainings = filteredTrainings.length > 0

  // const inProgress = ongoingTrainings.filter((t) => t.progress > 0)

  return (
    <PageWrapper>
      <PageHeader
        title={t("contents.title")}
        subtitle={t("contents.subtitle")}
        breadcrumbs={[{ label: t("nav.home"), href: "/dashboard" }, { label: t("contents.title") }]}
      />

      <div className="flex gap-2 flex-wrap pb-2">
        {categories.map((category) => (
          <Chip
            key={category.id}
            variant="filter"
            label={category.name}
            selected={selectedCategory === category.name}
            onClick={() => setSelectedCategory(category.name)}
          />
        ))}
      </div>

      {/* {inProgress.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-[#111827] dark:text-white mb-4">
            {t("contents.continue-learning")}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {inProgress.map((training) => (
              <ContentProgressCard key={training.title} training={training} />
            ))}
          </div>
        </div>
      )} */}

      <div>
        <h2 className="text-xl font-bold text-[#111827] dark:text-white mb-4">
          {t("contents.all-contents")}
        </h2>

        {!loadingTrainings && !hasTrainings && (
          <div className="border border-border rounded-3xl flex flex-col items-center justify-center gap-4 p-10">
            <div className="flex items-center justify-between rounded-full p-3 bg-[#f5f5f5] dark:bg-[#262f45]">
              <Inbox className="size-8 text-black dark:text-gray-300" />
            </div>
            <h1 className="text-xl text-black dark:text-white">
              {t("contents.content-empty-state")}
            </h1>
          </div>
        )}

        {!loadingTrainings && hasTrainings && (
          <div className="grid grid-cols-1 lg:grid-cols-3 3xl:grid-cols-4 gap-6">
            {filteredTrainings.map((content) => (
              <ContentCard key={content.id} content={content} />
            ))}
          </div>
        )}

        <DataPagination
          page={page}
          totalPages={trainings?.total_pages}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
          onRowsPerPageChange={(value) => {
            setRowsPerPage(value)
            setPage(1)
          }}
        />
      </div>
    </PageWrapper>
  )
}
