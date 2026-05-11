import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useQuery } from "@tanstack/react-query"
import { Edit, Shield } from "lucide-react"
import { BusinessPermissionsModal } from "../business/BusinessPermissionsModal"
import { BusinessUserEditModal } from "../business/BusinessUserEditModal"
import { BusinessUsersData } from "@/services/business/types"
import { aclServices } from "@/services"
import { Chip } from "../shared/Chip"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

interface UsersTableBodyProps {
  user: BusinessUsersData
  businessId: number
}

export function UsersTableBody({ user, businessId }: UsersTableBodyProps) {
  const { t } = useTranslation()
  const [showEditModal, setShowEditModal] = useState<boolean>(false)
  const [showPermissionsModal, setShowPermissionsModal] = useState(false)
  const isAdmin = user.roles.map((item) => item.name === "admin")[0]

  const { data: roles } = useQuery({
    queryKey: ["roles"],
    queryFn: () => aclServices.getRoles(),
  })

  const { data: userRoles } = useQuery({
    queryKey: ["user-roles", businessId, user.id],
    queryFn: () => aclServices.getUserRoles(businessId, user.id),
    enabled: showPermissionsModal,
  })

  return (
    <>
      <tr className="border-b last:border-b-0 transition-colors dark:border-[#404040] dark:bg-[#2A2A2A]/50 border-[#e7e7e7] hover:bg-gray-50/50">
        <td className="w-[40%] px-6 py-4">
          <div>
            <p className="font-semibold text-sm dark:text-[#E5E5E5] text-gray-900">{user.name}</p>
            <p className="text-xs dark:text-[#808080] text-[#666f8d]">{user.email}</p>
          </div>
        </td>
        <td className="w-[20%] px-6 py-4">{isAdmin && <Chip label="Admin" size="sm" />}</td>
        <td className="w-[20%] px-6 py-4">
          <Badge
            variant={user.is_active ? "default" : "destructive"}
            className={cn(
              "lowercase",
              user.is_active && "bg-green-100 text-green-700! hover:bg-green-100 ",
            )}
          >
            {user.is_active ? t("common.active") : t("common.inactive")}
          </Badge>
        </td>
        <td className="px-6 py-4 min-w-0 w-auto whitespace-nowrap">
          <div className="flex items-center gap-2">
            <Button variant="text" size="sm" onClick={() => setShowPermissionsModal(true)}>
              <Shield className="w-3.5 h-3.5" />
              {!useIsMobile() && t("common.permissions")}
            </Button>
            <Button variant="text" size="sm" onClick={() => setShowEditModal(true)}>
              <Edit className="w-3.5 h-3.5" />
              {!useIsMobile() && t("common.edit")}
            </Button>
          </div>
        </td>
      </tr>

      {showEditModal && (
        <BusinessUserEditModal
          isOpen={showEditModal}
          user={{
            id: user.id,
            name: user.name,
            email: user.email,
            status: "",
            is_active: user.is_active,
          }}
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
