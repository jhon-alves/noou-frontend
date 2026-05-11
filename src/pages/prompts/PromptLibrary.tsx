import { useState } from "react"
import { useTranslation } from "react-i18next"
import { PromptCard } from "@/components/prompts/PromptCard"
import { PageHeader } from "@/components/shared/PageHeader"
import { usePromptsStore } from "@/stores/usePromptsStore"
import { PageWrapper } from "@/components/shared/PageWrapper"
import { useGetPromptCategories } from "./hooks/useGetPromptCategories"
import { PromptPageSkeleton } from "@/components/prompts/PromptPageSkeleton"
import { DataPagination } from "@/components/shared/DataPagination"
import { PromptFilterMenu } from "@/components/prompts/PromptFilterMenu"
import { useGetPromptTags } from "./hooks/useGetPromptTags"
import { useGetPrompts } from "./hooks/useGetPrompts"
import { Chip } from "@/components/shared/Chip"
import { Inbox } from "lucide-react"

export default function PromptLibraryPage() {
  const { t } = useTranslation()
  const { selectedTag, selectedCategory, setSelectedTag, setSelectedCategory } = usePromptsStore()
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Fetchs
  const { data: prompts, isPending: loadingPrompts } = useGetPrompts({
    page,
    page_size: rowsPerPage,
  })
  const { data: categories, isPending: loadingCategories } = useGetPromptCategories()
  const { data: tags, isPending: loadingTags } = useGetPromptTags()

  if (!prompts || loadingPrompts || loadingTags || !categories) return <PromptPageSkeleton />

  // Filters
  const filteredCategories = categories.map((cat) => ({
    id: String(cat.id),
    label: cat.name,
    count:
      prompts?.items.filter((item) => item.categories.some((c) => c.id === cat.id)).length ?? 0,
  }))

  const filteredTags = (tags ?? []).map((cat) => ({
    id: String(cat.id),
    label: cat.name,
    count: prompts?.items.filter((item) => item.tags.some((c) => c.id === cat.id)).length ?? 0,
  }))

  const filteredPrompts = prompts?.items.filter((prompt) => {
    const matchesCategory =
      selectedCategory === "all" ||
      prompt.categories.some((cat) => String(cat.id) === selectedCategory)

    const matchesTag =
      selectedTag === "all" || prompt.tags.some((tag) => String(tag.id) === selectedTag)

    return matchesCategory && matchesTag
  })

  const hasTags = tags?.length > 0
  const hasCategories = categories?.length > 0
  const hasFilteredPrompts = filteredPrompts?.length > 0

  return (
    <PageWrapper>
      <PageHeader
        title={t("prompts.title")}
        subtitle={t("prompts.subtitle")}
        breadcrumbs={[{ label: t("nav.home"), href: "/dashboard" }, { label: t("nav.prompts") }]}
      />

      {!loadingCategories && !loadingTags && hasCategories && hasTags && (
        <div className="flex items-center gap-2 flex-wrap">
          <Chip
            label={`${t("common.all")} (${prompts?.items.length})`}
            className="text-sm h-10"
            onClick={() => {
              setSelectedCategory("all")
              setSelectedTag("all")
            }}
          />
          <PromptFilterMenu
            options={filteredCategories}
            placeholder={t("prompts.disciplines")}
            selectedId={selectedCategory === "all" ? undefined : selectedCategory}
            onChange={(value) => setSelectedCategory(value ?? "all")}
          />
          <PromptFilterMenu
            options={filteredTags}
            placeholder={t("prompts.design-process")}
            selectedId={selectedTag === "all" ? undefined : selectedTag}
            onChange={(value) => setSelectedTag(value ?? "all")}
          />
        </div>
      )}

      {!loadingPrompts && hasFilteredPrompts && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {filteredPrompts.map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>

          <DataPagination
            page={page}
            totalPages={prompts.total_pages}
            rowsPerPage={rowsPerPage}
            onPageChange={setPage}
            onRowsPerPageChange={(value) => {
              setRowsPerPage(value)
              setPage(1)
            }}
          />
        </>
      )}

      {!loadingPrompts && !hasFilteredPrompts && (
        <div className="border border-border rounded-3xl flex flex-col items-center justify-center gap-4 p-10">
          <div className="flex items-center justify-between rounded-full p-3 bg-[#f5f5f5] dark:bg-[#262f45]">
            <Inbox className="size-8 text-black dark:text-gray-300" />
          </div>
          <h1 className="text-xl text-black dark:text-white">{t("prompts.prompt-empty-state")}</h1>
        </div>
      )}
    </PageWrapper>
  )
}
