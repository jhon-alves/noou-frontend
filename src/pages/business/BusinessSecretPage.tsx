import { useParams, useSearchParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { CreateSecretModal } from "@/components/secrets/CreateSecretModal"
import { SecretSkeleton } from "@/components/secrets/SecretSkeleton"
import { secretServices } from "@/services/secrets/secret-services"
import { SecretCard } from "@/components/secrets/SecretCard"
import { useTranslation } from "react-i18next"
import { PageWrapper } from "@/components/shared/PageWrapper"
import { PageHeader } from "@/components/shared/PageHeader"
import { Inbox } from "lucide-react"

const BusinessSecretPage = () => {
  const { t } = useTranslation()
  const { id: businessId } = useParams()
  const [searchParams] = useSearchParams()
  const businessName = searchParams.get("businessName")

  const { data: secrets, isPending } = useQuery({
    queryKey: ["business-secrets", businessId],
    queryFn: () => secretServices.getSecretsByBusiness(Number(businessId)),
  })

  const hasSecrets = secrets?.length > 0

  return (
    <PageWrapper>
      <PageHeader
        title={businessName}
        subtitle={t("secrets.subtitle")}
        breadcrumbs={[
          { label: t("nav.home"), href: "/dashboard" },
          { label: t("nav.business"), href: "/business" },
          { label: t("secrets.title") },
        ]}
      >
        <CreateSecretModal />
      </PageHeader>
      <div className="max-w-6xl mx-auto w-full flex flex-col">
        {isPending && <SecretSkeleton />}

        {!isPending && hasSecrets && (
          <div className="flex flex-col gap-4">
            {secrets.map((s) => (
              <SecretCard key={s.id} secret={s} />
            ))}
          </div>
        )}
        {!isPending && !hasSecrets && (
          <div className="border border-border rounded-3xl flex flex-col items-center justify-center gap-4 p-10">
            <div className="flex items-center justify-between rounded-full p-3 bg-[#f5f5f5] dark:bg-[#262f45]">
              <Inbox className="size-8 text-black dark:text-gray-300" />
            </div>
            <h1 className="text-xl text-black dark:text-white">
              {t("secrets.secret-business-empty-state")}
            </h1>
          </div>
        )}
      </div>
    </PageWrapper>
  )
}

export default BusinessSecretPage
