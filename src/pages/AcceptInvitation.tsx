import * as z from "zod"
import { useState } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useNavigate, useSearchParams } from "react-router-dom"
import { AcceptBusinessInviteBody } from "@/services/user/types"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { userServices } from "@/services"
import { Eye, EyeOff } from "lucide-react"
import { useTranslation } from "react-i18next"
import { toast } from "@/hooks/useToast"
import { LanguageToggle } from "@/components/shared/LanguageToggle"
import { ThemeToggle } from "@/components/shared/ThemeToggle"
import { AuthHero } from "@/components/shared/AuthHero"

const inviteSchema = z.object({
  name: z.string(),
  password: z.string(),
})

export default function AcceptInvitationPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")
  const [showPassword, setShowPassword] = useState(false)

  const inviteForm = useForm<Omit<AcceptBusinessInviteBody, "invitation_token">>({
    resolver: zodResolver(inviteSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      password: "",
    },
  })
  const { control, handleSubmit } = inviteForm

  const userName = useWatch({ control, name: "name" })
  const userPassword = useWatch({ control, name: "password" })

  const { isPending, mutateAsync } = useMutation({
    mutationFn: (body: AcceptBusinessInviteBody) => userServices.acceptBusinessInvite(body),
    onSuccess: () => {
      navigate("/")
    },

    onError: (err: any) => {
      const msg = err?.response?.data?.detail?.[0]?.msg ?? t("invited.invitation-error")
      toast({ title: t("common.error"), description: msg, type: "error" })
    },
  })

  const handleInitial = handleSubmit(async (data) => {
    if (!userName || !userPassword) return
    await mutateAsync({
      invitation_token: token,
      name: data.name,
      password: data.password,
    })
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 lg:h-screen">
      {/* Left Side */}
      <div className="relative flex-1 flex items-center justify-center p-8 dark:bg-neutral-700 bg-[#f8f9fa]">
        <div className="absolute top-6 right-6 z-10 flex items-center justify-end gap-4">
          <LanguageToggle />
          <ThemeToggle />
        </div>
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl text-black dark:text-white font-bold">{t("invited.title")}</h1>
            <p className="text-gray-600 dark:text-gray-400">{t("invited.subtitle")}</p>
          </div>

          <form onSubmit={handleInitial} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-semibold text-black dark:text-white">
                {t("common.name")}
              </Label>
              <Controller
                name="name"
                control={control}
                render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                  <Input
                    id="name"
                    placeholder={t("invited.your-name")}
                    error={error?.message}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="font-semibold text-black dark:text-white">
                {t("common.password")}
              </Label>
              <div className="relative">
                <Controller
                  name="password"
                  control={control}
                  render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                    <Input
                      id="password"
                      placeholder={t("invited.set-password")}
                      type={showPassword ? "text" : "password"}
                      error={error?.message}
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                    />
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent rounded-full"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {!showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              isLoading={isPending}
              disabled={!userName || !userPassword}
            >
              {t("invited.cta-btn")}
            </Button>
          </form>
        </div>
      </div>
      {/* Right Side */}
      <AuthHero />
    </div>
  )
}
