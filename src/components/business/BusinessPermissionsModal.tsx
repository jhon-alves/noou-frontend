import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
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
import {
  AssignRolesBody,
  RevokeRolesBody,
  RolesData,
  UserRolesResponse,
} from "@/services/acl/types"
import { Checkbox } from "../shared/Checkbox"
import { useMeStore } from "@/stores/meStore"
import { toast } from "@/hooks/useToast"
import { aclServices } from "@/services"
import { Button } from "../ui/button"

interface BusinessPermissionsModalProps {
  roles: RolesData[]
  userRoles: UserRolesResponse
  isOpen: boolean
  userId: number
  businessId: number
  onClose: () => void
}

export function BusinessPermissionsModal({
  roles,
  userRoles,
  isOpen,
  userId,
  businessId,
  onClose,
}: BusinessPermissionsModalProps) {
  const { me } = useMeStore()
  const qc = useQueryClient()
  const { t } = useTranslation()
  const [initialPermissions, setInitialPermissions] = useState<number[]>([])
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([])

  useEffect(() => {
    if (!userRoles?.roles) return

    const activeRoleIds = userRoles.roles.map((ur) => ur.id)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInitialPermissions(activeRoleIds)
    setSelectedPermissions(activeRoleIds)
  }, [userRoles])

  const { isPending: loadingAssign, mutateAsync: assign } = useMutation({
    mutationFn: (body: AssignRolesBody) => aclServices.assignRolesToUser(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users", businessId] })
    },
  })

  const { isPending: loadingRevoke, mutateAsync: revoke } = useMutation({
    mutationFn: (body: RevokeRolesBody) => aclServices.revokeRolesFromUser(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["users", businessId] })
    },
  })

  function handleToggleRole(roleId: number, checked: boolean) {
    setSelectedPermissions((prev) =>
      checked ? [...prev, roleId] : prev.filter((r) => r !== roleId),
    )
  }

  async function handleSave() {
    if (!me?.current_business_id) return

    const toAssign = selectedPermissions.filter((id) => !initialPermissions.includes(id))

    const toRevoke = initialPermissions.filter((id) => !selectedPermissions.includes(id))

    try {
      const promises = []

      if (toAssign.length > 0) {
        promises.push(
          assign({
            user_id: Number(userId),
            role_ids: toAssign,
            business_id: businessId,
          }),
        )
      }

      if (toRevoke.length > 0) {
        promises.push(
          revoke({
            user_id: Number(userId),
            role_ids: toRevoke,
            business_id: businessId,
          }),
        )
      }

      await Promise.all(promises)

      qc.invalidateQueries({ queryKey: ["user-roles", businessId, userId] })

      toast({
        title: t("common.success"),
        description: t("admin.permissions-success"),
        type: "success",
      })

      onClose()
    } catch {
      toast({
        title: t("common.error"),
        description: t("admin.permissions-error"),
        type: "error",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("admin.manage-permissions")}</DialogTitle>
          <DialogDescription>{t("admin.set-permissions")}</DialogDescription>
        </DialogHeader>

        <DialogBody>
          {roles.map((permission) => (
            <div
              key={permission?.id}
              className="flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors dark:border-[#404040] dark:hover:bg-[#2A2A2A] border-[#e7e7e7] hover:bg-gray-50"
            >
              <div className="mt-0.5">
                <Checkbox
                  checked={selectedPermissions.includes(permission.id)}
                  onChange={(checked) => handleToggleRole(permission.id, checked === true)}
                  variant="filled"
                  size="medium"
                />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm dark:text-[#E5E5E5] text-gray-900">
                  {permission?.name ?? "—"}
                </p>
                <p className="text-xs dark:text-[#808080] text-[#666f8d]">
                  {permission?.description ?? "—"}
                </p>
              </div>
            </div>
          ))}
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button isLoading={loadingAssign || loadingRevoke} onClick={handleSave}>
            {t("common.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
