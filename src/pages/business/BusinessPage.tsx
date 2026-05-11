import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useQuery } from "@tanstack/react-query"
import { BusinessTable } from "@/components/business/BusinessTable"
import { businessServices } from "@/services/business/business-services"
import { CreateBusinessModal } from "@/components/business/CreateBusinessModal"
import { PageHeader } from "@/components/shared/PageHeader"
import { Input } from "@/components/ui/input"
import { PageWrapper } from "@/components/shared/PageWrapper"

const BusinessPage = () => {
  const [q, setQ] = useState("")
  const { t } = useTranslation()

  const { data: business, isPending: loadingBusiness } = useQuery({
    queryKey: ["business"],
    queryFn: () => businessServices.getBusiness(),
  })

  return (
    <PageWrapper>
      <PageHeader
        title={t("nav.business")}
        subtitle={t("business.subtitle")}
        breadcrumbs={[{ label: t("nav.home"), href: "/dashboard" }, { label: t("nav.business") }]}
      >
        <CreateBusinessModal />
      </PageHeader>

      <header className="space-y-6" role="banner" aria-label="Cabeçalho da listagem de usuários">
        <div className="flex items-center gap-3">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("business.input-search")}
            className="w-full sm:max-w-xs"
          />
        </div>
      </header>

      <BusinessTable data={business} loadingData={loadingBusiness} />
    </PageWrapper>
  )
}

export default BusinessPage
