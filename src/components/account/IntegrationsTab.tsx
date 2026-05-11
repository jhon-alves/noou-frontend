import { useEffect, useState } from "react"
import { type IntegrationData } from "@/services/integrations/types"
import { IntegrationSkeleton } from "./IntegrationSkeleton"
import { toast } from "@/hooks/useToast"
import { Switch } from "../shared/Switch"
import { Button } from "../ui/button"
import { api } from "@/services/api"
import { config } from "@/config"
import { useTranslation } from "react-i18next"

interface IntegrationTabProps {
  integration: IntegrationData
  loading: boolean
}

export function IntegrationsTab({ integration, loading }: IntegrationTabProps) {
  const { t } = useTranslation()
  const initialScopes = {
    GMAIL_READONLY: false,
    GMAIL_MODIFY: false,
    GMAIL_COMPOSE: false,
    DRIVE_FILE: false,
    SPREADSHEETS_READONLY: false,
  }
  const [scopes, setScopes] = useState(initialScopes)
  const [draftScopes, setDraftScopes] = useState(initialScopes)
  const [disableBtn, setDisabledBtn] = useState(false)
  const hasChanges = JSON.stringify(scopes) !== JSON.stringify(draftScopes) && !disableBtn

  useEffect(() => {
    if (!integration) return

    const mapped = { ...initialScopes }

    integration.scopes.forEach((scope) => {
      if (scope in mapped) mapped[scope as keyof typeof mapped] = true
    })

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setScopes(mapped)
    setDraftScopes(mapped)
  }, [integration])

  const openPopup = (url: string, onCancel: () => void) => {
    const popup = window.open(url, "noou_oauth", "width=600,height=700")
    let receivedSuccess = false
    setDisabledBtn(true)

    const onMessage = (event: MessageEvent) => {
      if (event.data?.type === "oauth-success") {
        receivedSuccess = true
        window.removeEventListener("message", onMessage)
        toast({
          title: t("common.success"),
          description: t("settings.integrations.integration-updated-success"),
          type: "success",
        })
        setScopes(draftScopes)
        setDisabledBtn(false)
      }
    }

    window.addEventListener("message", onMessage)

    const timer = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(timer)
        window.removeEventListener("message", onMessage)

        if (!receivedSuccess) {
          onCancel()
        }
      }
    }, 300)
  }

  const handleToggle = (scope: keyof typeof scopes, checked: boolean) => {
    setDraftScopes((prev) => {
      const updated = { ...prev }

      updated[scope] = checked

      if (!checked) {
        if (scope === "GMAIL_READONLY") {
          updated.GMAIL_MODIFY = false
          updated.GMAIL_COMPOSE = false
        }
        if (scope === "GMAIL_MODIFY") {
          updated.GMAIL_COMPOSE = false
        }
      } else {
        if (scope === "GMAIL_MODIFY") {
          updated.GMAIL_READONLY = true
        }
        if (scope === "GMAIL_COMPOSE") {
          updated.GMAIL_MODIFY = true
          updated.GMAIL_READONLY = true
        }
      }

      return updated
    })
  }

  const handleSave = async () => {
    const before = scopes
    const after = draftScopes

    // Verifica oq foi removido
    const removed = Object.keys(before).filter((k) => before[k] && !after[k])

    if (removed.length > 0) {
      await api.get(`${config.API_BASE_URL}/oauth/google/revoke`)
    }

    const selected = Object.entries(after)
      .filter(([_, v]) => v)
      .map(([s]) => s)

    const qs = selected.map((s) => `scopes=${s}`).join("&")

    if (selected.length > 0) {
      openPopup(`${config.API_BASE_URL}/oauth/google/init?${qs}`, () => {
        toast({
          title: t("common.error"),
          description: t("settings.integrations.integration-cancel-success"),
          type: "error",
        })
        setDraftScopes(scopes)
        setDisabledBtn(false)
      })
    } else {
      toast({
        title: t("common.success"),
        description: t("settings.integrations.integration-updated-success"),
        type: "success",
      })
      setScopes(draftScopes)
      setDisabledBtn(false)
    }
  }

  return loading ? (
    <IntegrationSkeleton />
  ) : (
    <div className="rounded-2xl p-6 border border-gray-300 dark:border-white/15 space-y-6">
      <h1 className="text-gray-900 dark:text-white font-semibold">
        {t("settings.integrations.title")}
      </h1>

      <div className="space-y-4 text-[#111827] dark:text-white">
        <div className="space-y-4 border-b dark:border-white/15 border-[#e7e7e7] pb-5">
          <div className="flex items-center justify-between">
            <span>Gmail Readonly</span>
            <Switch
              variant="secondary"
              checked={draftScopes.GMAIL_READONLY}
              onChange={(checked) => handleToggle("GMAIL_READONLY", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <span>Gmail Modify</span>
            <Switch
              variant="secondary"
              checked={draftScopes.GMAIL_MODIFY}
              onChange={(checked) => handleToggle("GMAIL_MODIFY", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <span>Gmail Compose</span>
            <Switch
              variant="secondary"
              checked={draftScopes.GMAIL_COMPOSE}
              onChange={(checked) => handleToggle("GMAIL_COMPOSE", checked)}
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span>Drive File</span>
          <Switch
            variant="secondary"
            checked={draftScopes.DRIVE_FILE}
            onChange={(checked) => handleToggle("DRIVE_FILE", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <span>Sheets Readonly</span>
          <Switch
            variant="secondary"
            checked={draftScopes.SPREADSHEETS_READONLY}
            onChange={(checked) => handleToggle("SPREADSHEETS_READONLY", checked)}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={!hasChanges}>
          {t("common.save")}
        </Button>
      </div>
    </div>
  )
}
