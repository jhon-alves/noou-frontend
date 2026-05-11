import day from "dayjs"
import { useTranslation } from "react-i18next"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { secretServices } from "@/services/secrets/secret-services"
import { SecretsByBusinessData } from "@/services/secrets/types"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/useToast"
import { Trash2 } from "lucide-react"

interface SecretCardProps {
  secret: SecretsByBusinessData
  isUser?: boolean
}

export function SecretCard({ secret, isUser = false }: SecretCardProps) {
  const qc = useQueryClient()
  const { t } = useTranslation()

  const { isPending, mutateAsync } = useMutation({
    mutationFn: (secretId: number) => secretServices.deleteSecret(secretId),
    onSuccess: () => {
      if (isUser) {
        qc.invalidateQueries({ queryKey: ["user-secrets"] })
      } else {
        qc.invalidateQueries({ queryKey: ["business-secrets"] })
      }
      toast({
        title: t("common.success"),
        description: t("secrets.delete-secret-toast"),
        type: "success",
      })
    },
  })

  return (
    <div className="rounded-3xl p-6 border transition-all duration-200 dark:border-[#404040] dark:bg-[#2A2A2A]/50 border-[#e7e7e7] bg-white/60 backdrop-blur-[20px]">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex flex-col gap-2 mb-3">
            <h3 className="font-semibold text-gray-900 dark:text-[#E5E5E5]">{secret.key}</h3>
            <p className="text-sm dark:text-[#808080] text-[#666f8d]">
              {t("secrets.added-on")} {day(secret.created_at).format("DD/MM/YYYY")}
            </p>
          </div>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="destructive"
              size="sm"
              onSelect={(e) => e.preventDefault()}
              isLoading={isPending}
              className="font-medium"
            >
              <Trash2 className="w-4 h-4 text-white group-hover:text-red-500" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("secrets.confirm-delete")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("secrets.confirm-delete-description")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-600/90"
                onClick={() => mutateAsync(secret.id)}
              >
                {t("common.delete")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
