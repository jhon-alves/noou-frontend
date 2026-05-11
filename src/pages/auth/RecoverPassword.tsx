import * as z from "zod"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ConfirmResetPasswordBody } from "@/services/auth/types"
import { authServices } from "@/services/auth/auth-services"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { AuthHero } from "@/components/shared/AuthHero"
import { LanguageToggle } from "@/components/shared/LanguageToggle"
import { ThemeToggle } from "@/components/shared/ThemeToggle"

export default function RecoverPassword() {
  const { token } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [showPassword, setShowPassword] = useState(false)

  const confirmSchema = z.object({
    new_password: z.string().min(1, t("form.enter-new-password")),
  })

  const confirmForm = useForm({
    resolver: zodResolver(confirmSchema),
    mode: "onBlur",
    defaultValues: { new_password: "" },
  })

  const { isPending: loadingConfirm, mutateAsync: mutateConfirm } = useMutation({
    mutationFn: (body: ConfirmResetPasswordBody) => authServices.confirmResetPassword(body),
    onSuccess: () => {
      navigate("/")
    },
  })

  const handleAuth = confirmForm.handleSubmit(async (data) => {
    await mutateConfirm({
      token: token,
      new_password: data.new_password,
    })
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 lg:h-screen">
      {/* Left Side */}
      <div className="relative flex items-center justify-center p-8 dark:bg-[#1a2332] bg-[#f8f9fa]">
        <div className="absolute top-6 right-6 z-10 flex items-center justify-end gap-4">
          <LanguageToggle />
          <ThemeToggle />
        </div>
        <div className="relative w-full max-w-md space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-black dark:text-white">
              {t("recover-password.title")}
            </h1>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="relative">
              <Label htmlFor="new_password" className="font-semibold text-black dark:text-white">
                {t("common.password")}
              </Label>
              <Controller
                control={confirmForm.control}
                name="new_password"
                render={({ field: { value, onChange } }) => (
                  <div className="relative">
                    <Input
                      id="new_password"
                      type={showPassword ? "text" : "password"}
                      value={value}
                      onChange={onChange}
                      placeholder={t("common.password")}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent rounded-full"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                    >
                      {!showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                  </div>
                )}
              />
            </div>

            <div className="space-y-4">
              <Button type="submit" className="w-full" isLoading={loadingConfirm}>
                {t("common.confirm")}
              </Button>
              <Button className="w-full" variant="outline" onClick={() => navigate("/login")}>
                {t("recover-password.back-to-login")}
              </Button>
            </div>
          </form>
        </div>
      </div>
      {/* Right Side */}
      <AuthHero />
    </div>
  )
}
