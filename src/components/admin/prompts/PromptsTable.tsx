import { useTranslation } from "react-i18next"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "../../ui/table"
import { TableRowSkeleton } from "@/components/shared/TableRowSkeleton"
import { PromptsData } from "@/services/prompt/types"
import { PromptsTableRow } from "./PromptsTableRow"

interface PromptsTableProps {
  prompts: PromptsData
  loading: boolean
}

export function PromptsTable({ prompts, loading }: PromptsTableProps) {
  const { t } = useTranslation()

  return (
    <div className="rounded-3xl border overflow-hidden dark:border-[#404040] dark:bg-[#2A2A2A]/50 border-[#e7e7e7] bg-white/60 backdrop-blur-[20px] overflow-x-auto">
      <Table className="table-auto">
        <TableHeader>
          <TableRow>
            <TableHead className="w-42.5">{t("common.title")}</TableHead>
            <TableHead className="w-[30%]">{t("common.description")}</TableHead>
            <TableHead className="w-[10%]">{t("common.author")}</TableHead>
            <TableHead>Agent</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading && <TableRowSkeleton />}

          {!loading &&
            prompts?.items?.map((prompt) => (
              <PromptsTableRow key={prompt.id} prompt={prompt} totalPrompts={prompts?.total} />
            ))}
        </TableBody>
      </Table>
    </div>
  )
}
