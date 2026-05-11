import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { businessServices } from "@/services/business/business-services"
import { BusinessData } from "@/services/business/types"
import { BusinessTableMenu } from "./BusinessTableMenu"
import { toast } from "@/hooks/useToast"
import { Badge } from "../ui/badge"

interface BusinessTableProps {
  data: BusinessData[]
  loadingData: boolean
}

export function BusinessTable({ data, loadingData }: BusinessTableProps) {
  const qc = useQueryClient()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const { mutateAsync } = useMutation({
    mutationFn: (id: number) => businessServices.deleteBusiness(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["business"] })
      toast({
        title: t("common.success"),
        description: t("business.business-inactivated-success"),
        type: "success",
      })
    },
  })

  async function handleDeleteBusiness(businessId: number) {
    await mutateAsync(businessId)
  }

  return (
    <section className="flex flex-col gap-6" aria-label="Tabela de usuários">
      <div className="rounded-3xl border overflow-hidden dark:border-[#404040] dark:bg-[#2A2A2A]/50 border-[#e7e7e7] bg-white/60 backdrop-blur-[20px] overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-42.5">{t("common.name")}</TableHead>
              <TableHead className="w-[40%]">{t("common.description")}</TableHead>
              <TableHead className="w-[30%">E-mail</TableHead>
              <TableHead className="w-17.5">Status</TableHead>
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
              data.map((b) => (
                <TableRow
                  key={b.id}
                  className="border-b last:border-b-0 border-[#e7e7e7] dark:border-[#404040] dark:bg-[#2A2A2A]/50 hover:bg-gray-50 truncate"
                >
                  <TableCell className="font-medium">
                    <span className="cursor-pointer" onClick={() => navigate(`/business/${b.id}`)}>
                      {b.name ?? "—"}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="max-w-[50ch] truncate">{b?.description ?? "—"}</div>
                  </TableCell>
                  <TableCell>{b?.email ?? "—"}</TableCell>

                  <TableCell>
                    {b.is_active ? (
                      <Badge className="bg-green-100 text-green-700! hover:bg-green-100 lowercase">
                        {t("common.active")}
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="lowercase">
                        {t("common.inactive")}
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    <BusinessTableMenu
                      business={b}
                      onView={() => navigate(`/business/${b.id}`)}
                      onSecret={() => navigate(`/business/${b.id}/secrets?businessName=${b.name}`)}
                      onDelete={() => handleDeleteBusiness(b.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </section>
  )
}
