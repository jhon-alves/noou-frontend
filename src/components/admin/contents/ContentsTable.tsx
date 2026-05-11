import { Table, TableBody, TableHead, TableHeader, TableRow } from "../../ui/table"
import { TableRowSkeleton } from "@/components/shared/TableRowSkeleton"
import { TrainingData } from "@/services/contents/types"
import { ContentsTableRow } from "./ContentsTableRow"
import { useTranslation } from "react-i18next"
interface ContentsTableProps {
  contents: TrainingData
  loading: boolean
}

export function ContentsTable({ contents, loading }: ContentsTableProps) {
  const { t } = useTranslation()

  return (
    <div className="rounded-3xl border overflow-hidden dark:border-[#404040] dark:bg-[#2A2A2A]/50 border-[#e7e7e7] bg-white/60 backdrop-blur-[20px] overflow-x-auto">
      <Table className="table-auto">
        <TableHeader>
          <TableRow>
            <TableHead className="w-42.5">{t("common.title")}</TableHead>
            <TableHead className="w-[30%]">{t("common.description")}</TableHead>
            <TableHead className="w-[10%]">{t("common.author")}</TableHead>
            <TableHead className="w-[10%]">Link</TableHead>
            <TableHead>{t("common.categories")}</TableHead>
            <TableHead className="w-17.5">Status</TableHead>
            <TableHead className="w-17.5">{t("common.order")}</TableHead>
            <TableHead className="w-14" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading && <TableRowSkeleton />}

          {!loading &&
            contents?.items?.map((content) => (
              <ContentsTableRow key={content.id} content={content} />
            ))}
        </TableBody>
      </Table>
    </div>
  )
}
