import z from "zod"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Controller, useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { UpdateUserAdminBody } from "@/services/user-admin/types"
import { userAdminServices, userServices } from "@/services"
import { toast } from "@/hooks/useToast"
import { Switch } from "../shared/Switch"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { cleanObject } from "@/utils/cleanObject"
import { useLocation } from "react-router-dom"
import { UpdateUserBody } from "@/services/user/types"
import { FormContent } from "../shared/FormContent"

interface BusinessUserEditModalProps {
  isOpen: boolean
  user: {
    id: number
    name: string
    email: string
    status: string
    is_active: boolean
  }
  onClose: () => void
}

export function BusinessUserEditModal({ isOpen, user, onClose }: BusinessUserEditModalProps) {
  const qc = useQueryClient()
  const { t } = useTranslation()
  const { pathname } = useLocation()

  const userProfileschema = z.object({
    name: z.string().optional(),
    email: z.email(t("form.enter-email")),
    is_active: z.boolean(),
  })

  type FormValues = z.infer<typeof userProfileschema>

  const defaultValues = {
    name: "",
    email: "",
    is_active: false,
  }

  const { control, reset, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(userProfileschema),
    mode: "onBlur",
    defaultValues: defaultValues,
  })

  const userId = user.id
  const userName = useWatch({ control, name: "name" })
  const userEmail = useWatch({ control, name: "email" })

  // Preenche o form quando carregar
  useEffect(() => {
    if (!user) return
    reset({
      name: user.name ?? "",
      email: user.email ?? "",
      is_active: !!user.is_active,
    })
  }, [user])

  // Limpa estados ao fechar o modal
  useEffect(() => {
    if (!isOpen) {
      reset(defaultValues)
    }
  }, [isOpen])

  // Atualiza dados de usuários na tela de business
  const { isPending: loadingAdminUpdate, mutateAsync: updateAdminUser } = useMutation({
    mutationFn: (body: UpdateUserAdminBody) => userAdminServices.updateAdminUser(userId, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["business-details"] })
      qc.invalidateQueries({ queryKey: ["users"] })
      toast({
        title: t("common.success"),
        description: t("admin.update-user-success"),
        type: "success",
      })
      onClose()
    },
    onError: () => {
      toast({
        title: t("common.error"),
        description: t("admin.update-user-error"),
        type: "error",
      })
    },
  })

  // Atualiza dados de usuários na tela de admin
  const { isPending: loadingUpdate, mutateAsync: updateUser } = useMutation({
    mutationFn: (body: UpdateUserBody) => userServices.updateUser(userId, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users"] })
      toast({
        title: t("common.success"),
        description: t("admin.update-user-success"),
        type: "success",
      })
      onClose()
    },
    onError: () => {
      toast({
        title: t("common.error"),
        description: t("admin.update-user-error"),
        type: "error",
      })
    },
  })

  const onSubmit = handleSubmit(async (data) => {
    const baseRoute = `/${pathname.split("/").filter(Boolean)[0]}`
    const isBusiness = baseRoute === "/business"

    if (isBusiness) {
      await updateAdminUser({
        email: data.email,
        is_active: data.is_active,
        ...cleanObject({
          name: data.name,
        }),
      })
    } else if (pathname === "/admin") {
      await updateUser({
        email: data.email,
        is_active: data.is_active,
        ...cleanObject({
          name: data.name,
        }),
      })
    }
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("admin.edit-user")}</DialogTitle>
        </DialogHeader>

        <DialogBody>
          <FormContent>
            <Label>{t("common.name")}</Label>
            <Controller
              control={control}
              name="name"
              render={({ field, fieldState: { error } }) => (
                <Input {...field} placeholder={t("common.name")} error={error?.message} />
              )}
            />
          </FormContent>

          <FormContent>
            <Label isRequired>E-mail</Label>
            <Controller
              control={control}
              name="email"
              render={({ field, fieldState: { error } }) => (
                <Input {...field} type="email" placeholder="E-mail" error={error?.message} />
              )}
            />
          </FormContent>

          <Controller
            control={control}
            name="is_active"
            render={({ field }) => (
              <div className="flex flex-row items-center justify-between w-full">
                <Label htmlFor="is_active">Status</Label>
                <Switch
                  checked={field.value}
                  onChange={field.onChange}
                  aria-label="Change user status"
                  variant="secondary"
                />
              </div>
            )}
          />
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button
            variant="filled"
            isLoading={loadingAdminUpdate || loadingUpdate}
            disabled={!userName || !userEmail}
            onClick={onSubmit}
          >
            {t("common.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
