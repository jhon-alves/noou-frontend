import { useState } from "react"
import { useTranslation } from "react-i18next"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { contentsServices } from "@/services/contents/contents-services"
import { DataPagination } from "@/components/shared/DataPagination"
import { ContentUpsertModal } from "./ContentUpsertModal"
import { ContentsTable } from "./ContentsTable"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function AdminContentsTab({ businessId }: { businessId: number }) {
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.language || "en"
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [showCreateContentModal, setShowCreateContentModal] = useState<boolean>(false)

  const { data: trainings, isPending: loadingTrainings } = useQuery({
    queryKey: ["trainings", businessId, currentLanguage, page, rowsPerPage],
    queryFn: () =>
      contentsServices.getTrainings({ lang: currentLanguage, page, page_size: rowsPerPage }),
    placeholderData: keepPreviousData,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 dark:text-[#E5E5E5] mb-1">{t("contents.title")}</h2>
          <p className="text-[14px] text-[#666f8d] dark:text-[#B3B3B3]">
            {t("admin.manage-trainings")}
          </p>
        </div>

        <Button variant="filled" onClick={() => setShowCreateContentModal(true)}>
          <Plus className="w-4 h-4" />
          {t("admin.new-content")}
        </Button>
      </div>

      <ContentUpsertModal
        mode="create"
        open={showCreateContentModal}
        onOpenChange={setShowCreateContentModal}
      />

      <section className="flex flex-col gap-6" aria-label="Tabela de usuários">
        <ContentsTable contents={trainings} loading={loadingTrainings} />
        <DataPagination
          page={page}
          totalPages={trainings?.total_pages}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
          onRowsPerPageChange={(value) => {
            setRowsPerPage(value)
            setPage(1)
          }}
          showRowsPerPage
        />
      </section>
    </div>
  )
}
