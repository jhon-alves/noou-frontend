import { useEffect } from "react"
import { useLocation, useParams } from "react-router-dom"
import { useGetUserSecrets } from "@/pages/account/hooks/useGetUserSecrets"
import { useAccountStore } from "@/pages/account/stores/useAccountStore"
import { ChangeUserPassword } from "./ChangeUserPassword"
import { UserSecrets } from "./UserSecrets"

export function SecurityTab() {
  const { token } = useParams()
  const { pathname } = useLocation()
  const { activeTab, setOpenChangeUserPasswordModal } = useAccountStore()

  const { data: userSecrets, isPending: loadingSecrets } = useGetUserSecrets(activeTab)

  const baseRoute = `/${pathname.split("/").filter(Boolean)[0]}`

  useEffect(() => {
    if (baseRoute === "/change-password" && token) {
      setOpenChangeUserPasswordModal(true)
    }
  }, [token, baseRoute])

  return (
    <div className="space-y-6">
      <ChangeUserPassword token={token} />
      <UserSecrets secrets={userSecrets} loadingSecrets={loadingSecrets} />
    </div>
  )
}
