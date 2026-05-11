import { useQuery } from "@tanstack/react-query"
import { secretServices } from "@/services/secrets/secret-services"
import { CreateSecretModal } from "../secrets/CreateSecretModal"
import { SecretSkeleton } from "../secrets/SecretSkeleton"
import { SecretCard } from "../secrets/SecretCard"
import { useTranslation } from "react-i18next"
import { Inbox } from "lucide-react"

export interface Integration {
  id: string
  name: string
  type: "api" | "webhook"
  url: string
  apiKey?: string
  enabled: boolean
  description: string
}

export function AdminSecretsTab({ businessId }: { businessId: number }) {
  const { t } = useTranslation()

  const { data: secrets, isPending } = useQuery({
    queryKey: ["business-secrets", businessId],
    queryFn: () => secretServices.getSecretsByBusiness(businessId),
  })

  const hasSecrets = secrets?.length > 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 dark:text-[#E5E5E5] mb-1">{t("secrets.title")}</h2>
          <p className="text-[14px] text-[#666f8d] dark:text-[#B3B3B3]">{t("secrets.subtitle")}</p>
        </div>

        <CreateSecretModal />
      </div>

      {isPending && <SecretSkeleton />}

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

      {!isPending && hasSecrets && (
        <div className="space-y-4">
          {secrets.map((secret) => (
            <SecretCard key={secret.id} secret={secret} />
          ))}
        </div>
      )}
    </div>
  )
}
