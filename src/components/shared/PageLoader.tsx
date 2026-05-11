import { useTranslation } from "react-i18next"

export function PageLoader() {
  const { t } = useTranslation()

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="space-y-4 text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
      </div>
    </div>
  )
}
