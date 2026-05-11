import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { PromptsUpsertModal } from "./PromptsUpsertModal"
import { PromptsTableMenu } from "./PromptsTableMenu"
import { PromptItem } from "@/services/prompt/types"
import { TableCell, TableRow } from "../../ui/table"
import { promptServices } from "@/services"
import { toast } from "@/hooks/useToast"

interface PromptsTableRowProps {
  prompt: PromptItem
  totalPrompts: number
}

export function PromptsTableRow({ prompt, totalPrompts }: PromptsTableRowProps) {
  const qc = useQueryClient()
  const { t } = useTranslation()
  const [showEditModal, setShowEditModal] = useState<boolean>(false)

  const { mutate } = useMutation({
    mutationFn: (id: number) => promptServices.deletePrompt(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["prompts"] })
      toast({
        title: t("common.success"),
        description: t("contents.remove-content-success"),
        type: "success",
      })
    },
  })

  return (
    <>
      <TableRow
        key={prompt.id}
        className="border-b last:border-b-0 border-[#e7e7e7] dark:border-[#404040] dark:bg-[#2A2A2A]/50 hover:bg-gray-50 truncate"
      >
        <TableCell className="font-medium">{prompt.title ?? "—"}</TableCell>
        <TableCell>
          <div className="max-w-[50ch] truncate font-medium">{prompt.description ?? "—"}</div>
        </TableCell>
        <TableCell>{prompt?.author_name ?? "—"}</TableCell>
        <TableCell>
          <div className="max-w-[50ch] truncate font-medium">{prompt?.agent.name ?? "—"}</div>
        </TableCell>

        <TableCell className="text-right">
          <PromptsTableMenu onEdit={setShowEditModal} onDelete={() => mutate(prompt.id)} />
        </TableCell>
      </TableRow>

      {showEditModal && (
        <PromptsUpsertModal
          mode="edit"
          open={showEditModal}
          prompt={prompt}
          totalPrompts={totalPrompts}
          onOpenChange={setShowEditModal}
        />
      )}
    </>
  )
}
