import { useTranslation } from "react-i18next"
import { CreateSecretModal } from "@/components/secrets/CreateSecretModal"
import { SecretSkeleton } from "@/components/secrets/SecretSkeleton"
import { SecretCard } from "@/components/secrets/SecretCard"
import { UserSecretData } from "@/services/secrets/types"
import { Inbox, Key } from "lucide-react"

interface UserSecretsProps {
  secrets: UserSecretData[]
  loadingSecrets: boolean
}

export function UserSecrets({ secrets, loadingSecrets }: UserSecretsProps) {
  const { t } = useTranslation()
  const hasSecrets = secrets?.length > 0

  return (
    <div className="rounded-2xl p-6 border border-gray-300 dark:border-white/15 space-y-6">
      <h1 className="flex items-center gap-2 font-medium text-black dark:text-white">
        <Key className="size-5" />
        {t("secrets.title")}
      </h1>
      <div className="flex flex-col gap-5">
        {loadingSecrets && <SecretSkeleton />}

        {!loadingSecrets && hasSecrets && (
          <div className="flex flex-col gap-6">
            {secrets.map((s) => (
              <SecretCard key={s.id} secret={s} isUser={true} />
            ))}
          </div>
        )}

        {!loadingSecrets && !hasSecrets && (
          <div className="flex flex-col items-center justify-center gap-4 p-10">
            <div className="flex items-center justify-between rounded-full p-3 bg-[#f5f5f5] dark:bg-[#262f45]">
              <Inbox className="size-8 text-black dark:text-gray-300" />
            </div>
            <h1 className="text-xl text-black dark:text-white">
              {t("secrets.secret-empty-state")}
            </h1>
          </div>
        )}

        <CreateSecretModal isUser={true} />
      </div>
    </div>
  )
}
