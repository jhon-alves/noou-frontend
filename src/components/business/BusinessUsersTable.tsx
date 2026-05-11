import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { UserTableRow } from "./BusinessUserRow"

interface BusinessUsersTableProps {
  data: {
    id: number
    name: string
    email: string
    status: string
    is_active: boolean
  }[]
  loadingData?: boolean
}

export function BusinessUsersTable({ data, loadingData }: BusinessUsersTableProps) {
  const { id: businessId } = useParams()
  const { t } = useTranslation()

  return (
    <section className="flex flex-col gap-6" aria-label="Tabela de usuários">
      <div className="rounded-3xl border overflow-hidden dark:border-[#404040] dark:bg-[#2A2A2A]/50 border-[#e7e7e7] bg-white/60 backdrop-blur-[20px] overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[20%]">{t("common.name")}</TableHead>
              <TableHead className="w-[28%]">E-mail</TableHead>
              <TableHead className="w-17.5">Status</TableHead>
              <TableHead className="w-17.5">{t("common.invitation")}</TableHead>
              <TableHead className="w-14" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {loadingData &&
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={`sk-${i}`} className="animate-pulse">
                  <TableCell>
                    <div className="h-4 w-40 rounded bg-muted" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-56 rounded bg-muted" />
                  </TableCell>
                  <TableCell>
                    <div className="h-6 w-20 rounded-full bg-muted" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-32 rounded bg-muted" />
                  </TableCell>
                </TableRow>
              ))}

            {!loadingData &&
              data.map((user) => (
                <UserTableRow key={user.id} user={user} businessId={Number(businessId)} />
              ))}
          </TableBody>
        </Table>
      </div>
    </section>
  )
}
