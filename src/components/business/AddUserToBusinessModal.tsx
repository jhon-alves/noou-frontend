import { z } from "zod"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Controller, useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogBody,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AddUserToBusinessBody } from "@/services/business/types"
import { businessServices } from "@/services"
import { toast } from "@/hooks/useToast"
import { FormContent } from "../shared/FormContent"

interface AddUserToBusinessModalProps {
  businessId?: string
}

export function AddUserToBusinessModal({ businessId }: AddUserToBusinessModalProps) {
  const qc = useQueryClient()
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  const createUserBusinessSchema = z.object({
    business_id: z.number(),
    user_email: z.email(t("business.enter-user-email")),
  })

  const defaultValues = {
    business_id: Number(businessId),
    user_email: "",
  }

  const { control, handleSubmit, reset } = useForm<AddUserToBusinessBody>({
    resolver: zodResolver(createUserBusinessSchema),
    mode: "onBlur",
    defaultValues,
  })
  const email = useWatch({ control, name: "user_email" })

  const { isPending: loadingAddUser, mutateAsync: addUser } = useMutation({
    mutationFn: (body: AddUserToBusinessBody) => businessServices.addUserToBusiness(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["business-details", businessId] })
      qc.invalidateQueries({ queryKey: ["me"] })
      reset(defaultValues)
      setOpen(false)
      toast({
        title: t("common.success"),
        description: t("business.create-user-toast"),
        type: "success",
      })
    },
  })

  const onSubmit = handleSubmit(async (data) => {
    if (!email) return
    await addUser(data)
  })

  useEffect(() => {
    if (!open) {
      reset(defaultValues)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{t("admin.invite-user")}</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("admin.invite-user")}</DialogTitle>
        </DialogHeader>

        <DialogBody>
          <FormContent>
            <Label isRequired>E-mail</Label>
            <Controller
              name="user_email"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Input
                  id="user_email"
                  error={error?.message}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  {...field}
                />
              )}
            />
          </FormContent>
        </DialogBody>

        <DialogFooter>
          <Button isLoading={loadingAddUser} disabled={!email} onClick={onSubmit}>
            {t("common.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
