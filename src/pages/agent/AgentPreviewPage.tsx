import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { AgentMessageList } from "@/components/agent/message/AgentMessageList"
import { useThemeStore } from "@/stores/useThemeStore"
import { useAgentStore } from "@/stores/useAgentStore"
import { Button } from "@/components/ui/button"

export default function AgentPreviewPage() {
  const { t } = useTranslation()
  const { theme } = useThemeStore()
  const { isStreaming, messagesPreview } = useAgentStore()

  useEffect(() => {
    const root = document.documentElement

    if (theme === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [theme])

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("messagesPreview")
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [])

  return (
    <main className="bg-foreground min-h-screen">
      {/* Header */}
      <header className="flex items-center bg-background h-18 px-7">
        <div className="flex flex-1 items-center gap-9">
          <div className="flex items-center justify-between pr-5 w-60">
            <img src="/logo.webp" alt="Noou" className="h-6 w-auto object-contain" />
          </div>
        </div>
        <Button onClick={() => window.print()} className="no-print">
          {t("agent.export-pdf")}
        </Button>
      </header>

      {/* Content */}
      <div className="flex justify-center p-8">
        <section className="max-w-5xl w-full h-full">
          <AgentMessageList messages={messagesPreview} isStreaming={isStreaming} isPreview />
        </section>
      </div>
    </main>
  )
}
