import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useSuspenseQuery } from "@tanstack/react-query"
import { CheckCircle2, UserPlus, Users, XCircle } from "lucide-react"
import { InviteUserModal } from "./InviteUserModal"
import { UsersTableBody } from "./UsersTableBody"
import { SearchBar } from "../shared/SearchBar"
import { businessServices } from "@/services"
import { Button } from "../ui/button"

export function AdminUsersTab({ businessId }: { businessId: number }) {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState("")
  const [showInviteModal, setShowInviteModal] = useState(false)

  const { data: usersData } = useSuspenseQuery({
    queryKey: ["users", businessId],
    queryFn: () => businessServices.getUsers(businessId),
  })

  const stats = [
    {
      label: t("admin.total-users"),
      value: usersData.length,
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      label: t("admin.active-users"),
      value: usersData.filter((user) => user.is_active).length,
      icon: CheckCircle2,
      color: "text-green-600 dark:text-green-400",
    },
    {
      label: t("common.inactive"),
      value: usersData.filter((user) => !user.is_active).length,
      icon: XCircle,
      color: "text-gray-600 dark:text-gray-400",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="rounded-3xl p-6 border dark:border-[#404040] dark:bg-[#2A2A2A]/50 border-[#e7e7e7] bg-white/60 backdrop-blur-[20px]"
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <h3 className="text-2xl font-semibold dark:text-[#E5E5E5] text-gray-900">
                {stat.value}
              </h3>
            </div>
            <p className="text-sm dark:text-[#B3B3B3] text-[#666f8d]">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Barra de Ações */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex-1 w-full md:max-w-md">
          <SearchBar
            placeholder={t("admin.search-users")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="filled" size="md" onClick={() => setShowInviteModal(true)}>
          <UserPlus className="w-4 h-4" />
          {t("admin.invite-user")}
        </Button>
      </div>

      {/* Tabela de Usuários */}
      <div className="w-full rounded-3xl border overflow-hidden dark:border-[#404040] dark:bg-[#2A2A2A]/50 border-[#e7e7e7] bg-white/60 backdrop-blur-[20px]">
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="border-b dark:border-[#404040] border-[#e7e7e7]">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold cursor-pointer transition-colors dark:text-[#B3B3B3] text-[#666f8d] hover:bg-gray-50/50 dark:hover:bg-[#2A2A2A]/50">
                  <div className="flex items-center">{t("common.user")}</div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold cursor-pointer transition-colors dark:text-[#B3B3B3] text-[#666f8d] hover:bg-gray-50/50 dark:hover:bg-[#2A2A2A]/50">
                  <div className="flex items-center">{t("common.role")}</div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold cursor-pointer transition-colors dark:text-[#B3B3B3] text-[#666f8d] hover:bg-gray-50/50 dark:hover:bg-[#2A2A2A]/50">
                  <div className="flex items-center">Status</div>
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold cursor-pointer transition-colors dark:text-[#B3B3B3] text-[#666f8d] hover:bg-gray-50/50 dark:hover:bg-[#2A2A2A]/50">
                  <div className="flex items-center">{t("common.actions")}</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {usersData.map((user) => (
                <UsersTableBody key={user.id} user={user} businessId={businessId} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showInviteModal && businessId && (
        <InviteUserModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          businessId={businessId}
        />
      )}
    </div>
  )
}
