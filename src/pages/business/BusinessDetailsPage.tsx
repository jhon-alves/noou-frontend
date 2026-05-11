import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useSuspenseQuery } from "@tanstack/react-query"
import { AddUserToBusinessModal } from "@/components/business/AddUserToBusinessModal"
import { BusinessUsersTable } from "@/components/business/BusinessUsersTable"
import { PageWrapper } from "@/components/shared/PageWrapper"
import { PageHeader } from "@/components/shared/PageHeader"
import { businessServices } from "@/services"
import { Badge } from "@/components/ui/badge"

const BusinessDetailsPage = () => {
  const { id } = useParams()
  const { t } = useTranslation()

  const { data: business } = useSuspenseQuery({
    queryKey: ["business-details", id],
    queryFn: () => businessServices.getBusinessById(Number(id)),
  })

  const hasUsers = business?.users?.length >= 0

  return (
    <PageWrapper>
      <PageHeader
        title={business.name}
        breadcrumbs={[
          { label: t("nav.home"), href: "/dashboard" },
          { label: t("nav.business"), href: "/business" },
          { label: t("business.business-details") },
        ]}
      />

      <div className="flex flex-col space-y-6">
        <section
          className="rounded-3xl border overflow-hidden dark:border-[#404040] dark:bg-[#2A2A2A]/50 border-[#e7e7e7] bg-white/60 backdrop-blur-[20px] p-6"
          aria-label="Informações da empresa"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium text-black dark:text-white">{business?.email || "—"}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">{t("common.phone")}</p>
              <p className="font-medium text-black dark:text-white">{business?.phone || "—"}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              {business?.is_active ? (
                <Badge className="bg-green-100 text-green-700! hover:bg-green-100 lowercase">
                  {t("common.active")}
                </Badge>
              ) : (
                <Badge variant="destructive">{t("common.inactive")}</Badge>
              )}
            </div>

            <div className="md:col-span-2 lg:col-span-4">
              <p className="text-sm text-muted-foreground">{t("common.description")}</p>
              <p className="font-medium text-black dark:text-white">
                {business?.description || "—"}
              </p>
            </div>
          </div>
        </section>

        {hasUsers && (
          <>
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-medium text-black dark:text-white">
                {t("business.manage-users")}
              </h1>
              <AddUserToBusinessModal businessId={id} />
            </div>
            <BusinessUsersTable data={business?.users} />
          </>
        )}
      </div>
    </PageWrapper>
  )
}

export default BusinessDetailsPage
