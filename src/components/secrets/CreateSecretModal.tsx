import { z } from "zod"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Controller, useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogBody,
} from "@/components/ui/dialog"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { secretServices } from "@/services/secrets/secret-services"
import { CreateSecretBody } from "@/services/secrets/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMeStore } from "@/stores/meStore"
import { toast } from "@/hooks/useToast"
import { FormContent } from "../shared/FormContent"
import { SelectSecret } from "./SelectSecret"

type ManualSecretForm = Pick<CreateSecretBody, "key" | "value">

interface CreateSecretModalProps {
  isUser?: boolean
}

export function CreateSecretModal({ isUser = false }: CreateSecretModalProps) {
  const qc = useQueryClient()
  const { me } = useMeStore()
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)

  const currentLanguage = i18n.language || "en"
  const currentBusinessId = me?.current_business_id

  const createSecretSchema = z.object({
    key: z.string().min(1, t("secrets.enter-key")),
    value: z.string().min(1, t("secrets.enter-value")),
  })

  const defaultValues = { key: "", value: "" }

  const { data: secretKeys = [], isPending: loadingKeys } = useQuery({
    queryKey: ["secret-keys", currentLanguage],
    queryFn: () => secretServices.getSecretKeys(currentLanguage),
    staleTime: 1000 * 60 * 5,
    enabled: open,
  })
  const hasKeys = secretKeys?.length > 0

  const { control, handleSubmit, reset } = useForm<ManualSecretForm>({
    resolver: zodResolver(createSecretSchema),
    mode: "onBlur",
    defaultValues,
  })

  const secretKey = useWatch({ control, name: "key" })
  const secretValue = useWatch({ control, name: "value" })

  const { isPending: loadingCreate, mutateAsync: createSecret } = useMutation({
    mutationFn: isUser
      ? (body: CreateSecretBody) => secretServices.createUserSecret(body)
      : (body: CreateSecretBody) => secretServices.createSecret(body),
    onSuccess: () => {
      if (isUser) {
        qc.invalidateQueries({ queryKey: ["user-secrets"] })
      } else {
        qc.invalidateQueries({ queryKey: ["business-secrets"] })
      }
      reset(defaultValues)
      setOpen(false)
      toast({
        title: t("common.success"),
        description: t("secrets.create-secret-toast"),
        type: "success",
      })
    },
  })

  const onSubmit = handleSubmit(async (data) => {
    if (!secretKey || !secretValue) return

    await createSecret({
      ...data,
      business_id: currentBusinessId,
    })
  })

  useEffect(() => {
    if (!open) {
      reset(defaultValues)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex justify-end">
          <Button>{t("secrets.new-secret")}</Button>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("secrets.new-secret")}</DialogTitle>
        </DialogHeader>

        {hasKeys && !loadingKeys && (
          <DialogBody>
            <FormContent>
              <Label isRequired>{t("common.key")}</Label>
              <Controller
                name="key"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <SelectSecret keys={secretKeys} value={value} onChange={onChange} />
                )}
              />
            </FormContent>

            <FormContent>
              <Label isRequired>{t("common.value")}</Label>
              <Controller
                name="value"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <Input
                    id="value"
                    placeholder={t("common.value")}
                    error={error?.message}
                    {...field}
                  />
                )}
              />
            </FormContent>
          </DialogBody>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t("common.cancel")}
          </Button>
          <Button
            isLoading={loadingCreate}
            disabled={!secretKey || !secretValue}
            onClick={onSubmit}
          >
            {t("common.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
