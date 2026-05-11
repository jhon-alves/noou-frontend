import * as z from "zod"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ResetInitialPasswordBody } from "@/services/auth/types"
import { useMutation } from "@tanstack/react-query"
import { authServices } from "@/services/auth/auth-services"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { AuthHero } from "@/components/shared/AuthHero"
import { LanguageToggle } from "@/components/shared/LanguageToggle"
import { ThemeToggle } from "@/components/shared/ThemeToggle"

export default function ForgotPassword() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [step, setStep] = useState<"initial" | "sended">("initial")

  const initialSchema = z.object({
    email: z.email(t("form.enter-your-email")),
  })

  useEffect(() => {
    return () => {
      setStep("initial")
    }
  }, [])

  const initialForm = useForm({
    resolver: zodResolver(initialSchema),
    mode: "onBlur",
    defaultValues: { email: "" },
  })

  const { isPending: loadingInitial, mutateAsync: mutateInitial } = useMutation({
    mutationFn: (body: ResetInitialPasswordBody) => authServices.resetInitialPassword(body),
    onSuccess: () => {
      setStep("sended")
    },
  })

  const handleInitial = initialForm.handleSubmit(async (data) => {
    await mutateInitial(data)
  })

  function returnToLogin() {
    setStep("initial")
    navigate(-1)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 lg:h-screen">
      {/* Left Side */}
      <div className="relative flex items-center justify-center p-8 dark:bg-neutral-700 bg-[#f8f9fa]">
        <div className="absolute top-6 right-6 z-10 flex items-center justify-end gap-4">
          <LanguageToggle />
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2">
            {step === "initial" && (
              <>
                <h1 className="text-3xl font-bold text-black dark:text-white">
                  {t("forgot-password.title")}
                </h1>
                <p className="text-gray-400">{t("forgot-password.subtitle")}</p>
              </>
            )}
          </div>

          {step === "initial" ? (
            /* Recover Initial Password Form */
            <form onSubmit={handleInitial} className="space-y-8">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="font-semibold text-black dark:text-white">
                  E-mail
                </Label>
                <Controller
                  control={initialForm.control}
                  name="email"
                  render={({ field: { value, onChange } }) => (
                    <Input
                      id="email"
                      type="email"
                      value={value}
                      onChange={onChange}
                      placeholder="E-mail"
                      required
                    />
                  )}
                />
              </div>

              <div className="space-y-4">
                <Button type="submit" className="w-full" isLoading={loadingInitial}>
                  {t("forgot-password.reset-password")}
                </Button>
                <Button className="w-full" variant="outline" onClick={returnToLogin}>
                  {t("forgot-password.go-back-login")}
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-neutral-500 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="text-white"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p className="text-gray-400">{t("forgot-password.info")}</p>
              </div>

              <div className="space-y-4">
                <Button className="w-full" variant="outline" onClick={returnToLogin}>
                  {t("forgot-password.go-back-login")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Right Side */}
      <AuthHero />
    </div>
  )
}
