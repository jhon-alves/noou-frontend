import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { BusinessPermissionsModal } from "./BusinessPermissionsModal"
import { RemoveUserToBusinessBody } from "@/services/business/types"
import { BusinessUsersTableMenu } from "./BusinessUsersTableMenu"
import { BusinessUserEditModal } from "./BusinessUserEditModal"
import { aclServices, businessServices } from "@/services"
import { TableCell, TableRow } from "../ui/table"
import { useMeStore } from "@/stores/meStore"
import { toast } from "@/hooks/useToast"
import { Badge } from "../ui/badge"

interface UserTableRowProps {
  user: {
    id: number
    name: string
    email: string
    status: string
    is_active: boolean
  }
  businessId: number
}

export function UserTableRow({ user, businessId }: UserTableRowProps) {
  const qc = useQueryClient()
  const { me } = useMeStore()
  const { t } = useTranslation()
  const [showEditModal, setShowEditModal] = useState<boolean>(false)
  const [showPermissionsModal, setShowPermissionsModal] = useState<boolean>(false)
  const isCurrentUser = user.id === me?.id

  const { data: roles } = useSuspenseQuery({
    queryKey: ["roles"],
    queryFn: () => aclServices.getRoles(),
  })

  const { data: userRoles } = useQuery({
    queryKey: ["user-roles", businessId, user.id],
    queryFn: () => aclServices.getUserRoles(businessId, user.id),
    enabled: showPermissionsModal,
  })

  const { mutateAsync } = useMutation({
    mutationFn: (body: RemoveUserToBusinessBody) => businessServices.removeUserFromBusiness(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["business-details"] })
      toast({
        title: t("common.success"),
        description: t("business.user-removed-success"),
        type: "success",
      })
    },
  })

  async function handleRemoveUserFromBusiness(userId: number) {
    await mutateAsync({
      business_id: businessId,
      user_id: userId,
    })
  }

  return (
    <>
      <TableRow className="border-b last:border-b-0 border-[#e7e7e7] dark:border-[#404040] dark:bg-[#2A2A2A]/50 hover:bg-gray-50">
        <TableCell className="font-medium text-black dark:text-white">{user.name ?? "—"}</TableCell>
        <TableCell className="font-medium text-black dark:text-white">{user.email}</TableCell>
        <TableCell>
          {user.is_active ? (
            <Badge className="bg-green-100 text-green-700! hover:bg-green-100 lowercase">
              {t("common.active")}
            </Badge>
          ) : (
            <Badge variant="destructive" className="lowercase">
              {t("common.inactive")}
            </Badge>
          )}
        </TableCell>
        <TableCell>
          {user.status === "ACCEPTED" ? (
            <Badge className="bg-green-100 text-green-700! hover:bg-green-100 lowercase">
              {t("common.accepted")}
            </Badge>
          ) : (
            <Badge variant="destructive" className="lowercase">
              {t("common.invitation-sent")}
            </Badge>
          )}
        </TableCell>

        <TableCell className="text-right">
          <BusinessUsersTableMenu
            isCurrentUser={isCurrentUser}
            onPermissions={() => setShowPermissionsModal(true)}
            onEdit={() => setShowEditModal(true)}
            onDelete={() => handleRemoveUserFromBusiness(user.id)}
          />
        </TableCell>
      </TableRow>

      {showEditModal && (
        <BusinessUserEditModal
          isOpen={showEditModal}
          user={user}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {showPermissionsModal && (
        <BusinessPermissionsModal
          roles={roles}
          userRoles={userRoles}
          isOpen={showPermissionsModal}
          userId={user.id}
          businessId={businessId}
          onClose={() => setShowPermissionsModal(false)}
        />
      )}
    </>
  )
}
