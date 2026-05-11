import { z } from "zod"
import { useEffect } from "react"
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
import { BusinessData, CreateBusinessBody, UpdateBusinessBody } from "@/services/business/types"
import { useBusinessStore } from "@/stores/useBusinessStore"
import { cleanObject } from "@/utils/cleanObject"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { businessServices } from "@/services"
import { toast } from "@/hooks/useToast"
import { Switch } from "../shared/Switch"
import { FormContent } from "../shared/FormContent"

export function CreateBusinessModal() {
  const qc = useQueryClient()
  const { t } = useTranslation()
  const {
    isEditBusiness,
    selectedBusiness,
    openCreateBusinessModal,
    setCreateBusinessModal,
    clearBusiness,
  } = useBusinessStore()

  const createBusinessSchema = z.object({
    name: z.string().min(1, t("form.enter-name")),
    description: z.string().optional(),
    email: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    is_active: z.boolean(),
  })

  type CreateBusinessForm = z.infer<typeof createBusinessSchema>

  const defaultValues = {
    name: "",
    description: "",
    email: "",
    address: "",
    phone: "",
    is_active: false,
  }

  const { control, handleSubmit, reset } = useForm<CreateBusinessForm>({
    resolver: zodResolver(createBusinessSchema),
    mode: "onBlur",
    defaultValues,
  })

  const businessName = useWatch({ control, name: "name" })

  useEffect(() => {
    if (isEditBusiness && selectedBusiness !== null) {
      reset({
        name: selectedBusiness.name,
        description: selectedBusiness?.description ?? "",
        email: selectedBusiness?.email ?? "",
        address: selectedBusiness?.address ?? "",
        phone: selectedBusiness?.phone ?? "",
        is_active: selectedBusiness.is_active,
      })
    }
  }, [isEditBusiness, selectedBusiness])

  const { isPending: loadingCreateBusiness, mutateAsync: createBusiness } = useMutation({
    mutationFn: (body: CreateBusinessBody) => businessServices.createBusiness(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["business"] })
      reset(defaultValues)
      clearBusiness()
      toast({
        title: t("common.success"),
        description: t("business.create-business-toast"),
        type: "success",
      })
    },
  })

  const { isPending: loadingUpdateBusiness, mutateAsync: updateBusiness } = useMutation({
    mutationFn: (body: UpdateBusinessBody) =>
      businessServices.updateBusiness(selectedBusiness.id, body),
    onMutate: async () => {
      const previousBusiness = qc.getQueryData<BusinessData[]>(["business"])
      return { previousBusiness }
    },
    onSuccess: (data, _variables, context) => {
      const previous = context?.previousBusiness ?? []
      const previousItem = previous?.filter((i) => i.id === data.id)[0]

      if (previousItem && data.is_active !== previousItem.is_active) {
        qc.invalidateQueries({ queryKey: ["me"] })
      }

      qc.invalidateQueries({ queryKey: ["business"] })
      reset(defaultValues)
      clearBusiness()
      toast({
        title: t("common.success"),
        description: t("business.update-business-toast"),
        type: "success",
      })
    },
  })

  const onSubmit = handleSubmit(async (data) => {
    if (isEditBusiness) {
      await updateBusiness(cleanObject(data))
    } else {
      await createBusiness({
        name: data.name,
        is_active: data.is_active,
        ...cleanObject(data),
      })
    }
  })

  function openModal(open: boolean) {
    setCreateBusinessModal(open)
    if (!open) {
      clearBusiness()
      reset(defaultValues)
    }
  }

  return (
    <Dialog open={openCreateBusinessModal} onOpenChange={(open) => openModal(open)}>
      <DialogTrigger asChild>
        <Button>{t("business.new-business")}</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditBusiness ? t("business.edit-business") : t("business.new-business")}
          </DialogTitle>
        </DialogHeader>

        <DialogBody>
          <FormContent>
            <Label isRequired>{t("common.name")}</Label>
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Input
                  id="name"
                  placeholder={t("form.enter-name")}
                  error={error?.message}
                  {...field}
                />
              )}
            />
          </FormContent>

          <FormContent>
            <Label>{t("common.description")}</Label>
            <Controller
              name="description"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Input
                  id="description"
                  placeholder={t("form.enter-description")}
                  error={error?.message}
                  {...field}
                />
              )}
            />
          </FormContent>

          <FormContent>
            <Label>E-mail</Label>
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Input
                  id="email"
                  placeholder={t("form.enter-email")}
                  error={error?.message}
                  {...field}
                />
              )}
            />
          </FormContent>

          <FormContent>
            <Label>{t("common.phone")}</Label>
            <Controller
              name="phone"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Input
                  id="phone"
                  placeholder={t("common.phone")}
                  className="rounded-full pr-12"
                  maxLength={11}
                  error={error?.message}
                  {...field}
                />
              )}
            />
          </FormContent>

          <FormContent>
            <Label>{t("common.address")}</Label>
            <Controller
              name="address"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Input
                  id="address"
                  type="address"
                  placeholder={t("common.address")}
                  error={error?.message}
                  {...field}
                />
              )}
            />
          </FormContent>

          <div className="flex items-center justify-between">
            <Label>Status</Label>
            <Controller
              control={control}
              name="is_active"
              render={({ field }) => (
                <Switch variant="secondary" checked={field.value} onChange={field.onChange} />
              )}
            />
          </div>
        </DialogBody>

        <DialogFooter>
          <Button
            isLoading={loadingCreateBusiness || loadingUpdateBusiness}
            disabled={!businessName}
            onClick={onSubmit}
          >
            {t("common.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
