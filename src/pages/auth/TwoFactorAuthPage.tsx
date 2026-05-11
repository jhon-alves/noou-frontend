import z from "zod"
import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { REGEXP_ONLY_DIGITS } from "input-otp"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useMutation } from "@tanstack/react-query"
import { Controller, useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { ValidateOtpBody } from "@/services/auth/types"
import { Button } from "@/components/ui/button"
import { authServices } from "@/services"
import { cn } from "@/lib/utils"
import { useTwoFactorStore } from "@/stores/useTwoFactorStore"
import { tokens } from "@/config/tokens"
import { LanguageToggle } from "@/components/shared/LanguageToggle"
import { ThemeToggle } from "@/components/shared/ThemeToggle"

const OTP_LENGTH = 6

const otpSchema = z.object({
  otp_code: z.string(),
})

export default function TwoFactorAuthPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { timer, startTimer } = useTwoFactorStore()
  const [error, setError] = useState("")
  const otpContainerRef = useRef<HTMLDivElement | null>(null)

  const focusOtp = () => {
    const firstInput = otpContainerRef.current?.querySelector("input")
    firstInput?.focus()
  }

  useEffect(() => {
    requestAnimationFrame(focusOtp)
  }, [])

  const { control, reset, handleSubmit } = useForm<ValidateOtpBody>({
    resolver: zodResolver(otpSchema),
    mode: "onBlur",
    defaultValues: { otp_code: "" },
  })

  const otpCode = useWatch({ control, name: "otp_code" })

  const { mutateAsync: mutateOtp, isPending } = useMutation({
    mutationFn: (body: ValidateOtpBody) => authServices.validateOtp(body),
    onSuccess: () => {
      const redirect = localStorage.getItem(tokens.redirectAfterLogin)

      if (redirect) {
        navigate(`${redirect}`)
        localStorage.removeItem(tokens.redirectAfterLogin)
      } else {
        navigate("/dashboard")
      }
    },
    onError: () => {
      setError(t("twofactor.invalidCode"))
    },
  })

  const handleSubmitOtp = handleSubmit(async (data) => {
    if (otpCode.length !== 6) {
      setError(t("twofactor.invalidCode"))
      return
    }
    await mutateOtp(data)
  })

  useEffect(() => {
    if (otpCode?.length === 6) {
      handleSubmitOtp()
    }
  }, [otpCode])

  const { mutateAsync: resendCode } = useMutation({
    mutationFn: () => authServices.resendOtp(),
    onSuccess: () => {
      reset({ otp_code: "" })
      focusOtp()
      startTimer()
    },
  })

  return (
    <div className="relative min-h-screen flex items-center justify-center p-8 bg-white dark:bg-neutral-700">
      <div className="absolute top-6 right-6 z-10 flex items-center justify-end gap-4">
        <LanguageToggle />
        <ThemeToggle />
      </div>

      <motion.div
        className="w-full max-w-md space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <motion.div
            className="w-16 h-16 bg-neutral-500 rounded-full flex items-center justify-center mx-auto mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </motion.div>

          <h2 className="text-3xl font-bold text-black dark:text-white mb-2">
            {t("twofactor.title")}
          </h2>
          <p className="text-gray-600 dark:text-[#9ca3af]">{t("twofactor.subtitle")}</p>
        </div>

        <form onSubmit={handleSubmitOtp} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-600 dark:text-white mb-4 text-center">
              {t("twofactor.enterCode")}
            </label>
            <div className="flex gap-3 justify-center">
              <Controller
                control={control}
                name="otp_code"
                render={({ field: { value, onChange } }) => (
                  <div ref={otpContainerRef} className="flex flex-col items-center gap-2">
                    <InputOTP
                      maxLength={OTP_LENGTH}
                      value={value}
                      pattern={REGEXP_ONLY_DIGITS}
                      pasteTransformer={(pasted) => pasted.replace(/\D/g, "").slice(0, OTP_LENGTH)}
                      onChange={(nextValue) => {
                        onChange(nextValue.replace(/\D/g, "").slice(0, OTP_LENGTH))
                      }}
                      containerClassName="justify-center"
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                )}
              />
            </div>
            {error && (
              <motion.p
                className="text-red-400 text-xs mt-3 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {error}
              </motion.p>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex justify-center">
              <button
                type="button"
                disabled={timer > 0}
                onClick={() => resendCode()}
                className={cn(
                  "text-sm text-gray-600 dark:text-[#9ca3af] font-semibold transition-colors",
                  timer <= 0 && "hover:text-gray-600/60 hover:dark:text-white cursor-pointer",
                )}
              >
                {timer > 0
                  ? `${t("twofactor.resend-in")} ${timer.toString().padStart(2, "0")}s`
                  : t("twofactor.resend")}
              </button>
            </div>
            <Button
              type="submit"
              isLoading={isPending}
              disabled={!otpCode || otpCode.length < 6}
              className="w-full"
            >
              {t("twofactor.verify")}
            </Button>
            <Button variant="outline" onClick={() => navigate(-1)}>
              {t("twofactor.back")}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
