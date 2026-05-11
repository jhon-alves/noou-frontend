import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Controller, useForm, useWatch } from "react-hook-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { UpdateUserBody } from "@/services/user/types"
import { useMeStore } from "@/stores/meStore"
import { userServices } from "@/services"
import { toast } from "@/hooks/useToast"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Save } from "lucide-react"
import { FormContent } from "../shared/FormContent"

export function ProfileTab() {
  const qc = useQueryClient()
  const { t } = useTranslation()
  const { me, setMe } = useMeStore()
  const userId = me?.id

  const methods = useForm({
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
    },
  })
  const { control, reset, handleSubmit } = methods

  const meName = useWatch({ control, name: "name" })
  const meEmail = useWatch({ control, name: "email" })

  useEffect(() => {
    if (!me) return
    reset(
      {
        name: me.name ?? "",
        email: me.email ?? "",
      },
      { keepDirtyValues: false },
    )
  }, [me])

  const { isPending: loadingUpdateProfile, mutateAsync: updateProfile } = useMutation({
    mutationFn: (body: UpdateUserBody) => userServices.updateUser(userId, body),
    onSuccess: (data) => {
      setMe({
        ...me,
        name: data.name,
        email: data.email,
      })
      qc.invalidateQueries({ queryKey: ["me"] })
      toast({
        title: t("common.success"),
        description: t("settings.profile.updated-data-success"),
        type: "success",
      })
    },
  })

  const handleSaveProfile = handleSubmit(async (data) => {
    if (!meName || !meEmail) return
    await updateProfile(data)
  })

  return (
    <div className="flex flex-col gap-6">
      <form
        onSubmit={handleSaveProfile}
        className="rounded-2xl p-6 border border-gray-300 dark:border-white/15 space-y-6"
      >
        <h1 className="text-lg font-medium text-black dark:text-white">
          {t("settings.profile.title")}
        </h1>

        <div className="grid grid-cols-1 gap-6">
          <FormContent>
            <Label>{t("common.name")}</Label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => <Input id="name" {...field} />}
            />
          </FormContent>
          <FormContent>
            <Label>E-mail</Label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => <Input id="email" type="email" {...field} />}
            />
          </FormContent>
        </div>

        <div className="flex justify-end">
          <Button isLoading={loadingUpdateProfile}>
            <Save size={18} />
            {t("common.save")}
          </Button>
        </div>
      </form>
    </div>
  )
}
