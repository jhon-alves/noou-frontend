import day from "dayjs"
import { ArrowRight, Eye, History, Trash } from "lucide-react"
import { SessionsResponse } from "@/services/sessions/types"
import { PreviewStateProps } from "./HistoryDrawer"
import { Skeleton } from "../../ui/skeleton"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"
import { useAgentStore } from "@/stores/useAgentStore"

interface HistoryListProps {
  isPreview: PreviewStateProps
  sessions: SessionsResponse
  loadingSessions: boolean
  onSessionRun: (sessionId: string, identifier: string) => void
  onSessionDelete: (e: React.MouseEvent, sessionId: string) => void
  onSessionPreview: (e: React.MouseEvent, sessionId: string) => void
}

export function HistoryList({
  isPreview,
  sessions,
  loadingSessions,
  onSessionRun,
  onSessionDelete,
  onSessionPreview,
}: HistoryListProps) {
  const { t } = useTranslation()
  const hasSessions = sessions.items?.length > 0
  const { containerStatus } = useAgentStore()

  return (
    <>
      {loadingSessions && (
        <div className="flex flex-col gap-3 px-3 py-6 text-gray-300 dark:text-gray-200">
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton key={index} className="h-21 w-full rounded-2xl" />
          ))}
        </div>
      )}

      {!loadingSessions && !hasSessions && (
        <div className="flex flex-col items-center justify-center gap-2 px-3 py-6 text-center">
          <div className="bg-gray-300 dark:bg-background/60 p-2 rounded-full">
            <History className="text-black dark:text-white" />
          </div>
          <p className="font-semibold text-lg text-black dark:text-white">
            {t("agent.no-sessions")}
          </p>
        </div>
      )}

      {!loadingSessions && hasSessions && (
        <div className={cn("relative space-y-3", isPreview.open ? "hidden" : "block")}>
          {sessions.items.map((session) => (
            <button
              key={session.session_id}
              className={cn(
                "flex flex-col gap-2 h-21 rounded-2xl p-3 w-full transition-all duration-300 group",
                "bg-gray-200 dark:bg-background/60 hover:bg-gray-200/50 hover:dark:bg-background/90",
                containerStatus === "active" ? "cursor-pointer" : "cursor-not-allowed",
              )}
              onClick={() => onSessionRun(session.session_id, session.agent_id)}
            >
              <div className="flex items-center justify-between h-8">
                <p className="text-sm text-black dark:text-white truncate">
                  {session.summary?.summary ?? t("agent.no-summary")}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    className="rounded-full items-center justify-center p-2 bg-gray-200 dark:bg-neutral-500 hidden group-hover:flex cursor-pointer"
                    onClick={(e) => onSessionPreview(e, session.session_id)}
                  >
                    <Eye className="w-3.5 h-3.5 text-black dark:text-white" />
                  </button>
                  <button
                    className="rounded-full items-center justify-center p-2 bg-gray-200 dark:bg-neutral-500 hidden group-hover:flex cursor-pointer"
                    onClick={(e) => onSessionDelete(e, session.session_id)}
                  >
                    <Trash className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-1">
                <p className="text-xs text-black dark:text-white">
                  <span className="font-semibold">{t("common.updated-at")}</span>:{" "}
                  {day(session?.updated_at * 1000).format("DD/MM/YYYY") ??
                    day(session?.created_at * 1000).format("DD/MM/YYYY")}
                </p>
                <div className="text-black dark:text-white">
                  <ArrowRight className="size-4" />
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </>
  )
}
