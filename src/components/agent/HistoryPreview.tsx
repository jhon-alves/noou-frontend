import day from "dayjs"
import duration from "dayjs/plugin/duration"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import { PreviewStateProps } from "./HistoryDrawer"
import { useQuery } from "@tanstack/react-query"
import { sessionsServices } from "@/services/sessions/sessions-services"
import { Skeleton } from "../ui/skeleton"
import { useTranslation } from "react-i18next"

day.extend(duration)

interface HistoryPreviewProps {
  isPreview: PreviewStateProps
  onSessionRun: (sessionId: string, identifier: string) => void
  onSessionDelete: (e: React.MouseEvent, sessionId: string) => void
}

export function HistoryPreview({ isPreview, onSessionRun, onSessionDelete }: HistoryPreviewProps) {
  const { t } = useTranslation()

  const { data: sessionDetails, isPending: loadingSessionDetails } = useQuery({
    queryKey: ["session-by-id", isPreview?.sessionId],
    queryFn: () => sessionsServices.getSessionById(isPreview?.sessionId),
    enabled: !!isPreview.sessionId && !!isPreview.open,
  })

  const formatDuration = (seconds: number) => {
    const durationS = day.duration(seconds, "seconds")

    if (seconds < 60) {
      return `${durationS.asSeconds().toFixed(1)}s`
    }

    return `${Math.floor(durationS.asMinutes())}m ${durationS.seconds()}s`
  }

  return (
    <>
      {loadingSessionDetails && (
        <div className="flex flex-col gap-8 px-3 py-6 text-gray-300 dark:text-gray-200">
          <div className="space-y-3">
            <Skeleton className="h-8 w-40 rounded-full" />
            <Skeleton className="h-5 w-full rounded-xl" />
            <Skeleton className="h-5 w-full rounded-xl" />
            <Skeleton className="h-5 w-full rounded-xl" />
          </div>
          <hr className="separator" />
          <div className="space-y-3">
            <Skeleton className="h-8 w-40 rounded-full" />
            <Skeleton className="h-5 w-80 rounded-xl" />
            <Skeleton className="h-5 w-80 rounded-xl" />
            <Skeleton className="h-5 w-80 rounded-xl" />
          </div>
          <hr className="separator" />
          <div className="space-y-3">
            <Skeleton className="h-8 w-40 rounded-full" />
            <Skeleton className="h-5 w-40 rounded-xl" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-50 rounded-xl" />
              <Skeleton className="h-5 w-50 rounded-xl" />
            </div>
          </div>
          <div className="flex items-center justify-end gap-4 mt-8">
            <Skeleton className="h-11 w-25 rounded-full" />
            <Skeleton className="h-11 w-25 rounded-full" />
          </div>
        </div>
      )}

      {!loadingSessionDetails && sessionDetails && (
        <div
          className={cn(
            "flex-col gap-5 py-6 px-3 space-y-3 text-black dark:text-white",
            isPreview.open ? "flex" : "hidden",
          )}
        >
          <div className="flex flex-col gap-2">
            <p className="font-semibold">{t("common.summary")}:</p>
            <p className=" text-sm">
              {sessionDetails?.summary?.summary ?? "Summary not generated for this conversation."}
            </p>
          </div>

          <hr className="separator text-gray-300 dark:text-gray-500" />

          {sessionDetails.summary && (
            <>
              <div className="flex flex-col gap-4">
                <p className="font-semibold">{t("common.topics")}:</p>
                <ul className="list-disc flex flex-col gap-2">
                  {sessionDetails?.summary?.topics.map((topic) => (
                    <li key={topic} className="ml-6 text-sm">
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>

              <hr className="separator text-gray-300 dark:text-gray-500" />
            </>
          )}

          <div className="flex flex-col gap-4">
            <p className="font-semibold">{t("common.details")}:</p>
            <p className="text-sm font-semibold">
              {t("common.name")}:{" "}
              <span className="font-normal">
                {sessionDetails.agent_id === "assistant" ? "Agent Noou" : "UX Researcher"}
              </span>
            </p>
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold">
                {t("common.created-at")}:{" "}
                <span className="font-normal">
                  {day(sessionDetails.created_at * 1000).format("DD/MM/YYYY")}
                </span>
              </p>
              <p className="text-sm font-semibold">
                {t("common.updated-at")}:{" "}
                <span className="font-normal">
                  {day(sessionDetails.updated_at * 1000).format("DD/MM/YYYY")}
                </span>
              </p>
            </div>
          </div>

          <hr className="separator text-gray-300 dark:text-gray-500" />

          <div className="flex flex-col gap-4">
            <p className="font-semibold">{t("common.metrics")}:</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {sessionDetails.metrics && sessionDetails.metrics?.duration && (
                <div className="rounded-lg border dark:border-white/10 dark:bg-white/5 p-3">
                  <p className="text-xs text-muted-foreground">{t("common.duration")}</p>
                  <p className="text-sm font-semibold text-black dark:text-white">
                    {formatDuration(sessionDetails.metrics.duration)}
                  </p>
                </div>
              )}
              {sessionDetails.metrics && sessionDetails.metrics?.input_tokens && (
                <div className="rounded-lg border dark:border-white/10 dark:bg-white/5 p-3">
                  <p className="text-xs text-muted-foreground">{t("agent.input-tokens")}</p>
                  <p className="text-sm font-semibold text-black dark:text-white">
                    {sessionDetails.metrics.input_tokens}
                  </p>
                </div>
              )}
              {sessionDetails.metrics && sessionDetails.metrics?.output_tokens && (
                <div className="rounded-lg border dark:border-white/10 dark:bg-white/5 p-3">
                  <p className="text-xs text-muted-foreground">{t("agent.output-tokens")}</p>
                  <p className="text-sm font-semibold text-black dark:text-white">
                    {sessionDetails.metrics.output_tokens}
                  </p>
                </div>
              )}
              {sessionDetails.metrics && sessionDetails.metrics?.total_tokens && (
                <div className="rounded-lg border dark:border-white/10 dark:bg-white/5 p-3">
                  <p className="text-xs text-muted-foreground">{t("agent.total-tokens")}</p>
                  <p className="text-sm font-semibold text-black dark:text-white">
                    {sessionDetails.metrics.total_tokens}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-5">
            <Button
              variant="outline"
              onClick={(e) => onSessionDelete(e, sessionDetails?.session_id)}
            >
              {t("common.delete")}
            </Button>
            <Button
              onClick={() => onSessionRun(sessionDetails?.session_id, sessionDetails.agent_id)}
            >
              {t("agent.use-session")}
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
