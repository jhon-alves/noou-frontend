import * as z from "zod"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useMutation } from "@tanstack/react-query"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { LanguageToggle } from "@/components/shared/LanguageToggle"
import { useTwoFactorStore } from "@/stores/useTwoFactorStore"
import { ThemeToggle } from "@/components/shared/ThemeToggle"
import { authServices } from "@/services/auth/auth-services"
import { AuthHero } from "@/components/shared/AuthHero"
import { LoginBody } from "@/services/auth/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const loginSchema = z.object({
  email: z.email("Informe o seu e-mail"),
  password: z.string(),
})

export default function Login() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { startTimer } = useTwoFactorStore()
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const loginForm = useForm<LoginBody>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: { email: "", password: "" },
  })

  const { isPending: loadingLogin, mutateAsync: mutateLogin } = useMutation({
    mutationFn: (body: LoginBody) => authServices.login(body),
    onSuccess: () => {
      navigate("/twofactor")
      startTimer()
    },
  })

  const handleLogin = loginForm.handleSubmit(async (data) => {
    await mutateLogin(data)
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 lg:h-screen">
      {/* Left Side */}
      <AuthHero />
      {/* Right Side */}
      <div className="relative dark:bg-neutral-700 bg-[#f8f9fa]">
        <div className="absolute top-6 right-6 z-10 flex items-center justify-end gap-4">
          <LanguageToggle />
          <ThemeToggle />
        </div>
        <div className="relative h-screen flex flex-col items-center justify-center p-8 ">
          <div className="w-full max-w-md space-y-8">
            <div className="space-y-2">
              <div className="lg:hidden mb-8">
                <img src="/logo.webp" alt="Noou" className="h-10 w-auto object-contain mx-auto" />
              </div>
              <h1 className="text-3xl text-black dark:text-white font-bold">{t("login.signin")}</h1>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="password" className="font-semibold text-black dark:text-white">
                    {t("login.email-address")}
                  </Label>
                  <Controller
                    control={loginForm.control}
                    name="email"
                    render={({ field, fieldState: { error } }) => (
                      <Input
                        id="email"
                        type="email"
                        placeholder="Digite seu email"
                        error={error?.message}
                        required
                        {...field}
                      />
                    )}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="password" className="font-semibold text-black dark:text-white">
                    {t("common.password")}
                  </Label>
                  <div className="relative">
                    <Controller
                      control={loginForm.control}
                      name="password"
                      render={({ field, fieldState: { error } }) => (
                        <Input
                          id="password"
                          placeholder={t("common.password")}
                          type={showPassword ? "text" : "password"}
                          error={error?.message}
                          required
                          {...field}
                        />
                      )}
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
                </div>
              </div>

              <div className="flex items-center justify-end text-sm">
                <button
                  type="button"
                  className="hover:opacity-80 transition-opacity cursor-pointer text-black dark:text-white font-semibold"
                  onClick={() => navigate("/forgot-password")}
                >
                  {t("login.forgot-password")}
                </button>
              </div>

              <Button type="submit" className="w-full" isLoading={loadingLogin}>
                {t("login.enter")}
              </Button>
            </form>

            <div className="text-center">
              <span className="text-xs text-gray-700 dark:text-[#9ca3af]">
                {t("login.by-continuing")}{" "}
                <span className="font-bold dark:text-white text-black hover:underline cursor-pointer">
                  {t("login.terms-of-service")}
                </span>{" "}
                {t("login.and")} <br />
                <span
                  onClick={() => navigate("/privacy")}
                  className="font-bold dark:text-white text-black hover:underline cursor-pointer"
                >
                  {t("privacy.title")}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
