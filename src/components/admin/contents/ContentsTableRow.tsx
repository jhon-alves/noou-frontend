import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { contentsServices } from "@/services/contents/contents-services"
import { TrainingItem } from "@/services/contents/types"
import { ContentsTableMenu } from "./ContentsTableMenu"
import { ContentUpsertModal } from "./ContentUpsertModal"
import { TableCell, TableRow } from "../../ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/useToast"
import { PreviewContentModal } from "./PreviewContentModal"
import { Chip } from "@/components/shared/Chip"

interface ContentsTableRowProps {
  content: TrainingItem
}

export function ContentsTableRow({ content }: ContentsTableRowProps) {
  const qc = useQueryClient()
  const { t } = useTranslation()
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false)
  const [showEditModal, setShowEditModal] = useState<boolean>(false)

  const { mutateAsync } = useMutation({
    mutationFn: (id: string) => contentsServices.deleteTraining(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["trainings"] })
      toast({
        title: t("common.success"),
        description: t("contents.remove-content-success"),
        type: "success",
      })
    },
  })

  async function handleDeleteTraining(id: string) {
    await mutateAsync(id)
  }

  return (
    <>
      <TableRow
        key={content.id}
        className="border-b last:border-b-0 border-[#e7e7e7] dark:border-[#404040] dark:bg-[#2A2A2A]/50 hover:bg-gray-50 truncate"
      >
        <TableCell className="font-medium">{content.title ?? "—"}</TableCell>
        <TableCell>
          <div className="max-w-[50ch] truncate font-medium">
            {content.short_description ?? "—"}
          </div>
        </TableCell>
        <TableCell>{content?.author ?? "—"}</TableCell>
        <TableCell>
          <div className="max-w-[50ch] truncate font-medium">{content?.video_url ?? "—"}</div>
        </TableCell>
        <TableCell>
          <div className="flex wrap items-center gap-3">
            {content.skills.map((item) => <Chip label={item.name} variant="card" size="sm" />)[0]}
            {content.skills.length > 1 && (
              <span className={`text-[11px] dark:text-gray-300 text-[#666f8d]`}>
                +{content.skills.length - 1}
              </span>
            )}
          </div>
        </TableCell>
        <TableCell>
          {content.is_active ? (
            <Badge className="bg-green-100 text-green-700! hover:bg-green-100 lowercase">
              {t("common.active")}
            </Badge>
          ) : (
            <Badge variant="destructive" className="lowercase">
              {t("common.inactive")}
            </Badge>
          )}
        </TableCell>
        <TableCell>{content?.sort_order > 0 ? content?.sort_order : "—"}</TableCell>

        <TableCell className="text-right">
          <ContentsTableMenu
            onView={() => setShowPreviewModal(true)}
            onEdit={setShowEditModal}
            onDelete={() => handleDeleteTraining(content.id)}
          />
        </TableCell>
      </TableRow>

      {showEditModal && (
        <ContentUpsertModal
          mode="edit"
          open={showEditModal}
          content={content}
          onOpenChange={setShowEditModal}
        />
      )}

      {showPreviewModal && (
        <PreviewContentModal
          isOpen={showPreviewModal}
          content={content}
          onClose={() => setShowPreviewModal(false)}
        />
      )}
    </>
  )
}
