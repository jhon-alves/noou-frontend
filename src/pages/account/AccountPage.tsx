import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useLocation, useParams } from "react-router-dom"
import { Shield, User, Link2, Settings } from "lucide-react"
import { IntegrationsTab } from "@/components/account/IntegrationsTab"
import { PreferencesTab } from "@/components/account/PreferencesTab"
import { SecurityTab } from "@/components/account/security/SecurityTab"
import { ProfileTab } from "@/components/account/ProfileTab"
import { PageWrapper } from "@/components/shared/PageWrapper"
import { useGetIntegration } from "./hooks/useGetIntegration"
import { useAccountStore } from "./stores/useAccountStore"
import { Tabs } from "@/components/shared/Tabs"

type AccountTabs = "profile" | "security" | "preferences" | "integrations"

const AccountPage = () => {
  const { t } = useTranslation()
  const { token } = useParams()
  const { pathname } = useLocation()
  const { activeTab, setActiveTab } = useAccountStore()

  const { data: integrations, isPending: loadingIntegrations } = useGetIntegration(activeTab)

  const baseRoute = `/${pathname.split("/").filter(Boolean)[0]}`

  useEffect(() => {
    if (baseRoute === "/change-password" && token) {
      setActiveTab("security")
    }
  }, [token, baseRoute, setActiveTab])

  const tabs = [
    { id: "profile", label: t("settings.tabs.profile"), icon: User },
    { id: "preferences", label: t("settings.tabs.preferences"), icon: Settings },
    { id: "security", label: t("settings.tabs.security"), icon: Shield },
    { id: "integrations", label: t("settings.tabs.integrations"), icon: Link2 },
  ]

  return (
    <PageWrapper>
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        variant="icon-text"
        onTabChange={(tabId) => setActiveTab(tabId as AccountTabs)}
        className="flex-wrap"
      />

      {activeTab === "profile" && <ProfileTab />}
      {activeTab === "preferences" && <PreferencesTab />}
      {activeTab === "security" && <SecurityTab />}
      {activeTab === "integrations" && (
        <IntegrationsTab integration={integrations} loading={loadingIntegrations} />
      )}
    </PageWrapper>
  )
}

export default AccountPage
