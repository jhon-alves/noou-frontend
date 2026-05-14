import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/alert-dialog"
import { sessionsServices } from "@/services/sessions/sessions-services"
import { DrawerTitle, DrawerClose, DrawerHeader } from "../../ui/drawer"
import { SessionsResponse } from "@/services/sessions/types"
import { DrawerBody, DrawerLayout } from "../../shared/Drawer"
import { NoouAgentData } from "@/services/agents/types"
import { useAgentStore } from "@/stores/useAgentStore"
import { ArrowLeft, RefreshCw, X } from "lucide-react"
import { HistoryPreview } from "./HistoryPreview"
import { HistoryList } from "./HistoryList"
import { cn } from "@/lib/utils"

interface HistoryDrawerProps {
  prompt?: string
  noouAgents: NoouAgentData[]
  sessions: SessionsResponse
  loadingSessions: boolean
}

export interface PreviewStateProps {
  open: boolean
  sessionId: string
}

export function HistoryDrawer({ noouAgents, sessions, loadingSessions }: HistoryDrawerProps) {
  const qc = useQueryClient()
  const { t } = useTranslation()
  const {
    selectedAgent,
    containerStatus,
    historyOpen,
    setSelectedAgent,
    setSessionId,
    setHistoryOpen,
  } = useAgentStore()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null)
  const [isPreview, setIsPreview] = useState<PreviewStateProps>({ open: false, sessionId: null })
  const [spinning, setSpinning] = useState(false)

  const { mutateAsync } = useMutation({
    mutationFn: (sessionId: string) => sessionsServices.deleteSession(sessionId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sessions"] })
      setIsPreview({ open: false, sessionId: null })
      setSessionToDelete(null)
      setDeleteOpen(false)
    },
  })

  function handleCloseHistory(e: React.MouseEvent) {
    e.stopPropagation()
    setIsPreview({ open: false, sessionId: null })
    setHistoryOpen(false)
  }

  function handlePreview(e: React.MouseEvent, sessionId: string) {
    e.stopPropagation()
    setIsPreview({ open: true, sessionId: sessionId })
  }

  function handleAskDelete(e: React.MouseEvent, sessionId: string) {
    e.stopPropagation()
    setSessionToDelete(sessionId)
    setDeleteOpen(true)
  }

  async function confirmDelete() {
    if (!sessionToDelete) return
    await mutateAsync(sessionToDelete)
  }

  function handleSessionRun(sessionId: string, agentIdentifier: string) {
    if (containerStatus !== "active") return

    setSessionId(sessionId)
    setHistoryOpen(false)

    const filteredAgent = noouAgents.filter((item) => item.identifier === agentIdentifier)[0]

    if (agentIdentifier !== selectedAgent.identifier) {
      setSelectedAgent({ name: filteredAgent?.name, identifier: filteredAgent?.identifier })
    }
  }

  const handleRefreshSession = () => {
    setSpinning(true)
    qc.invalidateQueries({ queryKey: ["sessions"] })
    setTimeout(() => setSpinning(false), 600)
  }

  return (
    <>
      <DrawerLayout
        open={historyOpen}
        onOpenChange={(drawer) => {
          setHistoryOpen(drawer)
          setIsPreview({ open: false, sessionId: null })
        }}
        contentClassName={cn(isPreview.open ? "lg:min-w-150" : "lg:min-w-110")}
      >
        <DrawerHeader className="px-6 py-4">
          <button
            onClick={() => setIsPreview({ open: false, sessionId: null })}
            className={cn(
              "p-2 hover:bg-gray-100 dark:hover:bg-neutral-500 rounded-full transition-colors cursor-pointer",
              isPreview.open ? "block" : "hidden",
            )}
          >
            <ArrowLeft className="size-5 text-[#111827] dark:text-white" />
          </button>
          <DrawerTitle className="text-lg font-semibold text-[#111827] dark:text-white">
            {isPreview.open ? t("common.preview") : t("common.history")}
          </DrawerTitle>
          <div className="flex items-center gap-2">
            {!isPreview.open && (
              <button
                onClick={handleRefreshSession}
                disabled={spinning}
                className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-500 rounded-full transition-colors cursor-pointer"
              >
                <RefreshCw
                  className={cn("size-4.5 text-black dark:text-white", spinning ? "spin-once" : "")}
                />
              </button>
            )}
            <DrawerClose asChild>
              <button
                onClick={handleCloseHistory}
                className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-500 rounded-full transition-colors cursor-pointer"
              >
                <X className="size-5 text-black dark:text-white" />
              </button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <DrawerBody className="p-4 scrollbar">
          {!isPreview.open && (
            <HistoryList
              isPreview={isPreview}
              sessions={sessions}
              loadingSessions={loadingSessions}
              onSessionRun={handleSessionRun}
              onSessionDelete={handleAskDelete}
              onSessionPreview={handlePreview}
            />
          )}

          {isPreview.open && (
            <HistoryPreview
              isPreview={isPreview}
              onSessionRun={handleSessionRun}
              onSessionDelete={handleAskDelete}
            />
          )}
        </DrawerBody>
      </DrawerLayout>

      {/* Confirm delete session dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("agent.delete-conversation")}</AlertDialogTitle>
            <AlertDialogDescription>{t("agent.delete-conversation-desc")}</AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDeleteOpen(false)
                setSessionToDelete(null)
              }}
            >
              {t("common.cancel")}
            </AlertDialogCancel>

            <AlertDialogAction className="bg-red-500! text-white" onClick={confirmDelete}>
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
