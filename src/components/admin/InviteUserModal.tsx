import z from "zod"
import { useTranslation } from "react-i18next"
import { Controller, useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { AddUserToBusinessBody } from "@/services/business/types"
import { businessServices } from "@/services"
import { toast } from "@/hooks/useToast"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { FormContent } from "../shared/FormContent"

interface InviteUserModalProps {
  isOpen: boolean
  businessId: number
  onClose: () => void
}

export function InviteUserModal({ isOpen, businessId, onClose }: InviteUserModalProps) {
  const qc = useQueryClient()
  const { t } = useTranslation()

  const createUserBusinessSchema = z.object({
    business_id: z.number(),
    user_email: z.email(t("business.enter-user-email")),
  })

  const { control, handleSubmit, reset } = useForm<AddUserToBusinessBody>({
    resolver: zodResolver(createUserBusinessSchema),
    mode: "onBlur",
    defaultValues: {
      business_id: Number(businessId),
      user_email: "",
    },
  })
  const email = useWatch({ control, name: "user_email" })

  const { isPending, mutateAsync } = useMutation({
    mutationFn: (body: AddUserToBusinessBody) => businessServices.addUserToBusiness(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users", businessId] })
      reset({ business_id: 0, user_email: "" })
      onClose()
      toast({
        title: t("common.success"),
        description: t("business.create-user-toast"),
        type: "success",
      })
    },
  })

  const handleInvite = handleSubmit(async (data) => {
    if (!email) return
    await mutateAsync(data)
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex flex-col gap-6">
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle>{t("admin.invite-user")}</DialogTitle>
          <DialogDescription>{t("admin.invite-user-description")}</DialogDescription>
        </DialogHeader>

        <DialogBody>
          <FormContent>
            <Label isRequired>E-mail</Label>
            <Controller
              name="user_email"
              control={control}
              render={({ field: { value, onChange }, fieldState: { error } }) => (
                <Input
                  id="user_email"
                  placeholder={t("admin.add-email")}
                  value={value}
                  onChange={onChange}
                  error={error?.message}
                />
              )}
            />
          </FormContent>
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button disabled={!email} isLoading={isPending} onClick={handleInvite}>
            {t("common.send")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
