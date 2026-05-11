import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog"
import { useAccountStore } from "@/pages/account/stores/useAccountStore"
import { ConfirmResetPasswordBody } from "@/services/auth/types"
import { Eye, EyeOff, Lock, LockIcon } from "lucide-react"
import { FormContent } from "../../shared/FormContent"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { authServices } from "@/services"
import { toast } from "@/hooks/useToast"

interface ChangeUserPasswordProps {
  token: string
}

export function ChangeUserPassword({ token }: ChangeUserPasswordProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { openChangeUserPasswordModal, setOpenChangeUserPasswordModal } = useAccountStore()
  const [security, setSecurity] = useState({ new_password: "", confirm_password: "" })

  const passwordMismatchError =
    security.new_password &&
    security.confirm_password &&
    security.new_password !== security.confirm_password

  const { mutateAsync: onInitiate } = useMutation({
    mutationFn: () => authServices.changePasswordInitiate(),
    onSuccess: () => {
      toast({
        title: t("common.success"),
        description: t("settings.security.password-link-success"),
        type: "success",
      })
    },
  })

  async function handleSendLink() {
    await onInitiate()
  }

  const { mutateAsync: onConfirm, isPending: loadingConfirm } = useMutation({
    mutationFn: (body: ConfirmResetPasswordBody) => authServices.changePasswordConfirm(body),
    onSuccess: () => {
      setSecurity({ new_password: "", confirm_password: "" })
      toast({
        title: t("common.success"),
        description: t("settings.security.password-success"),
        type: "success",
      })
      setOpenChangeUserPasswordModal(false)
      navigate("/account", { replace: true })
    },
  })

  async function handleConfirmChangedPassword() {
    await onConfirm({
      token,
      new_password: security.new_password,
    })
  }

  return (
    <>
      <Dialog open={openChangeUserPasswordModal} onOpenChange={setOpenChangeUserPasswordModal}>
        <DialogContent className="flex flex-col gap-6">
          <DialogHeader className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <LockIcon className="size-5 text-black dark:text-white" />
              <DialogTitle>{t("settings.security.password-title-modal")}</DialogTitle>
            </div>
            <DialogDescription>{t("settings.security.password-title-desc")}</DialogDescription>
          </DialogHeader>

          <DialogBody>
            <FormContent>
              <Label isRequired>{t("settings.security.new-password")}</Label>
              <div className="relative">
                <Input
                  id="new_password"
                  type={showNewPassword ? "text" : "password"}
                  placeholder={t("settings.security.enter-new-password")}
                  value={security.new_password}
                  onChange={(e) => setSecurity({ ...security, new_password: e.target.value })}
                  className="rounded-full pr-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent rounded-full"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
            </FormContent>
            <FormContent>
              <Label isRequired>{t("settings.security.confirm-password")}</Label>
              <div className="relative">
                <Input
                  id="confirm_password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t("settings.security.enter-confirm-password")}
                  value={security.confirm_password}
                  onChange={(e) => setSecurity({ ...security, confirm_password: e.target.value })}
                  className="rounded-full pr-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent rounded-full"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
            </FormContent>
            {passwordMismatchError && (
              <span className="text-xs text-red-400">
                {t("settings.security.password-different")}
              </span>
            )}
          </DialogBody>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenChangeUserPasswordModal(false)}>
              {t("common.cancel")}
            </Button>
            <Button
              disabled={
                !security.new_password && !security.confirm_password && passwordMismatchError
              }
              isLoading={loadingConfirm}
              onClick={handleConfirmChangedPassword}
            >
              {t("common.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="rounded-2xl p-6 border border-gray-300 dark:border-white/15 space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="flex items-center gap-2 font-medium text-black dark:text-white">
            <Lock size={20} />
            {t("settings.security.password-title")}
          </h1>
          <p className="text-sm dark:text-[#808080] text-[#666f8d]">
            {t("settings.security.password-desc")}
          </p>
        </div>
        <Button onClick={handleSendLink}>{t("settings.security.password-send-link")}</Button>
      </div>
    </>
  )
}
