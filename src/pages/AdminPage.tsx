import { useState } from "react"
import { useTranslation } from "react-i18next"
import { GraduationCap, LinkIcon, SquarePen, Users } from "lucide-react"
import { AdminContentsTab } from "@/components/admin/contents/AdminContentsTab"
import { AdminSecretsTab } from "@/components/admin/AdminSecretsTab"
import { AdminUsersTab } from "@/components/admin/AdminUsersTab"
import { PageWrapper } from "@/components/shared/PageWrapper"
import { useBusinessStore } from "@/stores/useBusinessStore"
import { PageHeader } from "@/components/shared/PageHeader"
import { Tabs } from "@/components/shared/Tabs"
import { AdminSkeleton } from "@/components/admin/AdminSkeleton"
import { AdminPromptsTab } from "@/components/admin/prompts/AdminPromptsTab"

type AdminTabs = "users" | "secrets" | "contents" | "prompts"

export default function AdminPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<AdminTabs>("users")
  const { selectedBusiness } = useBusinessStore()
  const hasBusiness = !!selectedBusiness
  const businessId = selectedBusiness?.id

  return (
    <PageWrapper>
      <PageHeader
        title={t("business.title")}
        subtitle={t("business.subtitle")}
        breadcrumbs={[{ label: t("nav.home"), href: "/dashboard" }, { label: t("nav.admin") }]}
      />
      {!hasBusiness && <AdminSkeleton />}

      {hasBusiness && (
        <div className="flex flex-col gap-8">
          <Tabs
            tabs={[
              { id: "users", label: t("common.users"), icon: Users },
              { id: "secrets", label: t("secrets.title"), icon: LinkIcon },
              { id: "contents", label: t("nav.contents"), icon: GraduationCap },
              { id: "prompts", label: t("nav.prompts"), icon: SquarePen },
            ]}
            activeTab={activeTab}
            onTabChange={(tabId) => setActiveTab(tabId as AdminTabs)}
            variant="icon-text"
            size="small"
          />

          {activeTab === "users" && <AdminUsersTab businessId={businessId} />}
          {activeTab === "secrets" && <AdminSecretsTab businessId={businessId} />}
          {activeTab === "contents" && <AdminContentsTab businessId={businessId} />}
          {activeTab === "prompts" && <AdminPromptsTab businessId={businessId} />}
        </div>
      )}
    </PageWrapper>
  )
}
