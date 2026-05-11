import { useState } from "react"
import { useTranslation } from "react-i18next"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { DataPagination } from "@/components/shared/DataPagination"
import { PromptsUpsertModal } from "./PromptsUpsertModal"
import { Button } from "@/components/ui/button"
import { PromptsTable } from "./PromptsTable"
import { promptServices } from "@/services"
import { Plus } from "lucide-react"

export function AdminPromptsTab({ businessId }: { businessId: number }) {
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.language || "en"
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [showCreatePromptModal, setShowCreatePromptModal] = useState<boolean>(false)

  const { data: prompts, isPending: loadingPrompts } = useQuery({
    queryKey: ["prompts", businessId, currentLanguage, page, rowsPerPage],
    queryFn: () =>
      promptServices.getPrompts({ lang: currentLanguage, page, page_size: rowsPerPage }),
    placeholderData: keepPreviousData,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 dark:text-[#E5E5E5] mb-1">{t("prompts.title")}</h2>
          <p className="text-[14px] text-[#666f8d] dark:text-[#B3B3B3]">{t("prompts.subtitle")}</p>
        </div>

        <Button variant="filled" onClick={() => setShowCreatePromptModal(true)}>
          <Plus className="w-4 h-4" />
          {t("admin.prompts.new-prompt")}
        </Button>
      </div>

      <PromptsUpsertModal
        mode="create"
        open={showCreatePromptModal}
        onOpenChange={setShowCreatePromptModal}
        totalPrompts={prompts?.total}
      />

      <section className="flex flex-col gap-6" aria-label="Tabela de Prompts">
        <PromptsTable prompts={prompts} loading={loadingPrompts} />
        <DataPagination
          page={page}
          totalPages={prompts?.total_pages}
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
